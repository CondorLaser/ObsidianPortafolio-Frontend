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
import { useAppAuth} from "@/src/lib/client-auth";

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

function formatSignedMoney(amount, currency = "USD") {
  if (amount === null || amount === undefined) return "-";

  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount)) return "-";

  const formatted = formatMoney(numericAmount, currency);
  if (numericAmount === 0) return formatted;

  return `${numericAmount > 0 ? "+" : ""}${formatted}`;
}

function formatPercentRatio(value) {
  if (value === null || value === undefined) return "-";

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return "-";

  return `${numericValue > 0 ? "+" : ""}${(numericValue * 100).toFixed(2)}%`;
}

function formatNumber(value, maximumFractionDigits = 2) {
  if (value === null || value === undefined) return "-";

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return "-";

  return new Intl.NumberFormat("es-CL", {
    minimumFractionDigits: 0,
    maximumFractionDigits
  }).format(numericValue);
}

function formatDate(value) {
  if (!value) return "-";

  return new Date(`${value}T00:00:00`).toLocaleDateString("es-CL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}

function getMetricTone(value) {
  if (value === null || value === undefined) return "default";

  const numericValue = Number(value);
  if (Number.isNaN(numericValue) || numericValue === 0) return "default";

  return numericValue < 0 ? "negative" : "positive";
}

function getPersonalReturn(metric, position) {
  if (metric?.personal_return !== null && metric?.personal_return !== undefined) {
    return metric.personal_return;
  }

  const invested = Number(position?.avg_cost) * Number(position?.quantity);
  const totalPnl = Number(metric?.total_pnl);

  if (!invested || Number.isNaN(invested) || Number.isNaN(totalPnl)) return null;

  return totalPnl / invested;
}

export function AssetDetailContent({ asset_id }) {
  const { getToken } = useAppAuth();
  const [position, setPosition] = useState(null);
  const [positionMetric, setPositionMetric] = useState(null);
  const [metricLoading, setMetricLoading] = useState(false);
  const [metricError, setMetricError] = useState(false);
  const [metricUnavailable, setMetricUnavailable] = useState(false);
  const [assetDailyMetric, setAssetDailyMetric] = useState(null);
  const [assetMonthlyMetric, setAssetMonthlyMetric] = useState(null);
  const [assetMetricsLoading, setAssetMetricsLoading] = useState(false);
  const [assetMetricsError, setAssetMetricsError] = useState(false);
  const [assetMetricsUnavailable, setAssetMetricsUnavailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_URL_BE || "";

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
        // console.log(data)
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

  useEffect(() => {
    if (!position?.id) {
      setPositionMetric(null);
      setMetricLoading(false);
      setMetricError(false);
      setMetricUnavailable(false);
      return;
    }

    async function loadPositionMetric() {
      try {
        setMetricLoading(true);
        setMetricError(false);
        setMetricUnavailable(false);
        const token = await getToken();
        const response = await fetch(
          `${baseUrl}/positions/metrics/daily/${encodeURIComponent(position.id)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }
        );

        if (response.status === 404) {
          setPositionMetric(null);
          setMetricUnavailable(true);
          return;
        }

        if (!response.ok) {
          throw new Error("Error al cargar las métricas de la posición");
        }

        const data = await response.json();
        setPositionMetric(data ?? null);
        setMetricUnavailable(!data);
      } catch (fetchError) {
        console.error("Fetch Position Metric Error:", fetchError);
        setPositionMetric(null);
        setMetricError(true);
      } finally {
        setMetricLoading(false);
      }
    }

    loadPositionMetric();
  }, [position?.id, baseUrl, getToken]);

  useEffect(() => {
    if (!asset_id) {
      setAssetDailyMetric(null);
      setAssetMonthlyMetric(null);
      setAssetMetricsLoading(false);
      setAssetMetricsError(false);
      setAssetMetricsUnavailable(false);
      return;
    }

    async function loadAssetMetrics() {
      try {
        setAssetMetricsLoading(true);
        setAssetMetricsError(false);
        setAssetMetricsUnavailable(false);
        const token = await getToken();

        const [dailyResponse, monthlyResponse] = await Promise.all([
          fetch(`${baseUrl}/assets/metrics/daily/${encodeURIComponent(asset_id)}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }),
          fetch(`${baseUrl}/assets/metrics/monthly/${encodeURIComponent(asset_id)}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          })
        ]);

        const dailyMissing = dailyResponse.status === 404;
        const monthlyMissing = monthlyResponse.status === 404;

        if (dailyMissing && monthlyMissing) {
          setAssetDailyMetric(null);
          setAssetMonthlyMetric(null);
          setAssetMetricsUnavailable(true);
          return;
        }

        if (!dailyMissing && !dailyResponse.ok) {
          throw new Error("Error al cargar métricas diarias del activo");
        }

        if (!monthlyMissing && !monthlyResponse.ok) {
          throw new Error("Error al cargar métricas mensuales del activo");
        }

        const dailyData = dailyMissing ? null : await dailyResponse.json();
        const monthlyData = monthlyMissing ? null : await monthlyResponse.json();

        setAssetDailyMetric(dailyData ?? null);
        setAssetMonthlyMetric(monthlyData ?? null);
      } catch (fetchError) {
        console.error("Fetch Asset Metrics Error:", fetchError);
        setAssetDailyMetric(null);
        setAssetMonthlyMetric(null);
        setAssetMetricsError(true);
      } finally {
        setAssetMetricsLoading(false);
      }
    }

    loadAssetMetrics();
  }, [asset_id, baseUrl, getToken]);

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

/*   const config = assetDetailConfigs[position.symbol] ?? assetDetailConfigs.SPY;
  const chartData = asset?.priceHistory ?? config.chartData;
  const chartLabels = config.chartLabels;
  const dailyMetrics = asset?.dailyMetrics;
  const monthlyMetrics = asset?.monthlyMetrics; */
  const last_transaction_date = position.last_transaction_at ? new Date(position.last_transaction_at).toLocaleString("es-CL", {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  }) : "-"
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
  const positionMetricDate = formatDate(positionMetric?.date);
  const personalReturn = getPersonalReturn(positionMetric, position);
  const hasAssetMetrics = Boolean(assetDailyMetric || assetMonthlyMetric);
  const assetDailyMetricDate = formatDate(assetDailyMetric?.date);
  const assetMonthlyMetricDate = formatDate(assetMonthlyMetric?.date);

  return (
    <DashboardShell
      title={`${position.asset.symbol} · ${position.asset.name}`}
      description="Observa los datos y la evolución de este activo específico, junto a sus métricas."
      actions={
        <>
        <Link
          href="/activos"
          className="inline-flex min-h-[44px] items-center justify-center rounded-[18px] border border-border-soft px-[18px] text-[14px] font-semibold text-white transition hover:border-accent/35 hover:text-accent"
        >
          Volver a activos
        </Link>
        </>
      }
    >


      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">      
        <span className={`inline-block rounded-md py-[50px] text-lg text-center w-full font-bold uppercase ${
          isStock ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
          isEtf ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
          "bg-purple-500/10 text-purple-400 border border-purple-500/20"
        }`}>
            {position.asset.kind === "stock" ? "Acción" : position.asset.kind === "etf" ? "ETF (Exchange Traded Fund)" : "Fondo Mutuo"}
        </span>
        <MetricCard label="Costo Promedio" value={currency === "CLP" && position.avg_cost !== null? `CLP${formatMoney(position.avg_cost, currency)}` : `${formatMoney(position.avg_cost, currency)}`} />
        
      </div>

      <div className="mt-7 grid gap-7">
        <SectionCard
          title="Cómo va tu inversión"
          description="Última lectura disponible de las métricas de esta posición dentro de tu portafolio."
        >
          {metricLoading ? (
            <FeedbackCard
              title="Cargando métricas de la posición"
              detail="Estamos consultando el último estado de rendimiento para este activo."
            />
          ) : metricError ? (
            <FeedbackCard
              title="No se pudieron cargar las métricas"
              detail="El detalle del activo sí está disponible, pero las métricas de posición fallaron al consultar el backend."
              tone="error"
            />
          ) : metricUnavailable || !positionMetric ? (
            <FeedbackCard
              title="Sin métricas disponibles"
              detail="Todavía no hay una métrica diaria registrada para esta posición."
            />
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-4">
              <DetailPill
                label="P&L no realizado"
                value={formatSignedMoney(positionMetric.unrealized_pnl, currency || "USD")}
                tone={getMetricTone(positionMetric.unrealized_pnl)}
              />
              <DetailPill
                label="P&L total"
                value={formatSignedMoney(positionMetric.total_pnl, currency || "USD")}
                tone={getMetricTone(positionMetric.total_pnl)}
              />
              <DetailPill
                label="Retorno personal"
                value={formatPercentRatio(personalReturn)}
                tone={getMetricTone(personalReturn)}
              />
              <DetailPill label="Última métrica" value={positionMetricDate} />
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Comportamiento del activo"
          description="Métricas del instrumento en el mercado, separadas del desempeño de tu posición personal."
        >
          {assetMetricsLoading ? (
            <FeedbackCard
              title="Cargando métricas del activo"
              detail="Estamos consultando la información de mercado más reciente para este instrumento."
            />
          ) : assetMetricsError ? (
            <FeedbackCard
              title="No se pudieron cargar las métricas del activo"
              detail="La posición está disponible, pero el bloque de métricas del activo falló al consultar el backend."
              tone="error"
            />
          ) : assetMetricsUnavailable || !hasAssetMetrics ? (
            <FeedbackCard
              title="Métricas del activo no disponibles"
              detail="El backend todavía no está entregando métricas de mercado para este activo."
            />
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-4">
              <DetailPill
                label="Retorno absoluto"
                value={formatPercentRatio(assetDailyMetric?.absolute_return)}
                tone={getMetricTone(assetDailyMetric?.absolute_return)}
              />
              <DetailPill
                label="Volatilidad"
                value={formatPercentRatio(assetDailyMetric?.volatility)}
              />
              <DetailPill
                label="Max drawdown"
                value={formatPercentRatio(assetDailyMetric?.max_drawdown)}
                tone={getMetricTone(assetDailyMetric?.max_drawdown)}
              />
              <DetailPill label="Beta" value={formatNumber(assetMonthlyMetric?.beta, 4)} />
              <DetailPill label="Última métrica diaria" value={assetDailyMetricDate} />
              <DetailPill label="Última métrica mensual" value={assetMonthlyMetricDate} />
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Datos sobre tu inversión"
          description={
            <>
              Información propia de este activo dentro del portafolio: resultado, dividendos, costos y última transacción. <br></br>
              <b>*Nota:</b> Solo se muestra aquella información pertinente, por ejemplo si para un activo no hay dividendos, no se muestran dividendos
            </>
          }
        >
          
          <div className="grid md:grid-cols-2 xl:grid-cols-4">
            {/* <DetailPill label="P&L no realizado" value={position.unrealizedPnl} tone={position.unrealizedPnl.startsWith("-") ? "negative" : "positive"} /> */}
            <DetailPill label={isFund? `Cantidad de Cuotas`: "Cantidad de Acciones"} value={Number(position.quantity).toFixed(4)} />
            <DetailPill label="P&L realizado" value={pnlWithCurrency} tone={isNegative ? "negative" : "positive"}/>
            {Number(position.total_dividends) === 0 ? 
              (<div></div>) :
              (<DetailPill label="Dividendos Totales" value={position.total_dividends ? formatMoney(position.total_dividends, currency) : "-"} />)}
            {Number(position.total_fees) === 0 ? 
              (<div></div>) :
              (<DetailPill label="Comisiones" value={position.total_fees ? formatMoney(position.total_fees, currency) : "-"} />)}
            
          </div>
          <div className=" grid gap-4 md:grid-cols-2">
            <article className="rounded-[22px] border border-border-soft bg-surface/55 p-5">
              <p className="text-[12px] uppercase tracking-[0.14em] text-text-muted">Última actualización</p>
              <p className="mt-2 text-[18px] font-semibold text-white">{last_transaction_date}</p>
            </article>
          </div>
        </SectionCard>

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
