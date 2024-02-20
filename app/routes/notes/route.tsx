import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/cloudflare";
import { Note } from "~/app/db/models/note";
import { redirectIfNotAuthenticated } from "~/app/sessions";
import { exhaustiveMatchingGuard } from "~/app/utils/misc";

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
      const content = formData.get("content");

      // TODO: Validate this form data
      if (!content) return null;

      await Note.create(userId, String(content));

      return null;
    }
    case FormAction.UpdateNote: {
      const noteId = formData.get("noteId");
      const content = formData.get("content");

      // TODO: Validate this form data
      if (!noteId || content === null) return null;

      await Note.update(
        userId,
        String(noteId),
        String(formData.get("content")),
      );

      return null;
    }
    case FormAction.DeleteNote: {
      const noteId = formData.get("noteId");

      // TODO: Validate this form data
      if (!noteId) return null;

      await Note.softDelete(userId, String(noteId));

      return null;
    }
    default:
      return exhaustiveMatchingGuard(_action);
  }
};
