import { useFetchers, useLoaderData } from "@remix-run/react";
import { AtomStructure, NoteStructure } from "~/app/db/mongodb/atom.server";
import { AtomFormAction } from "~/app/routes/atoms/route";
import { loader } from "~/app/routes/dashboard/route";
import AtomicItem from "./AtomicItem";
import CreateAtomicItem from "./CreateAtomicItem";

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
      const content = String(fetcher.formData!.get("content"));
      const _createdAt = Number(fetcher.formData!.get("_createdAt"));
      const _type = String(fetcher.formData!.get("_type"));

      return {
        _id: `pending-${_createdAt}`,
        type: _type,
        createdAt: _createdAt,
        updatedAt: _createdAt,
        userId: "pending",
        data: {
          content: content,
        },
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
        <CreateAtomicItem />
      </li>
    </ul>
  );
};

export default AtomicItemList;
