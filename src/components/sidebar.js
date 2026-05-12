"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/hello_world", label: "Conexión Hello World" },
  { href: "/portafolio", label: "Portafolio" },
  { href: "/activos/SPY", label: "Activos" },
  { href: "/cuentas", label: "Cuentas" },
  { href: "/perfil", label: "Perfil / Mis datos" },
  { href: "/alertas", label: "Alertas" },
  { href: "/recomendaciones", label: "Recomendaciones" }
];

export function Sidebar() {
  const pathname = usePathname();
  const isActive = (href) => (href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <aside className="w-full rounded-[28px] border border-border-soft bg-panel p-5 lg:min-h-[calc(100vh-48px)] lg:w-72">
      <div className="mb-7 flex items-center gap-3">
        <div className="flex h-[42px] w-[42px] items-center justify-center rounded-2xl bg-accent text-sm font-black text-[#041f1b]">
          O
        </div>
        <div>
          <p className="text-[18px] leading-tight font-semibold">Orion</p>
          <p className="text-sm text-text-muted">Panel de inversiones</p>
        </div>
      </div>

      <nav className="grid gap-2" aria-label="Navegación principal">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex min-h-11 items-center justify-between rounded-2xl px-4 text-sm font-[650] transition ${
              isActive(item.href)
                ? "bg-panel-soft text-white"
                : "text-text-muted hover:bg-panel-soft hover:text-white"
            }`}
          >
            <span>{item.label}</span>
            {isActive(item.href) ? <span className="h-[7px] w-[7px] rounded-full bg-accent" /> : null}
          </Link>
        ))}
      </nav>

      <div className="mt-7 rounded-[18px] border border-border-soft bg-panel-soft p-[14px]">
        <p className="text-sm font-semibold text-white">Datos por carga manual</p>
        <p className="mt-2 text-sm text-text-muted">
          El dashboard debe mostrar cuándo fue la última importación y qué certificado falta para confiar en los números.
        </p>
      </div>
    </aside>
  );
}
