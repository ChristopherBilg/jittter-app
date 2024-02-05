import type { ActionFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { redirect, useFetcher } from "@remix-run/react";
import db from "~/db/client.server";
import { user } from "~/db/schema";
import { MINIMUM_PASSWORD_LENGTH, validate } from "./validate";

export const meta: MetaFunction = () => {
  return [{ title: "Register for Jittter!" }];
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const env = context.env as Record<string, string>;
  const { ok, values } = await validate(request);

  if (!ok) return null;

  try {
    const newUser = await db(env.NEON_DATABASE_URL)
      .insert(user)
      .values({
        email: values.email as string,
        password: values.password as string,
        firstName: values.firstName as string,
        lastName: values.lastName as string,
      })
      .execute();

    if (!newUser) return null;
  } catch (err) {
    console.error(err);
    return null;
  }

  // TODO: Create cookie
  // TODO: Set cookie in redirect headers
  return redirect("/dashboard");
};

const Register = () => {
  const fetcher = useFetcher();

  return (
    <div className="flex h-screen items-center justify-center">
      <fetcher.Form method="POST" className="flex flex-col space-y-4">
        <h1 className="text-center text-4xl font-bold">
          Register for Jittter!
        </h1>

        <hr />

        <div className="flex space-x-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            autoComplete="given-name"
            className="rounded border px-4 py-2"
            required
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            autoComplete="family-name"
            className="rounded border px-4 py-2"
            required
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
          className="rounded border px-4 py-2"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="new-password"
          className="rounded border px-4 py-2"
          minLength={MINIMUM_PASSWORD_LENGTH}
          required
        />

        <input
          type="submit"
          value={fetcher.state !== "idle" ? "Registering..." : "Register"}
          className="mx-auto my-1 w-fit rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        />
      </fetcher.Form>
    </div>
  );
};

export default Register;
