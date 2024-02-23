import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useFetcher } from "@remix-run/react";
import { useRef, useState } from "react";
import { AtomStructure, ContactStructure } from "~/app/db/mongodb/atom.server";
import { FormAction } from "~/app/routes/atoms/route";

type AtomicNoteProps = {
  atom: AtomStructure<ContactStructure>;
};

const AtomicNote = ({ atom }: AtomicNoteProps) => {
  const fetcher = useFetcher();

  const formRef = useRef<HTMLFormElement>(null);

  const [editable, setEditable] = useState(false);

  if (fetcher?.formData?.has("fullName")) {
    atom.data.fullName = String(fetcher.formData.get("fullName"));
  }

  if (fetcher?.formData?.has("email")) {
    atom.data.email = String(fetcher.formData.get("email"));
  }

  if (fetcher?.formData?.has("phoneNumber")) {
    atom.data.phoneNumber = String(fetcher.formData.get("phoneNumber"));
  }

  return (
    <div className="flex justify-between space-x-2 overflow-hidden border-l-2 border-t-2 border-blue-700 bg-white px-4 py-4 shadow-lg sm:rounded-md sm:px-6">
      {editable ? (
        <>
          <fetcher.Form
            ref={formRef}
            method="POST"
            action="/atoms"
            className="flex w-full flex-col space-y-2"
            onSubmit={() => setEditable(false)}
          >
            <input
              type="hidden"
              name="_action"
              value={FormAction.UpdateContactAtom}
            />
            <input type="hidden" name="atomId" value={atom._id} />

            <input
              type="text"
              name="fullName"
              defaultValue={atom.data.fullName ?? ""}
              className="w-full rounded-md border border-gray-200 p-2"
            />

            <input
              type="text"
              name="email"
              defaultValue={atom.data.email ?? ""}
              className="w-full rounded-md border border-gray-200 p-2"
            />

            <input
              type="text"
              name="phoneNumber"
              defaultValue={atom.data.phoneNumber ?? ""}
              className="w-full rounded-md border border-gray-200 p-2"
            />
          </fetcher.Form>

          {/* TODO: Remove in favor of blur events */}
          <div>
            <button
              onClick={() => {
                fetcher.submit(formRef.current);
                setEditable(false);
              }}
              className="rounded-md bg-green-700 text-white"
            >
              <span className="sr-only">Save, {atom.data.fullName}</span>
              <CheckCircleIcon className="h-4 w-4" />
            </button>
          </div>
        </>
      ) : (
        <button
          onClick={() => setEditable(true)}
          className="flex w-full flex-col space-y-2"
        >
          <p className="text-left">{atom.data.fullName}</p>
          <p className="text-left">{atom.data.email}</p>
          <p className="text-left">{atom.data.phoneNumber}</p>
        </button>
      )}

      <fetcher.Form method="POST" action="/atoms">
        <input type="hidden" name="_action" value={FormAction.DeleteAtom} />
        <input type="hidden" name="atomId" value={atom._id} />

        {/* TODO: Update optimistic delete */}
        <button type="submit" className="rounded-md bg-red-300 text-white">
          <span className="sr-only">Delete, {atom.data.fullName}</span>
          <XMarkIcon className="h-4 w-4" />
        </button>
      </fetcher.Form>
    </div>
  );
};

export default AtomicNote;
