import { z } from "zod";
import {
  USER_ACCOUNT_MAXIMUM_FIRST_NAME_LENGTH,
  USER_ACCOUNT_MAXIMUM_LAST_NAME_LENGTH,
  USER_ACCOUNT_MAXIMUM_PASSWORD_LENGTH,
  USER_ACCOUNT_MINIMUM_FIRST_NAME_LENGTH,
  USER_ACCOUNT_MINIMUM_LAST_NAME_LENGTH,
  USER_ACCOUNT_MINIMUM_PASSWORD_LENGTH,
} from "~/app/utils/constant";

const UpdateNameSchema = z.object({
  firstName: z
    .string()
    .min(USER_ACCOUNT_MINIMUM_FIRST_NAME_LENGTH)
    .max(USER_ACCOUNT_MAXIMUM_FIRST_NAME_LENGTH),
  lastName: z
    .string()
    .min(USER_ACCOUNT_MINIMUM_LAST_NAME_LENGTH)
    .max(USER_ACCOUNT_MAXIMUM_LAST_NAME_LENGTH),
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

const UpdatePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(USER_ACCOUNT_MINIMUM_PASSWORD_LENGTH)
      .max(USER_ACCOUNT_MAXIMUM_PASSWORD_LENGTH),
    confirmNewPassword: z
      .string()
      .min(USER_ACCOUNT_MINIMUM_PASSWORD_LENGTH)
      .max(USER_ACCOUNT_MAXIMUM_PASSWORD_LENGTH),
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
