import { useFetcher } from "@remix-run/react";
import { createRef, useEffect, useState } from "react";
import { AtomStructure, ReminderStructure } from "~/app/db/mongodb/atom.server";
import { AtomFormAction } from "~/app/routes/atoms/route";
import OptimisticDeleteAtomicItemButton from "./OptimisticDeleteAtomicItemButton";

type AtomicReminderProps = {
  atom: AtomStructure<ReminderStructure>;
};

const AtomicReminder = ({ atom }: AtomicReminderProps) => {
  const fetcher = useFetcher();

  const editInputRef = createRef<HTMLInputElement>();

  const [editable, setEditable] = useState(false);
  useEffect(() => {
    if (editable) editInputRef.current?.focus();
  }, [editable, editInputRef]);

  if (fetcher?.formData?.has("content")) {
    atom.data.content = String(fetcher.formData.get("content"));
  }

  return (
    <div className="flex justify-between space-x-2 overflow-hidden border-l-2 border-t-2 border-orange-600 bg-white px-4 py-4 shadow-lg sm:rounded-md sm:px-6">
      {editable ? (
        <fetcher.Form
          method="POST"
          action="/atoms"
          className="w-full"
          onSubmit={() => setEditable(false)}
        >
          <input
            type="hidden"
            name="_action"
            value={AtomFormAction.UpdateReminderAtom}
          />
          <input type="hidden" name="atomId" value={atom._id} />

          <input
            ref={editInputRef}
            type="text"
            name="content"
            defaultValue={atom.data.content ?? ""}
            className="w-full rounded-md border border-gray-200 p-2"
            onBlur={(e) => {
              fetcher.submit(e.target.form);
              setEditable(false);
            }}
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

export default AtomicReminder;
