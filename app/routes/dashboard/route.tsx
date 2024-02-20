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

const items = [
  { id: "1", content: "HEERE" },
  { id: "2", content: "HEERE" },
  { id: "3", content: "HEERE" },
  { id: "4", content: "HEERE" },
  { id: "5", content: "HEERE" },
  { id: "6", content: "HEERE" },
  { id: "7", content: "HEERE" },
  { id: "8", content: "HEERE" },
  { id: "9", content: "HEERE" },
];

const DashboardRoute = () => {
  return (
    <div className="container mx-auto max-w-6xl sm:px-6 lg:px-8">
      <ul className="space-y-2 divide-gray-200">
        {items.map((item) => (
          <li
            key={item.id}
            className="overflow-hidden bg-white px-4 py-4 shadow-lg sm:rounded-md sm:px-6"
          >
            <div>{item.content}</div>
          </li>
        ))}
      </ul>

      {/* TODO: Remove eventually */}
      <div className="fixed bottom-4 left-4 bg-white p-4">
        <h1 className="text-2xl">Dashboard</h1>

        <div className="flex flex-col space-y-4">
          <Link to="/">Main page</Link>
          <Link to="/notes">Notes</Link>
          <Link to="/account">Account Settings</Link>
          <Link to="/signout">Sign Out</Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardRoute;
