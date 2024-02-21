import { Tab } from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import Container from "./Container";

const features = [
  {
    title: "Journals",
    description:
      "Journals are a great way to keep track of your day-to-day activities. You can use them to record your thoughts, tasks, and experiences, and they can help you to stay organized and focused.",
    // TODO: Add image
    image:
      "https://fastly.picsum.photos/id/269/2000/1000.webp?hmac=CqxS2lmxLf70SttDTy3dpjcf2QmG3i6fvP0ft4ZN9dU",
  },
  {
    title: "Notes",
    description:
      "Notes are a great way to keep track of important information.",
    // TODO: Add image
    image:
      "https://fastly.picsum.photos/id/921/2000/1000.webp?hmac=voS6TQxFBVc6cyuicOs60tJ0dlUpfj-GsKJbMG9YHFQ",
  },
  {
    title: "Reminders",
    description:
      "We all need a little help remembering things sometimes. Jittter can help you stay on top of your tasks and appointments with timely reminders and notifications.",
    // TODO: Add image
    image:
      "https://fastly.picsum.photos/id/280/2000/1000.webp?hmac=f65yngVU972R9-Q3t4d0PNmFS8c1iULzZZGo85_lHpo",
  },
  {
    title: "Recurring Tasks",
    description:
      "Recurring tasks are tasks that need to be done on a regular basis, such as paying bills or taking out the trash. While doing them might not be fun, they are necessary to keep your life running smoothly.",
    // TODO: Add image
    image:
      "https://fastly.picsum.photos/id/894/2000/1000.webp?hmac=xfiCA8ZFn8MLH_IGXWKfkUDH3vREKGx1wwcyWQD3aFY",
  },
];

const PrimaryFeatures = () => {
  const [tabOrientation, setTabOrientation] = useState<
    "horizontal" | "vertical"
  >("horizontal");

  useEffect(() => {
    const lgMediaQuery = window.matchMedia("(min-width: 1024px)");

    const onMediaQueryChange = ({ matches }: { matches: boolean }) => {
      setTabOrientation(matches ? "vertical" : "horizontal");
    };

    onMediaQueryChange(lgMediaQuery);
    lgMediaQuery.addEventListener("change", onMediaQueryChange);

    return () => {
      lgMediaQuery.removeEventListener("change", onMediaQueryChange);
    };
  }, []);

  return (
    <section
      id="features"
      aria-label="Features for running your books"
      className="relative overflow-hidden bg-blue-600 pb-28 pt-20 sm:py-32"
    >
      <Container className="relative">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
            Everything you need to manage your life.
          </h2>

          <p className="mt-6 text-lg tracking-tight text-blue-100">
            We aim to be your one-stop shop for all your life management and
            digital organizational needs.
          </p>
        </div>

        <Tab.Group
          as="div"
          className="mt-16 grid select-none grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0"
          vertical={tabOrientation === "vertical"}
        >
          {({ selectedIndex }) => (
            <>
              <div className="-mx-4 flex h-full overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                <Tab.List className="relative z-10 flex gap-x-4 whitespace-nowrap px-4 sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                  {features.map((feature, featureIndex) => (
                    <div
                      key={feature.title}
                      className={clsx(
                        "group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-xl lg:p-6",
                        selectedIndex === featureIndex
                          ? "bg-white lg:bg-white/10 lg:ring-1 lg:ring-inset lg:ring-white/10"
                          : "hover:bg-white/10 lg:hover:bg-white/5",
                      )}
                    >
                      <h3>
                        <Tab
                          className={clsx(
                            "font-display ui-not-focus-visible:outline-none text-lg outline-none",
                            selectedIndex === featureIndex
                              ? "text-blue-600 lg:text-white"
                              : "text-blue-100 hover:text-white lg:text-white",
                          )}
                        >
                          <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none" />
                          {feature.title}
                        </Tab>
                      </h3>

                      <p
                        className={clsx(
                          "mt-2 hidden text-sm lg:block",
                          selectedIndex === featureIndex
                            ? "text-white"
                            : "text-blue-100 group-hover:text-white",
                        )}
                      >
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </Tab.List>
              </div>

              <Tab.Panels className="self-baseline lg:col-span-7">
                {features.map((feature) => (
                  <Tab.Panel key={feature.title} unmount={false}>
                    <div className="relative sm:px-6 lg:hidden">
                      <div className="absolute -inset-x-4 bottom-[-2.25rem] top-[-6.5rem] bg-white/10 ring-1 ring-inset ring-white/10 sm:inset-x-0 sm:rounded-xl" />

                      <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">
                        {feature.description}
                      </p>
                    </div>

                    <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]">
                      <img
                        className="w-full"
                        src={feature.image}
                        alt=""
                        sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
                      />
                    </div>
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </>
          )}
        </Tab.Group>
      </Container>
    </section>
  );
};

export default PrimaryFeatures;
