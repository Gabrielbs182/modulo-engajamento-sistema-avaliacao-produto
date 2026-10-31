import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { z } from "zod";
import {
  type SignUpErrorBody,
  type SignUpSuccessBody,
  signUpSchema,
} from "./schema";

// Custo 10 levou ~76 ms por hash na máquina de desenvolvimento (custo 12: ~300 ms).
export const BCRYPT_COST = 10;

export type NewAccount = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  active: boolean;
};

export type StoredAccount = Omit<NewAccount, "password"> & {
  created_at: string;
};

export class EmailTakenError extends Error {
  constructor() {
    super("email já cadastrado");
    this.name = "EmailTakenError";
  }
}

export interface AccountsRepository {
  /** Grava a conta. Lança EmailTakenError quando o email já existe. */
  insert(account: NewAccount): Promise<StoredAccount>;
}

const json = (body: SignUpErrorBody | SignUpSuccessBody, status: number) =>
  Response.json(body, { status });

export function createSignUpHandler(accounts: AccountsRepository) {
  return async function POST(request: Request): Promise<Response> {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return json(
        {
          error: "invalid_body",
          message: "O corpo da requisição precisa ser um JSON válido.",
        },
        400,
      );
    }

    const parsed = signUpSchema.safeParse(body);
    if (!parsed.success) {
      return json(
        {
          error: "validation_error",
          message: "Confira os dados do formulário.",
          fieldErrors: z.flattenError(parsed.error).fieldErrors,
        },
        400,
      );
    }

    const { firstName, lastName, email, password } = parsed.data;
    try {
      const account = await accounts.insert({
        id: nanoid(),
        first_name: firstName,
        last_name: lastName,
        email,
        password: await bcrypt.hash(password, BCRYPT_COST),
        active: true,
      });
      return json(
        {
          id: account.id,
          firstName: account.first_name,
          lastName: account.last_name,
          email: account.email,
          active: account.active,
          createdAt: account.created_at,
        },
        201,
      );
    } catch (error) {
      if (error instanceof EmailTakenError) {
        return json(
          {
            error: "email_taken",
            message: "Este email já está cadastrado.",
          },
          409,
        );
      }
      console.error("[sign-up] falha ao criar a conta", error);
      return json(
        {
          error: "internal_error",
          message: "Não foi possível criar sua conta agora. Tente novamente.",
        },
        500,
      );
    }
  };
}
