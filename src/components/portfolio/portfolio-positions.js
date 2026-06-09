"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppAuth} from "@/src/lib/client-auth";


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


function PositionRow({ position, accountName, currency }) {
  const pnl = Number(position.unrealized_pnl);
  const isNegative = pnl < 0;
  const pnlFormatted = position.unrealized_pnl 
    ? `${formatMoney(pnl, currency)}` 
    : "-";
  const pnlWithCurrency = `${isNegative ? "" : "+"}${currency === "CLP" && position.last_price !== null? "CLP" : ""}${pnlFormatted}` 

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
      <td className="whitespace-nowrap px-3 py-5 text-[14px] font-semibold text-white uppercase">{position.asset.kind}</td>
      <td className="whitespace-nowrap px-3 py-5 text-[14px] font-semibold text-white truncate max-w-[120px]" title={"accountName"}>
        {accountName || "No disponible"}
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-right text-[14px] font-semibold text-white">
        {Number(position.quantity).toFixed(4)}
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-right text-[14px] font-semibold text-white">
        {currency === "CLP" && position.last_price !== null? "CLP" : ""}{formatMoney(position.last_price, currency)}
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-right text-[14px] font-semibold text-white">
        {currency === "CLP" && position.last_price !== null? "CLP" : ""}{formatMoney(position.market_value, currency)}
      </td>
      <td
        className={`whitespace-nowrap px-3 py-5 text-right text-[14px] font-bold ${
          isNegative ? "text-danger" : "text-success"
        }`}
      >
        {pnlWithCurrency}
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

export function PortfolioPositions({account_distribution}) {
  const { getToken } = useAppAuth();

  const [positionsData, setPositionsData] = useState([]);
  const [page, setPage] = useState(0);
  const limit = 10;

  const [loadingPositions, setLoadingPositions] = useState(false);
  const [updatingPositions, setUpdatingPositions] = useState(false);
  const [error, setError] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_URL_BE || "";

  // Carga de Posiciones según la paginación
  useEffect(() => {
    async function loadPositions() {
      try {
        if(positionsData.length === 0 && !updatingPositions && page === 0) setLoadingPositions(true);
        setUpdatingPositions(true);
        setError(false);
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
        setError(true);
      } finally {
        setLoadingPositions(false);
        setUpdatingPositions(false);
      }
    }
    loadPositions();
  }, [baseUrl, page, limit]);

  if (loadingPositions) {
    return <FeedbackCard title="Cargando tus activos..." detail="Obteniendo tus posiciones a lo largo del portafolio." />;
  }

  // Mapa rápido para obtener el nombre de la cuenta para la tabla
  const accountMap = account_distribution.reduce((acc, curr) => {
    acc[curr.account_id] = [curr.name, curr.currency];
    return acc;
  }, {});

  return (
    <div>
      <div className="mt-6">
      <section className="rounded-[28px] border border-border-soft bg-panel-soft p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-white">Activos principales</h2>
            <p className="mt-2 mb-2 text-[14px] text-text-muted">
              Revisa tus posiciones en los activos que conforman tu portafolio.
            </p>
          </div>
        </div>
          {error ? (
            <div>
              {/* Msg caso error */}
              <div className="flex h-60 w-full flex flex-col items-center justify-center rounded-[28px] border border-red-500/20 bg-red-500/5 p-6 text-center text-red-300">
                <p className="font-semibold text-white">No se pudo cargar la evolución del portafolio</p>
                <p className="mt-2 text-sm text-text-muted">Por favor, intente más tarde o revisa tu conexión.</p>
              </div>
            </div>
          ) : (
            <div className={`mt-7 overflow-x-auto max-h-[80vh] bg-app shadow-sm`}>
              <table className={`w-full min-w-[980px] border-collapse ${updatingPositions ? "opacity-50" : "opacity-100"}`}>
                <thead className="sticky top-0 z-20 bg-app">
                  <tr className="bg-panel border-b border-border text-[12px] uppercase tracking-[0.1em] text-text-muted shadow-sm">
                    <th className="w-[20%] px-5 pb-4 pt-5 text-center font-semibold">Activo</th>
                    <th className="w-[20%] px-3 pb-4 pt-5 text-center font-semibold">Tipo</th>
                    <th className="w-[44%] px-3 pb-4 pt-5 text-center font-semibold">Cuenta</th>
                    <th className="w-[8%] px-3 pb-4 pt-5 text-center font-semibold">Cantidad</th>
                    <th className="w-[10%] px-3 pb-4 pt-5 text-center font-semibold">Precio Mercado</th>
                    <th className="w-[10%] px-3 pb-4 pt-5 text-center font-semibold">Valor Total</th>
                    <th className="w-[8%] px-3 pb-4 pt-5 text-center font-semibold">PnL No Realizado</th>
                    <th className="w-[10%] px-3 pb-4 pt-5 text-center font-semibold">Acción</th>
                  </tr>
                </thead>
                <tbody className={loadingPositions ? "opacity-50" : ""}>
                  {positionsData.map((position) => (
                    <PositionRow 
                      key={`${position.account_id}-${position.symbol}`} 
                      position={position} 
                      accountName={accountMap[position.account_id][0]}
                      currency={accountMap[position.account_id][1]}
                    />
                  ))}
                </tbody>
              </table>
              
              {/* Controles de Paginación */}
              <div className="p-6 sticky bottom-0 z-30 bg-panel flex items-center justify-between border-t border-border-soft pt-4">
                <span className="text-sm text-text-muted">
                  Página {page + 1}
                </span>
                <div className="flex gap-2">
                  {updatingPositions && (
                    <StatusPill tone="accent" className="animate-pulse">
                      Actualizando...
                    </StatusPill>
                  )}
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
          )}
          </section>
        </div>
      </div>
  );
}
