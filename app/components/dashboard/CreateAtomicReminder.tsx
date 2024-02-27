import { Form, useSubmit } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { AtomFormAction } from "~/app/routes/atoms/route";
import { CreateNoteAtomSchema } from "~/app/routes/atoms/validate";
import { AtomicReminderFrequency } from "~/app/utils/constant";

const CreateAtomicReminder = () => {
  const submit = useSubmit();

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Form
      className="flex flex-col space-y-2 overflow-hidden bg-white px-4 py-4 shadow-lg sm:rounded-md sm:px-6"
      onSubmit={(e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        formData.set("_createdAt", new Date().getTime().toString());

        submit(formData, { method: "POST", action: "/atoms", navigate: false });

        e.currentTarget.reset();
      }}
    >
      <input type="hidden" name="_action" value={AtomFormAction.CreateAtom} />
      <input type="hidden" name="_type" value="reminder" />

      <input
        ref={inputRef}
        type="text"
        name="content"
        placeholder="Add a reminder"
        className="rounded-md border border-gray-200 p-2"
        maxLength={CreateNoteAtomSchema.shape.content.maxLength ?? undefined}
        required
      />

      <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
        <select
          name="frequency"
          className="rounded-md border border-gray-200 p-2 md:w-1/2"
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
          defaultValue={new Date().toISOString().split("T")[0]}
          required
        />
      </div>
    </Form>
  );
};

export default CreateAtomicReminder;
