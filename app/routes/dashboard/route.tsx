import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/cloudflare";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import Container from "~/app/components/dashboard/Container";
import Drawer from "~/app/components/dashboard/Drawer";
import { Note } from "~/app/db/models/note";
import { redirectIfNotAuthenticated } from "~/app/sessions";
import { FormAction } from "../notes/route";
import { CreateNoteSchema } from "../notes/validate";

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

  return json({
    notes,
  });
};

const DashboardRoute = () => {
  const loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const [open, setOpen] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    // TODO: Check for errors here, similar to how I've done in other routes
    // TODO: Only reset the form if the request was initiated from the create note form
    if (fetcher.state === "idle") {
      formRef.current?.reset();
      formRef.current?.scrollIntoView({
        behavior: "instant",
      });
    }
  }, [fetcher.state]);

  return (
    <Container>
      <div className="flex justify-end">
        <button
          className="my-2 rounded-md bg-blue-500 px-2 py-1 text-white"
          onClick={() => setOpen(true)}
        >
          <span className="sr-only">Open dashboard menu</span>
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      <Drawer open={open} setOpen={setOpen} />

      <ul className="my-2 space-y-2 divide-gray-200">
        {loaderData.notes
          .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
          .map((note) => (
            <li
              key={note.id}
              className="overflow-hidden bg-white px-4 py-4 shadow-lg sm:rounded-md sm:px-6"
            >
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
              maxLength={CreateNoteSchema.shape.content.maxLength ?? undefined}
              required
              // TODO: Use optimistic add
            />
          </fetcher.Form>
        </li>
      </ul>
    </Container>
  );
};

export default DashboardRoute;
