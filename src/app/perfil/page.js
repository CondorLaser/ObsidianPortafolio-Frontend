"use server"
import { DashboardShell } from "@/src/components/dashboard-shell";
import { auth } from "@clerk/nextjs/server";
import { YourDataCard } from "@/src/components/profile/your_data-card";
import { YourPreferencesCard } from "@/src/components/profile/your_preferences-card";
import { YourRiskProfileCard } from "@/src/components/profile/your_risk_profile-card";
import { shouldRedirectToSignIn } from "@/src/lib/auth-mode";

export default async function ProfilePage() {
  const { isAuthenticated, redirectToSignIn, userId } = await auth()

  if (shouldRedirectToSignIn(isAuthenticated)) return redirectToSignIn()
  
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
        <YourRiskProfileCard></YourRiskProfileCard>
      </div>
    </DashboardShell>
    
  );
}
