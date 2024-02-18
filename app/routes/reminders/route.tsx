import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/cloudflare";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { createReminder, getRemindersByUserId } from "~/app/db/schema";
import { redirectIfNotAuthenticated } from "~/app/sessions";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await redirectIfNotAuthenticated(request, "/login");

  const userId = session.get("id");
  if (!userId) return redirect("/logout");

  const reminders = await getRemindersByUserId(userId);

  return {
    reminders,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await redirectIfNotAuthenticated(request, "/login");

  const userId = session.get("id");
  if (!userId) return redirect("/logout");

  await createReminder(userId);

  return null;
};

const RemindersRoute = () => {
  const { reminders } = useLoaderData<typeof loader>();

  const fetcher = useFetcher();

  return (
    <div>
      <h1>Reminders ({reminders.length})</h1>

      <hr />

      <fetcher.Form method="POST">
        <input
          type="submit"
          value="Create a New Reminder"
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
                {new Date(reminder.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
      </ol>
    </div>
  );
};

export default RemindersRoute;
