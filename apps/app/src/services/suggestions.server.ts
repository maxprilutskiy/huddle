import { getSupabase } from "./supabase.server";

export async function generateProfileSuggestions(env: any) {
  const sb = getSupabase(env);

  const countResponse = await sb.from("UserProfile").select("id", { count: "exact", head: true });
  const count = countResponse.count || 0;

  const profiles = await sb.from("UserProfile").select("*").limit(3);

  return profiles.data;
}