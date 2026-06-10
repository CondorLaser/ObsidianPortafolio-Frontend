"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "@/src/components/metric-card";
import { useAppAuth} from "@/src/lib/client-auth";
import dynamic from "next/dynamic";
import { PortfolioPositions } from "./portfolio-positions";
import { PortfolioSummary } from "./portfolio-summary";

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

function FeedbackCard({ title, detail, tone = "default" }) {
  const toneClass =
    tone === "error"
      ? "border-red-500/20 bg-red-500/5 text-red-300"
      : "border-border-soft bg-panel-soft text-text-muted";

  return (
    <section className={`rounded-[28px] border p-8 text-center ${toneClass}`}>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-[1.6]">{detail}</p>
    </section>
  );
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
        if (!res.ok) throw new Error("Error al cargar el summary");
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

  if (error || !summaryData) {
    return (
      <FeedbackCard
        title="No se pudo cargar el portafolio"
        detail="Por favor, revisa la conexión con el backend."
        tone="error"
      />
    );
  }

  const { summary, account_distribution } = summaryData;
  console.log(summary)
  return (
    <>
      <PortfolioSummary summaryData={summaryData} loading={loading} error={error}></PortfolioSummary>

      <div className="mt-6 flex flex-col gap-6">
        <PortfolioTrend></PortfolioTrend>

        <section className="rounded-[28px] border border-border-soft bg-panel-soft p-6">
          <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-white">Distribución por cuenta</h2>
          <p className="mt-2 text-[14px] text-text-muted">Desglose de capital total distribuido.</p>

          <div className="mt-10 space-y-5">
            {account_distribution.map((item) => (
              <DistributionRow key={item.account_id} item={item} />
            ))}
          </div>
        </section>
          
        <PortfolioPositions account_distribution={account_distribution}></PortfolioPositions>
      </div>
    </>
  );
}
