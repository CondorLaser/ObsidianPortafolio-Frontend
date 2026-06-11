"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navigation = [
  { href: "/portafolio", label: "Portafolio" },
  { href: "/activos", label: "Activos" },
  { href: "/cuentas", label: "Cuentas" },
  { href: "/perfil", label: "Perfil / Mis datos" },
  { href: "/alertas", label: "Alertas" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  // Cargar estado de localStorage al montar
  useEffect(() => {
    const saved = localStorage.getItem("sidebarExpanded");
    if (saved !== null) {
      setIsExpanded(JSON.parse(saved));
    }
  }, []);
  // Guardar en localStorage cuando cambia
  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem("sidebarExpanded", JSON.stringify(newState));
  };

  const isActive = (href) => (href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <aside className={`rounded-[28px] border border-border-soft bg-panel p-5 transition-all duration-300 ${
      isExpanded ? "w-full lg:w-72" : "w-full lg:w-34"
      } lg:min-h-[calc(100vh-48px)]`}>
      


      <div className="mb-7 flex items-center gap-3">
        <div className=" flex items-center gap-1">
          <div className="flex h-[42px] w-[42px] items-center justify-center rounded-2xl bg-accent text-sm font-black text-[#041f1b]">
            O
          </div>
          <button
              onClick={toggleSidebar}
              className="
                flex h-9 w-9 shrink-0 items-center justify-center
                rounded-lg
                text-text-muted
                hover:bg-panel-soft
                hover:text-white
                transition-all
              "
              aria-label="Toggle sidebar"
            >
              {isExpanded ? "◀" : "▶"}
            </button>
            
            
        </div>
        
        {isExpanded && (
            <div>
            <p className="text-[18px] leading-tight font-semibold">Orion</p>
            <p className="text-sm text-text-muted">Panel de inversiones</p>
          </div>
        )}
        
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
      
      {isExpanded && (
        <div>
          <div className="mt-7 rounded-[18px] border border-border-soft bg-panel-soft p-[14px]">
          <p className="text-sm font-semibold text-white">Carga de datos</p>
          <p className="mt-2 text-sm text-text-muted">
            Recuerda que para cargar o actualizar tus datos debes subir tus Certificados de Transacciones en la pestaña de <b>Perfil/Mis datos</b>.
          </p>
        </div>
        <div className="mt-7 rounded-[18px] border border-border-soft bg-panel-soft p-[14px]">
          <p className="text-sm font-semibold text-white">Creación de cuentas</p>
          <p className="mt-2 text-sm text-text-muted">
            Recuerda que puedes crear nuevas cuentas en la pestaña de <b>Cuentas</b>.
          </p>
        </div>
        </div>
      )}
      
    </aside>
  );
}
