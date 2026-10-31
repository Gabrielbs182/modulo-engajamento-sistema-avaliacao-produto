import { CircleCheck } from "lucide-react";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Conta criada" };

export default function SignUpSuccessPage() {
  return (
    <Card className="w-full max-w-md shadow-sm">
      <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
        <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CircleCheck className="size-6" />
        </div>
        <h1 className="font-heading text-xl font-semibold tracking-tight">
          Conta criada!
        </h1>
        <p className="text-sm text-muted-foreground">
          Tudo certo: sua conta já está ativa.
        </p>
      </CardContent>
    </Card>
  );
}
