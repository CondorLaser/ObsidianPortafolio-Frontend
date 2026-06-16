"use-client"

function formatMoney(amount, currency = "USD") {
  if (amount === null || amount === undefined) return "-";
  const numAmount = Number(amount);
  
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: currency === "CLP" ? 0 : 2,
  }).format(numAmount);
}

export function DividendAssetRow({ dividend }) {  
  const pay_date = new Date(dividend.date).toLocaleDateString("es-CL") || "-"
  const currency = dividend.asset.currency || ""
  const symbol = dividend.asset.symbol || "N/D"
  const name = dividend.asset.name || ""
  const gross_amount = Number(dividend.gross_amount) || 0
  
  

  return (
    <tr
      className="border-t border-border-soft align-middle text-center transition hover:bg-accent/5 first:border-t-0">
      {/* Symbol */}
      <td className="px-5 py-5 align-middle">
          <div className="flex flex-col">
            <span className="font-semibold text-white">{symbol}</span>
            <span className="text-[10px] text-text-muted max-w-[140px] truncate">{name}</span>
          </div>
      </td>
      {/* Fecha de Pago */}
      <td className="whitespace-nowrap px-3 py-5 text-[14px] font-semibold text-white truncate max-w-[120px]" title={"accountName"}>
        {pay_date}
      </td>
      {/* Monto Bruto */}
      <td className="whitespace-nowrap px-3 py-5 text-[14px] font-semibold text-accent truncate max-w-[120px]" title={"accountName"}>
        {gross_amount ? formatMoney(gross_amount, currency) : "-"}
      </td>
      {/* Impuesto / Retención */}
      <td className="whitespace-nowrap px-3 py-5 text-[14px] font-semibold text-danger truncate max-w-[120px]" title={"accountName"}>
         {Number(dividend.tax_amount) > 0 ? "-" : ""}{Number(dividend.tax_amount).toFixed(2)}
      </td>
      {/* Monto Neto Recibido */}
      <td className="whitespace-nowrap px-3 py-5 pr-10 text-[14px] font-semibold text-success truncate max-w-[120px]" title={"accountName"}>
         +{Number(dividend.net_amount).toFixed(2)} {currency}
      </td>    
    </tr>
  );
}