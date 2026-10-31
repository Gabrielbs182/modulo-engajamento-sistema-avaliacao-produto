import type { SignUpErrorBody, SignUpInput, SignUpSuccessBody } from "./schema";

export class SignUpRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly fieldErrors?: SignUpErrorBody["fieldErrors"],
  ) {
    super(message);
    this.name = "SignUpRequestError";
  }
}

export async function postSignUp(
  input: SignUpInput,
): Promise<SignUpSuccessBody> {
  let response: Response;
  try {
    response = await fetch("/api/v1/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    throw new SignUpRequestError(
      "Não foi possível falar com o servidor. Confira sua conexão e tente de novo.",
      0,
    );
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const error = body as SignUpErrorBody | null;
    throw new SignUpRequestError(
      error?.message ??
        "Não foi possível criar sua conta agora. Tente novamente.",
      response.status,
      error?.fieldErrors,
    );
  }
  return body as SignUpSuccessBody;
}
