import { z } from "zod";
import { User } from "~/app/db/models/user";
import { USER_ACCOUNT_MINIMUM_PASSWORD_LENGTH } from "~/app/utils/constant";

const AuthenticateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(USER_ACCOUNT_MINIMUM_PASSWORD_LENGTH),
});

export const validateSignIn = async (request: Request) => {
  const formData = await request.formData();

  const email = formData.get("email");
  const password = formData.get("password");

  const result = AuthenticateUserSchema.safeParse({
    email,
    password,
  });

  if (!result.success) return null;

  return User.getByAuthenticating(result.data.email, result.data.password);
};
