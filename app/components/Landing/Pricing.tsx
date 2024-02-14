import clsx from "clsx";
import Button from "./Button";
import Container from "./Container";

const CheckIcon = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"svg">) => {
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

const Plan = ({
  name,
  price,
  description,
  href,
  features,
  featured = false,
}: {
  name: string;
  price: string;
  description: string;
  href: string;
  features: Array<string>;
  featured?: boolean;
}) => {
  return (
    <section
      className={clsx(
        "flex flex-col rounded-3xl px-6 sm:px-8",
        featured ? "order-first bg-blue-600 py-8 lg:order-none" : "lg:py-8",
      )}
    >
      <h3 className="font-display mt-5 text-lg text-white">{name}</h3>

      <p
        className={clsx(
          "mt-2 text-base",
          featured ? "text-white" : "text-slate-400",
        )}
      >
        {description}
      </p>

      <p className="font-display order-first text-5xl font-light tracking-tight text-white">
        {price}
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
            <span className="ml-4">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        to={href}
        variant={featured ? "solid" : "outline"}
        color="white"
        className="mt-8"
        aria-label={`Get started with the ${name} plan for ${price}`}
      >
        Get started
      </Button>
    </section>
  );
};

// TODO: Update all of the information in this component.
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
            It doesn't matter what size your business is, our software won't
            work well for you.
          </p>
        </div>

        <div className="-mx-4 mt-16 grid max-w-2xl grid-cols-1 gap-y-10 sm:mx-auto lg:-mx-8 lg:max-w-none lg:grid-cols-3 xl:mx-0 xl:gap-x-8">
          <Plan
            name="Starter"
            price="$9"
            description="Good for anyone who is self-employed and just getting started."
            href="/register"
            features={[
              "Send 10 quotes and invoices",
              "Connect up to 2 bank accounts",
              "Track up to 15 expenses per month",
              "Manual payroll support",
              "Export up to 3 reports",
            ]}
          />

          <Plan
            featured
            name="Small business"
            price="$15"
            description="Perfect for small / medium sized businesses."
            href="/register"
            features={[
              "Send 25 quotes and invoices",
              "Connect up to 5 bank accounts",
              "Track up to 50 expenses per month",
              "Automated payroll support",
              "Export up to 12 reports",
              "Bulk reconcile transactions",
              "Track in multiple currencies",
            ]}
          />

          <Plan
            name="Enterprise"
            price="$39"
            description="For even the biggest enterprise companies."
            href="/register"
            features={[
              "Send unlimited quotes and invoices",
              "Connect up to 15 bank accounts",
              "Track up to 200 expenses per month",
              "Automated payroll support",
              "Export up to 25 reports, including TPS",
            ]}
          />
        </div>
      </Container>
    </section>
  );
};

export default Pricing;
