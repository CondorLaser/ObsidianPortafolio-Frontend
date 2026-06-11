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
    router.push(`/activos/${position.asset.symbol}`);
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

  

  return (
    <tr
      onClick={handleRowClick} 
      className="border-t border-border-soft align-middle text-center transition hover:bg-accent/5 first:border-t-0">
      {/* Symbol */}
      <td className="px-5 py-5 align-middle">
          <div className="grid h-[50px] w-[50px] place-items-center rounded-[12px] border border-border-soft bg-surface font-mono text-xs font-extrabold text-white">
            {position.asset.symbol}
          </div>
      </td>
      {/* Kind */}
      <td className="whitespace-nowrap px-3 py-5 text-[14px] font-semibold text-white uppercase">{position.asset.kind}</td>
      {/* Nombre de Cuenta */}
      <td className="whitespace-nowrap px-3 py-5 text-[14px] font-semibold text-white truncate max-w-[120px]" title={"accountName"}>
        {accountName || "No disponible"}
      </td>
      {/* Cantidad (quantity)*/}
      <td className="whitespace-nowrap px-3 py-5 text-right text-[14px] font-semibold text-white">
        {Number(position.quantity).toFixed(4)}
      </td>
      {/* Costo Promedio (avg_cost)*/}
      <td className="whitespace-nowrap px-3 py-5 text-right text-[14px] font-semibold">
        <div className={"text-warning"}>
          {currency === "CLP" && position.avg_cost !== null? "CLP" : ""}{formatMoney(position.avg_cost, currency)}
        </div>
        
      </td>
      {/* PNL Realizado (realized_pnl)*/}
      <td className={`whitespace-nowrap px-3 py-5 text-right text-[14px] font-semibold ${getValueColor(pnl)}`}>
        {pnlWithCurrency}
      </td>
      {/* Dividendos Totales (total_dividends)*/}
      <td className={`whitespace-nowrap px-3 py-5 text-right text-[14px] font-semibold ${getValueColor(position.total_dividends)}`}>
        {position.total_dividends ? formatMoney(position.total_dividends, currency) : "-"}
      </td>
      {/* Cargos totales (total_fees)*/}
      <td className={`whitespace-nowrap px-3 py-5 text-right text-[14px] font-semibold ${getValueColorFees(position.total_fees)}`}>
        {position.total_fees ? formatMoney(position.total_fees, currency) : "-"}
      </td>
      {/* Última Transacción (last_transaction_at)*/}
      
      <td className="whitespace-nowrap px-3 py-5 text-right text-[14px] font-semibold text-white">
        {last_transaction_date}
      </td>
      
      
    </tr>
  );
}