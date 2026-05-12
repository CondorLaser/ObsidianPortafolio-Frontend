import { auth } from "@clerk/nextjs/server";

import { AssetCard } from "@/src/components/assets/asset-card";
import { DashboardShell } from "@/src/components/dashboard-shell";
import { SectionCard } from "@/src/components/section-card";
import { positions } from "@/src/lib/mock-data";

const accountOrder = ["Fintual USD", "Fintual CLP"];

export default async function AssetsPage() {
  const { isAuthenticated, redirectToSignIn } = await auth();

  if (!isAuthenticated) return redirectToSignIn();

  const groupedPositions = accountOrder
    .map((account) => ({
      account,
      positions: positions.filter((position) => position.account === account)
    }))
    .filter((group) => group.positions.length > 0);

  return (
    <DashboardShell
      title="Activos"
      description="Selecciona un activo disponible para revisar su evolución, métricas, alertas y recomendaciones en una vista más detallada."
    >
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.35fr)_360px]">
        <SectionCard
          title="Activos disponibles"
          description="Separamos los activos por cuenta para que el salto al detalle mantenga el contexto de moneda, instrumento y rendimiento."
        >
          <div className="space-y-7">
            {groupedPositions.map((group) => (
              <section key={group.account}>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-white">{group.account}</h3>
                    <p className="mt-1 text-sm text-text-muted">
                      {group.account === "Fintual USD"
                        ? "ETFs y acciones internacionales asociados a la cuenta en dólares."
                        : "Fondos mutuos, acciones locales y liquidez disponibles en pesos chilenos."}
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
          title="Cómo usar esta vista"
          description="La idea es entrar primero al índice de activos y desde aquí bajar al detalle puntual del símbolo que quieras revisar."
        >
          <div className="space-y-4">
            {[
              "Los activos en Fintual USD concentran ETFs y acciones internacionales.",
              "Los activos en Fintual CLP incluyen fondos mutuos locales, acciones chilenas y liquidez.",
              "Si quieres cambiar de moneda o cuenta, usa primero la vista de Cuentas y luego entra al activo correspondiente."
            ].map((detail) => (
              <article key={detail} className="rounded-[20px] border border-border-soft bg-surface/55 px-5 py-4">
                <p className="text-sm leading-[1.6] text-text-muted">{detail}</p>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </DashboardShell>
  );
}
