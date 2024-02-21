import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/cloudflare";
import {
  Link,
  json,
  redirect,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import Logo from "~/app/components/common/Logo";
import SlimLayout from "~/app/components/common/SlimLayout";
import { commitSession, getSession } from "~/app/sessions";
import { SignInUserSchema, validateSignIn } from "./validate";

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
    <SlimLayout
      background={
        <img
          className="absolute inset-0 h-full w-full object-cover"
          // TODO: Add image
          src="https://fastly.picsum.photos/id/475/2000/1000.webp?hmac=cJ4NA7Cf4U-Ex0LQxcrIqfffR-DXTA-WMAvPpje2iSI"
          alt=""
        />
      }
    >
      <div className="flex">
        <Link to="/" prefetch="viewport" aria-label="Home">
          <Logo />
        </Link>
      </div>

      <h2 className="mt-20 text-lg font-semibold text-gray-900">
        Sign in to your account
      </h2>

      <p className="my-2 text-sm text-gray-700">
        Don't have an account?{" "}
        <Link
          to="/signup"
          prefetch="viewport"
          className="font-medium text-blue-600 hover:underline"
        >
          Sign up
        </Link>{" "}
        to get started.
      </p>

      <hr />

      <fetcher.Form method="POST" className="flex flex-col space-y-4">
        {error && <p className="text-red-500">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
          className="rounded border px-4 py-2"
          maxLength={SignInUserSchema.shape.email.maxLength ?? undefined}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="current-password"
          className="rounded border px-4 py-2"
          minLength={SignInUserSchema.shape.password.minLength ?? undefined}
          maxLength={SignInUserSchema.shape.password.maxLength ?? undefined}
          required
        />

        <input
          type="submit"
          value={fetcher.state !== "idle" ? "Signing in..." : "Sign In"}
          className="mx-auto my-1 w-fit cursor-pointer rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        />
      </fetcher.Form>
    </SlimLayout>
  );
};

export default SignInRoute;
