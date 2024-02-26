import { Bars3Icon } from "@heroicons/react/24/outline";
import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/cloudflare";
import { useFetchers, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import AtomicItem from "~/app/components/dashboard/AtomicItem";
import Container from "~/app/components/dashboard/Container";
import CreateAtomicItem from "~/app/components/dashboard/CreateAtomicItem";
import Drawer from "~/app/components/dashboard/Drawer";
import { Atom } from "~/app/db/mongodb/atom.server";
import { redirectIfNotAuthenticated } from "~/app/sessions";
import { FormAction } from "../atoms/route";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Dashboard",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user } = await redirectIfNotAuthenticated(request, "/signin");
  const { id: userId } = user;

  const atoms = await Atom.get(userId);

  return json({
    atoms,
  });
};

const useDeletedAtomIds = () => {
  return useFetchers()
    .filter((fetcher) => {
      if (!fetcher.formData) return false;

      return fetcher.formData.get("_action") === FormAction.DeleteAtom;
    })
    .map((fetcher) => String(fetcher.formData!.get("atomId")));
};

const DashboardRoute = () => {
  const loaderData = useLoaderData<typeof loader>();

  const deletedAtomIds = useDeletedAtomIds();
  const displayAtoms = loaderData.atoms.filter(
    (atom) => !deletedAtomIds.includes(atom._id),
  );

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
        {displayAtoms.map((atom) => (
          <li key={atom._id}>
            <AtomicItem atom={atom} />
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
