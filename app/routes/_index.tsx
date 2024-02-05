import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import db from "~/db/client.server";
import { user } from "~/db/schema";

export const meta: MetaFunction = () => {
  return [{ title: "Welcome to Jittter!" }];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const env = context.env as Record<string, string>;

  const users = await db(env.NEON_DATABASE_URL).select().from(user);

  return { length: users.length };
};

const Landing = () => {
  const { length } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col space-y-4">
        <h1 className="text-4xl font-bold">Welcome to Jittter!</h1>

        <p>
          There are currently <b>{length}</b> users in the database.
        </p>

        <Link to="/register" className="text-blue-500 underline">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Landing;
