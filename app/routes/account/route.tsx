import { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Link, useFetcher } from "@remix-run/react";
import { redirectIfNotAuthenticated } from "~/sessions";

export const meta: MetaFunction = () => {
  return [
    {
      title: "My Account",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await redirectIfNotAuthenticated(request, "/login");

  return null;
};

export const action = async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  return null;
};

const AccountRoute = () => {
  const fetcher = useFetcher();

  return (
    <div className="p-4">
      <h1 className="text-2xl">Dashboard</h1>

      <div className="flex flex-col space-y-4">
        <Link to="/">Main page</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/logout">Log out</Link>
      </div>

      <fetcher.Form method="POST">
        <input type="submit" value="Update Account" />
      </fetcher.Form>
    </div>
  );
};

export default AccountRoute;
