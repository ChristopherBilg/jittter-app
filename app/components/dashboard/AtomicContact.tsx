import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useFetcher } from "@remix-run/react";
import { useRef, useState } from "react";
import { AtomStructure, ContactStructure } from "~/app/db/mongodb/atom.server";
import { AtomFormAction } from "~/app/routes/atoms/route";
import OptimisticDeleteAtomicItemButton from "./OptimisticDeleteAtomicItemButton";

type AtomicContactProps = {
  atom: AtomStructure<ContactStructure>;
};

const AtomicContact = ({ atom }: AtomicContactProps) => {
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
        <fetcher.Form
          ref={formRef}
          method="POST"
          action="/atoms"
          className="flex w-full flex-col space-y-2"
          onSubmit={() => setEditable(false)}
        >
          <input
            type="text"
            name="fullName"
            placeholder="Full name"
            autoComplete="name"
            defaultValue={atom.data.fullName ?? ""}
            className="w-full rounded-md border border-gray-200 p-2"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            defaultValue={atom.data.email ?? ""}
            className="w-full rounded-md border border-gray-200 p-2"
          />

          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone number"
            autoComplete="tel"
            defaultValue={atom.data.phoneNumber ?? ""}
            className="w-full rounded-md border border-gray-200 p-2"
          />

          <input
            type="hidden"
            name="_action"
            value={AtomFormAction.UpdateContactAtom}
          />

          <input type="hidden" name="atomId" value={atom._id} />
        </fetcher.Form>
      ) : (
        <button
          onClick={() => setEditable(true)}
          className="flex w-full flex-col space-y-2"
        >
          <p className="text-left">
            <span className="text-sm font-semibold text-gray-600 md:text-xs">
              Full name:
            </span>{" "}
            {atom.data.fullName}
          </p>
          <p className="text-left">
            <span className="text-sm font-semibold text-gray-600 md:text-xs">
              Email:
            </span>{" "}
            {atom.data.email}
          </p>
          <p className="text-left">
            <span className="text-sm font-semibold text-gray-600 md:text-xs">
              Phone number:
            </span>{" "}
            {atom.data.phoneNumber}
          </p>
        </button>
      )}

      <div className="flex flex-col justify-between">
        <OptimisticDeleteAtomicItemButton id={atom._id} />

        {/* TODO: Remove in favor of blur events */}
        {editable && (
          <button
            onClick={() => {
              fetcher.submit(formRef.current);
              setEditable(false);
            }}
            className="rounded-md bg-green-700 text-white"
          >
            <span className="sr-only">Save, {atom.data.fullName}</span>
            <CheckCircleIcon className="h-5 w-5 md:h-4 md:w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AtomicContact;
