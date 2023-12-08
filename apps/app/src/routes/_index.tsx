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

  if (!data.suggestion) {
    return (
      <main>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-3xl font-semibold">No suggestions available</h1>
          <p className="text-foreground-400">You've seen all the suggestions for now.</p>
          <p className="text-foreground-400">Please come back later.</p>
        </div>
      </main>
    );
  }

  const randomProfilePic = `https://i.pravatar.cc/400?name=${data.suggestion.profile.name}`;
  return (
    <main>
      <ProfileSuggestionCard
        className="max-w-sm transform translate-y-[-50%] translate-x-[-50%] top-1/2 left-1/2"
        profilePictureUrl={randomProfilePic}
        name={data.suggestion.profile.name}
        location={data.suggestion.profile.location}
        companyDescription={data.suggestion.profile.company_description}
        latestAchievement={data.suggestion.profile.latest_achievement}
        currentChallenge={data.suggestion.profile.current_challenge}
        score={data.suggestion.score}
        onRefresh={() => navigate('.', { replace: true })}
      />
    </main>
  );
}
