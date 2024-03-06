import { Form, useSubmit } from "@remix-run/react";
import { AtomType } from "~/app/db.server/mongodb/atom";
import { AtomFormAction } from "~/app/routes/atoms/route";
import { CreateReminderAtomSchema } from "~/app/routes/atoms/validate";
import { AtomicReminderFrequency } from "~/app/utils/misc";

const CreateAtomicReminder = () => {
  const submit = useSubmit();

  return (
    <Form
      method="POST"
      action="/atoms"
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
      <input type="hidden" name="_type" value={AtomType.Reminder} />

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
          className="w-full rounded-md border border-gray-200 p-2 md:w-1/2"
          defaultValue={new Date().toISOString().split("T")[0]}
          maxLength={
            CreateReminderAtomSchema.shape.startingAt.maxLength ?? undefined
          }
          required
        />
      </div>

      <input
        type="text"
        name="content"
        placeholder="Add a reminder"
        className="rounded-md border border-gray-200 p-2"
        maxLength={
          CreateReminderAtomSchema.shape.content.maxLength ?? undefined
        }
        required
      />

      <input type="submit" className="hidden" />
    </Form>
  );
};

export default CreateAtomicReminder;
