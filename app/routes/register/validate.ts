export const validate = async (request: Request) => {
  const formData = await request.formData();

  // TODO: Zod validation

  return {
    ok: true,
    error: null,
    formData,
  };
};
