import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getSession } from "~/app/sessions";
import CallToAction from "../components/Landing/CallToAction";
import FAQs from "../components/Landing/FAQs";
import Footer from "../components/Landing/Footer";
import Header from "../components/Landing/Header";
import Hero from "../components/Landing/Hero";
import Pricing from "../components/Landing/Pricing";
import PrimaryFeatures from "../components/Landing/PrimaryFeatures";
import SecondaryFeatures from "../components/Landing/SecondaryFeatures";
import Testimonials from "../components/Landing/Testimonials";

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
        <Pricing />
        <FAQs />
      </main>

      <Footer />
    </>
  );
};

export default LandingRoute;
