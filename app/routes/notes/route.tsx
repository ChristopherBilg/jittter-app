import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { Atom } from "~/app/db/models/atom.server";
import { redirectIfNotAuthenticated } from "~/app/sessions";
import { exhaustiveMatchingGuard } from "~/app/utils/misc";
import {
  validateCreateNote,
  validateDeleteNote,
  validateUpdateNote,
} from "./validate";

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
      await Atom.create(userId, { content });

      return null;
    }
    case FormAction.UpdateNote: {
      const validated = await validateUpdateNote(formData);
      if (!validated) return null;

      const { noteId, content } = validated;
      await Atom.update(userId, noteId, { content });

      return null;
    }
    case FormAction.DeleteNote: {
      const validated = await validateDeleteNote(formData);
      if (!validated) return null;

      const { noteId } = validated;
      await Atom.softDelete(userId, noteId);

      return null;
    }
    default:
      return exhaustiveMatchingGuard(_action);
  }
};
