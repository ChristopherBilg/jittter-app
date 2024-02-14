import { Tab } from "@headlessui/react";
import clsx from "clsx";
import Container from "./Container";

type Feature = {
  name: React.ReactNode;
  summary: string;
  description: string;
  image: string;
  icon: React.ComponentType;
};

const features: Array<Feature> = [
  {
    name: "Mobile First",
    summary: "Access your business from anywhere, on any device.",
    description:
      "Jittter is designed to work on any device, so you can access your business from anywhere.",
    // TODO: Add image
    image: "https://picsum.photos/2000/1000?random=5",
    icon: function MobileFirstIcon() {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="#fff"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
          />
        </svg>
      );
    },
  },
  {
    name: "Simple Ease of Use",
    summary:
      "Jittter is designed to be simple and easy to use, so you can focus on everything else.",
    description:
      "Focusing heavily on the user experience, we built Jittter from the ground up for simplicity.",
    // TODO: Add image
    image: "https://picsum.photos/2000/1000?random=6",
    icon: function SimpleEaseOfUseIcon() {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="#fff"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      );
    },
  },
  {
    name: "Data That YOU Own",
    summary:
      "We believe that your data is yours, and we don't want to change that.",
    description:
      "We are simply here to help you manage it. Whenever you choose to leave, you can take your data with you.",
    // TODO: Add image
    image: "https://picsum.photos/2000/1000?random=7",
    icon: function DataThatYouOwnIcon() {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="#fff"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
          />
        </svg>
      );
    },
  },
];

const Feature = ({
  feature,
  isActive,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  feature: Feature;
  isActive: boolean;
}) => {
  return (
    <div
      className={clsx(className, !isActive && "opacity-75 hover:opacity-100")}
      {...props}
    >
      <div
        className={clsx(
          "w-9 rounded-lg",
          isActive ? "bg-blue-600" : "bg-slate-500",
        )}
      >
        <svg aria-hidden="true" className="h-9 w-9" fill="none">
          <feature.icon />
        </svg>
      </div>

      <h3
        className={clsx(
          "mt-6 text-sm font-medium",
          isActive ? "text-blue-600" : "text-slate-600",
        )}
      >
        {feature.name}
      </h3>

      <p className="font-display mt-2 text-xl text-slate-900">
        {feature.summary}
      </p>

      <p className="mt-4 text-sm text-slate-600">{feature.description}</p>
    </div>
  );
};

const FeaturesMobile = () => {
  return (
    <div className="-mx-4 mt-20 flex flex-col gap-y-10 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:hidden">
      {features.map((feature) => (
        <div key={feature.summary}>
          <Feature feature={feature} className="mx-auto max-w-2xl" isActive />

          <div className="relative mt-10 pb-10">
            <div className="absolute -inset-x-4 bottom-0 top-8 bg-slate-200 sm:-inset-x-6" />

            <div className="relative mx-auto w-[52.75rem] overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-500/10">
              <img
                className="w-full"
                src={feature.image}
                alt=""
                sizes="52.75rem"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const FeaturesDesktop = () => {
  return (
    <Tab.Group id="features" as="div" className="hidden lg:mt-20 lg:block">
      {({ selectedIndex }) => (
        <>
          <Tab.List className="grid grid-cols-3 gap-x-8">
            {features.map((feature, featureIndex) => (
              <Feature
                key={feature.summary}
                feature={{
                  ...feature,
                  name: (
                    <Tab className="ui-not-focus-visible:outline-none outline-none">
                      <span className="absolute inset-0" />
                      {feature.name}
                    </Tab>
                  ),
                }}
                isActive={featureIndex === selectedIndex}
                className="relative"
              />
            ))}
          </Tab.List>

          <Tab.Panels className="rounded-4xl relative mt-20 overflow-hidden bg-slate-200 px-14 py-16 xl:px-16">
            <div className="-mx-5 flex">
              {features.map((feature, featureIndex) => (
                <Tab.Panel
                  static
                  key={feature.summary}
                  className={clsx(
                    "ui-not-focus-visible:outline-none px-5 transition duration-500 ease-in-out",
                    featureIndex !== selectedIndex && "opacity-60",
                  )}
                  style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
                  aria-hidden={featureIndex !== selectedIndex}
                >
                  <div className="w-[52.75rem] overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-500/10">
                    <img
                      className="w-full"
                      src={feature.image}
                      alt=""
                      sizes="52.75rem"
                    />
                  </div>
                </Tab.Panel>
              ))}
            </div>

            <div className="rounded-4xl pointer-events-none absolute inset-0 ring-1 ring-inset ring-slate-900/10" />
          </Tab.Panels>
        </>
      )}
    </Tab.Group>
  );
};

const SecondaryFeatures = () => {
  return (
    <section
      id="secondary-features"
      aria-label="Features for simplifying everyday business tasks"
      className="pb-14 pt-20 sm:pb-20 sm:pt-32 lg:pb-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
            Simplify your everyday digital life
          </h2>

          <p className="mt-4 text-lg tracking-tight text-slate-700">
            Because who in the world doesn't want a more simple workflow.
          </p>
        </div>

        <FeaturesMobile />
        <FeaturesDesktop />
      </Container>
    </section>
  );
};

export default SecondaryFeatures;
