"use client";

import { useAuth } from "@clerk/nextjs";
import { isE2eMode } from "@/src/lib/auth-mode";

const e2eAuth = {
  getToken: async () => "e2e-token",
  isSignedIn: true,
  userId: "e2e-user"
};

function readClerkAuth() {
  return useAuth();
}

export function useAppAuth() {
  if (isE2eMode()) {
    return e2eAuth;
  }

  return readClerkAuth();
}
