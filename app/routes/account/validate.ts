import { z } from "zod";
import { USER_ACCOUNT_MINIMUM_PASSWORD_LENGTH } from "~/app/utils/constant";

const UpdateNameSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
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

const UpdatePasswordSchema = z.object({
  password: z.string().min(USER_ACCOUNT_MINIMUM_PASSWORD_LENGTH),
});

export const validateUpdatePassword = async (formData: FormData) => {
  const password = formData.get("newPassword");

  const result = UpdatePasswordSchema.safeParse({
    password,
  });

  if (!result.success) return null;

  return {
    password: result.data.password,
  };
};
