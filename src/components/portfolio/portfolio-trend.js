"use client";

import { useEffect, useState, useMemo } from "react";
import { useAppAuth} from "@/src/lib/client-auth";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const toneClasses = {
  accent: "border-accent/20 bg-accent/10 text-accent",
  success: "border-emerald-500/20 bg-emerald-500/10 text-success",
  warning: "border-amber-500/20 bg-amber-500/10 text-warning",
  default: "border-border-soft bg-panel text-white/70"
};

function formatMoney(amount, currency = "USD") {
  if (amount === null || amount === undefined) return "-";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: currency === "CLP" ? 0 : 2,
  }).format(Number(amount));
}

// Calcular rangos de fechas para trends del valor del portafolio
function getTrendDates(range) {
  const to = new Date();
  const from = new Date();
  
  if (range === "3M") from.setMonth(to.getMonth() - 3);
  if (range === "1M") from.setMonth(to.getMonth() - 1);
  if (range === "1Y") from.setFullYear(to.getFullYear() - 1);

  return {
    trend_from: from.toISOString().split("T")[0],
    trend_to: to.toISOString().split("T")[0]
  };
}

function StatusPill({ children, tone = "default", className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.02em] ${toneClasses[tone] ?? toneClasses.default} ${className}`}
    >
      {children}
    </span>
  );
}

function GraphPointDetailTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const dateObj = new Date(data.date + "T00:00:00");
    
    return (
      <div className="rounded-xl border border-border-soft bg-panel p-3 shadow-xl backdrop-blur-md">
        <p className="text-xs font-medium text-text-muted">
          {dateObj.toLocaleDateString("es-CL", {
            day: "numeric",
            month: "long",
            year: "numeric"
          })}
        </p>
        <p className="mt-1 font-mono text-sm font-bold text-accent">
          {formatMoney(data.value, "CLP")}
        </p>
      </div>
    );
  }
  return null;
}

















export function PortfolioTrend() {
  const { getToken } = useAppAuth();

  const [trendData, setTrendData] = useState([]);
  const [trendUSDData, setTrendUSDData] = useState([]);
  const [trendCLPData, setTrendCLPData] = useState([]);
  const [trendRange, setTrendRange] = useState("1M");
  const [loadingTrend, setLoadingTrend] = useState(true); // Carga inicial
  const [isUpdating, setIsUpdating] = useState(false);    // Cargas de rango posteriores
  const [error, setError] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_URL_BE || "";

  useEffect(() => {
    async function loadTrend() {
      try {
        if (trendData.length === 0 && !isUpdating) setLoadingTrend(true);
        setIsUpdating(true);
        setError(false);
        setTrendCLPData([])
        setTrendUSDData([])
        const token = await getToken();

        const { trend_from, trend_to } = getTrendDates(trendRange);
        const res = await fetch(`${baseUrl}/portfolio/trend?trend_from=${trend_from}&trend_to=${trend_to}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Error al cargar la tendencia");
        const data = await res.json();

        // Mapear los valores a números nativos para que Recharts los grafique correctamente
        let parsedData = []
        let parsedUSDData = []
        let parsedCLPData = []

        if (data[0].value !== null) {
          parsedData = data.map(item => ({
            date: item.date,
            value: Number(item.value)
          }));
        } else {
          parsedUSDData = data.map(item => ({
            date: item.date,
            value: Number(item.values_by_currency.USD)
          }));
          
          parsedCLPData = data.map(item => ({
            date: item.date,
            value: Number(item.values_by_currency.CLP)
          }));
          parsedData = data;
        }
        
        setTrendData(parsedData);
        setTrendCLPData(parsedCLPData)
        setTrendUSDData(parsedUSDData)
      } catch (err) {
        console.error("Fetch Trend Error:", err);
        setError(true);
      } finally {
        setLoadingTrend(false);
        setIsUpdating(false);
      }
    }
    loadTrend();
  }, [baseUrl, trendRange]);

  // Formateador dinámico para limpiar y espaciar las fechas del Eje X
  const xAxisTickFormatter = useMemo(() => {
    return (tickItem) => {
      const dateObj = new Date(tickItem + "T00:00:00");
      if (trendRange === "3M") {
        return dateObj.toLocaleDateString("es-CL", { day: "numeric", month: "short" });
      }
      if (trendRange === "1M") {
        return dateObj.toLocaleDateString("es-CL", { day: "numeric", month: "short" });
      }
      if (trendRange === "1Y") {
        return dateObj.toLocaleDateString("es-CL", { month: "short", year: "2-digit" });
      }
      return tickItem;
    };
  }, [trendRange]);

  // Formateador simplificado para los montos del Eje Y (ej: $1.500)
  const yAxisTickFormatterCLP = (value) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0
    }).format(value);
  };

  const yAxisTickFormatterUSD = (value) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loadingTrend) {
    return (
      <div className="flex h-[490px] w-full flex-col items-center justify-center rounded-[28px] border border-border-soft bg-panel-soft p-6 text-center">
        <p className="text-lg font-semibold text-white animate-pulse">Cargando evolución del portafolio...</p>
      </div>
    );
  }


  return (
    <section className="rounded-[28px] border border-border-soft bg-panel-soft p-6 relative">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-white">Evolución del portafolio</h2>
          <div className="mt-3 flex gap-2">
            {["1M", "3M", "1Y"].map((range) => (
              <button
                key={range}
                onClick={() => {
                  setTrendRange(range)
                  setIsUpdating(true);
                }}
                disabled={isUpdating && trendRange === range}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  trendRange === range
                    ? "bg-accent text-white shadow-md shadow-accent/20"
                    : "bg-surface border border-border-soft text-text-muted hover:text-white"
                }`}
              >
                {range === "1M" ? "1 Mes" : range === "3M" ? "3 Meses" : "1 Año"}
              </button>
            ))}
          </div>
        </div>
        {isUpdating && (
          <StatusPill tone="accent" className="animate-pulse">
            Actualizando...
          </StatusPill>
        )}
      </div>

      {/* Contenedor del Gráfico Reactivo (+ caso de error) */}
      <div className={`${trendData[0].value === null ? "h-[680px]": "h-[380px]"} w-full transition-opacity duration-200 ${isUpdating ? "opacity-50" : "opacity-100"}`}>
        {error || trendData.length === 0 ? (
          error ? (
            <div>
              {/* Msg caso error */}
              <div className="flex h-80 w-full flex flex-col items-center justify-center rounded-[28px] border border-red-500/20 bg-red-500/5 p-6 text-center text-red-300">
                <p className="font-semibold text-white">No se pudo cargar la evolución del portafolio</p>
                <p className="mt-2 text-sm text-text-muted">Por favor, intente más tarde o revisa tu conexión.</p>
              </div>
            </div>
          ):(
            <div>
              {/* Msg de caso de datos insuficientes */}
              <div className="flex h-full w-full flex-col items-center justify-center rounded-[22px] border border-dashed border-border-soft bg-surface/20 p-8 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white">
                  No hay datos para este periodo de tiempo
                </h3>
                <p className="mt-2 max-w-sm text-sm text-text-muted leading-[1.6]">
                  Por favor, prueba seleccionando los otros rangos de tiempo o espera a que se actualicen los datos durante la noche.
                </p>
              </div>
            </div>
          )
        ) : (
          trendData[0].value !== null ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent, #3b82f6)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--accent, #3b82f6)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke="#2d374c" 
                />

                <XAxis
                  dataKey="date"
                  tickFormatter={xAxisTickFormatter}
                  stroke="#7d8ea7"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                  interval={trendRange === "3M" ? 4 : trendRange === "1M" ? 1 : 14}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />

                <YAxis
                  stroke="#7d8ea7"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={yAxisTickFormatterCLP}
                  domain={["auto", "auto"]}
                  width={45}
                />

                <Tooltip content={<GraphPointDetailTooltip />} cursor={{ stroke: "#475569", strokeWidth: 1 }} />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--accent, #3b82f6)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>

          ) : (
            <div className="flex flex-col h-full w-full items-center justify-center text-text-muted">
            USD
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendUSDData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent, #3b82f6)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--accent, #3b82f6)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke="#2d394c" 
                />

                <XAxis
                  dataKey="date"
                  tickFormatter={xAxisTickFormatter}
                  stroke="#7d8ea7"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                  interval={trendRange === "3M" ? 4 : trendRange === "1M" ? 1 : 14}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />

                <YAxis
                  stroke="#7d8ea7"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={yAxisTickFormatterUSD}
                  domain={["auto", "auto"]}
                />

                <Tooltip content={<GraphPointDetailTooltip />} cursor={{ stroke: "#475569", strokeWidth: 1 }} />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--accent, #3b82f6)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>

            CLP
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendCLPData}
                margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent, #3b82f6)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--accent, #3b82f6)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke="#2d374c" 
                />

                <XAxis
                  dataKey="date"
                  tickFormatter={xAxisTickFormatter}
                  stroke="#7d8ea7"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                  interval={trendRange === "3M" ? 4 : trendRange === "1M" ? 1 : 14}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />

                <YAxis
                  stroke="#7d8ea7"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={yAxisTickFormatterCLP}
                  domain={["auto", "auto"]}
                  width={45}
                />

                <Tooltip content={<GraphPointDetailTooltip />} cursor={{ stroke: "#475569", strokeWidth: 1 }} />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--accent, #3b82f6)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
            </div>
          )

        )}
      </div>
    </section>
  );
}
