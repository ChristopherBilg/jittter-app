export const enum SubscriptionTier {
  Starter = "starter",
  Premium = "premium",
  Professional = "professional",
}

export const SubscriptionPrice: { [key in SubscriptionTier]: string } = {
  [SubscriptionTier.Starter]: "$0",
  [SubscriptionTier.Premium]: "$5",
  [SubscriptionTier.Professional]: "$10",
};

export const AtomLimit: { [key in SubscriptionTier]: number } = {
  [SubscriptionTier.Starter]: 1_000,
  [SubscriptionTier.Premium]: 10_000,
  [SubscriptionTier.Professional]: Infinity,
};
