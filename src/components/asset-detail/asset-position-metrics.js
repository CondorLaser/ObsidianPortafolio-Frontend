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


function formatDate(value) {
  if (!value) return "-";

  return new Date(`${value}T00:00:00`).toLocaleDateString("es-CL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}


export function AssetPositionMetrics({ position_id, currency }) {
  const { getToken } = useAppAuth();
  const [positionMetric, setPositionMetric] = useState(null);
  const [metricLoading, setMetricLoading] = useState(false);
  const [metricError, setMetricError] = useState(false);
  const [metricUnavailable, setMetricUnavailable] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_URL_BE || "";

  // Obtener Position Metric
  useEffect(() => {
    if (!position_id) {
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
          `${baseUrl}/positions/metrics/daily/${encodeURIComponent(position_id)}`,
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
        setPositionMetric(data);
        setMetricUnavailable(!data);
      } catch (fetchError) {
        // console.error("Fetch Position Metric Error:", fetchError);
        setPositionMetric(null);
        setMetricError(true);
      } finally {
        setMetricLoading(false);
      }
    }
    loadPositionMetric();
  }, [position_id, baseUrl, getToken]);

  if (metricLoading) {
    return (
      <FeedbackCard
        title="Cargando métricas de la posición"
        detail="Por favor espera, estamos obteniendo las métricas de este activo"
      />
    );
  }
  if (metricError) {
    return (
      <FeedbackCard
        title="No se pudieron cargar las métricas de tu posición"
        detail="Por favor, intenta más tarde o revisa tu conexión."
        tone="error"
      />
    );
  }
  if(metricUnavailable || !positionMetric){
    <FeedbackCard
      title="Métricas de position no disponibles"
      detail="Aún no se cuentan con métricas para tu position sobre este activo, estas se calcularán más adelante, por favor vuelve en otro momento."
    />
  }

  if(positionMetric !== null){
      const positionMetricDate = formatDate(positionMetric?.date);
    const unrealized_pnl = positionMetric.unrealized_pnl !== undefined ? Number(positionMetric.unrealized_pnl) : 0
    const total_pnl = positionMetric.total_pnl !== undefined ? Number(positionMetric.total_pnl) : 0

    return (
      <div>      
        <div className="mt-7 grid gap-7">
          {/* Métricas de Position (daily) */}
          <SectionCard
            title="Metricas de tu inversión"
            description="Miden el comportamiento de tu posición sobre este activo dentro de tu portafolio."
          >
            <div className="grid gap-4 xl:grid-cols-[0.35fr_repeat(3,minmax(0,1fr))]">
              {/* PnL no realizado */}
              {positionMetric.unrealized_pnl !== undefined && (
                <MetricCard
                  label="P&L no realizado"
                  value={`${formatSignedMoney(unrealized_pnl, currency || "USD")}`}
                  helper={`Ganancia o pérdida no realizada`}
                  helperTone="muted"
                  numeric_value={unrealized_pnl}
                />
              )}
              {/* PnL total */}
              {positionMetric.total_pnl !== undefined && (
                <MetricCard
                  label="P&L total"
                  value={`${formatSignedMoney(total_pnl, currency || "USD")}`}
                  helper={`Ganancia o pérdida total de la posición en el día`}
                  helperTone="muted"
                  numeric_value={total_pnl}
                />
              )}
              <DetailPill label="Última métrica diaria" tone="positive" value={positionMetricDate} />
              
            </div>
          </SectionCard>
        </div>
      </div>
    );
  }
  
}
