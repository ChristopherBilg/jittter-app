import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { Atom, AtomStructure, AtomType } from "~/app/db.server/mongodb/atom";
import { redirectIfNotAuthenticated } from "~/app/sessions.server";
import { exhaustiveMatchingGuard } from "~/app/utils/misc";
import { AtomLimit, SubscriptionTier } from "~/app/utils/subscription";
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
  CreateAtom = "create-atom",
  DeleteAtom = "delete-atom",
  UpdateNoteAtom = "update-note-atom",
  UpdateContactAtom = "update-contact-atom",
  UpdateReminderAtom = "update-reminder-atom",
}

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const { user } = await redirectIfNotAuthenticated(
    request,
    "/login",
    context.env.NEON_DATABASE_URL,
  );
  const { id: userId, subscriptionTier } = user;

  const formData = await request.formData();
  const _action = formData.get("_action") as AtomFormAction;

  switch (_action) {
    case AtomFormAction.CreateAtom: {
      const atomLimit = AtomLimit[subscriptionTier as SubscriptionTier];
      const atomCount = await Atom.count(
        context.env.MONGO_DATABASE_API_KEY,
        userId,
      );
      if (atomCount >= atomLimit) {
        return new Response("Atom limit reached", {
          status: 403,
          headers: {
            "Content-Type": "text/plain",
          },
        });
      }

      const _type = formData.get("_type") as AtomStructure["type"];
      const _createdAt = Number(formData.get("_createdAt"));

      switch (_type) {
        case AtomType.Note: {
          const validated = await validateCreateNoteAtom(formData);
          if (!validated) return null;

          await Atom.create(context.env.MONGO_DATABASE_API_KEY, userId, {
            type: _type,
            data: { ...validated },
            createdAt: _createdAt,
            updatedAt: _createdAt,
          });

          return null;
        }
        case AtomType.Contact: {
          const validated = await validateCreateContactAtom(formData);
          if (!validated) return null;

          await Atom.create(context.env.MONGO_DATABASE_API_KEY, userId, {
            type: _type,
            data: { ...validated },
            createdAt: _createdAt,
            updatedAt: _createdAt,
          });

          return null;
        }
        case AtomType.Reminder: {
          const validated = await validateCreateReminderAtom(formData);
          if (!validated) return null;

          await Atom.create(context.env.MONGO_DATABASE_API_KEY, userId, {
            type: _type,
            data: { ...validated },
            createdAt: _createdAt,
            updatedAt: _createdAt,
          });

          return null;
        }
        default: {
          exhaustiveMatchingGuard(_type);
          return null;
        }
      }
    }
    case AtomFormAction.DeleteAtom: {
      const validated = await validateDeleteAtom(formData);
      if (!validated) return null;

      const { atomId } = validated;
      await Atom.softDelete(context.env.MONGO_DATABASE_API_KEY, userId, atomId);

      return null;
    }
    case AtomFormAction.UpdateNoteAtom: {
      const validated = await validateUpdateNoteAtom(formData);
      if (!validated) return null;

      const { atomId, ...rest } = validated;
      await Atom.update(context.env.MONGO_DATABASE_API_KEY, userId, atomId, {
        data: { ...rest },
      });

      return null;
    }
    case AtomFormAction.UpdateContactAtom: {
      const validated = await validateUpdateContactAtom(formData);
      if (!validated) return null;

      const { atomId, ...rest } = validated;
      await Atom.update(context.env.MONGO_DATABASE_API_KEY, userId, atomId, {
        data: { ...rest },
      });

      return null;
    }
    case AtomFormAction.UpdateReminderAtom: {
      const validated = await validateUpdateReminderAtom(formData);
      if (!validated) return null;

      const { atomId, ...rest } = validated;
      await Atom.update(context.env.MONGO_DATABASE_API_KEY, userId, atomId, {
        data: { ...rest },
      });

      return null;
    }
    default:
      return exhaustiveMatchingGuard(_action);
  }
};
