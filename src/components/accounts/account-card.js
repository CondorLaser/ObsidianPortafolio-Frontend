import Link from "next/link";

export function AccountCard({ account }) {
  const {
    total_positions = 10,
    stock_count = 4,
    etf_count = 2,
    fund_count = 1
  } = account;
  return (
    <Link
      href={`/cuentas/${account.id}`}
      className="group flex flex-col justify-between rounded-[24px] border border-accent/35 bg-surface/65 p-6 transition hover:border-accent/35 hover:bg-panel"
    >
      {/* Broker de origen, nombre y moneda */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-[760] uppercase tracking-[0.16em] text-text-muted">
            {account.broker}
          </p>
          <h2 className="mt-2 text-[26px] leading-[1.1] font-semibold tracking-[-0.02em] text-white transition-colors group-hover:text-accent">
            {account.name}
          </h2>
        </div>
        <span className="rounded-xl bg-accent px-3 py-1.5 text-xs font-extrabold tracking-wider text-black shadow-md uppercase">
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
          {stock_count > 0 && (
            <span className="rounded-lg bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[11px] text-blue-300">
              <span className="font-semibold text-blue-100">{stock_count}</span>{" "}
              {stock_count === 1 ? "Acción" : "Acciones"}
            </span>
          )}

          {etf_count > 0 && (
            <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] text-emerald-300">
              <span className="font-semibold text-emerald-100">{etf_count}</span>{" "}
              {etf_count === 1 ? "ETF" : "ETFs"}
            </span>
          )}

          {fund_count > 0 && (
            <span className="rounded-lg bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[11px] text-purple-300">
              <span className="font-semibold text-purple-100">{fund_count}</span>{" "}
              {fund_count === 1 ? "Fondo Mutuo" : "Fondos Mutuos"}
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
        <span className="inline-flex min-h-9 items-center rounded-xl border border-border-soft px-4 text-xs font-semibold text-white transition group-hover:border-accent/50 group-hover:bg-accent group-hover:text-black">
          Ver cuenta
        </span>
      </div>
    </Link>
  );
}