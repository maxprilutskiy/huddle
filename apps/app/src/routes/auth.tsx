import { Button, Card, CardBody, Input, Spacer } from "@nextui-org/react";
import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";
import { getAuthenticator } from "~/services/auth.server";

// Second, we need to export an action function, here we will use the
// `authenticator.authenticate method`
export const action: ActionFunction = async ({ request, context }) => {
  const authenticator = getAuthenticator(context.env);
  // we call the method with the name of the strategy we want to use and the
  // request object, optionally we pass an object with the URLs we want the user
  // to be redirected to after a success or a failure
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/",
    failureRedirect: "/auth",
  });
};

// Finally, we can export a loader function where we check if the user is
// authenticated with `authenticator.isAuthenticated` and redirect to the
// dashboard if it is or return null if it's not
export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const authenticator = getAuthenticator(context.env);
  // If the user is already authenticated redirect to /dashboard directly
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
};


export default function App() {
  return (
    <main>
      <Card
        isBlurred
        className="p-4 border border-foreground-100 max-w-md transform translate-y-[-50%] translate-x-[-50%] top-1/2 left-1/2"
        shadow="sm"
      >
        <CardBody>
          <Spacer y={4} />
          <h1 className="text-center text-3xl font-semibold">
            Huddle
          </h1>
          <Spacer y={2} />
          <p className="text-center text-foreground-400">
            Log in to continue
          </p>
          <Spacer y={6} />
          <Form method="POST">
            <Input name="email" type="email" variant="bordered" label="Email" />
            <Spacer y={4} />
            <Input name="password" type="password" variant="bordered" label="Password" />
            <Spacer y={6} />
            <Button color="success" variant="flat" size="lg" type="submit">
              Login
            </Button>
          </Form>
          <Spacer y={2} />
        </CardBody>
      </Card>
    </main>
  );
}
