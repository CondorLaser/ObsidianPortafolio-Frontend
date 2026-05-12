import Link from "next/link";

import { ActionItem } from "@/src/components/asset-detail/action-item";
import { DashboardShell } from "@/src/components/dashboard-shell";
import { MetricCard } from "@/src/components/metric-card";
import { SectionCard } from "@/src/components/section-card";
import { SimpleChart } from "@/src/components/simple-chart";
import { assetDetailConfigs } from "@/src/lib/asset-detail-config";
import { positions } from "@/src/lib/mock-data";
import { auth } from "@clerk/nextjs/server";

export default async function AssetDetailPage({ params }) {
  const { symbol } = await params;
  const { isAuthenticated, redirectToSignIn } = await auth();

  if (!isAuthenticated) return redirectToSignIn();

  const normalizedSymbol = decodeURIComponent(symbol).toUpperCase();
  const position =
    positions.find((item) => item.symbol.toUpperCase() === normalizedSymbol) ?? positions[0];
  const config = assetDetailConfigs[position.symbol] ?? assetDetailConfigs.SPY;

  const quantityLabel =
    position.type === "Liquidez" ? position.quantity : `${position.quantity} unidades`;

  return (
    <DashboardShell
      title={`${position.symbol} · ${position.name}`}
      description={config.description}
      actions={
        <>
          <Link
            href="/portafolio"
            className="inline-flex min-h-[44px] items-center justify-center rounded-[18px] border border-border-soft px-[18px] text-[14px] font-semibold text-white transition hover:border-accent/35 hover:text-accent"
          >
            Volver al dashboard
          </Link>
          <Link
            href="/recomendaciones"
            className="inline-flex min-h-[44px] items-center justify-center rounded-[18px] border border-transparent bg-accent px-[18px] text-[14px] font-semibold text-app transition hover:brightness-105"
          >
            Ver recomendación
          </Link>
        </>
      }
    >
      <p className="mb-6 text-sm uppercase tracking-[0.25em] text-accent">{config.eyebrow}</p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Valor total" value={position.totalValue} helper={`${position.weight} del portafolio`} />
        <MetricCard label="Cantidad" value={quantityLabel} helper={position.type} />
        <MetricCard label="Precio actual" value={position.currentPrice} helper={position.source} />
        <MetricCard label="Cuenta" value={position.account} helper={position.returnPct} />
      </div>

      <div className="mt-7 grid gap-7">
        <SectionCard
          title="Evolución del activo"
          description="Comportamiento visual del activo seleccionado. La curva cambia por símbolo en esta representación."
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="inline-flex rounded-full bg-accent/14 px-3 py-1 font-mono text-[12px] font-semibold text-accent">
              /activos/{position.symbol}
            </span>
          </div>
          <SimpleChart
            data={config.chartData}
            labels={config.chartLabels}
            className="h-[420px] rounded-[22px] border-border-soft/80 bg-surface"
          />
        </SectionCard>

        <SectionCard
          title="Acciones disponibles"
          description="Acciones contextuales del activo, no acciones genéricas del dashboard."
        >
          <div className="grid gap-5">
            <ActionItem title="Recomendación" detail={config.recommendationDetail} />
            <ActionItem title="Alertas" detail={config.alertDetail} />
            <ActionItem title="Datos" detail={config.dataDetail} />
          </div>
        </SectionCard>
      </div>
    </DashboardShell>
  );
}
