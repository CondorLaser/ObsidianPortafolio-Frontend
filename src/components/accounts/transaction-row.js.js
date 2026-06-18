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

export function TransactionRow({ transaction }) { 
  const symbol = transaction.asset.symbol || "N/D"
  const name = transaction.asset.name || "N/D"
  const asset_kind = transaction.asset.kind || "N/D"
  const currency = transaction.asset.currency || ""

  const transaction_kind = transaction.kind || "N/D"
  const quantity = transaction.quantity || 0
  const price = transaction.price || 0
  const fee = transaction.fee || 0
  const executed_at = new Date(transaction.executed_at).toLocaleDateString("es-CL") || "-"

  const isStock = asset_kind === "stock";
  const isEtf = asset_kind === "etf";

  return (
    <tr
      className="border-t border-border-soft align-middle text-center transition hover:bg-accent/5 first:border-t-0">
      {/* Activo */}
      <td className="px-5 py-5 align-middle">
          <div className="flex flex-col">
            <span className="font-semibold text-white">{symbol}</span>
            <span className="text-[10px] text-text-muted truncate">
              {(name.length > 15) ? name.slice(0, 15) + "..." : name}</span>
          </div>
      </td>
      {/* Tipo de Activo */}
      <td className="whitespace-nowrap px-3 py-5 text-[14px] font-semibold text-white uppercase">
        <span className={`inline-block rounded-md px-2 py-0.5 uppercase ${
          isStock ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
          isEtf ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
          "bg-purple-500/10 text-purple-400 border border-purple-500/20"
        }`}>
          {asset_kind === "stock" ? "Acción" : asset_kind === "etf" ? "ETF" : "Fondo"}
        </span>
      </td>
      {/* Tipo de Transacción */}
      <td className={`whitespace-nowrap px-3 py-5 text-[14px] font-semibold text-white uppercase max-w-[120px] ${
        transaction_kind === "buy" ? "bg-warning/60" : "bg-accent/60"
      }`}>
        {transaction_kind}
      </td>
      {/* Fecha de Ejecución */}
      <td className="whitespace-nowrap px-3 py-5 text-[14px] font-semibold text-white max-w-[120px]">
        {executed_at}
      </td>
      {/* Cantidad */}
      <td className="whitespace-nowrap px-3 py-5 text-[14px] font-semibold text-white max-w-[120px]">
        {Number(quantity).toFixed(4)}
      </td>
      {/* Precio */}
      <td className="whitespace-nowrap px-3 py-5 text-[14px] font-semibold text-accent max-w-[120px]">
        {price ? formatMoney(price, currency) : "-"}
      </td>
      {/* Impuesto / Retención */}
      <td className="whitespace-nowrap px-3 py-5 text-[14px] font-semibold text-danger max-w-[120px]">
         {fee ? formatMoney(fee, currency) : "-"}
      </td>   
    </tr>
  );
}