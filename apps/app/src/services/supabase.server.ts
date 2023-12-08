import { createClient } from "@supabase/supabase-js";

export const getSupabase = (env: any) => {
  const sb = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
  return sb;
}
