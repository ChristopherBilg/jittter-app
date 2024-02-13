import type { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import stylesheet from "~/app/tailwind.css";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Jittter",
    },
  ];
};

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: stylesheet },
  { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/favicon-16x16.png",
  },
  { rel: "manifest", href: "/manifest.json" },
];

export const ErrorBoundary = () => {
  const error = useRouteError();

  // TODO: In production none of this information should be exposed to the user.
  // You should log the error to an error reporting service and return a generic
  // error screen to the user. Also, this should be cleaned up for better error
  // outputs for development.

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>

        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>

        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>

        <p>The error object is:</p>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
};

const App = () => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <Meta />
      <Links />
    </head>

    <body>
      <Outlet />
      <ScrollRestoration />
      <Scripts />
      <LiveReload />

      {/* Cloudflare Web Analytics */}
      <script
        defer
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon='{"token": "42a1a6e5974245b7bb08af85b8487894"}'
      ></script>
    </body>
  </html>
);

export default App;
