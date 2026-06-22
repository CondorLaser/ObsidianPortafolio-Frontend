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
      description="Da seguimiento a tu portafolio con alertas que se generan de acuerdo a la evolución de tu portafolio, cuentas y activos"
    >
      <li className="ml-4 mb-4 text-text-muted"><b>Ten en cuenta:</b> que las alertas solo se activarán para aquellos campos de tus <b>Preferencias de Alertas</b> de la vista <b>Perfil</b> que tengan un valor asociado</li>
      <li className="ml-4 mb-4 text-text-muted">Considera que solo se generan las alertas al subir nuevos archivos a tu portafolio, modificar tus Preferencias y durante la nocha mediante los mecanismos de Orion Portfolio</li>
      <AlertsContent />
    </DashboardShell>
  );
}
