import { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import { redirectIfNotAuthenticated } from "~/sessions";

export const meta: MetaFunction = () => {
  return [
    {
      title: "My Account",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  redirectIfNotAuthenticated(request, "/login");

  return null;
};

const AccountRoute = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl">Dashboard</h1>

      <Link to="/">Main page</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/logout">Log out</Link>
    </div>
  );
};

export default AccountRoute;
