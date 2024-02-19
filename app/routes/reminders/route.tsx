import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/cloudflare";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Reminder } from "~/app/db/models/reminder";
import { redirectIfNotAuthenticated } from "~/app/sessions";
import { exhaustiveMatchingGuard } from "~/app/utils/misc";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await redirectIfNotAuthenticated(request, "/login");

  const userId = session.get("id");
  if (!userId) return redirect("/logout");

  const reminders = await Reminder.getByUserId(userId);

  return {
    reminders,
  };
};

const enum FormAction {
  CreateReminder = "create-reminder",
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
    <div>
      <h1>Reminders ({reminders.length})</h1>

      <hr />

      <fetcher.Form method="POST">
        <input type="hidden" name="_action" value={FormAction.CreateReminder} />

        <input
          type="submit"
          value="Create a New Reminder"
          className="font-bold"
        />
      </fetcher.Form>

      <hr />

      <fetcher.Form method="POST">
        <input
          type="hidden"
          name="_action"
          value={FormAction.DeleteAllReminders}
        />

        <input
          type="submit"
          value="Delete All Reminders"
          className="font-bold"
        />
      </fetcher.Form>

      <hr />

      <ol>
        {reminders
          .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
          .map((reminder) => (
            <li key={reminder.id}>
              <span>
                {reminder.content || "No content"}
                {" - "}
                {reminder.createdAt}
                {" - "}
                {new Date(reminder.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
      </ol>
    </div>
  );
};

export default RemindersRoute;
