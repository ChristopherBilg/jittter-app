import { z } from "zod";
import { USER_ACCOUNT_MINIMUM_PASSWORD_LENGTH } from "~/app/utils/constant";

const SignUpUserSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(USER_ACCOUNT_MINIMUM_PASSWORD_LENGTH),
});

export const validateSignUp = async (request: Request) => {
  const formData = await request.formData();

  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const password = formData.get("password");

  const result = SignUpUserSchema.safeParse({
    firstName,
    lastName,
    email,
    password,
  });

  let data;
  let errors;

  if (!result.success) {
    const formattedErrors = result.error.format();

    errors = {
      firstName: formattedErrors.firstName?._errors?.[0],
      lastName: formattedErrors.lastName?._errors?.[0],
      email: formattedErrors.email?._errors?.[0],
      password: formattedErrors.password?._errors?.[0],
    };
  } else {
    data = {
      firstName: String(result.data.firstName),
      lastName: String(result.data.lastName),
      email: String(result.data.email),
      password: String(result.data.password),
    };
  }

  return {
    data,
    errors,
  };
};
