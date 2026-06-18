"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppAuth} from "@/src/lib/client-auth";
import { FeedbackCard } from "../feedback-card";
import Link from "next/link";


export function PortfolioOverviewCard() {
  const { getToken } = useAppAuth();
  const [summaryData, setSummary] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_URL_BE || ""; 

  useEffect(() => {
    async function loadSumary() {
      try {
        setLoading(true);
        setError(false);
        const token = await getToken();
        const res = await fetch(`${baseUrl}/portfolio/summary`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Error al cargar el resumen de tu portafolio");
        const data = await res.json();
        setSummary(data);
      } catch (fetchError) {
        console.error("Fetch Assets Error:", fetchError);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadSumary();
  }, [baseUrl]);

  if(loading){
    return (
      <div className="rounded-[28px] border border-border-soft bg-panel p-6 flex flex-col gap-4 ">
        <FeedbackCard title="Cargando resumen del portafolio..." detail="Obteniendo los datos de tu portafolio." />
      </div>
    )
  }
  if (error || !summaryData) {
    return (
      <div className="rounded-[28px] border border-border-soft p-6 flex flex-col gap-4 ">
        <FeedbackCard
          title="No se pudo cargar el resumen de tu portafolio"
          detail="Por favor, intenta más tarde o revisa tu conexión."
          tone="error"
        />
      </div>
      
    );
  }

  const { summary, account_distribution } = summaryData;
  const positions = summary.active_positions || 0

  if (positions === 0){
    return (
      <div className="flex  w-full flex-col items-center justify-center rounded-[22px] border border-dashed border-border-soft bg-panel p-8 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-white">
          Bienvenido a Orion Portafolio
        </h3>
        <h3 className="text-base font-semibold text-text-muted">
          parece no tienes datos disponibles aún
        </h3>
        <div className="text-left">
          <li className="mt-2 max-w-sm text-sm text-text-muted leading-[1.6]">
            Por favor, accede a la pestaña <b>Perfil</b> y sube tus Certificados de Transacciones para cargar tus información y obtener tus datos
          </li>
        </div>
        
      </div>
    );
  }

  const accounts = summary.linked_accounts || 0
  const last_update = new Date(summary.last_snapshot_date).toLocaleDateString("es-CL")
  return (
    <section className="rounded-[2rem] border border-border-soft bg-panel p-6">
        <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/activos">
            <div className="flex items-start justify-evenly gap-3 rounded-3xl bg-panel-soft p-5 hover:bg-panel-soft/50">
                <div className="">
                    <p className="text-sm text-text-muted">N° de Activos Totales</p>
                    <p className="mt-3 text-3xl font-semibold">{positions}</p>
                    
                </div>
                <span className="text-6xl text-right">›</span>
            </div>
            
        </Link>
        <Link href="/cuentas">
            <div className="flex items-start justify-evenly rounded-3xl bg-panel-soft p-5 hover:bg-panel-soft/50">
                <div className="">
                    <p className="text-sm text-text-muted">N° de Cuentas</p>
                    <p className="mt-3 text-3xl font-semibold">{accounts}</p>
                </div>
                <span className="text-6xl text-right">›</span>
            </div>
            
        </Link>
        
        <div className="rounded-3xl bg-panel-soft p-5 sm:col-span-2">
            <p className="text-sm text-text-muted">Última acutalización</p>
            <p className="mt-3 text-lg font-semibold text-accent">
            {last_update ? last_update : "No disponible"}
            </p>
        </div>
        </div>
    </section>
  )

}