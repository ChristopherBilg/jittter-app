import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/cloudflare";
import { json, redirect, useFetcher, useLoaderData } from "@remix-run/react";
import { commitSession, getSession } from "~/app/sessions";
import { validateSignIn } from "./validate";

export const meta: MetaFunction = () => {
  return [{ title: "Welcome back to Jittter!" }];
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

  const user = await validateSignIn(request);

  if (!user) {
    session.flash("error", "Invalid username and/or password");

    return redirect("/signin", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  session.set("id", user.id);

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

const SignInRoute = () => {
  const { error } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <div className="flex h-screen items-center justify-center">
      <fetcher.Form method="POST" className="flex flex-col space-y-4">
        <h1 className="text-center text-4xl font-bold">Login to Jittter!</h1>

        <hr />

        {error && <p className="text-red-500">{error}</p>}

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
          autoComplete="current-password"
          className="rounded border px-4 py-2"
          required
        />

        <input
          type="submit"
          value={fetcher.state !== "idle" ? "Logging in..." : "Login"}
          className="mx-auto my-1 w-fit rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        />
      </fetcher.Form>
    </div>
  );
};

export default SignInRoute;
