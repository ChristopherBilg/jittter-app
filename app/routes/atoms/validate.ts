import { z } from "zod";

export const CreateAtomSchema = z.object({
  content: z.string().min(0).max(1024),
});

export const validateCreateAtom = async (formData: FormData) => {
  const content = formData.get("content");

  const result = CreateAtomSchema.safeParse({
    content,
  });

  if (!result.success) return null;

  return result.data;
};

const UpdateAtomSchema = z.object({
  atomId: z.string(),
  content: z.string().min(0).max(10244),
});

export const validateUpdateAtom = async (formData: FormData) => {
  const atomId = formData.get("atomId");
  const content = formData.get("content");

  const result = UpdateAtomSchema.safeParse({
    atomId,
    content,
  });

  if (!result.success) return null;

  return result.data;
};

const DeleteAtomSchema = z.object({
  atomId: z.string(),
});

export const validateDeleteAtom = async (formData: FormData) => {
  const atomId = formData.get("atomId");

  const result = DeleteAtomSchema.safeParse({
    atomId,
  });

  if (!result.success) return null;

  return result.data;
};
