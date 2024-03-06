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
import { User } from "~/app/db.server/postgresql/models/user";
import { commitSession, getSession } from "~/app/sessions.server";
import { SignUpUserSchema, validateSignUp } from "./validate";

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

  const user = await User.create(firstName, lastName, email, password);

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

  return (
    <SlimLayout
      background={
        <img
          className="absolute inset-0 h-full w-full object-cover"
          // TODO: Add image
          src="https://fastly.picsum.photos/id/127/2000/1000.webp?hmac=4VfaQ02QSm48e6-SYFK1R4fhQxT6HlzDrQx_7QraSxU"
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
        Get started today
      </h2>

      <p className="my-2 text-sm text-gray-700">
        Already registered?{" "}
        <Link
          to="/signin"
          prefetch="viewport"
          className="font-medium text-blue-600 hover:underline"
        >
          Sign in
        </Link>{" "}
        to your account.
      </p>

      <hr />

      <fetcher.Form
        method="POST"
        action="/signup"
        className="flex flex-col space-y-4"
      >
        {error && <p className="text-red-500">{error}</p>}

        {Array.isArray(errors?.firstName) && (
          <span className="text-sm text-gray-500">
            First Name: {errors.firstName?.[0]}
          </span>
        )}

        {Array.isArray(errors?.lastName) && (
          <span className="text-sm text-gray-500">
            Last Name: {errors.lastName?.[0]}
          </span>
        )}

        <div className="mx-auto flex w-full justify-between">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            autoComplete="given-name"
            className="mr-2 w-1/2 rounded border px-4 py-2"
            maxLength={
              SignUpUserSchema._def.schema.shape.firstName.maxLength ??
              undefined
            }
            required
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            autoComplete="family-name"
            className="w-1/2 rounded border px-4 py-2"
            maxLength={
              SignUpUserSchema._def.schema.shape.lastName.maxLength ?? undefined
            }
            required
          />
        </div>

        {Array.isArray(errors?.email) && (
          <span className="text-sm text-gray-500">
            Email: {errors.email?.[0]}
          </span>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
          className="rounded border px-4 py-2"
          maxLength={
            SignUpUserSchema._def.schema.shape.email.maxLength ?? undefined
          }
          required
        />

        {Array.isArray(errors?.password) && (
          <span className="text-sm text-gray-500">
            Password: {errors.password?.[0]}
          </span>
        )}

        <div className="mx-auto flex w-full justify-between">
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="new-password"
            className="mr-2 w-1/2 rounded border px-4 py-2"
            minLength={
              SignUpUserSchema._def.schema.shape.password.minLength ?? undefined
            }
            maxLength={
              SignUpUserSchema._def.schema.shape.password.maxLength ?? undefined
            }
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            autoComplete="new-password"
            className="w-1/2 rounded border px-4 py-2"
            minLength={
              SignUpUserSchema._def.schema.shape.confirmPassword.minLength ??
              undefined
            }
            maxLength={
              SignUpUserSchema._def.schema.shape.confirmPassword.maxLength ??
              undefined
            }
            required
          />
        </div>

        <input
          type="submit"
          value={fetcher.state !== "idle" ? "Signing up..." : "Sign Up"}
          className="mx-auto my-1 w-fit cursor-pointer rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        />
      </fetcher.Form>
    </SlimLayout>
  );
};

export default SignUpRoute;
