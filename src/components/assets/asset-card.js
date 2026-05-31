import Link from "next/link";

function getReturnTone(value) {
  if (value.startsWith("-")) return "text-danger";
  if (value === "0.00%") return "text-text-muted";
  return "text-success";
}

export function AssetCard({ position }) {
  return (
    <Link
      href={`/activos/${encodeURIComponent(position.symbol)}`}
      className="group flex h-full flex-col rounded-[24px] border border-border-soft bg-surface/65 p-5 transition hover:border-accent/35 hover:bg-panel"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-[760] uppercase tracking-[0.16em] text-accent">En {position.account}</p>
          <h2 className="mt-3 text-[19px] leading-[1.12] font-semibold tracking-[-0.02em] text-white md:text-[21px]">
            {position.symbol}
          </h2>
          <p className="mt-1.5 min-h-[48px] text-[15px] leading-[1.45] text-text-muted">
            {position.name}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-accent-soft px-3 py-1 text-[11px] font-semibold text-accent">
          {position.type}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-[18px] border border-border-soft bg-panel-soft p-4">
          <p className="text-[11px] uppercase tracking-[0.12em] text-text-muted">Valor invertido</p>
          <p className="mt-2 text-[20px] font-semibold tracking-[-0.02em] text-white md:text-[24px]">
            {position.totalValue}
          </p>
        </div>
        <div className="rounded-[18px] border border-border-soft bg-panel-soft p-4">
          <p className="text-[11px] uppercase tracking-[0.12em] text-text-muted">Retorno</p>
          <p className={`mt-2 text-[20px] font-semibold tracking-[-0.02em] md:text-[24px] ${getReturnTone(position.returnPct)}`}>
            {position.returnPct}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-text-muted sm:grid-cols-2">
        <p>
          Cantidad: <span className="font-semibold text-white">{position.quantity}</span>
        </p>
        <p>
          Costo prom.: <span className="font-semibold text-white">{position.avgCost}</span>
        </p>
        <p>
          Dividendos: <span className="font-semibold text-white">{position.totalDividends}</span>
        </p>
        <p>
          Mercado: <span className="font-semibold text-white">{position.market}</span>
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-4 rounded-[18px] border border-border-soft bg-panel-soft px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">Última transacción</p>
          <p className="mt-1 text-xs text-text-muted">{position.lastTransactionAt}</p>
        </div>
        <span className="inline-flex min-h-10 shrink-0 items-center rounded-2xl border border-border-soft px-4 text-sm font-semibold text-white transition group-hover:border-accent/35 group-hover:text-accent">
          Ver detalle
        </span>
      </div>
    </Link>
  );
}
