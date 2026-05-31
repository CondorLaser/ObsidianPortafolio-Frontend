"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { DashboardShell } from "@/src/components/dashboard-shell";
import { MetricCard } from "@/src/components/metric-card";
import { SectionCard } from "@/src/components/section-card";
import { SimpleChart } from "@/src/components/simple-chart";
import { CollapsableShell } from "@/src/components/collapsable-shell";

export default function AccountDetailPage({ params }) {
  const { accountId } = React.use(params);
  const { getToken } = useAuth();
  const [assetsMap, setAssetsMap] = useState({});

  const [account, setAccount] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [positions, setPositions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [dividends, setDividends] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!accountId) return;

    async function loadAccountData() {
      try {
        setLoading(true);
        setError(false);
        const baseUrl = process.env.NEXT_PUBLIC_URL_BE || "";
        const token = await getToken();

        // Hace las request en paralelo
        const [resAccount, resMetrics, resPositions, resTransactions, resDividends, resAssets] = await Promise.all([
          fetch(`${baseUrl}/accounts/${accountId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          }}),
          fetch(`${baseUrl}/accounts/metrics/${accountId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          }}),
          fetch(`${baseUrl}/accounts/positions/${accountId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          }}),
          fetch(`${baseUrl}/accounts/transactions/${accountId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          }}),
          fetch(`${baseUrl}/accounts/dividends/${accountId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          }})
        ]);

        if (!resAccount.ok || !resMetrics.ok || !resPositions.ok || !resTransactions.ok || !resDividends.ok) {
          throw new Error("Error al obtener los desgloses distribuidos de la cuenta");
        }
        const dataAccount = await resAccount.json();
        const dataMetrics = await resMetrics.json();
        const dataPositions = await resPositions.json();
        const dataTransactions = await resTransactions.json();
        const dataDividends = await resDividends.json();
        const assetIds = [...new Set([
          ...dataTransactions.map(tx => tx.asset_id),
          ...dataPositions.map(pos => pos.asset_id),
          ...dataDividends.map(div => div.asset_id),
        ].filter(Boolean))];

        const assetResults = await Promise.all(
          assetIds.map(id =>
            fetch(`${baseUrl}/assets/${id}`, {
              headers: { "Authorization": `Bearer ${token}` }
            }).then(r => r.ok ? r.json() : null)
          )
        );

        const map = {};
        assetResults.filter(Boolean).forEach(a => { map[a.id] = a; });
        setAssetsMap(map);

        setAccount(dataAccount);
        setMetrics(dataMetrics);
        setPositions(dataPositions || []);
        setTransactions(dataTransactions || []);
        setDividends(dataDividends || []);
      } catch (err) {
        console.error("Fetch Account Detail Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadAccountData();
  }, [accountId])

  // Acción para regresar a la vista general de portafolios
  const actions = (
    <Link
      href="/cuentas"
      className="rounded-2xl bg-accent px-5 py-3
                    font-bold text-black
                    transition hover:scale-[1.02]
                    disabled:cursor-not-allowed disabled:opacity-50"
    >
      Volver a Cuentas
    </Link>
  );

  if (loading) {
    return (
      <DashboardShell title="Cargando cuenta..." description="Obteniendo el desglose de la cuenta" actions={actions}>
        <div className="text-center py-12 text-sm text-text-muted animate-pulse">
          Sincronizando métricas de riesgo, posiciones vigentes e historial financiero...
        </div>
      </DashboardShell>
    );
  }

  if (error || !account) {
    return (
      <DashboardShell title="Error de Carga" description="No se pudo procesar la solicitud" actions={actions}>
        <div className="rounded-[24px] border border-red-500/20 bg-red-500/5 p-8 text-center">
          <p className="text-sm font-medium text-red-400">
            Hubo un error de red al intentar consultar la información detallada de la cuenta
          </p>
          <p className="mt-2 text-xs text-text-muted">
            Por favor, vuelve a intentarlo más tarde
          </p>
        </div>
      </DashboardShell>
    );
  }

  // Separa métricas según sea diarias o mensuales
  const dailyMetrics = metrics?.daily || [];
  const monthlyMetrics = metrics?.monthly || [];

  const latestDaily = dailyMetrics[dailyMetrics.length - 1];
  const latestMonthly = monthlyMetrics[monthlyMetrics.length - 1];

  // Cálculo e inyección dinámica de métricas principales
  const pnlValue = latestDaily 
    ? `${latestDaily.pnl >= 0 ? "+" : ""}${Number(latestDaily.pnl).toFixed(2)} ${account.currency}` 
    : `0.00 ${account.currency}`;

  const totalDividendsNet = dividends.reduce((sum, div) => sum + Number(div.net_amount || 0), 0);
  const dividendsValue = `${totalDividendsNet.toFixed(2)} ${account.currency}`;

  const getTransactionType = (transaction) => (
    transaction.transaction_type || transaction.kind || ""
  ).toString().toUpperCase();

  let lastTxLabel = "Ninguna";
  if (transactions.length > 0) {
    const sortedTx = [...transactions].sort(
      (a, b) => new Date(b.executed_at || b.date) - new Date(a.executed_at || a.date)
    );
    const lastTx = sortedTx[0];
    const lastTxType = getTransactionType(lastTx) === "BUY" ? "Compra" : "Venta";
    lastTxLabel = `${lastTxType} (${new Date(lastTx.executed_at || lastTx.date).toLocaleDateString("es-CL")})`;
  }

  // Mapeo adaptativo para el componente de gráficos
  const chartData = dailyMetrics.map((m) => m.pnl);
  const chartLabels = dailyMetrics.map((m) => 
    new Date(m.date).toLocaleDateString("es-CL", { day: "numeric", month: "short" })
  );

  return (
    <DashboardShell
      title={`Cuenta: ${account.name}`}
      actions={actions}
    >
      {/* 1. Métricas Generales */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Último P&L Diario" value={pnlValue} />
        <MetricCard label="Posiciones Activas" value={positions.length.toString()} />
        <MetricCard label="Dividendos Netos Recibidos" value={dividendsValue} />
        <MetricCard label="Última Operación" value={lastTxLabel} />
      </div>

      {/* 2. Métricas Mensuales / Riesgo de la cuenta */}
      {latestMonthly && (
        <div>
          <h2 className="text-lg font-semibold mt-3">Métricas mensuales</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Retorno TWR Mensual" value={`${(Number(latestMonthly.twr) * 100).toFixed(2)}%`} />
            <MetricCard label="Sharpe Ratio (Riesgo)" value={Number(latestMonthly.sharpe_ratio).toFixed(2)} />
            <MetricCard label="Value at Risk (VaR)" value={`${Number(latestMonthly.value_at_risk).toFixed(2)} ${account.currency}`} />
            <MetricCard label="Max Drawdown Histórico" value={latestDaily ? `${(Number(latestDaily.max_drawdown) * 100).toFixed(2)}%` : "N/D"} />
          </div>
        </div>
        
      )}

      {/* 3. Gráfico de evolución del P&L basada en métricas diarias */}
      <div className="mt-6">
        <SectionCard
          title="Evolución del P&L Diario"
          description="Monitoreo histórico del rendimiento acumulado para la cuenta."
        >
          {chartData.length === 0 ? (
            <p className="text-sm text-text-muted py-6 text-center">No hay registros históricos suficientes para graficar</p>
          ) : (
            <SimpleChart data={chartData} labels={chartLabels} />
          )}
        </SectionCard>
      </div>
      
      {/* 4. Posiciones (tabla) */}
      <div className="mt-6">
        <SectionCard
          title="Posiciones de la Cuenta"
          description="Activos vigentes en esta cuenta con su costo promedio ponderado y retornos realizados."
        >
          {positions.length === 0 ? (
            <p className="text-sm text-text-muted py-4">No se registran posiciones de activos abiertas en esta cuenta</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border-soft bg-surface/45">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-soft bg-panel-soft/60 text-xs font-[760] uppercase tracking-[0.12em] text-text-muted">
                    <th className="p-4">Activo</th>
                    <th className="p-4">Tipo</th>
                    <th className="p-4 text-right">Cantidad</th>
                    <th className="p-4 text-right">Costo Promedio</th>
                    <th className="p-4 text-right">P&L Realizado</th>
                    <th className="p-4 text-right">Dividendos Totales</th>
                    <th className="p-4 text-right">Comisiones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-soft/40 text-sm text-white">
                  {positions.map((pos) => {
                    const asset = assetsMap[tx.asset_id] || {};
                    const isStock = asset.kind === "stock";
                    const isEtf = asset.kind === "etf";
                    
                    return (
                      <tr key={pos.id} className="hover:bg-panel/30 transition-colors">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-base tracking-tight">{asset.symbol || "N/D"}</span>
                            <span className="text-xs text-text-muted truncate max-w-[180px]">{asset.name || "Desconocido"}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            isStock ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                            isEtf ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                            "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          }`}>
                            {asset.kind === "stock" ? "Acción" : asset.kind === "etf" ? "ETF" : "Fondo"}
                          </span>
                        </td>
                        <td className="p-4 text-right text-text-muted font-medium">{Number(pos.quantity).toFixed(4)}</td>
                        <td className="p-4 text-right font-medium">{Number(pos.avg_cost).toFixed(2)} {account.currency}</td>
                        <td className={`p-4 text-right font-bold ${Number(pos.realized_pnl) >= 0 ? "text-success" : "text-danger"}`}>
                          {Number(pos.realized_pnl) >= 0 ? "+" : ""}{Number(pos.realized_pnl).toFixed(2)}
                        </td>
                        <td className="p-4 text-right text-emerald-400 font-medium">+{Number(pos.total_dividends).toFixed(2)}</td>
                        <td className="p-4 text-right text-text-muted">{Number(pos.total_fees).toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </div>
  

      {/* 5. Transacciones y Dividendos colapsables */}
      <div className="mt-6 flex flex-col gap-6">

        {/* Historial de Transacciones */}
        <CollapsableShell
          title="Historial de Transacciones"
          description="Registro de todas las compras y ventas ejecutadas de manera cronológica en la cuenta"
        >
          {transactions.length === 0 ? (
            <p className="text-sm text-text-muted py-4">No se registran transacciones operadas.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border-soft bg-surface/20 mt-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-soft text-xs font-[760] uppercase tracking-[0.12em] text-text-muted bg-panel-soft/30">
                    <th className="p-3">Fecha</th>
                    <th className="p-3">Tipo</th>
                    <th className="p-3">Activo</th>
                    <th className="p-3 text-right">Cantidad</th>
                    <th className="p-3 text-right">Precio Ejecución</th>
                    <th className="p-3 text-right">Comisión</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-soft/20 text-s text-white">
                  {transactions.map((tx) => {
                    const asset = assetsMap[tx.asset_id] || {};
                    const txType = getTransactionType(tx);
                    return (
                      <tr key={tx.id} className="hover:bg-panel/20 transition-colors">
                        <td className="p-3 text-text-muted">{new Date(tx.executed_at).toLocaleDateString("es-CL")}</td>
                        <td className="p-3">
                          <span className={`rounded px-2 py-0.5 font-bold text-[10px] uppercase ${txType === "BUY" ? "bg-blue-500/10 text-blue-400" : "bg-orange-500/10 text-orange-400"}`}>
                            {txType === "BUY" ? "Compra" : "Venta"}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-col">
                            <span className="font-semibold text-white">{asset.symbol || "N/D"}</span>
                            <span className="text-[10px] text-text-muted max-w-[140px] truncate">{asset.name || ""}</span>
                          </div>
                        </td>
                        <td className="p-3 text-right font-medium">{Number(tx.quantity)}</td>
                        <td className="p-3 text-right font-medium"> {tx.price !== null ? `${Number(tx.price)} ${account.currency}` : "-"}</td>
                        <td className="p-3 text-right text-text-muted">{Number(tx.fee || 0).toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CollapsableShell>

        {/* Historial de Dividendos */}
        <CollapsableShell
          title="Historial de Dividendos"
          description="Flujos de caja corporativos detallados por concepto de distribuciones recibidas y retenciones fiscales"
        >
          {dividends.length === 0 ? (
            <p className="text-sm text-text-muted py-4">No hay pagos de dividendos asociados a esta cuenta</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border-soft bg-surface/20 mt-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-soft text-xs font-[760] uppercase tracking-[0.12em] text-text-muted bg-panel-soft/30">
                    <th className="p-3">Fecha de Pago</th>
                    <th className="p-3">Activo</th>
                    <th className="p-3 text-right">Monto Bruto</th>
                    <th className="p-3 text-right">Impuesto / Retención</th>
                    <th className="p-3 text-right">Monto Neto Recibido</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-soft/20 text-s text-white">
                  {dividends.map((div) => {
                    const asset = assetsMap[div.asset_id] || {};
                    return (
                      <tr key={div.id} className="hover:bg-panel/20 transition-colors">
                        <td className="p-3 text-text-muted">{new Date(div.date).toLocaleDateString("es-CL")}</td>
                        <td className="p-3">
                          <div className="flex flex-col">
                            <span className="font-semibold text-white">{asset.symbol || "N/D"}</span>
                            <span className="text-[10px] text-text-muted max-w-[140px] truncate">{asset.name || ""}</span>
                          </div>
                        </td>
                        <td className="p-3 text-right text-text-muted">{Number(div.gross_amount)}</td>
                        <td className="p-3 text-right text-danger font-medium">
                          {Number(div.tax_amount) > 0 ? "-" : ""}{Number(div.tax_amount).toFixed(2)}
                        </td>
                        <td className="p-3 text-right font-semibold text-emerald-400">
                          +{Number(div.net_amount).toFixed(2)} {account.currency}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CollapsableShell>
        
      </div>
    </DashboardShell>
  );
}
