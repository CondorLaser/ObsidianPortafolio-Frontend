"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { MetricCard } from "@/src/components/metric-card";
import { useAppAuth} from "@/src/lib/client-auth";
import dynamic from "next/dynamic";

const PortfolioTrend = dynamic(
  () => import("./portfolio-trend").then((mod) => mod.PortfolioTrend),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-[490px] w-full flex-col items-center justify-center rounded-[28px] border border-border-soft bg-panel-soft p-6 text-center">
        <p className="text-lg font-semibold text-white animate-pulse">Cargando evolución del portafolio...</p>
      </div>
    )
  }
);

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

function FeedbackCard({ title, detail, tone = "default" }) {
  const toneClass =
    tone === "error"
      ? "border-red-500/20 bg-red-500/5 text-red-300"
      : "border-border-soft bg-panel-soft text-text-muted";

  return (
    <section className={`rounded-[28px] border p-8 text-center ${toneClass}`}>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-[1.6]">{detail}</p>
    </section>
  );
}

function DistributionRow({ item }) {
  const widthPct = `${(Number(item.percentage) * 100).toFixed(1)}%`;
  const isUSD = item.currency === "USD";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[18px] font-semibold text-white">{item.name}</p>
        <div className="flex min-w-[210px] items-center gap-4">
          <div className="h-3 flex-1 rounded-full bg-[#2d374c]">
            <div className="h-full rounded-full bg-accent" style={{ width: widthPct }} />
          </div>
          <span className="text-[18px] font-bold text-white">{widthPct}</span>
        </div>
      </div>
      <div className="rounded-[20px] border border-border-soft bg-surface px-6 py-6">
        <p className="text-sm text-text-muted">{isUSD ? "Acciones y ETFs (USD)" : "Fondos mutuos (CLP)"}</p>
        <p className="mt-3 font-mono text-[18px] font-bold tracking-[-0.02em] text-white">
          {formatMoney(item.amount, item.currency)}
        </p>
      </div>
    </div>
  );
}

function PositionRow({ position }) {
  const pnl = Number(position.unrealized_pnl);
  const isNegative = pnl < 0;
  const pnlFormatted = position.unrealized_pnl 
    ? `${isNegative ? "" : "+"}${formatMoney(pnl, "USD")}` 
    : "-";

  return (
    <tr className="border-t border-border-soft align-middle transition hover:bg-accent/5 first:border-t-0">
      <td className="px-5 py-5 align-middle">
        <Link
          href={`/activos/${encodeURIComponent(position.symbol)}`}
          className="inline-flex max-w-full items-center gap-3 rounded-[14px] outline-offset-4"
        >
          <div className="grid h-[38px] w-[38px] place-items-center rounded-[12px] border border-border-soft bg-surface font-mono text-xs font-extrabold text-white">
            {position.symbol.substring(0, 3)}
          </div>
          <div className="min-w-0 max-w-[260px]">
            <p className="text-[15px] font-semibold leading-[1.2] text-white">{position.symbol}</p>
            <p className="mt-[3px] truncate text-[13px] leading-[1.35] text-text-muted">{position.name}</p>
          </div>
        </Link>
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-[14px] font-semibold text-white">Activo</td>
      <td className="whitespace-nowrap px-3 py-5 text-[14px] font-semibold text-white truncate max-w-[120px]" title={"accountName"}>
        {position.account_id.substring(0, 8)}
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-right text-[14px] font-semibold text-white">
        {Number(position.quantity).toFixed(4)}
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-right text-[14px] font-semibold text-white">
        {formatMoney(position.last_price, "USD")}
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-right text-[14px] font-semibold text-white">
        {formatMoney(position.market_value, "USD")}
      </td>
      <td
        className={`whitespace-nowrap px-3 py-5 text-right text-[14px] font-bold ${
          isNegative ? "text-danger" : "text-success"
        }`}
      >
        {pnlFormatted}
      </td>
      <td className="px-3 py-5 text-right">
        <Link
          href={`/activos/${encodeURIComponent(position.asset_id)}`}
          className="inline-flex min-h-[34px] min-w-[110px] items-center justify-center whitespace-nowrap rounded-full border border-border-soft px-[10px] text-[12px] font-semibold text-white transition hover:border-accent/30 hover:bg-accent/10 hover:text-accent"
        >
          Ver detalle
        </Link>
      </td>
    </tr>
  );
}

