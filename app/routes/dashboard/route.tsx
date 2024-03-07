import { Bars3Icon } from "@heroicons/react/24/outline";
import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/cloudflare";
import { useState } from "react";
import AtomicItemList from "~/app/components/dashboard/AtomicItemList";
import Container from "~/app/components/dashboard/Container";
import Drawer from "~/app/components/dashboard/Drawer";
import { Atom } from "~/app/db.server/mongodb/atom";
import { redirectIfNotAuthenticated } from "~/app/sessions.server";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Dashboard",
    },
  ];
};

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { user } = await redirectIfNotAuthenticated(
    request,
    "/signin",
    context.env.NEON_DATABASE_URL,
  );
  const { id: userId } = user;

  const atoms = await Atom.get(context.env.MONGO_DATABASE_API_KEY, userId);

  return json({
    atoms,
  });
};

const DashboardRoute = () => {
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

      <AtomicItemList />
    </Container>
  );
};

export default DashboardRoute;
