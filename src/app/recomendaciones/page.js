import { DashboardShell } from "@/src/components/dashboard-shell";
import { MetricCard } from "@/src/components/metric-card";
import { SectionCard } from "@/src/components/section-card";
import { recommendations } from "@/src/lib/mock-data";
import { auth } from '@clerk/nextjs/server'

export default async function RecommendationsPage() {
  const { isAuthenticated, redirectToSignIn, userId } = await auth()

  if (!isAuthenticated) return redirectToSignIn()
  
  return (
    <DashboardShell
      title="Recomendaciones"
      description="Espacio inicial para sugerencias basadas en perfil, comportamiento y patrones similares."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Nuevas" value="2" />
        <MetricCard label="Total sugerencias" value="6" />
        <MetricCard label="Activos unicos" value="18" />
        <MetricCard label="Match promedio" value="87%" />
      </div>

      <div className="mt-6">
        <SectionCard title="Sobre estas recomendaciones" description="Texto importante para dejar claro el alcance del modulo.">
          <p className="rounded-2xl border border-border-soft bg-app p-4 text-sm leading-7 text-text-muted">
            Estas sugerencias no son recomendaciones financieras directas. Son hallazgos basados
            en perfiles similares y patrones estadisticos, y luego podremos afinarlas con los datos reales del usuario.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {recommendations.map((item) => (
              <article key={item.symbol} className="rounded-3xl border border-border-soft bg-app p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{item.symbol}</h3>
                    <p className="mt-1 text-sm text-text-muted">{item.name}</p>
                  </div>
                  <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                    Match {item.match}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </DashboardShell>
  );
}
