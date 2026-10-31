import "server-only";
import { supabaseAdmin } from "@/lib/supabase/server";
import {
  type AccountsRepository,
  EmailTakenError,
  type StoredAccount,
} from "./handler";

const UNIQUE_VIOLATION = "23505";

export const supabaseAccountsRepository: AccountsRepository = {
  async insert(account) {
    const { data, error } = await supabaseAdmin()
      .from("accounts")
      .insert(account)
      .select("id, first_name, last_name, email, active, created_at")
      .single<StoredAccount>();
    if (error) {
      if (error.code === UNIQUE_VIOLATION) throw new EmailTakenError();
      throw error;
    }
    return data;
  },
};
