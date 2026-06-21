import Link from "next/link";

import { DashboardShell } from "@/src/components/dashboard-shell";
import { PortfolioContent } from "@/src/components/portfolio/portfolio-content";
import { getServerAuth } from "@/src/lib/auth-mode";
import { shouldRedirectToSignIn } from "@/src/lib/auth-mode-client";

function QuickAction({ href, label, muted = false }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-14 items-center justify-center rounded-[20px] border px-6 text-base font-semibold transition ${
        muted
          ? "border-border-soft bg-transparent text-white hover:border-accent/30 hover:text-accent"
          : "border-transparent bg-accent text-[#03241f] hover:brightness-110"
      }`}
    >
      {label}
    </Link>
  );
}

export default async function PortfolioPage() {
  const { isAuthenticated, redirectToSignIn } = await getServerAuth();

  if (shouldRedirectToSignIn(isAuthenticated)) return redirectToSignIn();

  return (
    <DashboardShell
      title="Dashboard del portafolio"
      description="Resumen general de inversiones, cuentas activas, composicion y posiciones abiertas, con estado de frescura de certificados."
      actions={
        <>
          <QuickAction href="/alertas" label="Ver alertas" muted />
          <QuickAction href="/perfil" label="Subir/Actualizar Datos" />
        </>
      }
    >
      <PortfolioContent />
    </DashboardShell>
  );
}
