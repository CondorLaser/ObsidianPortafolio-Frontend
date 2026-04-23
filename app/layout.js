import "./globals.css";

export const metadata = {
  title: "Orion Portafolio",
  description: "Dashboard para seguimiento de inversiones"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-app text-white antialiased">{children}</body>
    </html>
  );
}
