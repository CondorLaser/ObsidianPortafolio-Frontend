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
      className={`inline-flex items-center mt-4 rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.02em] ${toneClasses[tone] ?? toneClasses.default} ${className}`}
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

export function AccountMetrics(account) {
  const account_id = account.account_id
  const currency = account.currency
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
        if(data.monthly === null && data.daily === null) setHasMetrics(false)
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
        <div className="m-3">
          <li className="text-left text-text-muted ">
            Por favor revisa que tengas activos asociados a esta cuenta (haber subido datos de los Certificados a la cuenta)
          </li>
          <li className="text-left text-text-muted">
            Si ya subiste datos, por favor intenta mañana, durante la noche se calcularán tus métricas diarias
          </li>
        </div>
      </div>
    )
  }
  const { daily, monthly } = metricsData;
  if(daily !== undefined && monthly !== undefined ){
    const daily_date = daily !== null && daily.date !== undefined ? new Date(daily.date).toLocaleDateString("es-CL"): "No Disponible"
    const daily_pnl = daily !== null &&  daily.pnl !== undefined ? Number(daily.pnl) : 0;
    const daily_max_drawdown = daily !== null && daily.max_drawdown !== undefined ? Math.abs(Number(daily.max_drawdown)) : 0;
    const daily_volatility = daily !== null && daily.volatility !== undefined ? Number(daily.volatility) : 0;

    const monthly_date = monthly !== null && monthly.date !== undefined ? new Date(monthly.date).toLocaleDateString("es-CL"): "No Disponible"
    const monthly_twr = monthly !== null && monthly.twr !== undefined ? Number(monthly.twr) : 0;
    const monthly_dietz = monthly !== null && monthly.dietz !== undefined ? Number(monthly.dietz) : 0;
    const monthly_sharpe_ratio = monthly !== null && monthly.sharpe_ratio !== undefined ? Number(monthly.sharpe_ratio) : 0;
    const monthly_var = monthly !== null && monthly.var !== undefined ? Number(monthly.var) : 0;
    const monthly_sortino = monthly !== null && monthly.sortino !== undefined ? Number(monthly.sortino) : 0;
    const monthly_correlation = monthly !== null && monthly.assets_correlation !== undefined ? Number(monthly.assets_correlation) : 0;

    return (
      <div className="rounded-[28px] border border-border-soft p-6 mt-6 flex flex-col gap-4">
        {daily !== null && (
          <div>
            
            <div className="grid gap-4 xl:grid-cols-2">   
              <div className={`min-h-[132px] rounded-[20px] border border-border-soft p-[18px] text-panel bg-text-muted flex items-center justify-center`} >
                <p className={`mt-3 font-semibold tracking-[-0.02em font-mono text-[28px] leading-[1.1]`}>Daily Metrics</p>
              </div>     
                {/*Ganancia/Pérdida del día*/}
                {daily.pnl !== undefined && (
                  <MetricCard
                    label="Ganancia/Pérdida (P&L)"
                    value={currency === "USD" ? `${formatMoney(daily_pnl, "USD")}` : `${formatMoney(daily_pnl, "CLP")} CLP`}
                    helper={`Cuánto dinero ganó o perdió tu cuenta durante el día`}
                    hero
                    helperTone="muted"
                    numeric_value={daily_pnl}
                  />
                )}

                {/*Max Drawdown*/}
                {daily.max_drawdown !== undefined && (
                  <MetricCard
                    label="Max Drawdown"
                    value={`${daily_max_drawdown.toFixed(2)} %`}
                    helper={`% de la mayor caída desde un máximo alcanzado en la jornada`}
                    helperTone="muted"
                  />
                )}

                {/*Retorno no realizado (PNL) por moneda*/}
                {daily.volatility !== undefined && (
                  <MetricCard
                    label="Volatilidad diaria"
                    value={daily_volatility.toFixed(2)}
                    helper={`Qué tanto fluctuó el valor de tu cuenta durante el día`}
                    helperTone="muted"
                    
                  />
                )}
            </div>
            <StatusPill className="w-60" tone={`${daily_date === "No Disponible" ? "text-text-muted" : "accent"}`}>{`Última actualización: ${daily_date}`}</StatusPill>
          </div>
        )}
        
        {monthly !== null && (
          <div>
            <div className="grid gap-4 xl:grid-cols-3">        
              <div className={`min-h-[132px] rounded-[20px] border border-border-soft p-[18px] text-panel bg-text-muted flex items-center justify-center`} >
                <p className={`mt-3 font-semibold tracking-[-0.02em font-mono text-[28px] leading-[1.1]`}>Monthly Metrics</p>
              </div>
                {/*TWR*/}
                {monthly.twr !== undefined && (
                  <MetricCard
                    label="TWR (Time-Weighted Return)"
                    value={`${monthly_twr.toFixed(2)} %`}
                    helper={`% rentabilidad pura (independiente de depósitos y retiros)`}
                    helperTone="muted"
                  />
                )}

                {/*Dietz*/}
                {monthly.dietz !== undefined && (
                  <MetricCard
                    label="Dietz (Rentabilidad ajustada por flujos)"
                    value={`${monthly_dietz.toFixed(2)} %`}
                    helper={`% de rentabilidad considerando depósitos y retiros`}
                    helperTone="muted"
                    numeric_value={monthly_dietz}
                  />
                )}

                {/*Sharpe Ratio*/}
                {monthly.sharpe_ratio !== undefined && (
                  <MetricCard
                    label="Sharpe Ratio (Rentabilidad ajustada al riesgo)"
                    value={monthly_sharpe_ratio.toFixed(2)}
                    helper={`Mide cuánta rentabilidad se obtiene por unidad de riesgo asumido`}
                    helperTone="muted"
                  />
                )}

                {/*VAR*/}
                {monthly.var !== undefined && (
                  <MetricCard
                    label="VaR (Riesgo potencial)"
                    value={`${monthly_var.toFixed(2)} %`}
                    helper={`Pérdida potencial estimada`}
                    helperTone="muted"
                  />
                )}
                {/*Sortino*/}
                {monthly.sortino !== undefined && (
                  <MetricCard
                    label="Sortino"
                    value={`${monthly_sortino.toFixed(2)}`}
                    helper={`Mide la rentabilidad obtenida solo considerando el riesgo de pérdidas`}
                    helperTone="muted"
                  />
                )}

                {/*Assets Correlation*/}
                {monthly.correlation !== undefined && (
                  <MetricCard
                    label="Correlation (Diversificación)"
                    value={`${monthly_correlation.toFixed(2)}`}
                    helper={`Mide qué tan similares se mueven los activos entre sí. Valores más bajos significa mayor diversificación`}
                    helperTone="muted"
                  />
                )}
            </div>
            <StatusPill className="w-60" tone={`${monthly_date === "No Disponible" ? "text-text-muted" : "accent"}`}>{`Última actualización: ${monthly_date}`}</StatusPill>
          </div>
        )}
       
        
        
      </div>
    );
  }
  
}
