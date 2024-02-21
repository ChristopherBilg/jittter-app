import { z } from "zod";

export const CreateNoteSchema = z.object({
  content: z.string().min(1).max(1024),
});

export const validateCreateNote = async (formData: FormData) => {
  const content = formData.get("content");

  const result = CreateNoteSchema.safeParse({
    content,
  });

  if (!result.success) return null;

  return result.data;
};

const UpdateNoteSchema = z.object({
  noteId: z.string().uuid(),
  content: z.string().min(1).max(10244),
});

export const validateUpdateNote = async (formData: FormData) => {
  const noteId = formData.get("noteId");
  const content = formData.get("content");

  const result = UpdateNoteSchema.safeParse({
    noteId,
    content,
  });

  if (!result.success) return null;

  return result.data;
};

const DeleteNoteSchema = z.object({
  noteId: z.string().uuid(),
});

export const validateDeleteNote = async (formData: FormData) => {
  const noteId = formData.get("noteId");

  const result = DeleteNoteSchema.safeParse({
    noteId,
  });

  if (!result.success) return null;

  return result.data;
};
