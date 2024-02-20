import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { destroySession, getSession } from "~/app/sessions";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
