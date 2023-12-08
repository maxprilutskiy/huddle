import { redirect, type LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getAuthenticator } from "~/services/auth.server";
import { generateProfileSuggestions as generateProfileSuggestion } from "~/services/suggestions.server";
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

  const suggestions = await generateProfileSuggestion(context.env);
  return { suggestions };
};

export default function Home() {
  const data = useLoaderData();
  console.log(data);

  return <></>;
}
