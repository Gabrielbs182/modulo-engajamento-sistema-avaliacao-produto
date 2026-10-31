import { createSignUpHandler } from "@/lib/sign-up/handler";
import { supabaseAccountsRepository } from "@/lib/sign-up/supabase-repository";

export const POST = createSignUpHandler(supabaseAccountsRepository);
