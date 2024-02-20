import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/cloudflare";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { Note } from "~/app/db/models/note";
import { redirectIfNotAuthenticated } from "~/app/sessions";
import { NOTE_MAXIMUM_CONTENT_LENGTH } from "~/app/utils/constant";
import { FormAction } from "../notes/route";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Dashboard",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await redirectIfNotAuthenticated(request, "/signin");

  const userId = session.get("id");
  if (!userId) return redirect("/logout");

  const notes = await Note.getByUserId(userId);

  return {
    notes,
  };
};

const DashboardRoute = () => {
  const loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const [open, setOpen] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  useEffect(
    function resetFormOnSuccess() {
      // TODO: Check for errors here, similar to how I've done in other routes
      if (fetcher.state === "idle") {
        formRef.current?.reset();
        formRef.current?.scrollIntoView({
          behavior: "instant",
        });
      }
    },
    [fetcher.state, fetcher.data, fetcher.formData],
  );

  return (
    <div className="container mx-auto max-w-6xl sm:px-6 lg:px-8">
      <button
        className="fixed right-4 top-4 rounded-md bg-blue-500 px-2 py-1 text-white"
        onClick={() => setOpen(true)}
      >
        <span className="sr-only">Open dashboard menu</span>
        <Bars3Icon className="h-6 w-6" />
      </button>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <div className="fixed inset-0" />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300 sm:duration-500"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-300 sm:duration-500"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                    <div className="flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                            Dashboard
                          </Dialog.Title>

                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              onClick={() => setOpen(false)}
                            >
                              <span className="absolute -inset-2.5" />
                              <span className="sr-only">Close panel</span>

                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className="flex flex-col space-y-4">
                          <Link to="/account">Account Settings</Link>
                          <Link to="/signout">Sign Out</Link>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <ul className="my-2 space-y-2 divide-gray-200">
        {loaderData.notes
          .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
          .map((note) => (
            <li
              key={note.id}
              className="overflow-hidden bg-white px-4 py-4 shadow-lg sm:rounded-md sm:px-6"
            >
              {/* Left align content, right align a delete button */}
              <div className="flex justify-between">
                <p>{note.content}</p>

                <fetcher.Form method="POST" action="/notes">
                  <input
                    type="hidden"
                    name="_action"
                    value={FormAction.DeleteNote}
                  />
                  <input type="hidden" name="noteId" value={note.id} />

                  <button
                    type="submit"
                    className="rounded-md bg-red-300 text-white"
                  >
                    <span className="sr-only">Delete, {note.content}</span>
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </fetcher.Form>
              </div>
            </li>
          ))}

        <li className="overflow-hidden bg-white px-4 py-4 shadow-lg sm:rounded-md sm:px-6">
          <fetcher.Form
            method="POST"
            className="flex flex-col"
            action="/notes"
            ref={formRef}
          >
            <input type="hidden" name="_action" value={FormAction.CreateNote} />

            <input
              type="text"
              name="content"
              placeholder="Add a note"
              className="rounded-md border border-gray-200 p-2"
              minLength={1}
              maxLength={NOTE_MAXIMUM_CONTENT_LENGTH}
              required
              // TODO: Scroll down, and use optimistic add
            />
          </fetcher.Form>
        </li>
      </ul>
    </div>
  );
};

export default DashboardRoute;
