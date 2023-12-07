import type { ActionFunction } from "@remix-run/cloudflare";
import { getAuthenticator } from "~/services/auth.server";

export const action: ActionFunction = async ({ request, context }) => {
  const authenticator = getAuthenticator(context.env);
  await authenticator.logout(request, { redirectTo: "/auth" });
};

export default function Deauth() {
  return <></>;
}