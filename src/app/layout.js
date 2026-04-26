import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Orion Portafolio",
  description: "Dashboard para seguimiento de inversiones"
};

export default function RootLayout({ children }) {
  // [radial-gradient(circle_at_top,#183250_0%,#08111f_55%)]
  // Guardo esto aquí como referencia del fondo para después
  return (
    <html lang="es">
      <body className="bg-app text-white antialiased">
        <ClerkProvider>
          <div className="min-h-screen bg-[radial-gradient(circle_at_top,#0b3d46_0%,#0a2e38_40%,#063a2b_70%,#00a83a_100%)] ">
            <header className="bg-gray-800/40  flex justify-between items-center pl-3  pr-6 h-22 border-b border-gray-700/50">
              <div className="bg-stone-100/85 w-40 h-22 absolute left-0"></div>
              <div className="flex relative ">
                <Link href="/">
                  <Image 
                  src="/assets/logo2.png" 
                  height={13} 
                  width={135}
                  alt="Orion logo"
                  />
                </Link>
              </div>
              <div className="flex items-center gap-3 font-bold" >
                <Show when="signed-out">
                  <SignInButton>
                    <button className="bg-teal-500 hover:bg-teal-600/90 text-white rounded-lg font-bold text-sm h-10 px-4 transition-colors duration-200">
                      Iniciar Sesión
                    </button>  
                  </SignInButton>  
                  <SignUpButton>
                    <button className="bg-transparent hover:bg-stone-100/10 text-stone-300 border border-stone-300 rounded-lg font-semibold text-sm h-10 px-4 transition-colors duration-200">
                      Registrarse
                    </button>
                  </SignUpButton>
                </Show>

                <Show when="signed-in">
                  <UserButton />
                </Show>
              </div>
            </header>
            
            {children}
          </div>
          
        </ClerkProvider>
      </body>
    </html>
  );
}
