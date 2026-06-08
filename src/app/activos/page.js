import { AssetsContent } from "@/src/components/assets/assets-content";
import { DashboardShell } from "@/src/components/dashboard-shell";
import { getServerAuth } from "@/src/lib/auth-mode";
import { shouldRedirectToSignIn } from "@/src/lib/auth-mode-client";

export default async function AssetsPage() {
  const { isAuthenticated, redirectToSignIn } = await getServerAuth();

  if (shouldRedirectToSignIn(isAuthenticated)) return redirectToSignIn();

  return (
    <DashboardShell
      title="Activos"
      description="Lista de activos presentes en el portafolio del usuario, considerando todas sus cuentas vinculadas."
    >
      <AssetsContent />
    </DashboardShell>
  );
}
