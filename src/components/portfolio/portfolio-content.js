"use client";

import { useEffect, useState } from "react";
import { useAppAuth} from "@/src/lib/client-auth";
import dynamic from "next/dynamic";
import { PortfolioPositions } from "./portfolio-positions";
import { PortfolioSummary } from "./portfolio-summary";
import { FeedbackCard } from "../feedback-card";

const PortfolioTrend = dynamic(
  () => import("./portfolio-trend").then((mod) => mod.PortfolioTrend),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-[490px] w-full flex-col items-center justify-center rounded-[28px] border border-border-soft bg-panel-soft p-6 text-center">
        <p className="text-lg font-semibold text-white animate-pulse">Cargando evolución del portafolio...</p>
      </div>
    )
  }
);

// Formatear dinero según divisa (CLP o USD)
function formatMoney(amount, currency = "USD") {
  if (amount === null || amount === undefined) return "-";
  const numAmount = Number(amount);
  
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: currency === "CLP" ? 0 : 2,
  }).format(numAmount);
}

function DistributionRow({ item }) {
  const widthPct = `${(Number(item.percentage) * 100).toFixed(1)}%`;
  const isUSD = item.currency === "USD";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[18px] font-semibold text-white">{item.name}</p>
        <div className="flex min-w-[210px] items-center gap-4">
          <div className="h-3 flex-1 rounded-full bg-[#2d374c]">
            <div className="h-full rounded-full bg-accent" style={{ width: widthPct }} />
          </div>
          <span className="text-[18px] font-bold text-white">{widthPct}</span>
        </div>
      </div>
      <div className="rounded-[20px] border border-border-soft bg-surface px-6 py-6">
        <p className="text-sm text-text-muted">{isUSD ? "Acciones y ETFs (USD)" : "Fondos mutuos (CLP)"}</p>
        <p className="mt-3 font-mono text-[18px] font-bold tracking-[-0.02em] text-white">
          {formatMoney(item.amount, item.currency)}
        </p>
      </div>
    </div>
  );
}

export function PortfolioContent() {
  const { getToken } = useAppAuth();

  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_URL_BE || "";

  // Carga inicial del summary
  useEffect(() => {
    async function loadSummary() {
      try {
        setLoading(true);
        setError(false);
        const token = await getToken();

        const res = await fetch(`${baseUrl}/portfolio/summary`, {
          method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
        }})
        if (!res.ok) throw new Error("Error al cargar los datos del portafolio");
        const data = await res.json();
        setSummaryData(data);

      } catch (err) {
        console.error("Fetch Summary Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, [baseUrl]);


  if (loading) {
    return <FeedbackCard title="Cargando portafolio..." detail="Obteniendo el resumen de tu cuenta." />;
  }

  if (summaryData == null) {
    return (
      <div>
        <FeedbackCard
            title="No se pudo cargar los datos de tu portafolio"
            detail="Por favor, intenta más tarde o revisa tu conexión."
            tone="error"
          />
      </div>
    )
  }

  const { summary, account_distribution } = summaryData;
  if (summary.active_positions === 0){
    return (
      <div className="flex  w-full flex-col items-center justify-center rounded-[22px] border border-dashed border-border-soft bg-surface/20 p-8 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-white">
          No tienes datos disponibles aún
        </h3>
        <div className="text-left">
          <li className="mt-2 max-w-sm text-sm text-text-muted leading-[1.6]">
            Por favor, sube tus Certificados de Transacciones en la pestaña de Perfil/Mis datos o clickeando el botón "Subir/Actualizar Datos"
          </li>
          <li className="mt-2 max-w-sm text-sm text-text-muted leading-[1.6]">
            Recuerda que puedes crear Cuentas donde vincular tus datos en la pestaña de Cuentas
          </li>
        </div>
        
      </div>
    )
  }
  
  return (
    <>
      <PortfolioSummary summaryData={summaryData} loading={loading} error={error}></PortfolioSummary>

      <div className="mt-6 flex flex-col gap-6">
        <PortfolioTrend></PortfolioTrend>

        <section className="rounded-[28px] border border-border-soft bg-panel-soft p-6">
          <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-white">Distribución por cuenta</h2>
          <p className="mt-2 text-[14px] text-text-muted">Desglose de capital total distribuido.</p>

          <div className="mt-10 space-y-5">
            {account_distribution === undefined ? (
              <div>
                <FeedbackCard
                  title="No se pudo cargar la distribución a lo largo de tus cuentas"
                  detail="Por favor, intenta más tarde o revisa tu conexión."
                  tone="error"
                />
              </div>
            ): (
              <div>
                {account_distribution.map((item) => (
                  <DistributionRow key={item.account_id} item={item} />
                ))}
              </div>
            )}
          </div> 
        </section>
          
        <PortfolioPositions account_distribution={account_distribution}></PortfolioPositions>
      </div>
    </>
  );
}
