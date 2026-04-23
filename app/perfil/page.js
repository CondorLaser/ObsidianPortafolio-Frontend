import { DashboardShell } from "@/components/dashboard-shell";
import { SectionCard } from "@/components/section-card";

export default function ProfilePage() {
  return (
    <DashboardShell
      title="Perfil de usuario"
      description="Configura tu conexion con Fintual y completa los datos base del cliente para trabajar con el portafolio."
    >
      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-[#1b4d3d] bg-[linear-gradient(135deg,rgba(9,38,31,0.96),rgba(10,28,24,0.92))] p-5 shadow-[0_0_0_1px_rgba(16,185,129,0.05)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(16,185,129,0.16)] text-success">
                  <span className="h-2.5 w-2.5 rounded-full bg-success" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">Conectado a Fintual</p>
                  <p className="mt-1 text-sm text-[#9fd1c0]">
                    Tus datos se estan sincronizando automaticamente.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Desconectar
              </button>
            </div>
          </section>

          <SectionCard
            title="Informacion personal"
            description="Datos base del cliente para identificar la cuenta y completar el perfil."
          >
            <form className="grid gap-5 md:grid-cols-2">
              <InputField label="Nombre completo" defaultValue="Juan Perez" />
              <InputField label="Email" defaultValue="juan@ejemplo.com" />
              <InputField label="Telefono" defaultValue="+56 9 1234 5678" />
              <InputField label="Pais" defaultValue="Chile" />

              <div className="md:col-span-2">
                <button
                  type="button"
                  className="rounded-2xl bg-accent px-5 py-3 font-semibold text-white transition hover:opacity-90"
                >
                  Actualizar informacion
                </button>
              </div>
            </form>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard
            title="Conexion con Fintual"
            description="Estado de la credencial con la que luego consultaremos informacion desde la API."
          >
            <div className="rounded-2xl border border-border-soft bg-app/80 px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                    API Key configurada
                  </p>
                  <p className="mt-2 text-sm text-white">orion-****-1234</p>
                </div>
                <button
                  type="button"
                  className="rounded-2xl border border-border-soft px-4 py-2.5 text-sm font-semibold transition hover:bg-panel"
                >
                  Cambiar
                </button>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Cargar transacciones (CSV)"
            description="Sube un archivo CSV con transacciones para importarlas al sistema."
          >
            <p className="text-sm leading-6 text-text-muted">
              El archivo deberia incluir columnas como fecha, simbolo, tipo, cantidad y precio.
              Mas adelante conectamos la validacion y la importacion real.
            </p>

            <div className="mt-5 rounded-3xl border border-dashed border-accent/35 bg-app px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-2xl text-accent">
                ↑
              </div>
              <p className="mt-5 font-semibold text-white">Haz clic para seleccionar un archivo CSV</p>
              <p className="mt-2 text-sm text-text-muted">o arrastra y suelta aqui</p>
            </div>

            <button
              type="button"
              className="mt-4 text-sm font-semibold text-accent transition hover:opacity-85"
            >
              Descargar plantilla CSV
            </button>
          </SectionCard>

          <section className="rounded-3xl border border-border-soft bg-panel-soft p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-text-muted">Ultima sincronizacion</p>
                <p className="mt-2 text-lg font-semibold text-white">23 de abril de 2026, 19:25</p>
              </div>
              <span className="rounded-full bg-[rgba(16,185,129,0.14)] px-3 py-1 text-xs font-semibold text-success">
                Activa
              </span>
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}

function InputField({ label, defaultValue }) {
  return (
    <label className="text-sm text-text-muted">
      {label}
      <input
        className="mt-2 w-full rounded-2xl border border-border-soft bg-app px-4 py-3 text-white outline-none transition focus:border-accent/60"
        defaultValue={defaultValue}
      />
    </label>
  );
}
