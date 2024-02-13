import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getSession } from "~/app/sessions";
import Header from "~/components/Header";

export const meta: MetaFunction = () => {
  return [{ title: "Welcome to Jittter!" }];
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
      <Header />
    </>
  );
};

export default LandingRoute;
