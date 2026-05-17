import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { DashboardShell } from "@/src/components/dashboard-shell";
import { SectionCard } from "@/src/components/section-card";
import { accountCards } from "@/src/lib/account-detail-config";

export default async function AccountsPage() {
  const { isAuthenticated, redirectToSignIn } = await auth();

  if (!isAuthenticated) return redirectToSignIn();

  return (
    <DashboardShell
      title="Cuentas"
      description="Selecciona una cuenta para revisar su evolución, posiciones vinculadas y contexto operativo."
    >
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.9fr]">
        <SectionCard
          title="Cuentas disponibles"
          description="Cada cuenta conserva su moneda, estado de sincronización y accesos separados para no mezclar el contexto de USD y CLP."
        >
          <div className="grid gap-5 md:grid-cols-2">
            {accountCards.map((account) => (
              <Link
                key={account.slug}
                href={`/cuentas/${account.slug}`}
                className="group rounded-[24px] border border-border-soft bg-surface/65 p-6 transition hover:border-accent/35 hover:bg-panel"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-[760] uppercase tracking-[0.16em] text-accent">Cuenta {account.shortLabel}</p>
                    <h2 className="mt-3 text-[28px] leading-[1.05] font-semibold tracking-[-0.03em] text-white">
                      {account.name}
                    </h2>
                  </div>
                  <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">{account.share}</span>
                </div>

                <p className="mt-4 max-w-[28ch] text-sm leading-[1.6] text-text-muted">{account.description}</p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[18px] border border-border-soft bg-panel-soft p-4">
                    <p className="text-xs uppercase tracking-[0.12em] text-text-muted">Monto total</p>
                    <p className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-white">{account.amount}</p>
                  </div>
                  <div className="rounded-[18px] border border-border-soft bg-panel-soft p-4">
                    <p className="text-xs uppercase tracking-[0.12em] text-text-muted">Posiciones</p>
                    <p className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-white">{account.accountCountLabel}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-4 rounded-[18px] border border-border-soft bg-panel-soft px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{account.status}</p>
                    <p className="mt-1 text-xs text-text-muted">Variación reciente {account.change}</p>
                  </div>
                  <span className="inline-flex min-h-10 items-center rounded-2xl border border-border-soft px-4 text-sm font-semibold text-white transition group-hover:border-accent/35 group-hover:text-accent">
                    Ver cuenta
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Cómo usar esta vista"
          description="La idea es que primero elijas la cuenta y luego profundices en sus activos, sin perder el contexto de moneda y origen de datos."
        >
          <div className="space-y-4">
            {[
              "Fintual USD agrupa ETFs y acciones internacionales.",
              "Fintual CLP concentra fondos locales, acciones chilenas y caja operativa.",
              "Cada detalle de cuenta muestra solo los activos vinculados a esa fuente."
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
