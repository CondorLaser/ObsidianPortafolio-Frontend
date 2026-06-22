"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { DashboardShell } from "@/src/components/dashboard-shell";
import { MetricCard } from "@/src/components/metric-card";
import { SectionCard } from "@/src/components/section-card";
import { FeedbackCard } from "../feedback-card";
import { useAppAuth} from "@/src/lib/client-auth";
import { AssetDailyMetric } from "./asset-metric-daily";
import { AssetPositionMetrics } from "./asset-position-metrics";

function DetailPill({ label, value, tone = "default" }) {
  const toneClass =
    tone === "positive"
      ? "text-success"
      : tone === "negative"
        ? "text-danger"
        : "text-white";

  return (
    <article className="rounded-[22px] border border-border-soft bg-surface/55 p-5 mr-3 mb-4">
      <p className="text-[12px] uppercase tracking-[0.14em] text-text-muted">{label}</p>
      <p className={`mt-2 text-[22px] font-semibold tracking-[-0.02em] ${toneClass}`}>{value}</p>
    </article>
  );
}

function formatMoney(amount, currency = "USD") {
  if (amount === null || amount === undefined) return "-";
  const numAmount = Number(amount);
  
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: currency === "CLP" ? 0 : 2,
  }).format(numAmount);
}

export function AssetDetailContent({ asset_id }) {
  const { getToken } = useAppAuth();
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_URL_BE || "";

  // Obtener Position
  useEffect(() => {
    async function loadPosition() {
      try {
        setLoading(true);
        setError(false);
        const token = await getToken();
        const response = await fetch(`${baseUrl}/positions/asset/${encodeURIComponent(asset_id)}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
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
  }, [asset_id, baseUrl, getToken]);


  if (loading) {
    return (
      <DashboardShell
        title="Detalle de activo"
        description="Observa los datos de este activo y tu inversión en él, junto a los datos de su evolución en el mercado."
      >
        <FeedbackCard title="Cargando activo..." detail="Estamos obteniendo el detalle del activo seleccionado." />
      </DashboardShell>
    );
  }

  if (error || !position) {
    return (
      <DashboardShell
        title="Detalle de activo"
        description="Observa los datos de este activo y tu inversión en él, junto a los datos de su evolución en el mercado."
      >
        <FeedbackCard
          title="No se pudo cargar el activo"
          detail="Por favor, intentalo en otro momento, revisa tu conexión o vuelve al listado para elegir otro activo."
          tone="error"
        />
      </DashboardShell>
    );
  }

  const last_transaction_date = position.last_transaction_at ? new Date(position.last_transaction_at).toLocaleString("es-CL", {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  }) : "No disponible"
  const currency = position.asset.currency != undefined? (position.asset.currency === "CPL"? "CLP": position.asset.currency) : ""
  const pnl = Number(position.realized_pnl);
  const isNegative = pnl < 0;
  const pnlFormatted = position.realized_pnl
    ? `${formatMoney(pnl, currency)}` 
    : "-";
  const pnlWithCurrency = `${isNegative ? "" : "+"}${currency === "CLP" && position.last_price !== null? "CLP" : ""}${pnlFormatted}` 
  const isStock = position.asset.kind === "stock";
  const isEtf = position.asset.kind === "etf";
  const isFund = position.asset.kind === "fund";

  return (
    <DashboardShell
      title={`${position.asset.symbol} · ${position.asset.name}`}
      description="Observa los datos de este activo y tu inversión en él, junto a los datos de su evolución en el mercado."
      actions={
        <>
        <Link
          href="/activos"
          className="inline-flex min-h-[44px] items-center justify-center rounded-[18px] border border-border-soft px-[18px] text-[14px] bg-accent font-semibold text-white transition hover:border-accent/35 hover:text-accent"
        >
          Volver a activos
        </Link>
        </>
      }
    >


      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">      
        <span className={`inline-block rounded-md py-[50px] text-lg text-center w-full font-bold uppercase ${
          isStock ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
          isEtf ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
          "bg-purple-500/10 text-purple-400 border border-purple-500/20"
        }`}>
            {position.asset.kind === "stock" ? "Acción" : position.asset.kind === "etf" ? "ETF (Exchange Traded Fund)" : "Fondo Mutuo"}
        </span>
        {position.quantity !== null && (
          <MetricCard hero label={isFund? `Cantidad de Cuotas`: "Cantidad de Acciones"} value={Number(position.quantity).toFixed(4)} />
        )}
        <article className="rounded-[22px] border border-border-soft bg-surface/55 p-5">
          <p className="text-[12px] uppercase tracking-[0.14em] text-text-muted">Última actualización</p>
          <p className="mt-2 text-[18px] font-semibold text-white">{last_transaction_date}</p>
        </article>
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {position.avg_cost !== null && (
          <MetricCard label="Costo Promedio" value={currency === "CLP" && position.avg_cost !== null? `CLP${formatMoney(position.avg_cost, currency)}` : `${formatMoney(position.avg_cost, currency)}`} />
        )}
        {position.realized_pnl !== null && (
          <MetricCard label="P&L realizado" value={pnlWithCurrency} numeric_value={position.realized_pnl}/>
        )}
        {position.total_dividends !== null && (
          <MetricCard label="Dividendos totales" value={currency === "CLP" && position.total_dividends !== null? `CLP${formatMoney(position.total_dividends, currency)}` : `${formatMoney(position.total_dividends, currency)}`} />
        )}
        {position.total_fees !== null && (
          <MetricCard label="Dividendos totales" value={currency === "CLP" && position.total_fees !== null? `CLP${formatMoney(position.total_fees, currency)}` : `${formatMoney(position.total_fees, currency)}`} />
        )}
        
      </div>
      
      <div className="mt-7 grid gap-7">

        {/* Métricas de Position (daily) */}
        <AssetPositionMetrics position_id={position.id} currency={currency}></AssetPositionMetrics>
        <AssetDailyMetric asset_id={asset_id}></AssetDailyMetric>

        

        {/* <SectionCard
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
        </SectionCard> */}
      </div>
    </DashboardShell>
  );
}
