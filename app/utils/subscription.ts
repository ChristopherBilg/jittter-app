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
