import { z } from "zod";

// O bcrypt só considera os primeiros 72 bytes da senha: acima disso, duas senhas
// diferentes passariam a valer como iguais. Acentos e emojis ocupam mais de 1 byte.
export const PASSWORD_MAX_BYTES = 72;
export const PASSWORD_MIN_LENGTH = 8;

const byteLength = (value: string) => new TextEncoder().encode(value).length;

const name = (label: string) =>
  z
    .string({ error: `Informe seu ${label}.` })
    .trim()
    .min(1, `Informe seu ${label}.`)
    .max(100, `O ${label} pode ter no máximo 100 caracteres.`);

/** O corpo do POST /api/v1/sign-up. */
export const signUpSchema = z.object({
  firstName: name("primeiro nome"),
  lastName: name("sobrenome"),
  email: z
    .string({ error: "Informe seu email." })
    .trim()
    .toLowerCase()
    .max(254, "Email longo demais.")
    .pipe(z.email("Informe um email válido.")),
  password: z
    .string({ error: "Informe uma senha." })
    .min(
      PASSWORD_MIN_LENGTH,
      `A senha precisa ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`,
    )
    .refine(
      (value) => byteLength(value) <= PASSWORD_MAX_BYTES,
      "Senha longa demais: use até 72 caracteres (acentos e emojis ocupam mais de um).",
    ),
});

/** O formulário: o corpo da API mais a confirmação, que não sai do navegador. */
export const signUpFormSchema = signUpSchema
  .extend({ confirmPassword: z.string().min(1, "Confirme sua senha.") })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não conferem.",
  });

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignUpFormValues = z.input<typeof signUpFormSchema>;

export type SignUpErrorBody = {
  error: "invalid_body" | "validation_error" | "email_taken" | "internal_error";
  message: string;
  fieldErrors?: Partial<Record<keyof SignUpInput, string[]>>;
};

export type SignUpSuccessBody = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  active: boolean;
  createdAt: string;
};
