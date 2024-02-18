import { Link } from "@remix-run/react";
import Container from "./Container";

type CallToActionProps = {
  isAuthenticated: boolean;
};

const CallToAction = ({ isAuthenticated }: CallToActionProps) => {
  return (
    <section className="relative overflow-hidden bg-blue-600 py-32">
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Get started today
          </h2>

          <p className="mt-4 text-lg tracking-tight text-white">
            It's time to take control of your life. Create an account and start
            your journey today.
          </p>

          {isAuthenticated ? (
            <Link
              to="/dashboard"
              prefetch="viewport"
              className="mt-8 inline-block rounded-lg bg-white px-8 py-3.5 font-medium text-blue-600 hover:bg-opacity-90"
            >
              My Dashboard
            </Link>
          ) : (
            <Link
              to="/signup"
              prefetch="viewport"
              className="mt-8 inline-block rounded-lg bg-white px-8 py-3.5 font-medium text-blue-600 hover:bg-opacity-90"
            >
              Sign Up
            </Link>
          )}
        </div>
      </Container>
    </section>
  );
};

export default CallToAction;
