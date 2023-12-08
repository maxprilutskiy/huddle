import { redirect, type ActionFunction } from "@remix-run/cloudflare";
import { getAuthenticator } from "~/services/auth.server";
import { getSupabase } from "~/services/supabase.server";

export const action: ActionFunction = async ({ request, context }) => {
  const authenticator = getAuthenticator(context.env);
  // get the user data or redirect to /login if it failed
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth",
  });
  if (!user) { return null; }

  const sb = getSupabase(context.env);
  await sb.from('UserProfile').delete().eq('id', user.id);

  return redirect('/');
};
