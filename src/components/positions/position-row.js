import Link from "next/link";
function formatMoney(amount, currency = "USD") {
  if (amount === null || amount === undefined) return "-";
  const numAmount = Number(amount);
  
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: currency === "CLP" ? 0 : 2,
  }).format(numAmount);
}

export function PositionRow({ position, accountName}) {
  const pnl = Number(position.unrealized_pnl);
  const isNegative = pnl < 0;
  const currency = position.asset.currency
  const pnlFormatted = position.unrealized_pnl 
    ? `${formatMoney(pnl, currency)}` 
    : "-";
  const pnlWithCurrency = `${isNegative ? "" : "+"}${currency === "CLP" && position.last_price !== null? "CLP" : ""}${pnlFormatted}` 
  const isStock = position.asset.kind === "stock";
  const isEtf = position.asset.kind === "etf";
  const position_name = position.name || ""
  const actual_account_name = accountName || "No disponible" 

  return (
    <tr className="border-t border-border-soft align-middle transition hover:bg-accent/5 first:border-t-0">
      <td className="px-5 py-5 align-middle">
        <Link
          href={`/activos/${encodeURIComponent(position.symbol)}`}
          className="inline-flex max-w-full items-center gap-3 rounded-[14px] outline-offset-4"
        >
          <div className="grid h-[38px] w-[38px] place-items-center rounded-[12px] border border-border-soft bg-surface font-mono text-xs font-extrabold text-white">
            {position.asset.symbol.substring(0, 3)}
          </div>
          <div className="min-w-0 max-w-[260px]">
            <p className="text-[15px] font-semibold leading-[1.2] text-white">{position.asset.symbol}</p>
            <p className="mt-[3px] truncate text-[13px] leading-[1.35] text-text-muted">
              {(position_name.length > 15) ? position_name.slice(0, 15) + "..." : position_name}
            </p>
          </div>
        </Link>
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-[14px] font-semibold text-white uppercase">
        <span className={`inline-block rounded-md px-2 py-0.5 uppercase ${
          isStock ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
          isEtf ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
          "bg-purple-500/10 text-purple-400 border border-purple-500/20"
        }`}>
          {position.asset.kind === "stock" ? "Acción" : position.asset.kind === "etf" ? "ETF" : "Fondo"}
        </span>
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-[14px] font-semibold text-white truncate max-w-[120px]" >
        {(actual_account_name.length > 15) ? actual_account_name.slice(0, 15) + "..." : actual_account_name || "No disponible"}
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-right text-[14px] font-semibold text-white">
        {Number(position.quantity).toFixed(4)}
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-right text-[14px] font-semibold text-warning">
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