export function PortfolioContent() {
  const { getToken } = useAppAuth();

  const [summaryData, setSummaryData] = useState(null);
  const [positionsData, setPositionsData] = useState([]);
  const [page, setPage] = useState(0);
  const limit = 10;

  const [loading, setLoading] = useState(true);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [error, setError] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_URL_BE || "";

  // Carga inicial del summary
  useEffect(() => {
    async function loadSummary() {
      try {
        setLoading(true);
        setError(false);
        const token = await getToken();

        const res = await fetch(`${baseUrl}/portfolio/summary`, {
          method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
        }})
        if (!res.ok) throw new Error("Error al cargar el summary");
        const data = await res.json();
        setSummaryData(data);
      } catch (err) {
        console.error("Fetch Summary Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, [baseUrl]);

  // Carga de Posiciones según la paginación
  useEffect(() => {
    async function loadPositions() {
      try {
        setLoadingPositions(true);
        const token = await getToken();
        const skip = page * limit;
        const res = await fetch(`${baseUrl}/positions?skip=${skip}&limit=${limit}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Error al cargar las posiciones");
        const data = await res.json();
        setPositionsData(data);
      } catch (err) {
        console.error("Fetch Positions Error:", err);
      } finally {
        setLoadingPositions(false);
      }
    }
    loadPositions();
  }, [baseUrl, page, limit]);

  if (loading) {
    return <FeedbackCard title="Cargando portafolio..." detail="Obteniendo el resumen de tu cuenta." />;
  }

  if (error || !summaryData) {
    return (
      <FeedbackCard
        title="No se pudo cargar el portafolio"
        detail="Por favor, revisa la conexión con el backend."
        tone="error"
      />
    );
  }

  const { summary, account_distribution } = summaryData;

  // Mapa rápido para obtener el nombre de la cuenta para la tabla
  const accountMap = account_distribution.reduce((acc, curr) => {
    acc[curr.account_id] = curr.name;
    return acc;
  }, {});

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-[1.35fr_repeat(3,minmax(0,1fr))]">
        <MetricCard
          label="Valor total del portafolio"
          value={formatMoney(summary.total_value, "USD")}
          helper={`Datos actualizados: ${summary.last_snapshot_date}`}
          helperTone="pill"
          hero
        />
        <MetricCard
          label="Retorno no realizado"
          value={formatMoney(summary.unrealized_pnl, "USD")}
          helper={`${Number(summary.total_return_pct).toFixed(2)}%`}
          helperTone="pill"
        />
        <MetricCard
          label="Posiciones activas"
          value={summary.active_positions}
          helper="Activos en portafolio"
          helperTone="muted"
        />
        <MetricCard
          label="Cuentas vinculadas"
          value={summary.linked_accounts}
          helper="Operativas"
          helperTone="muted"
        />
      </div>

      <div className="mt-6 flex flex-col gap-6">
        <PortfolioTrend></PortfolioTrend>

        <section className="rounded-[28px] border border-border-soft bg-panel-soft p-6">
          <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-white">Distribución por cuenta</h2>
          <p className="mt-2 text-[14px] text-text-muted">Desglose de capital total distribuido.</p>

          <div className="mt-10 space-y-5">
            {account_distribution.map((item) => (
              <DistributionRow key={item.account_id} item={item} />
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6">
        <section className="rounded-[28px] border border-border-soft bg-panel-soft p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-white">Activos principales</h2>
              <p className="mt-2 text-[14px] text-text-muted">
                Tus posiciones activas.
              </p>
            </div>
          </div>

          <div className="mt-7 overflow-x-auto">
            <table className="w-full min-w-[980px] border-separate border-spacing-0 text-left">
              <thead>
                <tr className="text-[12px] uppercase tracking-[0.1em] text-text-muted">
                  <th className="w-[30%] px-5 pb-4 font-semibold">Activo</th>
                  <th className="w-[10%] px-3 pb-4 font-semibold">Tipo</th>
                  <th className="w-[14%] px-3 pb-4 font-semibold">Cuenta</th>
                  <th className="w-[8%] px-3 pb-4 text-right font-semibold">Cantidad</th>
                  <th className="w-[10%] px-3 pb-4 text-right font-semibold">Precio Mercado</th>
                  <th className="w-[10%] px-3 pb-4 text-right font-semibold">Valor Total</th>
                  <th className="w-[8%] px-3 pb-4 text-right font-semibold">PnL No Realizado</th>
                  <th className="w-[10%] px-3 pb-4 text-right font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody className={loadingPositions ? "opacity-50" : ""}>
                {positionsData.map((position) => (
                  <PositionRow 
                    key={`${position.account_id}-${position.symbol}`} 
                    position={position} 
                    accountName={accountMap[position.account_id]}
                  />
                ))}
              </tbody>
            </table>
            
            {/* Controles de Paginación */}
            <div className="mt-6 flex items-center justify-between border-t border-border-soft pt-4">
              <span className="text-sm text-text-muted">
                Página {page + 1}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0 || loadingPositions}
                  className="rounded-lg border border-border-soft bg-surface px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:bg-accent/10 transition-colors"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={positionsData.length < limit || loadingPositions}
                  className="rounded-lg border border-border-soft bg-surface px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:bg-accent/10 transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
