import { z } from "zod";

export const UpdateNameSchema = z.object({
  firstName: z.string().min(1).max(128),
  lastName: z.string().min(1).max(128),
});

export const validateUpdateName = async (formData: FormData) => {
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");

  const result = UpdateNameSchema.safeParse({
    firstName,
    lastName,
  });

  if (!result.success) return null;

  return {
    firstName: result.data.firstName,
    lastName: result.data.lastName,
  };
};

export const UpdatePasswordSchema = z
  .object({
    newPassword: z.string().min(10).max(128),
    confirmNewPassword: z.string().min(10).max(128),
  })
  .superRefine(({ newPassword, confirmNewPassword }, ctx) => {
    if (newPassword !== confirmNewPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["newPassword"],
        message: "The passwords did not match",
      });
    }
  });

export const validateUpdatePassword = async (formData: FormData) => {
  const newPassword = formData.get("newPassword");
  const confirmNewPassword = formData.get("confirmNewPassword");

  const result = UpdatePasswordSchema.safeParse({
    newPassword,
    confirmNewPassword,
  });

  if (!result.success) return null;

  return {
    newPassword: result.data.newPassword,
  };
};
