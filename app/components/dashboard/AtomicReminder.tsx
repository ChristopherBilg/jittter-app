import {
  ArrowUturnLeftIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { AtomStructure, ReminderStructure } from "~/app/db.server/mongodb/atom";
import { AtomFormAction } from "~/app/routes/atoms/route";
import { UpdateReminderAtomSchema } from "~/app/routes/atoms/validate";
import { AtomicReminderFrequency } from "~/app/utils/constant";
import OptimisticDeleteAtomicItemButton from "./OptimisticDeleteAtomicItemButton";

type AtomicReminderProps = {
  atom: AtomStructure<ReminderStructure>;
};

const AtomicReminder = ({ atom }: AtomicReminderProps) => {
  const fetcher = useFetcher();

  const formRef = useRef<HTMLFormElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [editable, setEditable] = useState(false);
  useEffect(() => {
    if (editable) firstInputRef.current?.focus();
  }, [editable, firstInputRef]);

  if (fetcher?.formData?.has("content")) {
    atom.data.content = String(fetcher.formData.get("content"));
  }

  if (fetcher?.formData?.has("frequency")) {
    atom.data.frequency = String(fetcher.formData.get("frequency"));
  }

  if (fetcher?.formData?.has("startingAt")) {
    atom.data.startingAt = String(fetcher.formData.get("startingAt"));
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
            ref={firstInputRef}
            type="text"
            name="content"
            placeholder="Add a reminder"
            className="rounded-md border border-gray-200 p-2"
            defaultValue={atom.data.content ?? ""}
            maxLength={
              UpdateReminderAtomSchema.shape.content.maxLength ?? undefined
            }
            required
          />

          <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
            <select
              name="frequency"
              className="rounded-md border border-gray-200 p-2 md:w-1/2"
              defaultValue={atom.data.frequency ?? ""}
              required
            >
              {Object.entries(AtomicReminderFrequency).map(([key, value]) => (
                <option key={key} value={value}>
                  {key}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="startingAt"
              className="rounded-md border border-gray-200 p-2 md:w-1/2"
              defaultValue={atom.data.startingAt ?? ""}
              maxLength={
                UpdateReminderAtomSchema.shape.startingAt.maxLength ?? undefined
              }
              required
            />
          </div>

          <input
            type="hidden"
            name="_action"
            value={AtomFormAction.UpdateReminderAtom}
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
              Reminder:
            </span>{" "}
            {atom.data.content}
          </p>

          <p className="text-left">
            <span className="text-sm font-semibold text-gray-600 md:text-xs">
              Frequency:
            </span>{" "}
            {Object.entries(AtomicReminderFrequency).find(
              ([, value]) => value === atom.data.frequency,
            )?.[0] ?? "Unknown"}
          </p>

          <p className="text-left">
            <span className="text-sm font-semibold text-gray-600 md:text-xs">
              Next reminder at:
            </span>{" "}
            {/* TODO: Update to perform calculation to get next reminder date */}
            {atom.data.startingAt}
          </p>
        </button>
      )}

      <div className="flex flex-col justify-between">
        {editable ? (
          <button
            onClick={() => setEditable(false)}
            className="rounded-md bg-gray-400 text-white"
          >
            <span className="sr-only">Undo, {atom.data.content}</span>
            <ArrowUturnLeftIcon className="h-5 w-5 md:h-4 md:w-4" />
          </button>
        ) : (
          <OptimisticDeleteAtomicItemButton id={atom._id} />
        )}

        {/* TODO: Remove in favor of blur events */}
        {editable && (
          <button
            onClick={() => {
              fetcher.submit(formRef.current);
              setEditable(false);
            }}
            className="rounded-md bg-green-700 text-white"
          >
            <span className="sr-only">Save, {atom.data.content}</span>
            <CheckCircleIcon className="h-5 w-5 md:h-4 md:w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AtomicReminder;
