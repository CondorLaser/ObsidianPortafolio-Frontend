"use client";
import { useEffect, useState } from "react";
import { useAppAuth} from "@/src/lib/client-auth";
import { MetricCard } from "@/src/components/metric-card";
import { FeedbackCard } from "../feedback-card";
const toneClasses = {
  accent: "border-accent/20 bg-accent/10 text-accent",
  success: "border-emerald-500/20 bg-emerald-500/10 text-success",
  warning: "border-amber-500/20 bg-amber-500/10 text-warning",
  default: "border-border-soft bg-panel text-white/70"
};
function StatusPill({ children, tone = "default", className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.02em] ${toneClasses[tone] ?? toneClasses.default} ${className}`}
    >
      {children}
    </span>
  );
}
// Formatear dinero según divisa (CLP o USD)
function formatMoney(amount, currency = "USD") {
  if (amount === null || amount === undefined) return "-";
  const numAmount = Number(amount);
  
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: currency === "CLP" ? 0 : 2,
  }).format(numAmount);
}

export function AccountDailyMetrics(account_id) {
  const { getToken } = useAppAuth();
  const [metricsData, setMetricsData] = useState([]);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [hasMetrics, setHasMetrics] = useState(true);
  const [error, setError] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_URL_BE || "";
  
  useEffect(() => {
    async function loadMetrics() {
      try {
        if(metricsData.length === 0) setLoadingMetrics(true);
        setError(false);
        setHasMetrics(true)
        const token = await getToken();
        const res = await fetch(`${baseUrl}/accounts/metrics/${account_id}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if(res.status === 404){
          setHasMetrics(false)
          return
        }
        if (!res.ok) throw new Error("Error al cargar las métricas diarias");
        const data = await res.json();
        setMetricsData(data);
        console.log(data)
      } catch (err) {
        console.error("Fetch Daily Metrics Error:", err);
        setError(true);
      } finally {
        setLoadingMetrics(false);
      }
    }
    loadMetrics();
  }, [baseUrl, account_id]);

  if (loadingMetrics) {
    return (
      <div className="rounded-[28px] mt-6 border border-border-soft p-6 flex flex-col gap-4 ">
        <FeedbackCard title="Cargando métricas diarias de la cuenta..." detail="Obteniendo los datos de las métricas de la cuenta." />
      </div>
    )
  }
  if (error || !metricsData) {
    return (
      <div className="rounded-[28px] mt-6 border border-border-soft p-6 flex flex-col gap-4 ">
        <FeedbackCard
          title="No se pudo cargar las métricas diarias de tu cuenta"
          detail="Por favor, intenta más tarde o revisa tu conexión."
          tone="error"
        />
      </div>
    );
  }
  if (!hasMetrics){
    return (
      <div className="flex mt-6  w-full flex-col items-center justify-center rounded-[22px] border border-dashed border-border-soft bg-panel p-8 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-white">
          Parece que aún no tienes métricas diarias de tu cuenta
        </h3>
        <div>
          <p className="text-left text-text-muted">
            Por favor intenta mañana, durante la noche se calcularán tus métricas diarias
          </p>
        </div>
      </div>
    )
  }
  const { daily, monthly } = metricsData;
  const daily_date = daily.date;
  const daily_pnl = daily.pnl;
  const max_drawdown = daily.max_drawdown;
  const volatility = daily.volatility;
  // ================ AQUÏIII, viendo las métricas nuevas
  // Idea de poder mostrar un bloque daily y otro monthly
  /* const metrics_date = new Date(metricsData.date).toLocaleDateString("es-CL") || "No Disponible"
  const pnl = Number(metricsData.pnl) || 0
  const max_drawdown = Number(metricsData.max_drawdown) || 0
  const volatility = Number(metricsData.volatility) || 0 */
  return (
    <div className="rounded-[28px] border border-border-soft p-6 mt-6 flex flex-col gap-4">
      <div>
        <div className="grid gap-4 xl:grid-cols-[1.35fr_repeat(2,minmax(0,1fr))]">        
            {/*Ganancia/Pérdida del día*/}
            {metricsData.pnl !== undefined && (
              <MetricCard
                label="Ganancia/Pérdida del día (P&L)"
                value={`${formatMoney(pnl, "CLP")} CLP`}
                helper={`Cuánto dinero ganó o perdió tu portafolio durante el día`}
                hero
                helperTone="muted"
                numeric_value={pnl}
              />
            )}

            {/*Max Drawdown*/}
            {metricsData.max_drawdown !== undefined && (
              <MetricCard
                label="Max Drawdown"
                value={`${max_drawdown.toFixed(2)} %`}
                helper={`% de la mayor caída desde un máximo alcanzado en la jornada`}
                helperTone="muted"
                numeric_value={max_drawdown}
              />
            )}

            {/*Retorno no realizado (PNL) por moneda*/}
            {metricsData.volatility !== undefined && (
              <MetricCard
                label="Volatilidad diaria"
                value={volatility.toFixed(2)}
                helper={`Qué tanto fluctuó el valor del portafolio durante el día`}
                helperTone="muted"
                
              />
            )}
        </div>
      </div>
      
      <StatusPill className="w-60" tone={`${metrics_date === "No Disponible" ? "text-text-muted" : "accent"}`}>{`Última actualización: ${metrics_date}`}</StatusPill>
    </div>
  );
}
