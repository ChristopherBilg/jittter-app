import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/cloudflare";
import { json, redirect, useFetcher, useLoaderData } from "@remix-run/react";
import { createUser } from "~/db/schema";
import { commitSession, getSession } from "~/sessions";
import { validate } from "./validate";

export const meta: MetaFunction = () => {
  return [{ title: "Register for Jittter!" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("id")) return redirect("/dashboard");

  const data = { error: session.get("error") };

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  const { ok, formData } = await validate(request);

  if (!ok) {
    session.flash("error", "Please fill out all fields.");

    return redirect("/register", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  const firstName = String(formData.get("firstName"));
  const lastName = String(formData.get("lastName"));
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const user = await createUser(firstName, lastName, email, password);

  if (!user) {
    session.flash("error", "An error occurred while creating your account.");

    return redirect("/register", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  session.set("id", user.id);

  // Registration succeeded, send them to the home page.
  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

const RegisterRoute = () => {
  const { error } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <div className="flex h-screen items-center justify-center">
      <fetcher.Form method="POST" className="flex flex-col space-y-4">
        <h1 className="text-center text-4xl font-bold">
          Register for Jittter!
        </h1>

        <hr />

        {error && <p className="text-red-500">{error}</p>}

        <div className="mx-auto flex w-full justify-between">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            autoComplete="given-name"
            className="mr-2 rounded border px-4 py-2"
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

export default RegisterRoute;
