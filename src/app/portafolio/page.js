import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { DashboardShell } from "@/src/components/dashboard-shell";
import { MetricCard } from "@/src/components/metric-card";
import { SimpleChart } from "@/src/components/simple-chart";
import { shouldRedirectToSignIn } from "@/src/lib/auth-mode";
import {
  accountDistribution,
  certificateStatus,
  getPositionsWithAssets,
  portfolioSummary,
  portfolioTrend
} from "@/src/lib/mock-data";

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

function QuickAction({ href, label, muted = false }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-14 items-center justify-center rounded-[20px] border px-6 text-base font-semibold transition ${
        muted
          ? "border-border-soft bg-transparent text-white hover:border-accent/30 hover:text-accent"
          : "border-transparent bg-accent text-[#03241f] hover:brightness-110"
      }`}
    >
      {label}
    </Link>
  );
}

function DistributionRow({ item }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[18px] font-semibold text-white">{item.name}</p>
        <div className="flex min-w-[210px] items-center gap-4">
          <div className="h-3 flex-1 rounded-full bg-[#2d374c]">
            <div className="h-full rounded-full bg-accent" style={{ width: item.value }} />
          </div>
          <span className="text-[18px] font-bold text-white">{item.value}</span>
        </div>
      </div>
      <div className="rounded-[20px] border border-border-soft bg-surface px-6 py-6">
        <p className="text-sm text-text-muted">{item.name.includes("USD") ? "Acciones y ETFs" : "Fondos mutuos"}</p>
        <p className="mt-3 font-mono text-[18px] font-bold tracking-[-0.02em] text-white">
          {item.name.includes("USD") ? certificateStatus[0]?.status : certificateStatus[1]?.status}{" "}
          {item.name.includes("USD") ? certificateStatus[0]?.detail : certificateStatus[1]?.detail}
        </p>
      </div>
    </div>
  );
}

function PositionRow({ position }) {
  return (
    <tr className="border-t border-border-soft align-middle transition hover:bg-accent/5 first:border-t-0">
      <td className="px-5 py-5 align-middle">
        <Link
          href={`/activos/${encodeURIComponent(position.symbol)}`}
          className="inline-flex max-w-full items-center gap-3 rounded-[14px] outline-offset-4"
        >
          <div className="grid h-[38px] w-[38px] place-items-center rounded-[12px] border border-border-soft bg-surface font-mono text-xs font-extrabold text-white">
            {position.symbol}
          </div>
          <div className="min-w-0 max-w-[260px]">
            <p className="text-[15px] font-semibold leading-[1.2] text-white">{position.symbol}</p>
            <p className="mt-[3px] text-[13px] leading-[1.35] text-text-muted">{position.name}</p>
          </div>
        </Link>
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-[14px] font-semibold text-white">{position.type}</td>
      <td className="whitespace-nowrap px-3 py-5 text-[14px] font-semibold text-white">{position.account}</td>
      <td className="whitespace-nowrap px-3 py-5 text-right text-[14px] font-semibold text-white">{position.quantity}</td>
      <td className="whitespace-nowrap px-3 py-5 text-right text-[14px] font-semibold text-white">{position.currentPrice}</td>
      <td className="whitespace-nowrap px-3 py-5 text-right text-[14px] font-semibold text-white">{position.totalValue}</td>
      <td
        className={`whitespace-nowrap px-3 py-5 text-right text-[14px] font-bold ${
          position.returnPct.startsWith("-") ? "text-danger" : "text-success"
        }`}
      >
        {position.returnPct}
      </td>
      <td className="px-3 py-5 text-right">
        <Link
          href={`/activos/${encodeURIComponent(position.symbol)}`}
          className="inline-flex min-h-[34px] min-w-[110px] items-center justify-center whitespace-nowrap rounded-full border border-border-soft px-[10px] text-[12px] font-semibold text-white transition hover:border-accent/30 hover:bg-accent/10 hover:text-accent"
        >
          Ver detalle
        </Link>
      </td>
    </tr>
  );
}

export default async function PortfolioPage() {
  const { isAuthenticated, redirectToSignIn } = await auth();
  const positions = getPositionsWithAssets();

  if (shouldRedirectToSignIn(isAuthenticated)) return redirectToSignIn();

  return (
    <DashboardShell
      title="Dashboard del portafolio"
      description="Resumen general de inversiones, cuentas activas, composicion y posiciones abiertas, con estado de frescura de certificados."
      actions={
        <>
          <QuickAction href="/alertas" label="Ver alertas" muted />
          <QuickAction href="/perfil" label="Actualizar datos" />
        </>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[1.35fr_repeat(3,minmax(0,1fr))]">
        <MetricCard
          label="Valor total del portafolio"
          value={portfolioSummary.totalValue}
          helper={portfolioSummary.dataFreshness}
          helperTone="pill"
          hero
        />
        <MetricCard
          label="Retorno no realizado"
          value={portfolioSummary.totalReturn}
          helper={portfolioSummary.totalReturnPct}
          helperTone="pill"
        />
        <MetricCard
          label="Posiciones activas"
          value={portfolioSummary.activePositions}
          helper="Activos visibles en tabla"
          helperTone="muted"
        />
        <MetricCard
          label="Cuentas vinculadas"
          value={portfolioSummary.linkedAccounts}
          helper={portfolioSummary.pendingItems}
          helperTone="muted"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <section className="rounded-[28px] border border-border-soft bg-panel-soft p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-white">Evolución del portafolio</h2>
              <p className="mt-2 text-[14px] text-text-muted">Serie visual de referencia hasta conectar histórico real.</p>
            </div>
            <StatusPill tone="accent" className="border-none bg-accent/12 px-4 py-2 font-mono text-sm normal-case">
              mock-data.js
            </StatusPill>
          </div>

          <SimpleChart
            className="h-[404px] rounded-[22px] border border-border-soft bg-surface"
            data={portfolioTrend.map((item) => item.value)}
            labels={portfolioTrend.map((item) => item.label)}
          />
        </section>

        <section className="rounded-[28px] border border-border-soft bg-panel-soft p-6">
          <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-white">Distribución y frescura</h2>
          <p className="mt-2 text-[14px] text-text-muted">Estado mínimo que faltaba en el dashboard actual.</p>

          <div className="mt-10 space-y-5">
            {accountDistribution.map((item) => (
              <DistributionRow key={item.name} item={item} />
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6">
        <section className="rounded-[28px] border border-border-soft bg-panel-soft p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-white">Activos principales</h2>
              <p className="mt-2 text-[14px] text-text-muted">
                Activos principales del portafolio. Cada fila conserva el contexto de cuenta, cantidad y retorno, y
                lleva a la ficha{" "}
                <span className="rounded-full bg-accent/12 px-3 py-1 font-mono text-accent">/activos/[symbol]</span>.
              </p>
            </div>
          </div>

          <div className="mt-7 overflow-x-auto">
            <table className="w-full min-w-[980px] border-separate border-spacing-0 text-left">
              <thead>
                <tr className="text-[12px] uppercase tracking-[0.1em] text-text-muted">
                  <th className="w-[38%] px-5 pb-4 font-semibold">Activo</th>
                  <th className="w-[10%] px-3 pb-4 font-semibold">Tipo</th>
                  <th className="w-[14%] px-3 pb-4 font-semibold">Cuenta</th>
                  <th className="w-[8%] px-3 pb-4 text-right font-semibold">Cantidad</th>
                  <th className="w-[8%] px-3 pb-4 text-right font-semibold">Precio</th>
                  <th className="w-[10%] px-3 pb-4 text-right font-semibold">Valor total</th>
                  <th className="w-[6%] px-3 pb-4 text-right font-semibold">Retorno</th>
                  <th className="w-[12%] px-3 pb-4 text-right font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => (
                  <PositionRow key={`${position.account}-${position.symbol}`} position={position} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
