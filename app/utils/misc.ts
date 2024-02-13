export const exhaustiveMatchingGuard = (_: never): never => {
  throw new Error("Exhaustive matching: unexpected value");
};
