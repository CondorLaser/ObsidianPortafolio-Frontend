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
      description="Revisa los detalles de cantidad, cuenta asociada, valor y retorno de cada uno de los activos que conforman tu portafolio."
    >
      <AssetsContent />
    </DashboardShell>
  );
}
