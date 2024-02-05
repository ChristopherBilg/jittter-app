import { z, ZodError, ZodIssue } from "zod";

export const MINIMUM_PASSWORD_LENGTH = 8;

const UserRegistrationSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(MINIMUM_PASSWORD_LENGTH),
});

export const validate = async (request: Request) => {
  const formData = await request.formData();

  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const password = formData.get("password");

  const issues: ZodIssue[] = [];

  try {
    UserRegistrationSchema.parse({
      firstName,
      lastName,
      email,
      password,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      issues.push(...err.issues);
    }
  }

  return {
    ok: issues.length === 0,
    issues,
    values: {
      firstName,
      lastName,
      email,
      password,
    },
  };
};
