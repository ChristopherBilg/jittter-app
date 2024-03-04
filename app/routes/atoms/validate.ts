import { z } from "zod";
import { AtomicReminderFrequency } from "~/app/utils/constant";

export const CreateNoteAtomSchema = z.object({
  content: z.string().min(0).max(1024),
});

export const validateCreateNoteAtom = async (formData: FormData) => {
  const content = formData.get("content");

  const result = CreateNoteAtomSchema.safeParse({
    content,
  });

  if (!result.success) return null;

  return result.data;
};

export const UpdateNoteAtomSchema = z.object({
  atomId: z.string(),
  content: z.string().min(0).max(1024),
});

export const validateUpdateNoteAtom = async (formData: FormData) => {
  const atomId = formData.get("atomId");
  const content = formData.get("content");

  const result = UpdateNoteAtomSchema.safeParse({
    atomId,
    content,
  });

  if (!result.success) return null;

  return result.data;
};

export const CreateContactAtomSchema = z.object({
  fullName: z.string().min(0).max(256),
  email: z.string().email(),
  phoneNumber: z.string().min(0).max(16),
});

export const validateCreateContactAtom = async (formData: FormData) => {
  const fullName = formData.get("fullName");
  const email = formData.get("email");
  const phoneNumber = formData.get("phoneNumber");

  const result = CreateContactAtomSchema.safeParse({
    fullName,
    email,
    phoneNumber,
  });

  if (!result.success) return null;

  return result.data;
};

const UpdateContactAtomSchema = z.object({
  atomId: z.string(),
  fullName: z.string().min(0).max(256),
  email: z.string().min(0).max(256),
  phoneNumber: z.string().min(0).max(16),
});

export const validateUpdateContactAtom = async (formData: FormData) => {
  const atomId = formData.get("atomId");
  const fullName = formData.get("fullName");
  const email = formData.get("email");
  const phoneNumber = formData.get("phoneNumber");

  const result = UpdateContactAtomSchema.safeParse({
    atomId,
    fullName,
    email,
    phoneNumber,
  });

  if (!result.success) return null;

  return result.data;
};

export const CreateReminderAtomSchema = z.object({
  content: z.string().min(0).max(1024),
  frequency: z.nativeEnum(AtomicReminderFrequency),
  startingAt: z.string().min(0).max(32),
});

export const validateCreateReminderAtom = async (formData: FormData) => {
  const content = formData.get("content");
  const frequency = formData.get("frequency");
  const startingAt = formData.get("startingAt");

  const result = CreateReminderAtomSchema.safeParse({
    content,
    frequency,
    startingAt,
  });

  if (!result.success) return null;

  return result.data;
};

export const UpdateReminderAtomSchema = z.object({
  atomId: z.string(),
  content: z.string().min(0).max(1024),
  frequency: z.nativeEnum(AtomicReminderFrequency),
  startingAt: z.string().min(0).max(32),
});

export const validateUpdateReminderAtom = async (formData: FormData) => {
  const atomId = formData.get("atomId");
  const content = formData.get("content");
  const frequency = formData.get("frequency");
  const startingAt = formData.get("startingAt");

  const result = UpdateReminderAtomSchema.safeParse({
    atomId,
    content,
    frequency,
    startingAt,
  });

  if (!result.success) return null;

  return result.data;
};

export const CreateDrawingAtomSchema = z.object({
  content: z
    .string()
    .min(0)
    .max(2 ** 20),
});

export const validateCreateDrawingAtom = async (formData: FormData) => {
  const content = formData.get("content");

  const result = CreateDrawingAtomSchema.safeParse({
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
