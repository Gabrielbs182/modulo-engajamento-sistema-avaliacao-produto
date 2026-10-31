import { redirect } from "next/navigation";

// Por enquanto a única tela do produto é a criação de conta.
export default function Home() {
  redirect("/auth/sign-up");
}
