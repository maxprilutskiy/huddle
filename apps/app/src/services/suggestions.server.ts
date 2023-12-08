import { getSupabase } from "./supabase.server";

export async function generateProfileSuggestion(env: any, currentUserId: string) {
  const sb = getSupabase(env);

  const countResponse = await sb.from("UserProfile").select("id", { count: "exact", head: true }).not('id', 'eq', currentUserId);
  const count = countResponse.count || 0;

  const randomIndex = Math.floor(Math.random() * count);

  const profiles = await sb.from("UserProfile").select("*").not('id', 'eq', currentUserId).range(randomIndex, randomIndex + 1);
  const profile = profiles.data?.[0];
  if (!profile) { return null; }

  return profile;
}
