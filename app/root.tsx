import type { LinksFunction } from "@remix-run/cloudflare";
import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: stylesheet },
];

export const ErrorBoundary = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <html lang="en">
      <head>
        <title>Oh no!</title>

        <Meta />
        <Links />
      </head>

      <body>
        <h1>Oh no!</h1>
        <p>Something went wrong.</p>

        <Scripts />
      </body>
    </html>
  );
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
    </body>
  </html>
);

export default App;
