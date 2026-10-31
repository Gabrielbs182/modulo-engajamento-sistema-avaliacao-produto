import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

/**
 * Cliente com a chave secreta: ignora o RLS e por isso nunca pode chegar ao navegador.
 * Criado na primeira chamada para o build não exigir as variáveis.
 */
export function supabaseAdmin(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) {
    throw new Error(
      "SUPABASE_URL e SUPABASE_SECRET_KEY precisam estar definidas (veja .env.example).",
    );
  }
  client = createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
