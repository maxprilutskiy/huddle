import { redirect, type ActionFunction, type LoaderFunction } from "@remix-run/cloudflare";
import { Button, Card, CardBody, Input, Spacer, Textarea } from "@nextui-org/react";
import { getAuthenticator } from "~/services/auth.server";
import { Form } from "@remix-run/react";
import { LuSearch } from 'react-icons/lu';
import { getSupabase } from "~/services/supabase.server";

export const action: ActionFunction = async ({ request, context }) => {
  const authenticator = getAuthenticator(context.env);
  // get the user data or redirect to /login if it failed
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth",
  });
  if (!user) { return null; }

  const data = new URLSearchParams(await request.text());
  const name = data.get('name');
  const location = data.get('location');
  const companyDescription = data.get('companyDescription');
  const latestAchievement = data.get('latestAchievement');
  const currentChallenge = data.get('currentChallenge');

  const sb = getSupabase(context.env);
  const userProfile = await sb.from('UserProfile').select('*').eq('id', user.id).single();
  if (userProfile.data) { return null; }

  const profileCreationResponse = await sb.from('UserProfile').insert({
    id: user.id,
    userId: user.id,
    name,
    location,
    company_description: companyDescription,
    latest_achievement: latestAchievement,
    current_challenge: currentChallenge,
    zilliz_embeddings_id: '',
  });
  if (profileCreationResponse.error) { return null; }

  return redirect('/');
};

export const loader: LoaderFunction = async ({ request, context }) => {
  const authenticator = getAuthenticator(context.env);
  // get the user data or redirect to /login if it failed
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth",
  });
  if (!user) { return null; }

  return {};
};

export default function Welcome() {
  return (
    <main>
      <Card
        isBlurred
        className="p-4 border border-foreground-100 max-w-lg transform translate-y-[-50%] translate-x-[-50%] top-1/2 left-1/2"
        shadow="sm"
      >
        <CardBody>
          <Spacer y={4} />
          <h1 className="text-center text-3xl font-semibold">
            Let's get started!
          </h1>
          <Spacer y={2} />
          <p className="text-center text-foreground-400">
            Let's finish creating your profile, so we can find you the best networking companions.
          </p>
          <Spacer y={6} />
          <Form method="POST">
            <Input name="name" type="text" variant="bordered" labelPlacement="outside" label="What's your name?" placeholder={`e.g. "John Doe"`} />
            <Spacer y={4} />
            <Input name="location" type="text" variant="bordered" labelPlacement="outside" label="Where do you live?" placeholder={`e.g. "Barcelona, Spain"`} />
            <Spacer y={4} />
            <Textarea name="companyDescription" type="text" variant="bordered" labelPlacement="outside" label="What are you working on?" placeholder={`e.g. "I'm working on a SaaS startup that helps shy people network."`} />
            <Spacer y={4} />
            <Textarea name="latestAchievement" type="text" variant="bordered" labelPlacement="outside" label="What's your latest achievement?" placeholder={`e.g. "Last week we've launched on ProductHunt and became Product of the Day."`} />
            <Spacer y={4} />
            <Textarea name="currentChallenge" type="text" variant="bordered" labelPlacement="outside" label="What's your current challenge?" placeholder={`e.g. "I can't decide if we need to invest into marketing or sales."`} />
            <Spacer y={6} />
            <Button color="success" variant="flat" size="lg" type="submit" startContent={<LuSearch />} fullWidth>
              Find companions
            </Button>
          </Form>
          <Spacer y={2} />
        </CardBody>
      </Card>
    </main>
  );
}