import { Bars3Icon } from "@heroicons/react/24/outline";
import {
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import AtomicItem from "~/app/components/dashboard/AtomicItem";
import Container from "~/app/components/dashboard/Container";
import CreateAtomicItem from "~/app/components/dashboard/CreateAtomicItem";
import Drawer from "~/app/components/dashboard/Drawer";
import { Atom } from "~/app/db/models/atom.server";
import { redirectIfNotAuthenticated } from "~/app/sessions";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Dashboard",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await redirectIfNotAuthenticated(request, "/signin");

  const userId = session.get("id");
  if (!userId) return redirect("/logout");

  const notes = await Atom.get(userId);

  return json({
    notes,
  });
};

const DashboardRoute = () => {
  const loaderData = useLoaderData<typeof loader>();

  const [open, setOpen] = useState(false);

  return (
    <Container>
      <div className="flex justify-end">
        <button
          className="m-2 rounded-md bg-blue-500 px-2 py-1 text-white"
          onClick={() => setOpen(true)}
        >
          <span className="sr-only">Open dashboard menu</span>
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      <Drawer open={open} setOpen={setOpen} />

      <ul className="my-2 space-y-2 divide-gray-200">
        {loaderData.notes
          .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
          .map((note) => (
            <li key={note._id}>
              <AtomicItem note={note} />
            </li>
          ))}

        <li>
          <CreateAtomicItem />
        </li>
      </ul>
    </Container>
  );
};

export default DashboardRoute;
