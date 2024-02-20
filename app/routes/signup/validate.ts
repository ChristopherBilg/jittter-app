import { z } from "zod";
import {
  USER_ACCOUNT_MAXIMUM_EMAIL_LENGTH,
  USER_ACCOUNT_MAXIMUM_FIRST_NAME_LENGTH,
  USER_ACCOUNT_MAXIMUM_LAST_NAME_LENGTH,
  USER_ACCOUNT_MAXIMUM_PASSWORD_LENGTH,
  USER_ACCOUNT_MINIMUM_FIRST_NAME_LENGTH,
  USER_ACCOUNT_MINIMUM_LAST_NAME_LENGTH,
  USER_ACCOUNT_MINIMUM_PASSWORD_LENGTH,
} from "~/app/utils/constant";

const SignUpUserSchema = z
  .object({
    firstName: z
      .string()
      .min(USER_ACCOUNT_MINIMUM_FIRST_NAME_LENGTH)
      .max(USER_ACCOUNT_MAXIMUM_FIRST_NAME_LENGTH),
    lastName: z
      .string()
      .min(USER_ACCOUNT_MINIMUM_LAST_NAME_LENGTH)
      .max(USER_ACCOUNT_MAXIMUM_LAST_NAME_LENGTH),
    email: z.string().email().max(USER_ACCOUNT_MAXIMUM_EMAIL_LENGTH),
    password: z
      .string()
      .min(USER_ACCOUNT_MINIMUM_PASSWORD_LENGTH)
      .max(USER_ACCOUNT_MAXIMUM_PASSWORD_LENGTH),
    confirmPassword: z
      .string()
      .min(USER_ACCOUNT_MINIMUM_PASSWORD_LENGTH)
      .max(USER_ACCOUNT_MAXIMUM_PASSWORD_LENGTH),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "The passwords did not match",
      });
    }
  });

export const validateSignUp = async (request: Request) => {
  const formData = await request.formData();

  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  const result = SignUpUserSchema.safeParse({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  });

  let data;
  let errors;

  if (!result.success) {
    const formattedErrors = result.error.format();

    errors = {
      firstName: formattedErrors.firstName?._errors,
      lastName: formattedErrors.lastName?._errors,
      email: formattedErrors.email?._errors,
      password: formattedErrors.password?._errors,
    };
  } else {
    data = {
      firstName: result.data.firstName,
      lastName: result.data.lastName,
      email: result.data.email.toLowerCase(),
      password: result.data.password,
    };
  }

  return {
    data,
    errors,
  };
};
