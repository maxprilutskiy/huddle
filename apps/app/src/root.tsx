import logo from '~/images/huddle.png';
import type { LinksFunction, LoaderFunction } from "@remix-run/cloudflare";
import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Form,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { Button, Link, NextUIProvider } from "@nextui-org/react";
import tailwindCss from "~/styles/tailwind.css";
import { getAuthenticator } from './services/auth.server';
import { getSupabase } from './services/supabase.server';

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: tailwindCss },
];

export const loader: LoaderFunction = async ({ request, context }) => {
  const authenticator = getAuthenticator(context.env);

  const user = await authenticator.isAuthenticated(request);
  
  const sb = getSupabase(context.env);
  const hasUserProfile = await sb.from('UserProfile').select('*').eq('id', user?.id).single().then(res => !!res.data);

  if (user) {
    return { user, hasUserProfile };
  } else {
    return null;
  }
};

export default function App() {
  const navigate = useNavigate();
  const data = useLoaderData<any>();

  return (
    <html lang="en" className="dark text-foreground bg-background h-full">
      <head>
        <title>Huddle</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full overflow-x-hidden overflow-y-scroll">
        <NextUIProvider className="h-full" navigate={navigate}>
          <div className='px-4 h-full w-full flex flex-col justify-between max-w-6xl mx-auto'>
            {renderNav()}
            <Outlet />
            {renderFooter()}
          </div>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </NextUIProvider>
      </body>
    </html>
  );

  function renderNav() {
    return (
      <nav className='py-4 flex justify-between items-center'>
        <div className="flex gap-2 items-center cursor-pointer" onClick={() => navigate('/')}>
          <img src={logo} alt="relelscope logo" className='w-10 h-10' />
          <span className="font-semibold">Huddle</span>
        </div>
        <ul className='flex gap-4 items-center'>
        </ul>
        <div className='flex gap-4'>
          {data?.user ? (
            <>
            <Form method='POST' action="/reset">
              <Button
                type="submit"
                children="Reset onboarding"
                color="primary"
                variant='flat'
                onClick={(e) => {
                  if (!confirm('Are you sure you want to reset your onboarding?')) {
                    e.preventDefault();
                  }
                }}
              />
            </Form>
            <Form method='POST' action="/deauth">
              <Button
                type="submit"
                children="Log out"
              />
            </Form>
            </>
          ) : (
            <Button
              href="/auth"
              as={Link}
              children="Log in"
              color="success"
            />
          )}
        </div>
      </nav>
    );
  }

  function renderFooter() {
    return (
      <footer className='py-4 flex justify-between text-foreground-500 text-sm'>
        <p>
          Huddle © {new Date().getFullYear()}
        </p>
        <p>
        </p>
        <p>
          Built by <Link className="text-sm" target="_blank" href="https://twitter.com/MaxPrilutskiy">Max</Link> and <Link className="text-sm" target="_blank" href="https://twitter.com/belakhonya">Veronica</Link> from Barcelona.
        </p>
      </footer>
    );
  }
}
