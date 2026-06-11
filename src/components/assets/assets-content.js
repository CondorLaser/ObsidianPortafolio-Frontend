"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppAuth} from "@/src/lib/client-auth";
import { FeedbackCard } from "../feedback-card";
import { PositionAssetRow } from "./asset-position";

const toneClasses = {
  accent: "border-accent/20 bg-accent/10 text-accent",
  success: "border-emerald-500/20 bg-emerald-500/10 text-success",
  warning: "border-amber-500/20 bg-amber-500/10 text-warning",
  default: "border-border-soft bg-panel text-white/70"
};

function StatusPill({ children, tone = "default", className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.02em] ${toneClasses[tone] ?? toneClasses.default} ${className}`}
    >
      {children}
    </span>
  );
}

export function AssetsContent() {
  const { getToken } = useAppAuth();
  const [positions, setPositions] = useState([]);
  const [page, setPage] = useState(0);
  const limit = 10;
  const [loading, setLoading] = useState(true);
  const [updatingPositions, setUpdatingPositions] = useState(false);
  const [error, setError] = useState(false);

  
  const [accounts, setAccounts] = useState([]);
  const [accountsError, setAccountsError] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_URL_BE || ""; 

  useEffect(() => {
    async function loadPositions() {
      try {
        if(positions.length === 0 && !updatingPositions && page === 0) setLoading(true);
        setUpdatingPositions(true);
        setError(false);
        const token = await getToken();
        const skip = page * limit;
        const res = await fetch(`${baseUrl}/positions?skip=${skip}&limit=${limit}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Error al cargar las positions");
        const data = await res.json();
        setPositions(data);
      } catch (fetchError) {
        console.error("Fetch Assets Error:", fetchError);
        setError(true);
      } finally {
        setLoading(false);
        setUpdatingPositions(false);
      }
    }
    loadPositions();
  }, [baseUrl, page, limit]);

  useEffect(() => {
    async function loadAccounts() {
      try {
        setLoading(true);
        setAccountsError(false);
        const token = await getToken();
        const res = await fetch(`${baseUrl}/accounts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (!res.ok) throw new Error("Error al cargar las cuentas");
        const data = await res.json();
        setAccounts(data);
      } catch (fetchError) {
        console.error("Fetch Accounts Error:", fetchError);
        setAccountsError(true);
      } finally {
        setLoading(false);
      }
    }
    loadAccounts();
  }, []);

  const accountMap = useMemo(() => {
    const map = {};
    accounts.forEach((account) => {
      map[account.id] = account.name;
    });
    return map;
  }, [accounts]);


  if (loading) {
    return <FeedbackCard title="Cargando activos..." detail="Estamos obteniendo las posiciones del portafolio." />;
  }

  if (error) {
    return (
      <FeedbackCard
        title="No se pudieron cargar los activos"
        detail="Por favor, intenta más tarde o revisa tu conexión."
        tone="error"
      />
    );
  }

  if (positions.length === 0 && !updatingPositions) {
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
    );
  }
  
  return (
    <div>
      <div className="bg-panel-soft  border border-border-soft p-1">        
        <div className={` overflow-x-auto max-h-[80vh] bg-app shadow-sm`}>
          <table className={`w-full min-w-[980px] border-collapse ${updatingPositions ? "opacity-50" : "opacity-100"}`}>
            <thead className="sticky top-0 z-20 bg-app">
              <tr className="bg-panel border-b border-border text-[12px] uppercase tracking-[0.1em] text-text-muted shadow-sm">
                <th className="w-[20%] px-5 pb-4 pt-5 text-center font-semibold">Activo</th>
                <th className="w-[20%] px-3 pb-4 pt-5 text-center font-semibold">Tipo</th>
                <th className="w-[44%] px-3 pb-4 pt-5 text-center font-semibold">Cuenta</th>
                <th className="w-[8%] px-3 pb-4 pt-5 text-center font-semibold">Cantidad</th>
                <th className="w-[10%] px-3 pb-4 pt-5 text-center font-semibold">Costo Promedio</th>
                <th className="w-[10%] px-3 pb-4 pt-5 text-center font-semibold">P&L Realizado</th>
                <th className="w-[8%] px-3 pb-4 pt-5 text-center font-semibold">Dividendos Totales</th>
                <th className="w-[10%] px-3 pb-4 pt-5 text-center font-semibold">Comisiones Totales</th>
                <th className="w-[10%] px-3 pb-4 pt-5 text-center font-semibold">Última transacción</th>
              </tr>
            </thead>
            <tbody className={loading ? "opacity-50" : ""}>
              {positions.map((position) => (
                <PositionAssetRow
                  key={`${position.id}`} 
                  position={position} 
                  accountName={accountMap[position.account_id]}
                />
                
              ))}
            </tbody>
          </table>
          
          
          <div className="p-6 sticky bottom-0 z-30 w-full min-w-[1030px] bg-panel flex items-center justify-between border-t border-border-soft pt-4">
            <span className="text-sm text-text-muted">
              Página {page + 1}
            </span>
            <div className="flex gap-2">
              {updatingPositions && (
                <StatusPill tone="accent" className="animate-pulse">
                  Actualizando...
                </StatusPill>
              )}
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0 || loading}
                className="rounded-lg border border-border-soft bg-surface px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:bg-accent/10 transition-colors"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={positions.length < limit || loading}
                className="rounded-lg border border-border-soft bg-surface px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:bg-accent/10 transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
