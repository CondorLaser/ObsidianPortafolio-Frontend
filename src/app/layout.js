import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { MswProvider } from "../components/msw/msw-provider";
import { isE2eMode } from "@/src/lib/auth-mode";

export const metadata = {
  title: "Orion Portafolio",
  description: "Dashboard para seguimiento de inversiones"
};

export default function RootLayout({ children }) {
  // Ideas de variaciones para el fondo:
  // [radial-gradient(circle_at_top,#183250_0%,#08111f_55%)]
  // [radial-gradient(circle_at_top,#0b3d46_0%,#0a2e38_40%,#063a2b_70%,#00a83a_100%)]
  // [#0a2e38]

  // Guardo esto aquí como referencia del fondo para después
  const appShell = (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#0b3d46_0%,#0a2e38_40%,#063a2b_70%,#00a83a_100%)]">
      <header className="bg-gray-800/40 flex justify-between items-center pl-3 pr-6 h-22 border-gray-700/50">
        <div className="bg-stone-100/85 w-40 h-22 absolute left-0"></div>
        <div className="flex relative ">
          <Link href="/">
            <Image
              src="/assets/logo2.png"
              height={13}
              width={135}
              alt="Orion logo"
              className="h-auto"
            />
          </Link>
        </div>
        <div className="flex items-center gap-3 font-bold" >
          {isE2eMode() ? (
            <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
              Modo prueba
            </span>
          ) : (
            <>
              <Show when="signed-out">
                <SignInButton>
                  <button className="bg-accent hover:bg-teal-600/90 text-white rounded-lg font-bold text-sm h-10 px-4 transition-colors duration-200">
                    Iniciar Sesión
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="bg-transparent hover:bg-stone-100/20 text-stone-300 border border-stone-300 rounded-lg font-semibold text-sm h-10 px-4 transition-colors duration-200">
                    Registrarse
                  </button>
                </SignUpButton>
              </Show>

              <Show when="signed-in">
                <UserButton />
              </Show>
            </>
          )}
        </div>
      </header>

      {children}
    </div>
  );

  return (
    <html lang="es">
      <body className="bg-app text-white antialiased">
        {isE2eMode() ? (
          <MswProvider>{appShell}</MswProvider>
        ) : (
          <ClerkProvider>
            <MswProvider>{appShell}</MswProvider>
          </ClerkProvider>
        )}
      </body>
    </html>
  );
}
