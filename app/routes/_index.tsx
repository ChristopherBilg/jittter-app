import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/cloudflare";
import { Form, useLoaderData } from "@remix-run/react";
import db from "~/db/client.server";
import { user } from "~/db/schema";

export const meta: MetaFunction = () => {
  return [
    { title: "Welcome to Jittter!" },
    { name: "description", content: "Welcome to Jittter!" },
    { name: "keywords", content: "Jittter, welcome" },
    { name: "author", content: "Jittter, LLC" },
    { name: "robots", content: "index, follow" },
  ];
};

export async function action({ context }: ActionFunctionArgs) {
  const env = context.env as Record<string, string>;

  const users = await db(env.NEON_DATABASE_URL).select().from(user).execute();

  if (users.length >= 5) {
    await db(env.NEON_DATABASE_URL).delete(user).execute();
  } else {
    await db(env.NEON_DATABASE_URL).insert(user).values({}).execute();
  }

  return {};
}

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const env = context.env as Record<string, string>;

  const users = await db(env.NEON_DATABASE_URL).select().from(user);

  return { length: users.length };
};

const Landing = () => {
  const { length } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-screen items-center justify-center">
      <Form method="POST" className="flex flex-col space-y-4">
        <h1 className="text-4xl font-bold">Welcome to Jittter!</h1>

        <p>
          There are currently <b>{length}</b> users in the database.
        </p>

        <input
          type="submit"
          value={length >= 5 ? "Delete all users" : "Add a user"}
          className="mx-auto my-1 w-fit rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        />
      </Form>
    </div>
  );
};

export default Landing;
