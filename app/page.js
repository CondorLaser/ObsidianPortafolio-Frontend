import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#183250_0%,#08111f_55%)] px-4 py-10 lg:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <section>
          <p className="text-sm uppercase tracking-[0.35em] text-accent">Orion Portafolio</p>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight lg:text-7xl">
            Visualiza tus inversiones de forma clara, simple y accionable.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-muted">
            Esta base en Next.js deja listo el frontend para construir dashboard, activos,
            cuentas, alertas y recomendaciones con una estructura facil de seguir.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/portafolio"
              className="rounded-2xl bg-accent px-5 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Ir al portafolio
            </Link>
            <Link
              href="/perfil"
              className="rounded-2xl border border-border-soft px-5 py-3 font-semibold text-white transition hover:bg-panel-soft"
            >
              Ver perfil
            </Link>
          </div>
        </section>

        <section className="rounded-[2rem] border border-border-soft bg-panel p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-panel-soft p-5">
              <p className="text-sm text-text-muted">Patrimonio total</p>
              <p className="mt-3 text-3xl font-semibold">$93.591</p>
            </div>
            <div className="rounded-3xl bg-panel-soft p-5">
              <p className="text-sm text-text-muted">Retorno no realizado</p>
              <p className="mt-3 text-3xl font-semibold">$6.422</p>
            </div>
            <div className="rounded-3xl bg-panel-soft p-5 sm:col-span-2">
              <p className="text-sm text-text-muted">Vistas listas para construir</p>
              <p className="mt-3 text-lg font-semibold">
                Portafolio, activos, cuentas, perfil, alertas y recomendaciones.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
