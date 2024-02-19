import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/cloudflare";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { InferSelectModel } from "drizzle-orm";
import Container from "~/app/components/common/Container";
import EditableReminderList from "~/app/components/reminder/EditableReminderList";
import { Reminder, ReminderTable } from "~/app/db/models/reminder";
import { redirectIfNotAuthenticated } from "~/app/sessions";
import { exhaustiveMatchingGuard } from "~/app/utils/misc";

export const meta: MetaFunction = () => {
  return [{ title: "Jittter - Reminders" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await redirectIfNotAuthenticated(request, "/login");

  const userId = session.get("id");
  if (!userId) return redirect("/logout");

  const reminders = await Reminder.getByUserId(userId);

  return {
    reminders,
  };
};

export const enum FormAction {
  CreateReminder = "create-reminder",
  UpdateReminder = "update-reminder",
  DeleteAllReminders = "delete-all-reminders",
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await redirectIfNotAuthenticated(request, "/login");

  const userId = session.get("id");
  if (!userId) return null;

  const formData = await request.formData();
  const _action = formData.get("_action") as FormAction;

  switch (_action) {
    case FormAction.CreateReminder: {
      // TODO: Create a reminder using optimistic UI
      await Reminder.create(userId);

      return null;
    }
    case FormAction.UpdateReminder: {
      const reminderId = formData.get("reminderId");
      const content = formData.get("content");

      if (!reminderId || content === null) return null;

      // TODO: Validate this form data

      await Reminder.updateById(
        String(reminderId),
        String(formData.get("content")),
      );

      return null;
    }
    case FormAction.DeleteAllReminders: {
      const reminders = await Reminder.getByUserId(userId);

      await Promise.all(
        reminders.map(async (reminder) => Reminder.deleteById(reminder.id)),
      );

      return null;
    }
    default:
      return exhaustiveMatchingGuard(_action);
  }
};

const RemindersRoute = () => {
  const { reminders } = useLoaderData<typeof loader>();

  const fetcher = useFetcher();

  return (
    <Container>
      <div>
        <h1 className="mx-auto my-2 w-fit text-2xl font-bold">
          Reminders ({reminders.length})
        </h1>

        <hr />

        <EditableReminderList
          reminders={
            reminders as unknown as InferSelectModel<typeof ReminderTable>[]
          }
        />
      </div>

      <span className="fixed bottom-4 left-4 isolate inline-flex flex-col space-y-2 rounded-md shadow-sm">
        <fetcher.Form method="POST">
          <input
            type="hidden"
            name="_action"
            value={FormAction.DeleteAllReminders}
          />

          <button
            type="submit"
            className="rounded-full bg-red-600 p-4 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 md:p-3"
          >
            <MinusIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </fetcher.Form>

        <fetcher.Form method="POST">
          <input
            type="hidden"
            name="_action"
            value={FormAction.CreateReminder}
          />

          <button
            type="submit"
            className="rounded-full bg-blue-600 p-4 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 md:p-3"
          >
            <PlusIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </fetcher.Form>
      </span>
    </Container>
  );
};

export default RemindersRoute;
