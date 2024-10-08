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
import ErrorLayout from "./components/error/ErrorLayout";
import Container from "./components/root/Container";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Jittter",
    },
    {
      name: "theme-color",
      content: "#2563EB",
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

  if (isRouteErrorResponse(error)) {
    return (
      <Container title={`${error.status} Error - ${error.statusText}`}>
        <div className="text-center">
          <ErrorLayout error={error} />
        </div>
      </Container>
    );
  } else if (error instanceof Error) {
    return (
      <Container title={error.message}>
        <div className="text-left">
          <h1>Error</h1>
          <p>{error.message}</p>

          <p>The stack trace is:</p>
          <pre>{error.stack}</pre>

          <p>The error object is:</p>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      </Container>
    );
  } else {
    return (
      <Container title="Unknown Error">
        <div className="text-center">
          <h1>Unknown Error</h1>
          <p>An unknown error occurred.</p>
        </div>
      </Container>
    );
  }
};

const App = () => (
  <html lang="en" className="h-full scroll-smooth bg-white antialiased">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Jittter</title>

      <Meta />
      <Links />
    </head>

    <body className="flex h-full flex-col">
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
