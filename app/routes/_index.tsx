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
    { title: "Jittter | Welcome!" },
    { name: "description", content: "Welcome to Jittter!" },
  ];
};

export async function action({ context }: ActionFunctionArgs) {
  const env = context.env as Record<string, string>;

  const users = await db(env.DATABASE_URL).select().from(user).execute();

  if (users.length >= 10) {
    await db(env.DATABASE_URL).delete(user).execute();
  } else {
    await db(env.DATABASE_URL)
      .insert(user)
      .values({
        id: Math.floor(Math.random() * 1_000_000),
        firstName: "C",
        lastName: "B",
      })
      .execute();
  }

  return {
    success: true,
  };
}

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const env = context.env as Record<string, string>;

  const users = await db(env.DATABASE_URL).select().from(user);

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
        <ol>
          {users.map((user) => (
            <li key={user.id}>
              <a href={`/users/${user.id}`}>
                {user.firstName} {user.lastName}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Landing;
