import { getUserByAuthenticating } from "~/db/schema";

export const validateCredentials = async (request: Request) => {
  const formData = await request.formData();

  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  return getUserByAuthenticating(email, password);
};
