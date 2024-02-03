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
    { name: "robots", content: "index, follow" }
  ];
};

export async function action({ context }: ActionFunctionArgs) {
  const env = context.env as Record<string, string>;

  const users = await db(env.NEON_DATABASE_URL).select().from(user).execute();

  if (users.length >= 10) {
    await db(env.NEON_DATABASE_URL).delete(user).execute();
  } else {
    await db(env.NEON_DATABASE_URL)
      .insert(user)
      .values({})
      .execute();
  }

  return {
    success: true,
  };
}

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const env = context.env as Record<string, string>;

  const users = await db(env.NEON_DATABASE_URL).select().from(user);

  return { users };
};

const Landing = () => {
  const { users } = useLoaderData<typeof loader>();

  return (
    <div className="m-3">
      <h1 className="text-3xl font-bold text-red-500 underline">
        Welcome to the Jittter web application!
      </h1>

      <Form method="POST">
        <input type="submit" value="Submit" />
      </Form>

      <div>
        {users.map((user) => (
          <div key={user.id}>
            <p>
              {user.id}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Landing;
