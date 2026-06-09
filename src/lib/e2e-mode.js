export function isE2eMode() {
  return process.env.NEXT_PUBLIC_E2E_MODE === "true";
}
