import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { Atom } from "~/app/db/models/atom.server";
import { redirectIfNotAuthenticated } from "~/app/sessions";
import { exhaustiveMatchingGuard } from "~/app/utils/misc";
import {
  validateCreateNoteAtom,
  validateDeleteAtom,
  validateUpdateNoteAtom,
} from "./validate";

export const enum FormAction {
  CreateNoteAtom = "create-note-atom",
  UpdateNoteAtom = "update-note-atom",
  DeleteAtom = "delete-atom",
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await redirectIfNotAuthenticated(request, "/login");

  const userId = session.get("id");
  if (!userId) return null;

  const formData = await request.formData();
  const _action = formData.get("_action") as FormAction;

  switch (_action) {
    case FormAction.CreateNoteAtom: {
      const validated = await validateCreateNoteAtom(formData);
      if (!validated) return null;

      const { content } = validated;
      await Atom.create(userId, { type: "note", data: { content } });

      return null;
    }
    case FormAction.UpdateNoteAtom: {
      const validated = await validateUpdateNoteAtom(formData);
      if (!validated) return null;

      const { atomId, content } = validated;
      await Atom.update(userId, atomId, { data: { content } });

      return null;
    }
    case FormAction.DeleteAtom: {
      const validated = await validateDeleteAtom(formData);
      if (!validated) return null;

      const { atomId } = validated;
      await Atom.softDelete(userId, atomId);

      return null;
    }
    default:
      return exhaustiveMatchingGuard(_action);
  }
};
