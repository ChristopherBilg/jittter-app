export const exhaustiveMatchingGuard = (_: never): never => {
  throw new Error("Exhaustive matching: unexpected value");
};

export enum AtomicReminderFrequency {
  Once = "once",
  Daily = "daily",
  Weekly = "weekly",
  Monthly = "monthly",
  Yearly = "yearly",
}
