import { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import { redirectIfNotAuthenticated } from "~/sessions";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Jittter Dashboard",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  redirectIfNotAuthenticated(request, "/login");

  return null;
};

const DashboardRoute = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl">Dashboard</h1>

      <div className="flex flex-col space-y-4">
        <Link to="/">Main page</Link>
        <Link to="/account">My Account</Link>
        <Link to="/logout">Log out</Link>
      </div>
    </div>
  );
};

export default DashboardRoute;
