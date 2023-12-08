import { redirect, type LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData, useNavigate } from "@remix-run/react";
import ProfileSuggestionCard from "~/components/profile-suggestion-card";
import { getAuthenticator } from "~/services/auth.server";
import { generateProfileSuggestion } from "~/services/suggestions.server";
import { getSupabase } from "~/services/supabase.server";

export const loader: LoaderFunction = async ({ request, context }) => {
  const authenticator = getAuthenticator(context.env);
  // get the user data or redirect to /login if it failed
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth",
  });
  if (!user) { return null; }

  const sb = getSupabase(context.env);
  const userProfile = await sb.from('UserProfile').select('*').eq('id', user.id).single();
  if (!userProfile.data) { return redirect('/welcome'); }

  const suggestion = await generateProfileSuggestion(context.env, user.id);
  return { suggestion };
};

export default function Home() {
  const data = useLoaderData<any>();
  const navigate = useNavigate();

  const randomProfilePic = `https://i.pravatar.cc/400?name=${data.suggestion.name}`;
  const score = .87;
  return (
    <main>
      <ProfileSuggestionCard
        className="max-w-sm transform translate-y-[-50%] translate-x-[-50%] top-1/2 left-1/2"
        profilePictureUrl={randomProfilePic}
        name={data.suggestion.name}
        location={data.suggestion.location}
        companyDescription={data.suggestion.company_description}
        latestAchievement={data.suggestion.latest_achievement}
        currentChallenge={data.suggestion.current_challenge}
        score={score}
        onRefresh={() => navigate('.', { replace: true })}
      />
    </main>
  );
}
