import { PlusIcon } from "@heroicons/react/24/outline";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/cloudflare";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { InferSelectModel } from "drizzle-orm";
import Container from "~/app/components/common/Container";
import EditableNoteList from "~/app/components/note/EditableNoteList";
import { Note, NoteTable } from "~/app/db/models/note";
import { redirectIfNotAuthenticated } from "~/app/sessions";
import { exhaustiveMatchingGuard } from "~/app/utils/misc";

export const meta: MetaFunction = () => {
  return [{ title: "Jittter - Notes" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await redirectIfNotAuthenticated(request, "/login");

  const userId = session.get("id");
  if (!userId) return redirect("/logout");

  const notes = await Note.getByUserId(userId);

  return {
    notes,
  };
};

export const enum FormAction {
  CreateNote = "create-note",
  UpdateNote = "update-note",
  DeleteNote = "delete-note",
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await redirectIfNotAuthenticated(request, "/login");

  const userId = session.get("id");
  if (!userId) return null;

  const formData = await request.formData();
  const _action = formData.get("_action") as FormAction;

  switch (_action) {
    case FormAction.CreateNote: {
      // TODO: Create a note using optimistic UI
      await Note.create(userId);

      return null;
    }
    case FormAction.UpdateNote: {
      const noteId = formData.get("noteId");
      const content = formData.get("content");

      if (!noteId || content === null) return null;

      // TODO: Validate this form data

      await Note.updateById(String(noteId), String(formData.get("content")));

      return null;
    }
    case FormAction.DeleteNote: {
      const noteId = formData.get("noteId");

      if (!noteId) return null;

      // TODO: Validate this form data

      await Note.deleteById(String(noteId));

      return null;
    }
    default:
      return exhaustiveMatchingGuard(_action);
  }
};

const NotesRoute = () => {
  const { notes } = useLoaderData<typeof loader>();

  const fetcher = useFetcher();

  return (
    <Container>
      <div>
        <h1 className="mx-auto my-2 w-fit text-2xl font-bold">
          Notes ({notes.length})
        </h1>

        <hr />

        <EditableNoteList
          notes={notes as unknown as InferSelectModel<typeof NoteTable>[]}
        />
      </div>

      <span className="fixed bottom-4 left-4 isolate inline-flex flex-col space-y-2 rounded-md shadow-sm">
        <fetcher.Form method="POST">
          <input type="hidden" name="_action" value={FormAction.CreateNote} />

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

export default NotesRoute;
