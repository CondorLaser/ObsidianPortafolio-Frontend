"use client";
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


export function PortfolioSummary({summaryData, loading, error}) {
  if (loading) {
    return (
      <div className="rounded-[28px] border border-border-soft p-6 flex flex-col gap-4 ">
        <FeedbackCard title="Cargando resumen del portafolio..." detail="Obteniendo los datos de tu portafolio." />;
      </div>
    )
  }

  if (error || !summaryData) {
    return (
      <div className="rounded-[28px] border border-border-soft p-6 flex flex-col gap-4 ">
        <FeedbackCard
          title="No se pudo cargar el resumen de tu portafolio"
          detail="Por favor, intenta más tarde o revisa tu conexión."
          tone="error"
        />
      </div>
      
    );
  }
  const { summary, account_distribution } = summaryData;
  return (
    <div className="rounded-[28px] border border-border-soft p-6 flex flex-col gap-4 ">
      {false ? (
        <div>
{/*           <FeedbackCard
            title="No se pudo cargar el portafolio"
            detail="Por favor, revisa la conexión con el backend."
            tone="error"
          /> */}
        </div>
      ) : (
          <div>
          <div className="grid gap-4 xl:grid-cols-[1.35fr_repeat(2,minmax(0,1fr))]">        
            <div className="flex flex-col gap-4">
              {/*Valores totales por moneda*/}
              {summary.total_value_by_currency.USD !== undefined && (
                <MetricCard
                  label="Valor total USD"
                  value={formatMoney(summary.total_value_by_currency.USD, "USD")}
                  helper={`Solo inversiones en USD`}
                  hero
                />
              )}
              {summary.total_value_by_currency.CLP !== undefined && (
                <MetricCard
                  label="Valor total CLP"
                  value={`CLP${formatMoney(summary.total_value_by_currency.CLP, "CLP")}`}
                  helper={`Solo inversiones en CLP`}
                  hero
                />
              )}
            </div>
            <div className="flex flex-col gap-4">
              {/*Montos Invertidos por moneda*/}
              {summary.total_invested_by_currency.USD !== undefined && (
                <MetricCard
                  label="Monto invertido (USD)"
                  value={formatMoney(summary.total_invested_by_currency.USD, "USD")}
                  helper={`A lo largo de todas tus cuentas USD`}
                  helperTone="muted"
                  hero
                />
              )}
              {summary.total_invested_by_currency.CLP !== undefined && (
                <MetricCard
                  label="Monto invertido (CLP)"
                  value={`CLP${formatMoney(summary.total_invested_by_currency.CLP, "CLP")}`}
                  helper={`A lo largo de todas tus cuentas CLP`}
                  helperTone="muted"
                  hero
                />
              )}
            </div>
            <div className="flex flex-col gap-4">
              {/*Retorno no realizado (PNL) por moneda*/}
              {summary.unrealized_pnl_by_currency.USD !== undefined && (
                <MetricCard
                  label="Retorno no realizado USD"
                  value={formatMoney(summary.unrealized_pnl_by_currency.USD, "USD")}
                  helper={`Solo inversiones en USD`}
                  helperTone="muted"
                  hero
                />
              )}
              {summary.unrealized_pnl_by_currency.CLP !== undefined && (
                <MetricCard
                  label="Retorno no realizado CLP"
                  value={`CLP${formatMoney(summary.unrealized_pnl_by_currency.CLP, "CLP")}`}
                  helper={`Solo inversiones en CLP`}
                  helperTone="muted"
                  hero
                />
              )}
            </div>
            
            <MetricCard
              label="N° de Cuentas"
              value={summary.linked_accounts}
              helper="Que conforman tu portafolio"
              helperTone="muted"
            />

            <MetricCard
              label="N° de Posiciones"
              value={summary.active_positions}
              helper="Sobre activos en tu portafolio a lo largo de las cuentas"
              helperTone="muted"
            />
          </div>
        </div>
      )}
      
      
      <StatusPill className="w-60" tone="accent">{`Última actualización: ${summary.last_snapshot_date}`}</StatusPill>
    </div>
  );
}
