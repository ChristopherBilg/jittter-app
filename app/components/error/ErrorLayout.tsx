import { ErrorResponse } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";

type ErrorLayoutProps = {
  error: ErrorResponse;
};

const ErrorLayout = ({ error }: ErrorLayoutProps) => {
  let errorMessage = "";
  switch (error.status) {
    case 404:
      errorMessage = "Sorry, we couldn't find the page you're looking for.";
      break;
    case 500:
      errorMessage = "Sorry, we're having technical difficulties.";
      break;
    default:
      errorMessage = error.statusText;
      break;
  }

  return (
    <>
      <p className="text-base font-semibold text-blue-600">{error.status}</p>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        {error.statusText}
      </h1>

      <p className="mt-6 text-base leading-7 text-gray-600">{errorMessage}</p>

      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Link
          to="/"
          prefetch="viewport"
          className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Go back home
        </Link>

        <Link
          to="/contact-us"
          prefetch="viewport"
          className="rounded-md border border-blue-600 px-3.5 py-2.5 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Contact us <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </>
  );
};

export default ErrorLayout;
