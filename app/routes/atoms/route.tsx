import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { Atom } from "~/app/db/mongodb/atom.server";
import { redirectIfNotAuthenticated } from "~/app/sessions";
import { exhaustiveMatchingGuard } from "~/app/utils/misc";
import {
  validateCreateContactAtom,
  validateCreateNoteAtom,
  validateDeleteAtom,
  validateUpdateContactAtom,
  validateUpdateNoteAtom,
} from "./validate";

export const enum FormAction {
  CreateNoteAtom = "create-note-atom",
  UpdateNoteAtom = "update-note-atom",
  CreateContactAtom = "create-contact-atom",
  UpdateContactAtom = "update-contact-atom",
  CreateReminderAtom = "create-reminder-atom",
  UpdateReminderAtom = "update-reminder-atom",
  DeleteAtom = "delete-atom",
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { user } = await redirectIfNotAuthenticated(request, "/login");
  const { id: userId } = user;

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
    case FormAction.CreateContactAtom: {
      const validated = await validateCreateContactAtom(formData);
      if (!validated) return null;

      const { fullName, email, phoneNumber } = validated;
      await Atom.create(userId, {
        type: "contact",
        data: { fullName, email, phoneNumber },
      });

      return null;
    }
    case FormAction.UpdateContactAtom: {
      const validated = await validateUpdateContactAtom(formData);
      if (!validated) return null;

      const { atomId, fullName, email, phoneNumber } = validated;
      await Atom.update(userId, atomId, {
        data: { fullName, email, phoneNumber },
      });

      return null;
    }
    case FormAction.CreateReminderAtom: {
      // TODO: Implement
      return null;
    }
    case FormAction.UpdateReminderAtom: {
      // TODO: Implement
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
