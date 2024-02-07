import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import { destroySession, getSession } from "~/sessions";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Jittter Dashboard",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("id")) {
    return redirect("/login");
  }

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

const DashboardRoute = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl">Dashboard</h1>

      <Link to="/logout">Log out</Link>
    </div>
  );
};

export default DashboardRoute;
