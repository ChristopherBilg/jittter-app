import { useFetcher } from "@remix-run/react";
import { InferSelectModel } from "drizzle-orm";
import { useState } from "react";
import { ReminderTable } from "~/app/db/schema";
import { FormAction } from "~/app/routes/reminders/route";

type EditableReminderProps = {
  reminder: InferSelectModel<typeof ReminderTable>;
};

const EditableReminder = ({ reminder }: EditableReminderProps) => {
  const fetcher = useFetcher();
  const [value, setValue] = useState(reminder.content ?? "");

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    setValue(event.currentTarget.value);
    fetcher.submit(event.currentTarget.form, {
      method: "POST",
    });
  };

  return (
    <fetcher.Form className="flex flex-col gap-y-2">
      <label htmlFor={reminder.id} className="sr-only">
        Reminder
      </label>

      <input
        id={reminder.id}
        type="text"
        name="content"
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        value={value}
        onChange={onChange}
      />

      <input type="hidden" name="reminderId" value={reminder.id} />
      <input type="hidden" name="_action" value={FormAction.UpdateReminder} />
    </fetcher.Form>
  );
};

export default EditableReminder;
