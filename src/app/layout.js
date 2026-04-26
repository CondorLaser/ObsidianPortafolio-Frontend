import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import "./globals.css";

export const metadata = {
  title: "Orion Portafolio",
  description: "Dashboard para seguimiento de inversiones"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-app text-white antialiased">
        <ClerkProvider>
          <div className="min-h-screen bg-[radial-gradient(circle_at_top,#183250_0%,#08111f_55%)] ">
              <header className="bg-gray-800/90 flex justify-end items-center p-4 gap-6 h-16 pt-10 pb-9">
              <Show when="signed-out">
                <SignInButton>
                  <button className="bg-accent text-white rounded-xl font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                    <p className="font-bold">Iniciar Sesión</p>
                  </button>  
                </SignInButton>  
                <SignUpButton>
                  <button className="bg-accent text-white rounded-xl font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                    <p className="font-bold">Registrarse</p>
                  </button>
                </SignUpButton>
              </Show>

              <Show when="signed-in">
                <UserButton></UserButton>
              </Show>
            </header>
            {children}
          </div>
          
        </ClerkProvider>
      </body>
    </html>
  );
}
