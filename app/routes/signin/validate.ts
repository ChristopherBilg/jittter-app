import { z } from "zod";
import { User } from "~/app/db.server/postgresql/models/user";

export const SignInUserSchema = z.object({
  email: z.string().email().max(128),
  password: z.string().min(10).max(128),
});

export const validateSignIn = async (
  request: Request,
  connectionString: string,
) => {
  const formData = await request.formData();

  const email = formData.get("email");
  const password = formData.get("password");

  const result = SignInUserSchema.safeParse({
    email,
    password,
  });

  if (!result.success) return null;

  return User.getByAuthenticating(
    connectionString,
    result.data.email.toLowerCase(),
    result.data.password,
  );
};
