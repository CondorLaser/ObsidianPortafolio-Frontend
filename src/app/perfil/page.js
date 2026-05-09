"use server"
import { DashboardShell } from "@/src/components/dashboard-shell";
import { CollapsableShell } from "@/src/components/collapsable-shell";
import { auth } from "@clerk/nextjs/server";
import { YourDataCard } from "@/src/components/your_data-card";
import { YourPreferencesCard } from "@/src/components/your_preferences-card";

export default async function ProfilePage() {
  const { isAuthenticated, redirectToSignIn, userId } = await auth()

  if (!isAuthenticated) return redirectToSignIn()

  return (
    <DashboardShell
      title="Gestiona tus datos y preferencias"
      description="En las siguientes secciones gestiona los datos de tu portafolio y define tus preferencias y tu perfil de riesgo."
    >
      <div className="flex flex-col gap-6 justify-between">
        <YourDataCard
          etfsLastUploadDate={"28 de abril de 2026, 10:06"}
          fondosMutuosLastUploadDate={null}
        ></YourDataCard>
        <YourPreferencesCard></YourPreferencesCard>
      </div>
    </DashboardShell>
    
  );
}
