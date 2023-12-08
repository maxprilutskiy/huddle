import { getSupabase } from "./supabase.server";

export async function generateProfileSuggestion(env: any, currentUserId: string) {
  const sb = getSupabase(env);

  const currentProfileResponse = await sb.from("UserProfile").select("*").eq('id', currentUserId).single();
  const currentProfile = currentProfileResponse.data;
  if (!currentProfile) { return null; }

  const currentProfileEmbeddingsId = currentProfile.zilliz_embeddings_id;

  const similarities = await fetch(`https://api.huddle.sh/get-similar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      embeddings_id: currentProfileEmbeddingsId,
    }),
  }).then(r => r.json());

  console.log(similarities);

  const countResponse = await sb.from("UserProfile").select("id", { count: "exact", head: true }).not('id', 'eq', currentUserId);
  const count = countResponse.count || 0;

  const randomIndex = Math.floor(Math.random() * count);

  const profiles = await sb.from("UserProfile").select("*").not('id', 'eq', currentUserId).range(randomIndex, randomIndex + 1);
  const profile = profiles.data?.[0];
  if (!profile) { return null; }

  return profile;
}
