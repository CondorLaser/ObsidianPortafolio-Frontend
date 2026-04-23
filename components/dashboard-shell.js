import { Sidebar } from "@/components/sidebar";

export function DashboardShell({ title, description, children, actions }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#152846_0%,#08111f_55%)] px-4 py-6 lg:px-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[288px_minmax(0,1fr)]">
        <Sidebar />

        <main className="rounded-3xl border border-border-soft bg-panel p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-4 border-b border-border-soft pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-accent">Orion Portafolio</p>
              <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
              <p className="mt-2 max-w-2xl text-sm text-text-muted">{description}</p>
            </div>

            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
