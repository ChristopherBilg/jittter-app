import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { Atom } from "~/app/db/models/atom.server";
import { redirectIfNotAuthenticated } from "~/app/sessions";
import { exhaustiveMatchingGuard } from "~/app/utils/misc";
import {
  validateCreateAtom,
  validateDeleteAtom,
  validateUpdateAtom,
} from "./validate";

export const enum FormAction {
  CreateAtom = "create-atom",
  UpdateAtom = "update-atom",
  DeleteAtom = "delete-atom",
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await redirectIfNotAuthenticated(request, "/login");

  const userId = session.get("id");
  if (!userId) return null;

  const formData = await request.formData();
  const _action = formData.get("_action") as FormAction;

  switch (_action) {
    case FormAction.CreateAtom: {
      const validated = await validateCreateAtom(formData);
      if (!validated) return null;

      const { content } = validated;
      await Atom.create(userId, { content });

      return null;
    }
    case FormAction.UpdateAtom: {
      const validated = await validateUpdateAtom(formData);
      if (!validated) return null;

      const { atomId, content } = validated;
      await Atom.update(userId, atomId, { content });

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
