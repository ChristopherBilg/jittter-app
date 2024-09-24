import { useFetcher } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { AtomStructure, ContactStructure } from "~/app/db.server/mongodb/atom";
import { AtomFormAction } from "~/app/routes/atoms/route";
import { UpdateContactAtomSchema } from "~/app/routes/atoms/validate";
import OptimisticDeleteAtomicItemButton from "./OptimisticDeleteAtomicItemButton";

type AtomicContactProps = {
  atom: AtomStructure<ContactStructure>;
};

const AtomicContact = ({ atom }: AtomicContactProps) => {
  const fetcher = useFetcher();

  const formRef = useRef<HTMLFormElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [editable, setEditable] = useState(false);
  useEffect(() => {
    if (editable) firstInputRef.current?.focus();
  }, [editable, firstInputRef]);

  if (fetcher?.formData?.has("fullName")) {
    atom.data.fullName = String(fetcher.formData.get("fullName"));
  }

  if (fetcher?.formData?.has("email")) {
    atom.data.email = String(fetcher.formData.get("email"));
  }

  if (fetcher?.formData?.has("phoneNumber")) {
    atom.data.phoneNumber = String(fetcher.formData.get("phoneNumber"));
  }

  if (fetcher?.formData?.has("notes")) {
    atom.data.notes = String(fetcher.formData.get("notes"));
  }

  return (
    <div className="flex justify-between space-x-2 overflow-hidden border-l-2 border-t-2 border-red-600 bg-white px-4 py-4 shadow-lg sm:rounded-md sm:px-6">
      {editable ? (
        <fetcher.Form
          ref={formRef}
          method="POST"
          action="/atoms"
          className="flex w-full flex-col space-y-2"
          onSubmit={() => setEditable(false)}
          onBlur={(e) => {
            if (
              !formRef.current?.contains(e.relatedTarget as Node) &&
              !(
                e.relatedTarget instanceof HTMLButtonElement &&
                e.relatedTarget.name === "delete-atom"
              )
            ) {
              fetcher.submit(formRef.current);
              setEditable(false);
            }
          }}
        >
          <input
            ref={firstInputRef}
            type="text"
            name="fullName"
            placeholder="Full name"
            autoComplete="name"
            defaultValue={atom.data.fullName ?? ""}
            className="w-full rounded-md border border-gray-200 p-2"
            maxLength={
              UpdateContactAtomSchema.shape.fullName.maxLength ?? undefined
            }
            required
          />

          <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
            <input
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="email"
              defaultValue={atom.data.email ?? ""}
              className="rounded-md border border-gray-200 p-2 md:w-1/2"
              maxLength={
                UpdateContactAtomSchema.shape.email.maxLength ?? undefined
              }
            />

            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone number"
              autoComplete="tel"
              defaultValue={atom.data.phoneNumber ?? ""}
              className="rounded-md border border-gray-200 p-2 md:w-1/2"
              maxLength={
                UpdateContactAtomSchema.shape.phoneNumber.maxLength ?? undefined
              }
            />
          </div>

          <textarea
            name="notes"
            placeholder="Notes"
            defaultValue={atom.data.notes ?? ""}
            className="min-h-32 w-full rounded-md border border-gray-200 p-2"
            maxLength={
              UpdateContactAtomSchema.shape.notes.maxLength ?? undefined
            }
          />

          <input
            type="hidden"
            name="_action"
            value={AtomFormAction.UpdateContactAtom}
          />

          <input type="hidden" name="atomId" value={atom._id} />
          <input type="submit" className="hidden" />
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

          <p className="whitespace-pre-line text-left">
            <span className="text-sm font-semibold text-gray-600 md:text-xs">
              Notes:
            </span>{" "}
            {atom.data.notes}
          </p>
        </button>
      )}

      <OptimisticDeleteAtomicItemButton id={atom._id} />
    </div>
  );
};

export default AtomicContact;
