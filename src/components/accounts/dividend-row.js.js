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
  const asset_kind = dividend.asset.kind || "-"
  const isStock = asset_kind === "stock";
  const isEtf = asset_kind === "etf";

  return (
    <tr
      className="border-t border-border-soft align-middle text-center transition hover:bg-accent/5 first:border-t-0">
      {/* Symbol */}
      <td className="px-5 py-5 align-middle">
          <div className="flex flex-col">
            <span className="font-semibold text-white">{symbol}</span>
            <span className="text-[10px] text-text-muted max-w-[140px] truncate">
              {(name.length > 15) ? name.slice(0, 15) + "..." : name}</span>
          </div>
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-[14px] font-semibold text-white uppercase">
        <span className={`inline-block rounded-md px-2 py-0.5 uppercase ${
          isStock ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
          isEtf ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
          "bg-purple-500/10 text-purple-400 border border-purple-500/20"
        }`}>
          {asset_kind === "stock" ? "Acción" : asset_kind === "etf" ? "ETF" : "Fondo"}
        </span>
      </td>
      {/* Fecha de Pago */}
      <td className="whitespace-nowrap px-3 py-5 text-[14px] font-semibold text-white max-w-[120px]">
        {pay_date}
      </td>
      {/* Monto Bruto */}
      <td className="whitespace-nowrap px-3 py-5 text-[14px] font-semibold text-accent max-w-[120px]">
        {gross_amount ? formatMoney(gross_amount, currency) : "-"}
      </td>
      {/* Impuesto / Retención */}
      <td className="whitespace-nowrap px-3 py-5 text-[14px] font-semibold text-danger max-w-[120px]">
         {dividend.tax_amount ? formatMoney(dividend.tax_amount, currency) : "-"}
      </td>
      {/* Monto Neto Recibido */}
      <td className="whitespace-nowrap px-3 py-5 pr-10 text-[14px] font-semibold text-success max-w-[120px]">
         +{Number(dividend.net_amount).toFixed(2)} {currency}
      </td>    
    </tr>
  );
}