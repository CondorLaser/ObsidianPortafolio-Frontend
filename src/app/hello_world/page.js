import { DashboardShell } from "@/src/components/dashboard-shell";
import { SectionCard } from "@/src/components/section-card";
import { auth } from "@clerk/nextjs/server";
import { FetchButton } from "@/src/components/fetch-button";

export default async function HelloWorldPage() {
  const { isAuthenticated, redirectToSignIn, userId} = await auth()

  if (!isAuthenticated) return redirectToSignIn()

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