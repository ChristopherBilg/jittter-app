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

  // TODO: Remove temporary redirectonce we have a real dashboard
  // return redirect("/reminders", 307);

  return null;
};

const DashboardRoute = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl">Dashboard</h1>

      <div className="flex flex-col space-y-4">
        <Link to="/">Main page</Link>
        <Link to="/reminders">Reminders</Link>
        <Link to="/account">Account Settings</Link>
        <Link to="/signout">Sign Out</Link>
      </div>
    </div>
  );
};

export default DashboardRoute;
