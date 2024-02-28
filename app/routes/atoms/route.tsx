import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { Atom, AtomStructure } from "~/app/db.server/mongodb/atom";
import { redirectIfNotAuthenticated } from "~/app/sessions";
import { exhaustiveMatchingGuard } from "~/app/utils/misc";
import {
  validateCreateContactAtom,
  validateCreateNoteAtom,
  validateCreateReminderAtom,
  validateDeleteAtom,
  validateUpdateContactAtom,
  validateUpdateNoteAtom,
  validateUpdateReminderAtom,
} from "./validate";

export const enum AtomFormAction {
  CreateAtom = "create-note-atom",
  DeleteAtom = "delete-atom",
  UpdateNoteAtom = "update-note-atom",
  UpdateContactAtom = "update-contact-atom",
  UpdateReminderAtom = "update-reminder-atom",
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { user } = await redirectIfNotAuthenticated(request, "/login");
  const { id: userId } = user;

  const formData = await request.formData();
  const _action = formData.get("_action") as AtomFormAction;

  switch (_action) {
    case AtomFormAction.CreateAtom: {
      const _type = formData.get("_type");
      const _createdAt = Number(formData.get("_createdAt"));

      switch (_type as AtomStructure["type"]) {
        case "note": {
          const validated = await validateCreateNoteAtom(formData);
          if (!validated) return null;

          const { content } = validated;
          await Atom.create(userId, {
            type: _type,
            data: { content },
            createdAt: _createdAt,
            updatedAt: _createdAt,
          });

          return null;
        }
        case "contact": {
          const validated = await validateCreateContactAtom(formData);
          if (!validated) return null;

          const { fullName, email, phoneNumber } = validated;
          await Atom.create(userId, {
            type: _type,
            data: { fullName, email, phoneNumber },
            createdAt: _createdAt,
            updatedAt: _createdAt,
          });

          return null;
        }
        case "reminder": {
          const validated = await validateCreateReminderAtom(formData);
          if (!validated) return null;

          const { content, frequency, startingAt } = validated;
          await Atom.create(userId, {
            type: _type,
            data: { content, frequency, startingAt },
            createdAt: _createdAt,
            updatedAt: _createdAt,
          });

          return null;
        }
        default:
          return null;
      }
    }
    case AtomFormAction.DeleteAtom: {
      const validated = await validateDeleteAtom(formData);
      if (!validated) return null;

      const { atomId } = validated;
      await Atom.softDelete(userId, atomId);

      return null;
    }
    case AtomFormAction.UpdateNoteAtom: {
      const validated = await validateUpdateNoteAtom(formData);
      if (!validated) return null;

      const { atomId, content } = validated;
      await Atom.update(userId, atomId, { data: { content } });

      return null;
    }
    case AtomFormAction.UpdateContactAtom: {
      const validated = await validateUpdateContactAtom(formData);
      if (!validated) return null;

      const { atomId, fullName, email, phoneNumber } = validated;
      await Atom.update(userId, atomId, {
        data: { fullName, email, phoneNumber },
      });

      return null;
    }
    case AtomFormAction.UpdateReminderAtom: {
      const validated = await validateUpdateReminderAtom(formData);
      if (!validated) return null;

      const { atomId, content, frequency, startingAt } = validated;
      await Atom.update(userId, atomId, {
        data: { content, frequency, startingAt },
      });

      return null;
    }
    default:
      return exhaustiveMatchingGuard(_action);
  }
};
