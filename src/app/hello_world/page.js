import { DashboardShell } from "@/src/components/dashboard-shell";
import { SectionCard } from "@/src/components/section-card";
import { FetchButton } from "@/src/components/fetch-button";
import { getServerAuth } from "@/src/lib/auth-mode";
import { shouldRedirectToSignIn } from "@/src/lib/auth-mode-client";

export default async function HelloWorldPage() {
  const { isAuthenticated, redirectToSignIn, userId} = await getServerAuth()

  if (shouldRedirectToSignIn(isAuthenticated)) return redirectToSignIn()

  return (
    <DashboardShell
      title="Hello World"
    >
      <div className="mt-6">
        <SectionCard title="Conexión con Backend" description="Presiona el botón para probarlo.">
          <FetchButton></FetchButton>
        </SectionCard>
      </div>
    </DashboardShell>
  );
}
