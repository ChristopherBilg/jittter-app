import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/cloudflare";
import { json, redirect, useFetcher, useLoaderData } from "@remix-run/react";
import SlimLayout from "~/app/components/common/SlimLayout";
import { createUser } from "~/app/db/schema";
import { commitSession, getSession } from "~/app/sessions";
import {
  USER_ACCOUNT_MINIMUM_PASSWORD_LENGTH,
  validateSignUp,
} from "./validate";

export const meta: MetaFunction = () => {
  return [{ title: "We're excited to have you join Jittter!" }];
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

  const { errors, data } = await validateSignUp(request);

  if (errors || !data) {
    return json(
      { errors },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      },
    );
  }

  const { firstName, lastName, email, password } = data;

  const user = await createUser(firstName, lastName, email, password);

  if (!user) {
    session.flash("error", "An error occurred while creating your account.");

    return redirect("/signup", {
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

const SignUpRoute = () => {
  const { error } = useLoaderData<typeof loader>();

  const fetcher = useFetcher<typeof action>();
  const errors = fetcher.data?.errors;

  const x = true;
  if (x) {
    return (
      <SlimLayout
        img={
          <img
            className="absolute inset-0 h-full w-full object-cover"
            // TODO: Add image
            src="https://picsum.photos/2000/1000?random=14"
            alt=""
          />
        }
      >
        <p>Coming Soon!</p>
      </SlimLayout>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <fetcher.Form method="POST" className="flex flex-col space-y-4">
        <h1 className="text-center text-4xl font-bold">
          Sign up with Jittter!
        </h1>

        <hr />

        {error && <p className="text-red-500">{error}</p>}

        {errors?.firstName && (
          <span className="text-sm text-gray-500">
            First Name: {errors.firstName}
          </span>
        )}

        {errors?.lastName && (
          <span className="text-sm text-gray-500">
            Last Name: {errors.lastName}
          </span>
        )}

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

        {errors?.email && (
          <span className="text-sm text-gray-500">Email: {errors.email}</span>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
          className="rounded border px-4 py-2"
          required
        />

        {errors?.password && (
          <span className="text-sm text-gray-500">
            Password: {errors.password}
          </span>
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="new-password"
          className="rounded border px-4 py-2"
          minLength={USER_ACCOUNT_MINIMUM_PASSWORD_LENGTH}
          required
        />

        <input
          type="submit"
          value={fetcher.state !== "idle" ? "Signing up..." : "Sign Up"}
          className="mx-auto my-1 w-fit rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        />
      </fetcher.Form>
    </div>
  );
};

export default SignUpRoute;
