"use client";

import { useEffect, useMemo, useState } from "react";

import { AssetCard } from "@/src/components/assets/asset-card";
import { useAppAuth} from "@/src/lib/client-auth";
import { SectionCard } from "@/src/components/section-card";
import { FeedbackCard } from "../feedback-card";
import { PositionAssetRow } from "./asset-position";


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
        console.log("Positions: ", data)
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
  }, []);

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
        console.log("ACCOUNTS: ", data)
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
        detail="Revisa la conexion con el backend o que los mocks de desarrollo esten activos."
        tone="error"
      />
    );
  }

  if (positions.length === 0) {
    return (
      <FeedbackCard
        title="No hay activos disponibles"
        detail="Cuando existan posiciones cargadas a alguna cuenta, apareceran en esta vista. Por favor, sube tus Certificados de Transacciones en la pestaña de Perfil/Mis datos o clickeando el botón 'Subir/Actualizar Datos'."
      />
    );
  }

  /* return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.35fr)_360px]">
      <SectionCard
        title="Activos del portafolio"
        description="Cada tarjeta muestra un activo que el usuario tiene en una cuenta, junto con cantidad, valor, retorno y datos relevantes para entrar al detalle."
      >
        <div className="space-y-7">
          {groupedPositions.map((group) => (
            <section key={group.account}>
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-white">{group.account}</h3>
                  <p className="mt-1 text-sm text-text-muted">
                    Activos asociados a esta cuenta, con su cantidad, costo promedio y resultado.
                  </p>
                </div>
                <span className="rounded-full border border-border-soft bg-surface/55 px-3 py-1 text-xs font-semibold text-text-muted">
                  {group.positions.length} activos
                </span>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {group.positions.map((position) => (
                  <AssetCard key={`${position.account}-${position.symbol}`} position={position} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        className="self-start"
        title="Cómo leer esta vista"
        description="La vista se enfoca en los activos que forman parte del portafolio actual, no en un catálogo general de mercado."
      >
        <div className="space-y-4">
          {[
            "Cuenta: indica desde dónde viene el activo y en qué moneda se está revisando.",
            "Datos del usuario: muestran cantidad, costo promedio, valor actual, dividendos y retorno.",
            "Detalle del activo: permite ver precio, evolución, métricas y acciones sugeridas."
          ].map((detail) => (
            <article key={detail} className="rounded-[20px] border border-border-soft bg-surface/55 px-5 py-4">
              <p className="text-sm leading-[1.6] text-text-muted">{detail}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  ); */
  
  return (
    <div>
      <div className="mt-6 bg-red-500 p-1">        
          {error ? (
            <div>
              <div className="flex h-60 w-full flex flex-col items-center justify-center rounded-[28px] border border-red-500/20 bg-red-500/5 p-6 text-center text-red-300">
                <p className="font-semibold text-white">No se pudo cargar la evolución del portafolio</p>
                <p className="mt-2 text-sm text-text-muted">Por favor, intente más tarde o revisa tu conexión.</p>
              </div>
            </div>
          ) : (
            <div className={`mt-7 overflow-x-auto max-h-[80vh] bg-app shadow-sm`}>
              <table className={`w-full min-w-[980px] border-collapse ${updatingPositions ? "opacity-50" : "opacity-100"}`}>
                <thead className="sticky top-0 z-20 bg-app">
                  <tr className="bg-panel border-b border-border text-[12px] uppercase tracking-[0.1em] text-text-muted shadow-sm">
                    <th className="w-[20%] px-5 pb-4 pt-5 text-center font-semibold">Activo</th>
                    <th className="w-[20%] px-3 pb-4 pt-5 text-center font-semibold">Tipo</th>
                    <th className="w-[44%] px-3 pb-4 pt-5 text-center font-semibold">Cuenta</th>
                    <th className="w-[8%] px-3 pb-4 pt-5 text-center font-semibold">Cantidad</th>
                    <th className="w-[10%] px-3 pb-4 pt-5 text-center font-semibold">Costo Promedio</th>
                    <th className="w-[10%] px-3 pb-4 pt-5 text-center font-semibold">PnL Realizado</th>
                    <th className="w-[8%] px-3 pb-4 pt-5 text-center font-semibold">Dividendos Totales</th>
                    <th className="w-[10%] px-3 pb-4 pt-5 text-center font-semibold">Cargos totales</th>
                    <th className="w-[10%] px-3 pb-4 pt-5 text-center font-semibold">Última transacción</th>
                  </tr>
                </thead>
                <tbody className={loading ? "opacity-50" : ""}>
                  {positions.map((position) => (
                    <PositionAssetRow
                      key={`${position.account_id}-${position.asset_id}`} 
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
          )}
        
      </div>
    </div>
  );
}
