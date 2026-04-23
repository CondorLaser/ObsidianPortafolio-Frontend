import { DashboardShell } from "@/components/dashboard-shell";
import { MetricCard } from "@/components/metric-card";
import { SectionCard } from "@/components/section-card";
import { SimpleChart } from "@/components/simple-chart";
import { positions } from "@/lib/mock-data";

export default async function AccountDetailPage({ params }) {
  const { accountId } = await params;

  return (
    <DashboardShell
      title={`Cuenta: ${accountId}`}
      description="Vista base por cuenta para ver evolucion y activos vinculados."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Monto total invertido" value="$41.691" />
        <MetricCard label="Posiciones activas" value="4 activos" />
        <MetricCard label="Dividendos acumulados" value="$246" />
        <MetricCard label="Ultima transaccion" value="01-04-2026" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <SectionCard title="Evolucion del monto invertido" description="Aqui luego conectamos la serie historica de la cuenta.">
          <SimpleChart />
        </SectionCard>

        <SectionCard title="Activos en esta cuenta" description="Listado simple de posiciones para el MVP.">
          <div className="space-y-4">
            {positions.map((position) => (
              <article key={position.symbol} className="rounded-2xl border border-border-soft p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{position.symbol}</p>
                    <p className="text-sm text-text-muted">{position.name}</p>
                  </div>
                  <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                    {position.type}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <p className="text-sm text-text-muted">Cantidad: <span className="text-white">{position.quantity}</span></p>
                  <p className="text-sm text-text-muted">Ultimo precio: <span className="text-white">{position.currentPrice}</span></p>
                  <p className="text-sm text-text-muted">Valor total: <span className="text-white">{position.totalValue}</span></p>
                  <p className="text-sm text-text-muted">Retorno: <span className="text-success">{position.returnPct}</span></p>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </DashboardShell>
  );
}
