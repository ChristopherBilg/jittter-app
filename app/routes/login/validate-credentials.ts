import { getUserByAuthenticating } from "~/db/schema";

export const validateCredentials = async (request: Request) => {
  const formData = await request.formData();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  return getUserByAuthenticating(email, password);
};
