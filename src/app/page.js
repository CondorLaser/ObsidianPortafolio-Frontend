'use client'
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppAuth } from "@/src/lib/client-auth";

function SignedInHome() {
  const { getToken } = useAppAuth();

  useEffect(() => {
    const init = async () => {
      try {
        const token = await getToken();
        const baseUrl = process.env.NEXT_PUBLIC_URL_BE || "";
        const res = await fetch(`${baseUrl}/accounts`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("[init] accounts check", res.status);
      } catch (error) {
        console.error("[init] accounts check failed", error);
      }
    };

    init();
  }, [getToken]);

  return (
    <main className="min-h-screen px-4 lg:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <section>
          <p className="text-sm uppercase tracking-[0.35em] text-teal-200 font-bold">Orion Portafolio</p>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight lg:text-7xl">
            Visualiza tus inversiones de forma clara, simple e interactiva.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-muted">
            Esta es la base para construir el dashboard, presentar los activos,
            cuentas, alertas y recomendaciones con una estructura facil de seguir.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/portafolio" prefetch={false} className="bg-panel-soft hover:bg-teal-600/50 text-white rounded-xl font-bold text-sm h-11 px-4 py-3 transition-colors duration-200 transition hover:scale-[1.02]">
              Ir al portafolio
            </Link>
            <Link href="/perfil" prefetch={false} className="rounded-xl border-3 border-border-soft hover:border-teal-600/50 px-5 py-2 font-semibold text-white transition hover:bg-panel-soft">
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

function SignedOutHome() {
  return (
    <main className="min-h-screen px-4 lg:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <section>
          <p className="text-sm uppercase tracking-[0.35em] text-teal-200 font-bold">
            Orion Portafolio
          </p>

          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight lg:text-7xl">
            Visualiza tus inversiones de forma clara, simple e interactiva.
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-text-muted">
            Esta es la base para construir el dashboard, presentar los activos,
            cuentas, alertas y recomendaciones con una estructura facil de seguir.
          </p>
        </section>

        <div>
          <Image src="/assets/grafico_stock_1.jpg" height={500} width={500} alt="Orion logo" className="w-auto h-auto rounded-xl opacity-85"/>
        </div>
      </div>
    </main>
  );
}

function ClerkHomePage() {
  const { isSignedIn } = useUser();
  return isSignedIn ? <SignedInHome /> : <SignedOutHome />;
}

export default function HomePage() {
  const isE2eMode = process.env.NEXT_PUBLIC_E2E_MODE === "true";
  if (isE2eMode) return <SignedInHome />;
  return <ClerkHomePage />;
}
