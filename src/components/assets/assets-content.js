"use client";

import { useEffect, useMemo, useState } from "react";

import { AssetCard } from "@/src/components/assets/asset-card";
import { SectionCard } from "@/src/components/section-card";

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

export function AssetsContent() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadPositions() {
      try {
        setLoading(true);
        setError(false);

        const baseUrl = process.env.NEXT_PUBLIC_URL_BE || "";
        const response = await fetch(`${baseUrl}/positions`);

        if (!response.ok) throw new Error("Error al cargar activos");

        const data = await response.json();
        setPositions(data.positions ?? []);
      } catch (fetchError) {
        console.error("Fetch Assets Error:", fetchError);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadPositions();
  }, []);

  const groupedPositions = useMemo(
    () => {
      const accountNames = [...new Set(positions.map((position) => position.account))];

      return accountNames.map((account) => ({
        account,
        positions: positions.filter((position) => position.account === account)
      }));
    },
    [positions]
  );

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
        detail="Cuando existan posiciones cargadas desde una cuenta, apareceran en esta vista."
      />
    );
  }

  return (
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
  );
}
