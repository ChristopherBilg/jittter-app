import { Link, useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import { ComponentPropsWithoutRef } from "react";
import { loader } from "~/app/routes/_index";
import { SubscriptionPrice, SubscriptionTier } from "~/app/utils/subscription";
import Container from "./Container";

const CheckIcon = ({
  className,
  ...props
}: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      aria-hidden="true"
      className={clsx(
        "h-6 w-6 flex-none fill-current stroke-current",
        className,
      )}
      {...props}
    >
      <path
        d="M9.307 12.248a.75.75 0 1 0-1.114 1.004l1.114-1.004ZM11 15.25l-.557.502a.75.75 0 0 0 1.15-.043L11 15.25Zm4.844-5.041a.75.75 0 0 0-1.188-.918l1.188.918Zm-7.651 3.043 2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004Zm3.4 2.457 4.25-5.5-1.187-.918-4.25 5.5 1.188.918Z"
        strokeWidth={0}
      />

      <circle
        cx={12}
        cy={12}
        r={8.25}
        fill="none"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

type PlanProps = {
  subscriptionTier: SubscriptionTier;
  description: string;
  features: string[];
  featured?: boolean;
};

const Plan = ({
  subscriptionTier,
  description,
  features,
  featured = false,
}: PlanProps) => {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <section
      className={clsx(
        "flex flex-col rounded-3xl px-6 sm:px-8",
        featured ? "order-first bg-blue-600 py-8 lg:order-none" : "lg:py-8",
      )}
    >
      <h3 className="font-display mt-5 text-lg capitalize text-white">
        {subscriptionTier}
      </h3>

      <p
        className={clsx(
          "mt-2 text-base",
          featured ? "text-white" : "text-slate-400",
        )}
      >
        {description}
      </p>

      <p className="font-display order-first text-5xl font-light tracking-tight text-white">
        {SubscriptionPrice[subscriptionTier]}
      </p>

      <ul
        className={clsx(
          "order-last mt-10 flex flex-col gap-y-3 text-sm",
          featured ? "text-white" : "text-slate-200",
        )}
      >
        {features.map((feature) => (
          <li key={feature} className="flex">
            <CheckIcon className={featured ? "text-white" : "text-slate-400"} />
            <span className="ml-4 self-center">{feature}</span>
          </li>
        ))}
      </ul>

      {loaderData?.id ? (
        <Link
          to="/dashboard"
          prefetch="viewport"
          className="mt-4 inline-block rounded-lg bg-white px-8 py-3.5 font-medium text-blue-600 hover:bg-opacity-90"
        >
          My Dashboard
        </Link>
      ) : (
        <Link
          to="/signup"
          prefetch="viewport"
          className="mt-4 inline-block rounded-lg bg-white px-8 py-3.5 font-medium text-blue-600 hover:bg-opacity-90"
        >
          Get Started
        </Link>
      )}
    </section>
  );
};

const Pricing = () => {
  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className="bg-slate-900 py-20 sm:py-32"
    >
      <Container>
        <div className="md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Simple pricing, for everyone.
          </h2>

          <p className="mt-4 text-lg text-slate-400">
            Simply choose the plan that's right for you and get started today!
          </p>
        </div>

        <div className="-mx-4 mt-16 grid max-w-2xl grid-cols-1 gap-y-10 sm:mx-auto lg:-mx-8 lg:max-w-none lg:grid-cols-3 xl:mx-0 xl:gap-x-8">
          <Plan
            subscriptionTier={SubscriptionTier.Starter}
            description="Good for anyone who wants to see what we're about."
            features={["Basic features"]}
          />

          <Plan
            featured
            subscriptionTier={SubscriptionTier.Premium}
            description="Perfect for day-to-day users that want to get more done."
            features={[
              "Everything in Starter",
            ]}
          />

          <Plan
            subscriptionTier={SubscriptionTier.Professional}
            description="For power users that want to get the most out of our software."
            features={[
              "Everything in Premium",
            ]}
          />
        </div>
      </Container>
    </section>
  );
};

export default Pricing;
