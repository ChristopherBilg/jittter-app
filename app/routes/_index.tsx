import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getSession } from "~/app/sessions";
import CallToAction from "../components/landing/CallToAction";
import FAQs from "../components/landing/FAQs";
import Footer from "../components/landing/Footer";
import Header from "../components/landing/Header";
import Hero from "../components/landing/Hero";
import Pricing from "../components/landing/Pricing";
import PrimaryFeatures from "../components/landing/PrimaryFeatures";
import SecondaryFeatures from "../components/landing/SecondaryFeatures";
import Testimonials from "../components/landing/Testimonials";

export const meta: MetaFunction = () => {
  return [
    { title: "Jittter - Productivity workflows made simple for everyone" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("id")) return null;

  return {
    id: session.get("id"),
  };
};

const LandingRoute = () => {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <>
      <Header isAuthenticated={!!loaderData?.id} />

      <main>
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <CallToAction isAuthenticated={!!loaderData?.id} />
        <Testimonials />
        <Pricing isAuthenticated={!!loaderData?.id} />
        <FAQs />
      </main>

      <Footer />
    </>
  );
};

export default LandingRoute;
