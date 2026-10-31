import { Star } from "lucide-react";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { SignUpForm } from "./sign-up-form";

export const metadata: Metadata = { title: "Criar conta" };

export default function SignUpPage() {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Star className="size-5" />
        </div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Crie sua conta
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Leva menos de um minuto.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="py-2">
          <SignUpForm />
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Sua senha nunca é guardada em texto puro.
      </p>
    </div>
  );
}
