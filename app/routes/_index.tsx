import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import NeonDB from "~/db/client.server";
import { UserTable } from "~/db/schema";
import { getSession } from "~/sessions";

export const meta: MetaFunction = () => {
  return [{ title: "Welcome to Jittter!" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  const x = await NeonDB.getInstance().db.select().from(UserTable);

  if (!session.has("id")) return null;

  return {
    id: session.get("id"),
    firstName: session.get("firstName"),
    lastName: session.get("lastName"),
    length: x.length,
  };
};

const LandingRoute = () => {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col space-y-4">
        <h1 className="text-4xl font-bold">Welcome to Jittter!</h1>

        <hr />

        <p>{loaderData?.length}</p>

        <hr />

        {loaderData && (
          <>
            <p>
              Welcome back, {loaderData.firstName} {loaderData.lastName}!
            </p>

            <hr />
          </>
        )}

        <Link to="/login" className="text-blue-500 underline">
          Login
        </Link>

        <Link to="/register" className="text-blue-500 underline">
          Register
        </Link>

        <Link to="/dashboard" className="text-blue-500 underline">
          Dashboard
        </Link>
      </div>
    </div>
  );
};

export default LandingRoute;
