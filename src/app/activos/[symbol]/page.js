import { DashboardShell } from "@/src/components/dashboard-shell";
import { MetricCard } from "@/src/components/metric-card";
import { SectionCard } from "@/src/components/section-card";
import { SimpleChart } from "@/src/components/simple-chart";
import { auth } from "@clerk/nextjs/server";

export default async function AssetDetailPage({ params }) {
  const { symbol } = await params;
  const { isAuthenticated, redirectToSignIn, userId } = await auth()
  
  if (!isAuthenticated) return redirectToSignIn()

  return (
    <DashboardShell
      title={`Activo: ${symbol}`}
      description="Vista base para mostrar detalle de precio, monto invertido, performance y graficos historicos."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Valor de mercado" value="$11.132,50" helper="+1.42% 24h" />
        <MetricCard label="Monto invertido" value="$10.512,50" />
        <MetricCard label="Cantidad de cuotas" value="25 unidades" />
        <MetricCard label="Ultimo precio" value="$445,30" helper="+1.42% 24h" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard title="Evolucion historica del precio" description="Placeholder para integrar el grafico real por activo.">
          <SimpleChart />
        </SectionCard>

        <SectionCard title="Metricas de performance" description="Resumen corto para el MVP.">
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard label="Retorno total" value="5.90%" />
            <MetricCard label="P&L no realizado" value="$620,00" />
            <MetricCard label="Fees acumulados" value="$8,50" />
            <MetricCard label="Income acumulado" value="$125,00" />
          </div>
        </SectionCard>
      </div>
    </DashboardShell>
  );
}
