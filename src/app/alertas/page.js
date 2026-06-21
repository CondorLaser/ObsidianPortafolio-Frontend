import { DashboardShell } from "@/src/components/dashboard-shell";
import { AlertsContent } from "@/src/components/alerts/alerts-content";
import { getServerAuth } from "@/src/lib/auth-mode";
import { shouldRedirectToSignIn } from "@/src/lib/auth-mode-client";

export default async function AlertsPage() {
  const { isAuthenticated, redirectToSignIn } = await getServerAuth()

  if (shouldRedirectToSignIn(isAuthenticated)) return redirectToSignIn()

  return (
    <DashboardShell
      title="Alertas"
      description="Seguimiento de eventos importantes detectados en tu portafolio."
    >
      <AlertsContent />
    </DashboardShell>
  );
}
