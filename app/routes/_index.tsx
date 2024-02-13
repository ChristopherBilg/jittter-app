import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { getSession } from "~/sessions";

export const meta: MetaFunction = () => {
  return [{ title: "Welcome to Jittter!" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("id")) return null;

  return {
    id: session.get("id"),
  };
};

const LandingRoute = () => {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col space-y-4">
        <h1 className="text-4xl font-bold">
          Welcome {loaderData && "back "}to Jittter!
        </h1>

        <hr />

        {loaderData ? (
          <>
            <Link to="/logout" className="text-blue-500 underline">
              Logout
            </Link>

            <Link to="/dashboard" className="text-blue-500 underline">
              Dashboard
            </Link>

            <Link to="/my-account" className="text-blue-500 underline">
              My Account
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-500 underline">
              Login
            </Link>

            <Link to="/register" className="text-blue-500 underline">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default LandingRoute;
