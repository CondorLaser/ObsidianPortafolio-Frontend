import { DashboardShell } from "@/src/components/dashboard-shell";
import { MetricCard } from "@/src/components/metric-card";
import { SectionCard } from "@/src/components/section-card";
import { SimpleChart } from "@/src/components/simple-chart";
import { accountDistribution, portfolioSummary, positions } from "@/src/lib/mock-data";

export default function PortfolioPage() {
  return (
    <DashboardShell
      title="Dashboard del Portafolio"
      description="Resumen general de inversiones, cuentas activas, composicion y posiciones abiertas."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Valor total del portafolio" value={portfolioSummary.totalValue} helper="+6.8%" />
        <MetricCard
          label="Retorno no realizado"
          value={portfolioSummary.totalReturn}
          helper={portfolioSummary.totalReturnPct}
        />
        <MetricCard label="Posiciones activas" value={portfolioSummary.activePositions} />
        <MetricCard label="Cuentas vinculadas" value={portfolioSummary.linkedAccounts} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <SectionCard
          title="Evolucion del portafolio"
          description="Grafico inicial de referencia. Mas adelante aqui conectamos la serie historica real."
        >
          <SimpleChart />
        </SectionCard>

        <SectionCard title="Distribucion por cuenta" description="Resumen rapido por cuenta conectada.">
          <div className="space-y-4">
            {accountDistribution.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-2xl border border-border-soft px-4 py-3"
              >
                <span className="text-sm text-text-muted">{item.name}</span>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-6">
        <SectionCard title="Tabla de posiciones" description="Activos principales del portafolio con datos mock.">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-text-muted">
                <tr className="border-b border-border-soft">
                  <th className="px-3 py-3 font-medium">Activo</th>
                  <th className="px-3 py-3 font-medium">Tipo</th>
                  <th className="px-3 py-3 font-medium">Cuenta</th>
                  <th className="px-3 py-3 font-medium">Cantidad</th>
                  <th className="px-3 py-3 font-medium">Precio</th>
                  <th className="px-3 py-3 font-medium">Valor total</th>
                  <th className="px-3 py-3 font-medium">Retorno</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => (
                  <tr key={position.symbol} className="border-b border-border-soft/70">
                    <td className="px-3 py-4">
                      <p className="font-semibold">{position.symbol}</p>
                      <p className="text-text-muted">{position.name}</p>
                    </td>
                    <td className="px-3 py-4">{position.type}</td>
                    <td className="px-3 py-4">{position.account}</td>
                    <td className="px-3 py-4">{position.quantity}</td>
                    <td className="px-3 py-4">{position.currentPrice}</td>
                    <td className="px-3 py-4">{position.totalValue}</td>
                    <td className="px-3 py-4 text-success">{position.returnPct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </DashboardShell>
  );
}
