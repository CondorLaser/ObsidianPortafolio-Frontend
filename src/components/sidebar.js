import Link from "next/link";

const navigation = [
  { href: "/portafolio", label: "Portafolio" },
  { href: "/activos/SPY", label: "Activos" },
  { href: "/cuentas/fintual-usd", label: "Cuentas" },
  { href: "/perfil", label: "Perfil / Mis datos" },
  { href: "/alertas", label: "Alertas" },
  { href: "/recomendaciones", label: "Recomendaciones" }
];

export function Sidebar() {
  return (
    <aside className="w-full rounded-3xl border border-border-soft bg-panel p-5 lg:w-72">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-sm font-bold">
          O
        </div>
        <div>
          <p className="text-lg font-semibold">Orion</p>
          <p className="text-sm text-text-muted">Panel de inversiones</p>
        </div>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-2xl px-4 py-3 text-sm text-text-muted transition hover:bg-panel-soft hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 rounded-2xl border border-border-soft bg-panel-soft p-4">
        <p className="text-sm font-semibold text-white">Carga manual habilitada</p>
        <p className="mt-2 text-sm text-text-muted">
          Esta base esta lista para recibir datos mock y luego conectarse al backend.
        </p>
      </div>
    </aside>
  );
}
