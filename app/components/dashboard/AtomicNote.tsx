import { useFetcher } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { AtomStructure, NoteStructure } from "~/app/db.server/mongodb/atom";
import { AtomFormAction } from "~/app/routes/atoms/route";
import { UpdateNoteAtomSchema } from "~/app/routes/atoms/validate";
import OptimisticDeleteAtomicItemButton from "./OptimisticDeleteAtomicItemButton";

type AtomicNoteProps = {
  atom: AtomStructure<NoteStructure>;
};

const AtomicNote = ({ atom }: AtomicNoteProps) => {
  const fetcher = useFetcher();

  const editInputRef = useRef<HTMLInputElement>(null);

  const [editable, setEditable] = useState(false);
  useEffect(() => {
    if (editable) editInputRef.current?.focus();
  }, [editable, editInputRef]);

  if (fetcher?.formData?.has("content")) {
    atom.data.content = String(fetcher.formData.get("content"));
  }

  return (
    <div className="flex justify-between space-x-2 overflow-hidden border-l-2 border-t-2 border-green-700 bg-white px-4 py-4 shadow-lg sm:rounded-md sm:px-6">
      {editable ? (
        <fetcher.Form
          method="POST"
          action="/atoms"
          className="w-full"
          onSubmit={() => setEditable(false)}
          onBlur={(e) => {
            if (
              !(
                e.relatedTarget instanceof HTMLButtonElement &&
                e.relatedTarget.name === "delete-atom"
              )
            ) {
              fetcher.submit(e.target.form);
              setEditable(false);
            }
          }}
        >
          <input
            type="hidden"
            name="_action"
            value={AtomFormAction.UpdateNoteAtom}
          />
          <input type="hidden" name="atomId" value={atom._id} />

          <input
            ref={editInputRef}
            type="text"
            name="content"
            placeholder="Add a note"
            defaultValue={atom.data.content ?? ""}
            className="w-full rounded-md border border-gray-200 p-2"
            maxLength={
              UpdateNoteAtomSchema.shape.content.maxLength ?? undefined
            }
          />
        </fetcher.Form>
      ) : (
        <button onClick={() => setEditable(true)} className="w-full">
          <p className="text-left">{atom.data.content}</p>
        </button>
      )}

      <OptimisticDeleteAtomicItemButton id={atom._id} />
    </div>
  );
};

export default AtomicNote;
