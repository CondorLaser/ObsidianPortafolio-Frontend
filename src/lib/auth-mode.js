export function shouldRedirectToSignIn(isAuthenticated) {
  const hasClerkKey = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
      process.env.CLERK_PUBLISHABLE_KEY
  );

  return !isAuthenticated && hasClerkKey;
}
