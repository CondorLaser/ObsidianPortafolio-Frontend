import Link from "next/link";
import { Trash2 } from "lucide-react";

export function AccountCard({ account: accountData, onDelete, deleting = false }) {
  const account = accountData.account || {};
  const n_stock_positions = accountData.stock_positions || 0;
  const n_etf_positions = accountData.etf_positions || 0;
  const n_fund_positions = accountData.fund_positions || 0;
  const total_positions = n_stock_positions + n_etf_positions + n_fund_positions;
  const broker = account.broker || "Fintual";
  const name = account.name.length > 10 ? account.name.slice(0, 10) + "..." : account.name

  return (
    <article
      className="group flex flex-col justify-between rounded-[24px] border border-accent/35 bg-surface/65 p-6 transition hover:border-accent/35 hover:bg-panel"
    >
      {/* Broker de origen, nombre y moneda */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-[760] uppercase tracking-[0.16em] text-text-muted">
            {broker}
          </p>
          <Link
            href={`/cuentas/${account.id}`}
            className="mt-2 block text-[26px] leading-[1.1] font-semibold tracking-[-0.02em] text-white transition-colors hover:text-accent"
          >
            {name}
          </Link>
        </div>
        <span className={`rounded-xl px-3 py-1.5 text-m font-bold tracking-wider text-black shadow-md uppercase ${
          account.currency === "USD" ? "bg-blue-500" : "bg-accent"
        }`}>
          {account.currency}
        </span>
      </div>

      {/* Contadores Posiciones vinculadas según tipo de activo (solo muestra las que hay)*/}
      <div className="mt-5 flex flex-col gap-2">
        <div className="text-xs text-text-muted">
          Posiciones totales:{" "}
          <span className="font-bold text-white text-sm">{total_positions}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {n_stock_positions > 0 && (
            <span className="rounded-lg bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[11px] text-blue-300">
              <span className="font-semibold text-blue-100">{n_stock_positions}</span>{" "}
              {n_stock_positions === 1 ? "Acción" : "Acciones"}
            </span>
          )}

          {n_etf_positions > 0 && (
            <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] text-emerald-300">
              <span className="font-semibold text-emerald-100">{n_etf_positions}</span>{" "}
              {n_etf_positions === 1 ? "ETF" : "ETFs"}
            </span>
          )}

          {n_fund_positions > 0 && (
            <span className="rounded-lg bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[11px] text-purple-300">
              <span className="font-semibold text-purple-100">{n_fund_positions}</span>{" "}
              {n_fund_positions === 1 ? "Fondo Mutuo" : "Fondos Mutuos"}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 rounded-[18px] border border-border-soft bg-panel-soft px-4 py-3">
        <div className="text-xs text-text-muted">
          Registrada el:{" "}
          <span className="font-medium text-white">
            {new Date(account.created_at).toLocaleDateString("es-CL")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDelete?.(account)}
            disabled={deleting}
            title={`Eliminar ${name}`}
            aria-label={`Eliminar cuenta ${name}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/25 text-red-300 transition hover:border-red-400/50 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>

          <Link
            href={`/cuentas/${account.id}`}
            className="inline-flex min-h-9 items-center rounded-xl border border-border-soft px-4 text-xs font-semibold text-white transition hover:border-accent/50 hover:bg-accent hover:text-black"
          >
            Ver cuenta
          </Link>
        </div>
      </div>
    </article>
  );
}
