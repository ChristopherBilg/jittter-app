import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/cloudflare";
import { Note } from "~/app/db/models/note";
import { redirectIfNotAuthenticated } from "~/app/sessions";
import { exhaustiveMatchingGuard } from "~/app/utils/misc";
import {
  validateCreateNote,
  validateDeleteNote,
  validateUpdateNote,
} from "./validate";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await redirectIfNotAuthenticated(request, "/login");

  const userId = session.get("id");
  if (!userId) return redirect("/logout");

  const notes = await Note.getByUserId(userId);

  return json({
    notes,
  });
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
      const validated = await validateCreateNote(formData);
      if (!validated) return null;

      const { content } = validated;
      await Note.create(userId, content);

      return null;
    }
    case FormAction.UpdateNote: {
      const validated = await validateUpdateNote(formData);
      if (!validated) return null;

      const { noteId, content } = validated;
      await Note.update(userId, noteId, content);

      return null;
    }
    case FormAction.DeleteNote: {
      const validated = await validateDeleteNote(formData);
      if (!validated) return null;

      const { noteId } = validated;
      await Note.softDelete(userId, noteId);

      return null;
    }
    default:
      return exhaustiveMatchingGuard(_action);
  }
};
