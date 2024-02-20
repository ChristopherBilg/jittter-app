import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from "@remix-run/cloudflare";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import Logo from "~/app/components/common/Logo";
import SlimLayout from "~/app/components/common/SlimLayout";
import { ContactUs } from "~/app/db/models/contact-us";
import { commitSession, getSession } from "~/app/sessions";
import { validateSendMessage } from "./validate";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Let us know how we can help",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  const data = {
    error: session.get("error"),
    success: session.get("success"),
  };

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  const { errors, data } = await validateSendMessage(request);

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

  const { firstName, lastName, email, message } = data;

  const sentMessage = await ContactUs.create(
    firstName,
    lastName,
    email,
    message,
  );

  if (sentMessage) {
    session.flash("success", "Your message has been sent successfully.");
  } else {
    session.flash("error", "An error occurred while sending your message.");
  }

  return json(
    {
      errors,
      data,
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    },
  );
};

const ContactUsRoute = () => {
  const { error, success } = useLoaderData<typeof loader>();

  const fetcher = useFetcher<typeof action>();
  const errors = fetcher.data?.errors;

  const formRef = useRef<HTMLFormElement>(null);
  useEffect(
    function resetFormOnSuccess() {
      if (fetcher.state === "idle" && !fetcher.data?.errors) {
        formRef.current?.reset();
      }
    },
    [fetcher.state, fetcher.data],
  );

  return (
    <SlimLayout
      background={
        <img
          className="absolute inset-0 h-full w-full object-cover"
          // TODO: Add image
          src="https://fastly.picsum.photos/id/385/2000/1000.webp?hmac=kEbTroKnpSiJ2ek09Fb9OCQ1nXmx9ON55bV6G6BQu00"
          alt=""
        />
      }
    >
      <div className="flex">
        <Link to="/" prefetch="viewport" aria-label="Home">
          <Logo />
        </Link>
      </div>

      <h2 className="mt-20 text-lg font-semibold text-gray-900">Contact Us</h2>

      <p className="my-2 text-sm text-gray-700">
        Please let us know how we can help. We'll get back to you as soon as
        possible.
      </p>

      <hr />

      <fetcher.Form
        method="POST"
        className="flex flex-col space-y-4"
        ref={formRef}
      >
        {success && <p className="text-green-500">{success}</p>}
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
            className="mr-2 w-[50%] rounded border px-4 py-2"
            minLength={1}
            maxLength={128}
            required
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            autoComplete="family-name"
            className="w-[50%] rounded border px-4 py-2"
            minLength={1}
            maxLength={128}
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
          maxLength={128}
          required
        />

        {Array.isArray(errors?.message) && (
          <span className="text-sm text-gray-500">
            Message: {errors.message?.[0]}
          </span>
        )}

        <textarea
          name="message"
          placeholder="Message"
          className="min-h-40 rounded border px-4 py-2"
          minLength={1}
          maxLength={1024}
          required
        />

        <input
          type="submit"
          value={
            fetcher.state !== "idle" ? "Sending Message..." : "Send Message"
          }
          className="mx-auto my-1 w-fit cursor-pointer rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        />
      </fetcher.Form>
    </SlimLayout>
  );
};

export default ContactUsRoute;
