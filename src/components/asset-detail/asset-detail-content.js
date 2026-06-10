"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { ActionItem } from "@/src/components/asset-detail/action-item";
import { DashboardShell } from "@/src/components/dashboard-shell";
import { MetricCard } from "@/src/components/metric-card";
import { SectionCard } from "@/src/components/section-card";
import { SimpleChart } from "@/src/components/simple-chart";
import { assetDetailConfigs } from "@/src/lib/asset-detail-config";
import { FeedbackCard } from "../feedback-card";

function DetailPill({ label, value, tone = "default" }) {
  const toneClass =
    tone === "positive"
      ? "text-success"
      : tone === "negative"
        ? "text-danger"
        : "text-white";

  return (
    <article className="rounded-[22px] border border-border-soft bg-surface/55 p-5">
      <p className="text-[12px] uppercase tracking-[0.14em] text-text-muted">{label}</p>
      <p className={`mt-2 text-[22px] font-semibold tracking-[-0.02em] ${toneClass}`}>{value}</p>
    </article>
  );
}

export function AssetDetailContent({ symbol }) {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadPosition() {
      try {
        setLoading(true);
        setError(false);

        const baseUrl = process.env.NEXT_PUBLIC_URL_BE || "";
        const response = await fetch(`${baseUrl}/positions/${encodeURIComponent(symbol)}`);

        if (!response.ok) throw new Error("Error al cargar el activo");

        const data = await response.json();
        setPosition(data);
      } catch (fetchError) {
        console.error("Fetch Asset Detail Error:", fetchError);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadPosition();
  }, [symbol]);

  if (loading) {
    return (
      <DashboardShell
        title="Detalle de activo"
        description="Vista específica del activo seleccionado, con su evolución de mercado y los datos que tiene el usuario en su cuenta."
      >
        <FeedbackCard title="Cargando activo..." detail="Estamos obteniendo el detalle del activo seleccionado." />
      </DashboardShell>
    );
  }

  if (error || !position) {
    return (
      <DashboardShell
        title="Detalle de activo"
        description="Vista específica del activo seleccionado, con su evolución de mercado y los datos que tiene el usuario en su cuenta."
      >
        <FeedbackCard
          title="No se pudo cargar el activo"
          detail="Revisa la conexion con el backend o vuelve al listado para elegir otro activo."
          tone="error"
        />
      </DashboardShell>
    );
  }

  const asset = position.asset;
  const config = assetDetailConfigs[position.symbol] ?? assetDetailConfigs.SPY;
  const chartData = asset?.priceHistory ?? config.chartData;
  const chartLabels = config.chartLabels;
  const dailyMetrics = asset?.dailyMetrics;
  const monthlyMetrics = asset?.monthlyMetrics;
  const quantityLabel = position.type === "Liquidez" ? position.quantity : `${position.quantity} unidades`;

  return (
    <DashboardShell
      title={`${position.symbol} · ${position.name}`}
      description="Vista específica del activo seleccionado, con su evolución de mercado y los datos que tiene el usuario en su cuenta."
      actions={
        <>
        <Link
          href="/activos"
          className="inline-flex min-h-[44px] items-center justify-center rounded-[18px] border border-border-soft px-[18px] text-[14px] font-semibold text-white transition hover:border-accent/35 hover:text-accent"
        >
          Volver a activos
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

      <p className="mb-6 text-sm uppercase tracking-[0.25em] text-accent">Detalle de activo</p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Valor invertido" value={position.totalValue} helper={`${position.weight} del portafolio`} />
        <MetricCard label="Cantidad" value={quantityLabel} helper={`Costo prom. ${position.avgCost}`} />
        <MetricCard label="Precio actual" value={asset?.currentPrice ?? position.currentPrice} helper={asset?.priceSource ?? position.source} />
        <MetricCard label="Cuenta asociada" value={position.account} helper={position.returnPct} />
      </div>

      <div className="mt-7 grid gap-7">
        <SectionCard
          title="Datos del usuario"
          description="Información propia de este activo dentro del portafolio: resultado, dividendos, costos y última transacción."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <DetailPill label="P&L no realizado" value={position.unrealizedPnl} tone={position.unrealizedPnl.startsWith("-") ? "negative" : "positive"} />
            <DetailPill label="P&L realizado" value={position.realizedPnl} />
            <DetailPill label="Dividendos" value={position.totalDividends} />
            <DetailPill label="Comisiones" value={position.totalFees} />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <article className="rounded-[22px] border border-border-soft bg-surface/55 p-5">
              <p className="text-[12px] uppercase tracking-[0.14em] text-text-muted">Última transacción</p>
              <p className="mt-2 text-[18px] font-semibold text-white">{position.lastTransactionAt}</p>
            </article>
            <article className="rounded-[22px] border border-border-soft bg-surface/55 p-5">
              <p className="text-[12px] uppercase tracking-[0.14em] text-text-muted">Última actualización</p>
              <p className="mt-2 text-[18px] font-semibold text-white">{position.updatedAt}</p>
            </article>
          </div>
        </SectionCard>

        <SectionCard
          title="Métricas del activo"
          description="Datos generales del instrumento de mercado para entender su comportamiento más allá de esta cuenta."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <DetailPill label="Mercado" value={asset?.market ?? "Sin dato"} />
            <DetailPill label="Moneda" value={asset?.currency ?? "Sin dato"} />
            <DetailPill label="Retorno mensual" value={monthlyMetrics?.absoluteReturn ?? position.returnPct} tone={position.returnPct.startsWith("-") ? "negative" : "positive"} />
            <DetailPill label="Volatilidad diaria" value={dailyMetrics?.volatility ?? "Sin dato"} />
          </div>
        </SectionCard>

        <SectionCard
          title="Evolución del activo"
          description="Serie de precio del activo en el tiempo para seguir su tendencia reciente."
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="inline-flex rounded-full bg-accent/14 px-3 py-1 font-mono text-[12px] font-semibold text-accent">
              /activos/{position.symbol}
            </span>
          </div>
          <SimpleChart
            data={chartData}
            labels={chartLabels}
            className="h-[420px] rounded-[22px] border-border-soft/80 bg-surface"
          />
        </SectionCard>

        <SectionCard
          title="Acciones disponibles"
          description="Acciones contextuales para este activo, no acciones genéricas del dashboard."
        >
          <div className="grid gap-5">
            <ActionItem title="Recomendación" detail={config.recommendationDetail} />
            <ActionItem title="Alertas" detail={config.alertDetail} />
            <ActionItem
              title="Datos"
              detail={`Revisar ${position.source}, última transacción ${position.lastTransactionAt}.`}
            />
          </div>
        </SectionCard>
      </div>
    </DashboardShell>
  );
}
