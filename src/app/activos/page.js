import { auth } from "@clerk/nextjs/server";

import { AssetCard } from "@/src/components/assets/asset-card";
import { DashboardShell } from "@/src/components/dashboard-shell";
import { SectionCard } from "@/src/components/section-card";
import { shouldRedirectToSignIn } from "@/src/lib/auth-mode";
import { getPositionsWithAssets } from "@/src/lib/mock-data";

const accountOrder = ["Fintual USD", "Fintual CLP"];

export default async function AssetsPage() {
  const { isAuthenticated, redirectToSignIn } = await auth();

  if (shouldRedirectToSignIn(isAuthenticated)) return redirectToSignIn();

  const positions = getPositionsWithAssets();
  const groupedPositions = accountOrder
    .map((account) => ({
      account,
      positions: positions.filter((position) => position.account === account)
    }))
    .filter((group) => group.positions.length > 0);

  return (
    <DashboardShell
      title="Activos"
      description="Lista de activos presentes en el portafolio del usuario, considerando todas sus cuentas vinculadas."
    >
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
    </DashboardShell>
  );
}
