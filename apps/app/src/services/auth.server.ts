// app/services/auth.server.ts
import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { FormStrategy } from "remix-auth-form";
import { createClient } from '@supabase/supabase-js';

export const getAuthenticator = (env: any) => {
  // Create an instance of the authenticator, pass a generic with what
  // strategies will return and will store in the session
  const authenticator = new Authenticator<{ id: string }>(sessionStorage);

  // Tell the Authenticator to use the form strategy
  authenticator.use(
    new FormStrategy(async ({ form }) => {
      const email = form.get("email");
      let user: any = null;
      if (email === 'admin@example.com') {
        const sb = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
        const userFromDb = await sb.from('User').select('*').eq('email', email).single();
        user = userFromDb.data ? { id: userFromDb.data.id } : null;
      }
      // the type of this user must match the type you pass to the Authenticator
      // the strategy will automatically inherit the type if you instantiate
      // directly inside the `use` method
      return user;
    }),
    // each strategy has a name and can be changed to use another one
    // same strategy multiple times, especially useful for the OAuth2 strategy.
    "user-pass"
  );

  return authenticator;
}
