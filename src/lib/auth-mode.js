export function isE2eMode() {
  return process.env.NEXT_PUBLIC_E2E_MODE === "true";
}

export async function getServerAuth() {
  /* if (isE2eMode()) {
    return {
      isAuthenticated: true,
      redirectToSignIn: () => null,
      userId: "e2e-user"
    };
  } */

  const { auth } = await import("@clerk/nextjs/server");
  return auth();
}

export function shouldRedirectToSignIn(isAuthenticated) {
  const hasClerkKey = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
      process.env.CLERK_PUBLISHABLE_KEY
  );

  return !isAuthenticated && hasClerkKey && !isE2eMode();
}
