import { AtomicReminderFrequency, exhaustiveMatchingGuard } from "./misc";

export const getNextReminderDate = (
  startingAt: string,
  frequency: AtomicReminderFrequency,
): string => {
  // TODO: Update to perform calculation to get next reminder date
  switch (frequency) {
    case AtomicReminderFrequency.Once:
      return startingAt;
    case AtomicReminderFrequency.Daily:
      return startingAt;
    case AtomicReminderFrequency.Weekly:
      return startingAt;
    case AtomicReminderFrequency.Monthly:
      return startingAt;
    case AtomicReminderFrequency.Yearly:
      return startingAt;
    default: {
      exhaustiveMatchingGuard(frequency);
      return "An error occurred";
    }
  }
};
