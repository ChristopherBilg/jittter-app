import { XMarkIcon } from "@heroicons/react/24/outline";
import { useFetcher } from "@remix-run/react";
import { createRef, useEffect, useState } from "react";
import { AtomStructure } from "~/app/db/models/atom.server";
import { FormAction } from "~/app/routes/atoms/route";

type AtomicItemProps = {
  atom: AtomStructure;
};

const AtomicItem = ({ atom }: AtomicItemProps) => {
  const fetcher = useFetcher();

  const editInputRef = createRef<HTMLInputElement>();

  const [editable, setEditable] = useState(false);
  useEffect(() => {
    if (editable) editInputRef.current?.focus();
  }, [editable, editInputRef]);

  return (
    <div className="flex justify-between space-x-2 overflow-hidden bg-white px-4 py-4 shadow-lg sm:rounded-md sm:px-6">
      {editable ? (
        <fetcher.Form
          method="POST"
          action="/atoms"
          className="w-full"
          onSubmit={() => setEditable(false)}
        >
          <input type="hidden" name="_action" value={FormAction.UpdateAtom} />
          <input type="hidden" name="atomId" value={atom._id} />

          <input
            ref={editInputRef}
            type="text"
            name="content"
            defaultValue={atom.content ?? ""}
            className="w-full rounded-md border border-gray-200 p-2"
            onBlur={(e) => {
              fetcher.submit(e.target.form);
              setEditable(false);
            }}
          />
        </fetcher.Form>
      ) : (
        <button onClick={() => setEditable(true)} className="w-full">
          <p className="text-left">{atom.content}</p>
        </button>
      )}

      <fetcher.Form method="POST" action="/atoms">
        <input type="hidden" name="_action" value={FormAction.DeleteAtom} />
        <input type="hidden" name="atomId" value={atom._id} />

        <button type="submit" className="rounded-md bg-red-300 text-white">
          <span className="sr-only">Delete, {atom.content}</span>
          <XMarkIcon className="h-4 w-4" />
        </button>
      </fetcher.Form>
    </div>
  );
};

export default AtomicItem;
