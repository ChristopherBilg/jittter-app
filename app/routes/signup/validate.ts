import { z } from "zod";
import { USER_ACCOUNT_MINIMUM_PASSWORD_LENGTH } from "~/app/utils/constant";

const SignUpUserSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(USER_ACCOUNT_MINIMUM_PASSWORD_LENGTH),
    confirmPassword: z.string().min(USER_ACCOUNT_MINIMUM_PASSWORD_LENGTH),
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
      email: result.data.email,
      password: result.data.password,
    };
  }

  return {
    data,
    errors,
  };
};
