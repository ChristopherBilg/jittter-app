import { z } from "zod";

const SendMessageSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1).max(1000),
});

export const validateSendMessage = async (request: Request) => {
  const formData = await request.formData();

  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const message = formData.get("message");

  const result = SendMessageSchema.safeParse({
    firstName,
    lastName,
    email,
    message,
  });

  let data;
  let errors;

  if (!result.success) {
    const formattedErrors = result.error.format();

    errors = {
      firstName: formattedErrors.firstName?._errors,
      lastName: formattedErrors.lastName?._errors,
      email: formattedErrors.email?._errors,
      message: formattedErrors.message?._errors,
    };
  } else {
    data = {
      firstName: String(result.data.firstName),
      lastName: String(result.data.lastName),
      email: String(result.data.email),
      message: String(result.data.message),
    };
  }

  return {
    data,
    errors,
  };
};
