import {
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/cloudflare";
import { destroySession, getSession } from "~/sessions";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Logout of Jittter",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

const LogoutRoute = () => null;

export default LogoutRoute;
