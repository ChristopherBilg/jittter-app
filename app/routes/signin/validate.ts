import { z } from "zod";
import { getUserByAuthenticating } from "~/app/db/schema";

export const AUTHENTICATE_USER_MINIMUM_PASSWORD_LENGTH = 8;

const AuthenticateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(AUTHENTICATE_USER_MINIMUM_PASSWORD_LENGTH),
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

  return getUserByAuthenticating(String(email), String(password));
};
