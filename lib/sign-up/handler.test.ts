import { describe, expect, test } from "bun:test";
import bcrypt from "bcryptjs";
import {
  type AccountsRepository,
  BCRYPT_COST,
  createSignUpHandler,
  EmailTakenError,
  type NewAccount,
} from "./handler";
import { signUpFormSchema } from "./schema";

/** Repositório em memória com a mesma regra do índice único do banco. */
function memoryRepository() {
  const rows: NewAccount[] = [];
  const repo: AccountsRepository = {
    async insert(account) {
      if (
        rows.some((r) => r.email.toLowerCase() === account.email.toLowerCase())
      ) {
        throw new EmailTakenError();
      }
      rows.push(account);
      const { password: _, ...stored } = account;
      return { ...stored, created_at: new Date().toISOString() };
    },
  };
  return { repo, rows };
}

const post = (body: unknown) =>
  new Request("http://localhost/api/v1/sign-up", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

const valid = {
  firstName: "  Maria ",
  lastName: "Silva",
  email: " Maria.Silva@Exemplo.com ",
  password: "senha-forte-123",
};

describe("POST /api/v1/sign-up", () => {
  test("201: grava a conta com hash bcrypt e nunca devolve a senha", async () => {
    const { repo, rows } = memoryRepository();
    const res = await createSignUpHandler(repo)(post(valid));

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toMatchObject({
      firstName: "Maria",
      lastName: "Silva",
      email: "maria.silva@exemplo.com",
      active: true,
    });
    expect(body.id).toMatch(/^[\w-]{21}$/);
    expect(JSON.stringify(body)).not.toContain("senha-forte-123");
    expect(body).not.toHaveProperty("password");

    expect(rows).toHaveLength(1);
    const [row] = rows;
    expect(row.password).not.toBe(valid.password);
    expect(row.password.startsWith(`$2b$${BCRYPT_COST}$`)).toBe(true);
    expect(await bcrypt.compare(valid.password, row.password)).toBe(true);
    expect(row).not.toHaveProperty("salt");
  });

  test("400: corpo que não é JSON", async () => {
    const { repo, rows } = memoryRepository();
    const res = await createSignUpHandler(repo)(post("{nome: maria"));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("invalid_body");
    expect(rows).toHaveLength(0);
  });

  test("400: campos faltando ou inválidos voltam por campo", async () => {
    const { repo, rows } = memoryRepository();
    const res = await createSignUpHandler(repo)(
      post({ firstName: " ", email: "nao-e-email", password: "curta" }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("validation_error");
    expect(Object.keys(body.fieldErrors).sort()).toEqual([
      "email",
      "firstName",
      "lastName",
      "password",
    ]);
    expect(rows).toHaveLength(0);
  });

  test("400: senha acima de 72 bytes, mesmo com menos de 72 letras", async () => {
    const { repo } = memoryRepository();
    const handler = createSignUpHandler(repo);
    // "ç" ocupa 2 bytes: 37 letras = 74 bytes.
    const res = await handler(post({ ...valid, password: "ç".repeat(37) }));
    expect(res.status).toBe(400);
    expect((await res.json()).fieldErrors.password).toHaveLength(1);

    const limite = await handler(post({ ...valid, password: "a".repeat(72) }));
    expect(limite.status).toBe(201);
  });

  test("409: email já cadastrado, sem diferenciar maiúscula", async () => {
    const { repo, rows } = memoryRepository();
    const handler = createSignUpHandler(repo);
    expect((await handler(post(valid))).status).toBe(201);

    const res = await handler(
      post({ ...valid, email: "MARIA.SILVA@exemplo.com" }),
    );
    expect(res.status).toBe(409);
    expect((await res.json()).error).toBe("email_taken");
    expect(rows).toHaveLength(1);
  });

  test("500: falha do banco não vaza detalhe para o cliente", async () => {
    const repo: AccountsRepository = {
      insert: async () => {
        throw new Error("connection refused 10.0.0.5:5432");
      },
    };
    const original = console.error;
    console.error = () => {};
    try {
      const res = await createSignUpHandler(repo)(post(valid));
      expect(res.status).toBe(500);
      expect(JSON.stringify(await res.json())).not.toContain("10.0.0.5");
    } finally {
      console.error = original;
    }
  });
});

describe("formulário", () => {
  test("a confirmação precisa ser igual à senha", () => {
    const r = signUpFormSchema.safeParse({
      ...valid,
      confirmPassword: "outra-senha-123",
    });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0].path).toEqual(["confirmPassword"]);

    const ok = signUpFormSchema.safeParse({
      ...valid,
      confirmPassword: valid.password,
    });
    expect(ok.success).toBe(true);
  });

  test("formulário vazio aponta erro em todos os campos, inclusive a confirmação", () => {
    const r = signUpFormSchema.safeParse({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    const campos = new Set(r.error?.issues.map((i) => i.path[0]));
    expect([...campos].sort()).toEqual([
      "confirmPassword",
      "email",
      "firstName",
      "lastName",
      "password",
    ]);
  });
});
