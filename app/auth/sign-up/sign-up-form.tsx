"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CircleAlert, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type FieldError as HookFieldError, useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { postSignUp, SignUpRequestError } from "@/lib/sign-up/client";
import {
  PASSWORD_MIN_LENGTH,
  type SignUpFormValues,
  signUpFormSchema,
} from "@/lib/sign-up/schema";

const EMPTY: SignUpFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: EMPTY,
    mode: "onTouched",
  });

  const signUp = useMutation({
    mutationFn: postSignUp,
    onSuccess: () => router.push("/auth/sign-up/success"),
    onError: (error) => {
      if (!(error instanceof SignUpRequestError)) return;
      if (error.status === 409) setError("email", { type: "server" });
      for (const [field, messages] of Object.entries(error.fieldErrors ?? {})) {
        if (messages?.[0]) {
          setError(field as keyof SignUpFormValues, { message: messages[0] });
        }
      }
    },
  });

  // Depois do sucesso o botão segue travado até a navegação terminar.
  const busy = signUp.isPending || signUp.isSuccess;

  const onSubmit = handleSubmit(({ confirmPassword: _, ...input }) => {
    signUp.mutate(input);
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup>
        {signUp.isError && (
          <Alert
            variant="destructive"
            className="border-destructive/30 bg-destructive/5"
          >
            <CircleAlert />
            <AlertTitle>Não foi possível criar sua conta</AlertTitle>
            <AlertDescription>{signUp.error.message}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="firstName"
            label="Primeiro nome"
            error={errors.firstName}
          >
            <Input
              id="firstName"
              autoComplete="given-name"
              placeholder="Maria"
              aria-invalid={!!errors.firstName}
              {...register("firstName")}
            />
          </TextField>
          <TextField id="lastName" label="Sobrenome" error={errors.lastName}>
            <Input
              id="lastName"
              autoComplete="family-name"
              placeholder="Silva"
              aria-invalid={!!errors.lastName}
              {...register("lastName")}
            />
          </TextField>
        </div>

        <TextField id="email" label="Email" error={errors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="maria@empresa.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </TextField>

        <TextField
          id="password"
          label="Senha"
          error={errors.password}
          description={`Mínimo de ${PASSWORD_MIN_LENGTH} caracteres.`}
        >
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className="pr-9"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute top-1/2 right-0.5 -translate-y-1/2 text-muted-foreground"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
          </div>
        </TextField>

        <TextField
          id="confirmPassword"
          label="Confirme a senha"
          error={errors.confirmPassword}
        >
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
        </TextField>

        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy && <LoaderCircle className="animate-spin" />}
          {busy ? "Criando conta…" : "Criar conta"}
        </Button>
      </FieldGroup>
    </form>
  );
}

function TextField({
  id,
  label,
  error,
  description,
  children,
}: {
  id: string;
  label: string;
  error?: HookFieldError;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {children}
      {error?.message ? (
        <FieldError>{error.message}</FieldError>
      ) : (
        description && <FieldDescription>{description}</FieldDescription>
      )}
    </Field>
  );
}
