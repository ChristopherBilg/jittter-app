import { useFetchers, useLoaderData } from "@remix-run/react";
import { AtomStructure, NoteStructure } from "~/app/db.server/mongodb/atom";
import { AtomFormAction } from "~/app/routes/atoms/route";
import { loader } from "~/app/routes/dashboard/route";
import AtomicItem from "./AtomicItem";
import CreateAtomicContact from "./CreateAtomicContact";
import CreateAtomicNote from "./CreateAtomicNote";
import CreateAtomicReminder from "./CreateAtomicReminder";

const useDeletedAtomIds = () => {
  return useFetchers()
    .filter((fetcher) => {
      if (!fetcher.formData) return false;

      return fetcher.formData.get("_action") === AtomFormAction.DeleteAtom;
    })
    .map((fetcher) => String(fetcher.formData!.get("atomId")));
};

const usePendingAtoms = () => {
  return useFetchers()
    .filter((fetcher) => {
      if (!fetcher.formData) return false;

      return fetcher.formData.get("_action") === AtomFormAction.CreateAtom;
    })
    .map((fetcher) => {
      const _createdAt = Number(fetcher.formData!.get("_createdAt"));
      const _type = String(fetcher.formData!.get("_type"));

      const allFormEntries = fetcher.formData!.entries();
      const data = Object.fromEntries(allFormEntries);

      return {
        _id: `pending-${_createdAt}`,
        type: _type,
        createdAt: _createdAt,
        updatedAt: _createdAt,
        userId: "pending",
        data,
      } as AtomStructure<NoteStructure>;
    });
};

const AtomicItemList = () => {
  const loaderData = useLoaderData<typeof loader>();

  const deletedAtomIds = useDeletedAtomIds();
  const pendingAtoms = usePendingAtoms();
  const displayAtoms = loaderData.atoms
    .filter((atom) => !deletedAtomIds.includes(atom._id))
    .filter(
      (atom) =>
        !pendingAtoms.some(
          (pendingAtom) => pendingAtom.createdAt === atom.createdAt,
        ),
    )
    .concat(pendingAtoms)
    .sort((a, b) => a.createdAt - b.createdAt);

  return (
    <ul className="my-2 space-y-2 divide-gray-200">
      {displayAtoms.map((atom) => (
        <li key={atom._id}>
          <AtomicItem atom={atom} />
        </li>
      ))}

      <li>
        <CreateAtomicNote />
      </li>

      <li>
        <CreateAtomicReminder />
      </li>

      <li>
        <CreateAtomicContact />
      </li>
    </ul>
  );
};

export default AtomicItemList;
