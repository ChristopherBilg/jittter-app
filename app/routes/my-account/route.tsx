import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from "@remix-run/cloudflare";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { exhaustiveMatchingGuard } from "utils/misc";
import { getUserById, updateUser } from "~/db/models/user";
import { commitSession, redirectIfNotAuthenticated } from "~/sessions";

export const meta: MetaFunction = () => {
  return [
    {
      title: "My Account",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await redirectIfNotAuthenticated(request, "/login");

  const user = await getUserById(session.data.id!);

  return {
    user,
  };
};

const enum FormAction {
  UpdateNames = "updateNames",
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await redirectIfNotAuthenticated(request, "/login");

  const formData = await request.formData();
  const _action = formData.get("_action") as FormAction;
  console.log("action", _action);

  switch (_action) {
    case FormAction.UpdateNames: {
      const id = String(session.get("id"));
      const firstName = String(formData.get("firstName"));
      const lastName = String(formData.get("lastName"));

      if (!firstName || !lastName) return null;

      const user = await updateUser(id, {
        firstName,
        lastName,
      });

      if (!user) return null;

      return json(user, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
    default: {
      return exhaustiveMatchingGuard(_action);
    }
  }
};

const AccountRoute = () => {
  const { user } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <div className="p-4">
      <h1 className="text-2xl">My Account</h1>

      <div className="flex flex-col space-y-4">
        <Link to="/">Main page</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/logout">Log out</Link>
      </div>

      <hr className="my-2" />

      <fetcher.Form method="POST">
        <div className="mx-auto flex w-full justify-start">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            autoComplete="given-name"
            className="mr-2 rounded border px-4 py-2"
            defaultValue={user?.firstName || ""}
            required
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            autoComplete="family-name"
            className="rounded border px-4 py-2"
            defaultValue={user?.lastName || ""}
            required
          />
        </div>

        <input type="hidden" name="_action" value={FormAction.UpdateNames} />

        <input
          type="submit"
          value={
            fetcher.state !== "idle" ? "Updating Names..." : "Update Names"
          }
          className="mx-auto my-1 w-fit rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        />
      </fetcher.Form>
    </div>
  );
};

export default AccountRoute;
