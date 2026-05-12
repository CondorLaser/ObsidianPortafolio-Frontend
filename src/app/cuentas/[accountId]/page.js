import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { DashboardShell } from "@/src/components/dashboard-shell";
import { MetricCard } from "@/src/components/metric-card";
import { SectionCard } from "@/src/components/section-card";
import { SimpleChart } from "@/src/components/simple-chart";
import { accountCards, accountDetailConfig } from "@/src/lib/account-detail-config";
import { positions } from "@/src/lib/mock-data";

function getReturnTone(value) {
  if (value.startsWith("-")) return "text-danger";
  if (value === "0.00%") return "text-text-muted";
  return "text-success";
}

export default async function AccountDetailPage({ params }) {
  const { accountId } = await params;
  const { isAuthenticated, redirectToSignIn } = await auth();

  if (!isAuthenticated) return redirectToSignIn();

  const account = accountDetailConfig[accountId] ?? accountDetailConfig["fintual-usd"];
  const accountPositions = positions.filter((position) => position.account === account.name);

  const actions = (
    <>
      {accountCards.map((option) => {
        const active = option.slug === account.slug;

        return (
          <Link
            key={option.slug}
            href={`/cuentas/${option.slug}`}
            className={`inline-flex min-h-[44px] items-center rounded-[16px] border px-4 text-sm font-semibold transition ${
              active
                ? "border-transparent bg-accent text-[#041f1b]"
                : "border-border-soft text-white hover:border-accent/40 hover:text-accent"
            }`}
          >
            {option.shortLabel}
          </Link>
        );
      })}
    </>
  );

  return (
    <DashboardShell
      title={`Cuenta: ${account.slug}`}
      description="Vista por cuenta para revisar su evolución, posiciones activas y el contexto operativo asociado a la moneda seleccionada."
      actions={actions}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Monto total invertido" value={account.amount} />
        <MetricCard label="Posiciones activas" value={account.accountCountLabel} />
        <MetricCard label="Dividendos acumulados" value={account.dividends} />
        <MetricCard label="Última transacción" value={account.lastTransaction} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <SectionCard
          title="Evolución del monto invertido"
          description={`Serie de referencia para ${account.name} mientras conectamos el histórico real de la cuenta.`}
        >
          <SimpleChart data={account.trend} labels={account.trendLabels} />
        </SectionCard>

        <SectionCard
          title={`Activos en ${account.shortLabel}`}
          description="La lista se filtra por cuenta para separar claramente posiciones en dólares y en pesos."
        >
          <div className="space-y-4">
            {accountPositions.map((position) => (
              <article key={position.symbol} className="rounded-[22px] border border-border-soft bg-surface/50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-[28px] leading-[1] font-semibold tracking-[-0.03em] text-white">{position.symbol}</p>
                      <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                        {position.type}
                      </span>
                    </div>
                    <p className="mt-2 text-[15px] leading-[1.55] text-text-muted">{position.name}</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  <p className="text-sm text-text-muted">
                    Cantidad: <span className="font-semibold text-white">{position.quantity}</span>
                  </p>
                  <p className="text-sm text-text-muted">
                    Último precio: <span className="font-semibold text-white">{position.currentPrice}</span>
                  </p>
                  <p className="text-sm text-text-muted">
                    Valor total: <span className="font-semibold text-white">{position.totalValue}</span>
                  </p>
                  <p className="text-sm text-text-muted">
                    Retorno: <span className={`font-semibold ${getReturnTone(position.returnPct)}`}>{position.returnPct}</span>
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4 text-sm">
                  <span className="text-text-muted">Fuente: {position.source}</span>
                  <Link
                    href={`/activos/${encodeURIComponent(position.symbol)}`}
                    className="inline-flex min-h-10 items-center rounded-2xl border border-border-soft px-4 font-semibold text-white transition hover:border-accent/35 hover:text-accent"
                  >
                    Ver activo
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </DashboardShell>
  );
}
