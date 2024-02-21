import { z } from "zod";

export const SendMessageSchema = z.object({
  firstName: z.string().min(1).max(128),
  lastName: z.string().min(1).max(128),
  email: z.string().email().max(128),
  message: z.string().min(1).max(1024),
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
      firstName: result.data.firstName,
      lastName: result.data.lastName,
      email: result.data.email,
      message: result.data.message,
    };
  }

  return {
    data,
    errors,
  };
};
