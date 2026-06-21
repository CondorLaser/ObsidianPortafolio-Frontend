"use-client"
import {useRouter} from "next/navigation";

function getValueColor(value){
  if(Number(value)< 0) return "text-danger"
  if(Number(value) === 0) return "text-text-muted"
  return "text-success"
}
function getValueColorFees(value){
  if(Number(value)> 0) return "text-danger"
  if(Number(value) === 0) return "text-text-muted"
  return "text-success"
}

function formatMoney(amount, currency = "USD") {
  if (amount === null || amount === undefined) return "-";
  const numAmount = Number(amount);
  
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: currency === "CLP" ? 0 : 2,
  }).format(numAmount);
}

export function PositionAssetRow({ position, accountName}) {
  const router = useRouter();
  const handleRowClick = () => {
    router.push(`/activos/${position.asset_id}`);
  };
  
  const pnl = Number(position.realized_pnl);
  const isNegative = pnl < 0;
  const last_transaction_date = position.last_transaction_at ? new Date(position.last_transaction_at).toLocaleString("es-CL", {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  }) : "-"
  const currency = position.asset.currency
  const pnlFormatted = position.realized_pnl
    ? `${formatMoney(pnl, currency)}` 
    : "-";
  const pnlWithCurrency = `${isNegative ? "" : "+"}${currency === "CLP" && position.last_price !== null? "CLP" : ""}${pnlFormatted}` 
  const isStock = position.asset.kind === "stock";
  const isEtf = position.asset.kind === "etf";
  const actual_account_name = accountName || "No disponible" 

  return (
    <tr
      onClick={handleRowClick} 
      className="border-t border-border-soft align-middle text-center transition hover:bg-accent/5 first:border-t-0">
      {/* Symbol */}
      <td className="whitespace-nowrap px-3 py-5 text-[14px] font-semibold text-white truncate max-w-[120px]" >
        {(position.asset.name.length > 18) ? position.asset.name.slice(0, 18) + "..." : position.asset.name || "No disponible"}
      </td>
      {/* Kind */}
      <td className="whitespace-nowrap px-3 py-5 text-[14px] font-semibold text-white uppercase">
        <span className={`inline-block rounded-md px-2 py-0.5 text-[12px] font-bold uppercase ${
          isStock ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
          isEtf ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
          "bg-purple-500/10 text-purple-400 border border-purple-500/20"
        }`}>
          {position.asset.kind === "stock" ? "Acción" : position.asset.kind === "etf" ? "ETF" : "Fondo"}
        </span>
      </td>
      {/* Nombre de Cuenta */}
      <td className="whitespace-nowrap px-3 py-5 text-[14px] font-semibold text-white truncate max-w-[120px]" >
        {(actual_account_name.length > 15) ? actual_account_name.slice(0, 15) + "..." : actual_account_name || "No disponible"}
      </td>
      {/* Cantidad (quantity)*/}
      <td className="whitespace-nowrap px-3 py-5 text-centert text-[14px] font-semibold text-white">
        {Number(position.quantity).toFixed(4)}
      </td>
      {/* Costo Promedio (avg_cost)*/}
      <td className="whitespace-nowrap px-3 py-5 text-centert text-[14px] font-semibold">
        <div className={"text-warning"}>
          {currency === "CLP" && position.avg_cost !== null? "CLP" : ""}{formatMoney(position.avg_cost, currency)}
        </div>
        
      </td>
      {/* PNL Realizado (realized_pnl)*/}
      <td className={`whitespace-nowrap px-3 py-5 text-centert text-[14px] font-semibold ${getValueColor(pnl)}`}>
        {pnlWithCurrency}
      </td>
      {/* Dividendos Totales (total_dividends)*/}
      <td className={`whitespace-nowrap px-3 py-5 text-centert text-[14px] font-semibold ${getValueColor(position.total_dividends)}`}>
        {position.total_dividends ? formatMoney(position.total_dividends, currency) : "-"}
      </td>
      {/* Cargos totales (total_fees)*/}
      <td className={`whitespace-nowrap px-3 py-5 text-centert text-[14px] font-semibold ${getValueColorFees(position.total_fees)}`}>
        {position.total_fees ? formatMoney(position.total_fees, currency) : "-"}
      </td>
      {/* Última Transacción (last_transaction_at)*/}
      
      <td className="whitespace-nowrap px-3 py-5 text-centert text-[14px] font-semibold text-white">
        {last_transaction_date}
      </td>
      
      
    </tr>
  );
}