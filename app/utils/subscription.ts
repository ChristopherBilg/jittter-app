const enum SubscriptionTier {
  Free = "free",
  Premium = "premium",
  Professional = "professional",
}

export const SubscriptionPrice = {
  [SubscriptionTier.Free]: "$0",
  [SubscriptionTier.Premium]: "$5",
  [SubscriptionTier.Professional]: "$10",
};

export const AtomicNoteLimit = {
  [SubscriptionTier.Free]: 1_000,
  [SubscriptionTier.Premium]: 10_000,
  [SubscriptionTier.Professional]: 100_000,
};
