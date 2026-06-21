"use-client"

export function isE2eMode() {
  return process.env.NEXT_PUBLIC_E2E_MODE === "true";
}

export function shouldRedirectToSignIn(isAuthenticated) {
  const hasClerkKey = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
      process.env.CLERK_PUBLISHABLE_KEY
  );

  return !isAuthenticated && hasClerkKey && !isE2eMode();
}
