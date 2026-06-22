"use client";

import { useEffect, useState } from "react";

import { MetricCard } from "@/src/components/metric-card";
import { SectionCard } from "@/src/components/section-card";
import { FeedbackCard } from "../feedback-card";
import { useAppAuth} from "@/src/lib/client-auth";

function DetailPill({ label, value, tone = "default" }) {
  return (
    <div className={`rounded-[22px] border gap-3 flex flex-row justify-between border-border-soft ${tone === "default" ? "bg-panel" : "bg-success/10"} p-5 mr-3 mb-4 w-auto`}>
      <p className="text-[12px] uppercase text-text-muted">{label}</p>
      <p className={` text-[22px] font-semibold `}>{value}</p>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "No disponible";

  return new Date(`${value}T00:00:00`).toLocaleDateString("es-CL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}

export function AssetDailyMetric({ asset_id }) {
  const { getToken } = useAppAuth();
  const [assetDailyMetric, setAssetDailyMetric] = useState(null);
  const [assetMonthlyMetric, setAssetMonthlyMetric] = useState(null);
  const [assetMetricsLoading, setAssetMetricsLoading] = useState(false);
  const [assetMetricsError, setAssetMetricsError] = useState(false);
  const [assetMetricsUnavailable, setAssetMetricsUnavailable] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_URL_BE || "";

  // Obtener metricas daily + monthly
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
        // console.error("Fetch Asset Metrics Error:", fetchError);
        setAssetDailyMetric(null);
        setAssetMonthlyMetric(null);
        setAssetMetricsError(true);
      } finally {
        setAssetMetricsLoading(false);
      }
    }

    loadAssetMetrics();
  }, [asset_id, baseUrl, getToken])

  if (assetMetricsLoading) {
    return (
      <FeedbackCard
        title="Cargando métricas del activo"
        detail="Por favor espera, estamos obteniendo las métricas de este activo."
      />
    );
  }
  
  if (assetMetricsError) {
    return (
      <FeedbackCard
        title="No se pudieron cargar las métricas del activo"
        detail="Por favor, intenta más tarde o revisa tu conexión."
        tone="error"
      />
    );
  }
  const hasAssetMetrics = Boolean(assetDailyMetric || assetMonthlyMetric);
  if (assetMetricsUnavailable || !hasAssetMetrics){
    return (
      <FeedbackCard
        title="Métricas del activo no disponibles"
        detail="Aún no se cuentan con métricas para este activo, estas se calcularán más adelante, por favor vuelve en otro momento."
      />
    )
  }

  
  const assetDailyMetricDate = formatDate(assetDailyMetric?.date);
  const assetMonthlyMetricDate = formatDate(assetMonthlyMetric?.date);
  const absolute_return = assetDailyMetric.absolute_return !== undefined ? Number(assetDailyMetric.absolute_return) : 0
  const volatility = assetDailyMetric.volatility !== undefined ? Number(assetDailyMetric.volatility ) : 0
  const max_drawdown = assetDailyMetric.max_drawdown !== undefined ? Number(assetDailyMetric.max_drawdown) : 0
  const beta = assetMonthlyMetric.beta !== undefined ? Number(assetMonthlyMetric.beta) : 0
  return (
      <div className="">
        {/* Métricas de Asset (Daily + Monthly)*/}
        <SectionCard
          title="Métricas del activo"
          description="Miden el comportamiento del activo en el mercado, miden el activo independiente de tu inversión personal."
        >
            <div className="grid gap-4 xl:grid-cols-[1.35fr_repeat(3,minmax(0,1fr))]">
              {/* Absolute_return */}
              {assetDailyMetric.absolute_return !== undefined && (
                <MetricCard
                  label="Retorno Absoluto"
                  value={`${absolute_return.toFixed(2)} %`}
                  helper={`Rentabilidad acumulada histórica del activo`}
                  helperTone="muted"
                />
              )}
              {/* Volatility */}
              {assetDailyMetric.volatility !== undefined && (
                <MetricCard
                  label="Volatilidad"
                  value={`${volatility.toFixed(2)*100} %`}
                  helper={`Qué tanto fluctuó el valor del activo en el día`}
                  helperTone="muted"
                />
              )}
              {/* Max Drawdown */}
              {assetDailyMetric.max_drawdown !== undefined && (
                <MetricCard
                  label="Volatilidad"
                  value={`${max_drawdown.toFixed(2)} %`}
                  helper={`% de la mayor caída desde un máximo histórico`}
                  helperTone="muted"
                />
              )}
              {assetMonthlyMetric.beta !== undefined && (
                <MetricCard
                  label="Beta (mensual)"
                  value={`${beta.toFixed(2)}`}
                  helper={`Comportamiento del activo v/s índica de referencia (mide su correlación)`}
                  helperTone="muted"
                />
              )}
            </div>
            <div className="flex flex-row mt-3">
              <DetailPill label="Última métrica diaria" tone="positive" value={assetDailyMetricDate} />
              <DetailPill label="Última métrica mensual" tone="positive" value={assetMonthlyMetricDate} />
            </div>
        </SectionCard>
      </div>
  );
}
