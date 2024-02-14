import { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import { redirectIfNotAuthenticated } from "~/app/sessions";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Dashboard",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await redirectIfNotAuthenticated(request, "/signin");

  return null;
};

const DashboardRoute = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl">Dashboard</h1>

      <div className="flex flex-col space-y-4">
        <Link to="/">Main page</Link>
        <Link to="/my-account">My Account</Link>
        <Link to="/signout">Sign Out</Link>
      </div>
    </div>
  );
};

export default DashboardRoute;
