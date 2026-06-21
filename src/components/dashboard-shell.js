import { Sidebar } from "@/src/components/sidebar";

export function DashboardShell({ title, description, children, actions }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#152846_0%,#08111f_55%)] px-4 py-6 lg:px-6">
      <div className="mx-auto grid max-w-[1440px] gap-6 lg:grid-cols-[auto_minmax(0,1fr)]">
        <Sidebar />

        <main className="rounded-[28px] border border-border-soft bg-panel p-[26px]">
          <div className="mb-8 flex flex-col gap-4 border-b border-border-soft pb-[22px] lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-accent">Orion Portafolio</p>
              <h1 className="mt-2 text-[clamp(32px,4vw,52px)] leading-[1.05] font-[650] tracking-[-0.025em]">
                {title}
              </h1>
              <p className="mt-[10px] max-w-[70ch] text-sm leading-[1.55] text-text-muted">{description}</p>
            </div>

            {actions ? <div className="flex flex-wrap gap-[10px] lg:justify-end">{actions}</div> : null}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
