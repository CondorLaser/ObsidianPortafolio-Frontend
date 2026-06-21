"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAppAuth } from "@/src/lib/client-auth";
import { DashboardShell } from "@/src/components/dashboard-shell";
import { MetricCard } from "@/src/components/metric-card";
import { SectionCard } from "@/src/components/section-card";
import { SimpleChart } from "@/src/components/simple-chart";
import { CollapsableShell } from "@/src/components/collapsable-shell";
import { AccountPositions } from "@/src/components/accounts/account-positions";
import { AccountDividends } from "@/src/components/accounts/account-dividends";
import { AccountTransactions } from "@/src/components/accounts/account-transactions";
import { AccountMetrics } from "@/src/components/accounts/account-metrics";

export default function AccountDetailPage({ params }) {
  const { accountId } = React.use(params);
  const { getToken } = useAppAuth();

  const [account, setAccount] = useState(null);

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
        const resAccount = await fetch(`${baseUrl}/accounts/${accountId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }}
        )
        if (!resAccount.ok ) {
          throw new Error("Error al obtener los desgloses distribuidos de la cuenta");
        }
        const dataAccount = await resAccount.json();
        setAccount(dataAccount);
      } catch (err) {
        console.error("Fetch Account Detail Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadAccountData();
  }, [accountId, getToken])

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
            Por favor, vuelve a intentarlo más tarde o revisa tu conexión
          </p>
        </div>
      </DashboardShell>
    );
  }
  return (
    <DashboardShell
      title={`Cuenta: ${account.name}`}
      actions={actions}
    >
      {/* Métricas  */}
      <AccountMetrics account_id={account.id} currency={account.currency}></AccountMetrics>

      {/* 3. Gráfico de evolución del P&L basada en métricas diarias */}
      {/* <div className="mt-6">
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
      </div> */}
      
      {/* 4. Posiciones (tabla) */}
      <div className="mt-6">
        <SectionCard
          title="Posiciones de la Cuenta"
          description="Activos vigentes en esta cuenta con su costo promedio ponderado y retornos realizados."
        >
          <AccountPositions accountId={accountId} />
        </SectionCard>
      </div>
  

      {/* 5. Transacciones y Dividendos colapsables */}
      <div className="mt-6 flex flex-col gap-6">

        {/* Historial de Transacciones */}
        <CollapsableShell
          title="Historial de Transacciones"
          description="Registro de todas las compras y ventas ejecutadas de manera cronológica en la cuenta"
        >
          <AccountTransactions accountId={accountId}></AccountTransactions>
        </CollapsableShell>

        {/* Historial de Dividendos */}
        <CollapsableShell
          title="Historial de Dividendos"
          description="Flujos de caja corporativos detallados por concepto de distribuciones recibidas y retenciones fiscales"
        >
          <AccountDividends accountId={accountId} />
        </CollapsableShell>
        
      </div>
    </DashboardShell>
  );
}
