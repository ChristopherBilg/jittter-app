import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useFetcher } from "@remix-run/react";
import clsx from "clsx";
import { InferSelectModel } from "drizzle-orm";
import { Fragment } from "react";
import { ReminderTable } from "~/app/db/schema";
import { FormAction } from "~/app/routes/reminders/route";
import EditableReminder from "./EditableReminder";

type EditableReminderListProps = {
  reminders: InferSelectModel<typeof ReminderTable>[];
};

const EditableReminderList = ({ reminders }: EditableReminderListProps) => {
  const fetcher = useFetcher();

  return (
    <ul className="divide-y divide-gray-100">
      {reminders
        .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
        .map((reminder) => (
          <li key={reminder.id} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <EditableReminder reminder={reminder} />
            </div>

            <div className="flex shrink-0 items-center gap-x-6">
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Created at{" "}
                  <time
                    dateTime={new Date(reminder.createdAt).toLocaleString()}
                  >
                    {new Date(reminder.createdAt).toLocaleString()}
                  </time>
                </p>
              </div>

              <Menu as="div" className="relative flex-none">
                <Menu.Button className="-m-2.5 mr-0 block p-2.5 text-gray-500 hover:text-gray-900">
                  <span className="sr-only">Open options</span>
                  <EllipsisVerticalIcon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-auto origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <fetcher.Form method="POST">
                          <input
                            type="hidden"
                            name="reminderId"
                            value={reminder.id}
                          />
                          <input
                            type="hidden"
                            name="_action"
                            value={FormAction.DeleteReminder}
                          />

                          <button
                            type="submit"
                            className={clsx(
                              active ? "bg-gray-50" : "",
                              "block px-3 py-1 text-sm leading-6 text-gray-900",
                            )}
                          >
                            Delete{" "}
                            <span className="sr-only">
                              , {reminder.content}
                            </span>
                          </button>
                        </fetcher.Form>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </li>
        ))}
    </ul>
  );
};

export default EditableReminderList;
