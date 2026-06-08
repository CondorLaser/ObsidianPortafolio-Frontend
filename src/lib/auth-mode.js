"use server"
import { isE2eMode } from "./auth-mode-client";

export async function getServerAuth() {
  if (isE2eMode()) {
    return {
      isAuthenticated: true,
      redirectToSignIn: () => null,
      userId: "e2e-user"
    };
  }

  const { auth } = await import("@clerk/nextjs/server");
  return auth();
}
