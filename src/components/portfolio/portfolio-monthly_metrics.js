
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

export function PortfolioMonthlyMetrics() {
  const { getToken } = useAppAuth();
  const [metricsData, setMetricsData] = useState([]);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [hasMetrics, setHasMetrics] = useState(true);
  const [error, setError] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_URL_BE || "";
  // Carga de Posiciones según la paginación
  useEffect(() => {
    async function loadMetrics() {
      try {
        if(metricsData.length === 0) setLoadingMetrics(true);
        setError(false);
        setHasMetrics(true)
        const token = await getToken();
        const res = await fetch(`${baseUrl}/portfolio/metrics/monthly`,{
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
      } catch (err) {
        // console.error("Fetch Daily Metrics Error:", err);
        setError(true);
      } finally {
        setLoadingMetrics(false);
      }
    }
    loadMetrics();
  }, [baseUrl]);

  if (loadingMetrics) {
    return (
      <div className="rounded-[28px] mt-6 border border-border-soft p-6 flex flex-col gap-4 ">
        <FeedbackCard title="Cargando métricas mensuales del portafolio..." detail="Obteniendo los datos de las métricas de tu portafolio." />
      </div>
    )
  }
  if (error || !metricsData) {
    return (
      <div className="rounded-[28px] mt-6 border border-border-soft p-6 flex flex-col gap-4 ">
        <FeedbackCard
          title="No se pudo cargar las métricas mensuales de tu portafolio"
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
          Parece que aún no tienes métricas mensuales de tu portafolio
        </h3>
        <div>
          <p className="text-left text-text-muted">
            Por favor intenta mañana, durante la noche se calcularán tus métricas mensuales
          </p>
        </div>
      </div>
    )
  }
  if(metricsData.length !== 0){
    const metrics_date = new Date(metricsData.date).toLocaleDateString("es-CL") || "No Disponible"
    const twr_CLP = (metricsData.twr.CLP !== undefined) ? Number(metricsData.twr.CLP) *100 : 0
    const twr_USD = (metricsData.twr.USD !== undefined) ? Number(metricsData.twr.USD) *100 : 0
    const metric_var_CLP = (metricsData.var.CLP !== undefined) ? Number(metricsData.var.CLP) *100 : 0
    const metric_var_USD = (metricsData.var.USD !== undefined) ? Number(metricsData.var.USD) *100 : 0
    return (
      <div className="rounded-[28px] border border-border-soft p-6 mt-6 flex flex-col gap-4">
        <div className="flex flex-col items-center justify-center gap-4">
          
          <div className="grid gap-4 xl:grid-cols-[1.35fr_repeat(2,minmax(0,1fr))]">  
              {metricsData.twr.CLP !== undefined ? 
                <div className={`min-h-[132px] rounded-[20px] border border-border-soft p-[18px] bg-accent flex items-center justify-center`} >
                  <p className={`mt-3 font-semibold tracking-[-0.02em font-mono text-[28px] leading-[1.1]`}>CLP</p>
                </div>
              : <p></p>}      
              
              {/*TWR*/}
              {metricsData.twr.CLP!== undefined && (
                <MetricCard
                  label="Rentabilidad Mensual (TWR)"
                  value={`${twr_CLP.toFixed(2)} %`}
                  helper={`Rendiemiento mensual del portafolio`}
                  helperTone="muted"
                />
              )}

              {/*VAR*/}
              {metricsData.var.CLP !== undefined && (
                <MetricCard
                  label="Riesgo estimado (VaR)"
                  value={`${metric_var_CLP.toFixed(2)} %`}
                  helper={`Pérdida máxima esperada mensualmente`}
                  helperTone="muted"
                />
              )}
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.35fr_repeat(2,minmax(0,1fr))]">        
              {metricsData.twr.USD !== undefined ? 
                <div className={`min-h-[132px] rounded-[20px] border border-border-soft p-[18px] bg-blue-500 flex items-center justify-center`} >
                  <p className={`mt-3 font-semibold tracking-[-0.02em font-mono text-[28px] leading-[1.1]`}>USD</p>
                </div>
              : <p></p>} 
              {/*TWR*/}
              {metricsData.twr.USD!== undefined && (
                <MetricCard
                  label="Rentabilidad Mensual (TWR)"
                  value={`${twr_USD.toFixed(2)} %`}
                  helper={`Rendiemiento mensual del portafolio`}
                  helperTone="muted"
                />
              )}

              {/*VAR*/}
              {metricsData.var.USD !== undefined && (
                <MetricCard
                  label="Riesgo estimado (VaR)"
                  value={`${metric_var_USD.toFixed(2)} %`}
                  helper={`Pérdida máxima esperada mensualmente`}
                  helperTone="muted"
                />
              )}
          </div>
  
        </div>
        
        <StatusPill className="w-60" tone={`${metrics_date === "No Disponible" ? "text-text-muted" : "accent"}`}>{`Última actualización: ${metrics_date}`}</StatusPill>
      </div>
    );
  }

}
