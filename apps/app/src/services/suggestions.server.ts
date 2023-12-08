import { getSupabase } from "./supabase.server";

export async function generateProfileSuggestion(env: any, currentUserId: string) {
  const sb = getSupabase(env);

  const currentProfileResponse = await sb.from("UserProfile").select("*").eq('id', currentUserId).single();
  const currentProfile = currentProfileResponse.data;
  if (!currentProfile) { return null; }

  const currentProfileEmbeddingsId = currentProfile.zilliz_embeddings_id;

  const similarities: any[] = await fetch(`https://api.huddle.sh/get-similar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      embeddings_id: currentProfileEmbeddingsId,
    }),
  })
    .then(r => r.json())

  console.log(similarities);

  const countResponse = await sb
    .from("UserProfile")
    .select("id", { count: "exact", head: true })
    .not('id', 'eq', currentUserId)
    .in('zilliz_embeddings_id', similarities.map((item: any) => item.id));

  const count = countResponse.count || 0;

  const profiles = await sb
    .from("UserProfile")
    .select("*")
    .not('id', 'eq', currentUserId)
    .in('zilliz_embeddings_id', similarities.map((item: any) => item.embeddings_id));

  const randomIndex = Math.floor(Math.random() * (profiles.data?.length || 0));
  const profile = profiles.data?.[randomIndex];

  console.log({ similarities, count, randomIndex, profiles, profile });

  if (!profile) { return null; }

  const score = similarities.find((item: any) => item.embeddings_id === profile.zilliz_embeddings_id)?.score || .99;

  return { profile, score };
}
