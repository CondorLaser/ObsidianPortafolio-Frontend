import { DashboardShell } from "@/src/components/dashboard-shell";
import { MetricCard } from "@/src/components/metric-card";
import { SectionCard } from "@/src/components/section-card";
import { getServerAuth, shouldRedirectToSignIn } from "@/src/lib/auth-mode";
import { alerts } from "@/src/lib/mock-data";

export default async function AlertsPage() {
  const { isAuthenticated, redirectToSignIn, userId } = await getServerAuth()

  if (shouldRedirectToSignIn(isAuthenticated)) return redirectToSignIn()

  return (
    <DashboardShell
      title="Alertas"
      description="Listado inicial para notificaciones importantes del sistema."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total" value="5" />
        <MetricCard label="Criticas" value="2" />
        <MetricCard label="Advertencias" value="1" />
        <MetricCard label="Informacion" value="2" />
      </div>

      <div className="mt-6">
        <SectionCard title="Alertas del sistema" description="Mock inicial para validar estructura visual y contenidos.">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <article key={alert.title} className="rounded-3xl border border-border-soft bg-app p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{alert.title}</h3>
                      <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                        {alert.severity}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-text-muted">{alert.detail}</p>
                  </div>

                  <button
                    type="button"
                    className="rounded-2xl border border-border-soft px-4 py-2 text-sm font-semibold transition hover:bg-panel-soft"
                  >
                    Ver detalle
                  </button>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </DashboardShell>
  );
}
