"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppAuth } from "@/src/lib/client-auth";
import { DashboardShell } from "@/src/components/dashboard-shell";
import { AccountCard } from "@/src/components/accounts/account-card";
import { CreateAccountForm } from "@/src/components/accounts/create-account-form";

async function fetchAccounts(getToken) {
  const baseUrl = process.env.NEXT_PUBLIC_URL_BE || "";
  const token = await getToken();
  const response = await fetch(`${baseUrl}/accounts/with-counters`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Error en el servidor");
  }

  return response.json();
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [creationFeedback, setCreationFeedback] = useState(null);

  const { getToken } = useAppAuth();

  useEffect(() => {
    async function loadAccounts() {
      try {
        setLoading(true);
        const data = await fetchAccounts(getToken);
        setAccounts(data);
      } catch (error) {
        console.error("Fetch Accounts Error:", error);
        setAccounts(null); // Caso de error v/s [] cuando no hay cuenta
      } finally {
        setLoading(false);
      }
    }

    loadAccounts();
  }, [getToken]);

  async function handleCreateAccount(payload) {
    const baseUrl = process.env.NEXT_PUBLIC_URL_BE || "";
    const token = await getToken();
    const response = await fetch(`${baseUrl}/accounts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let message = "No se pudo crear la cuenta.";

      try {
        const errorBody = await response.json();
        message = errorBody.detail || message;
      } catch {
        // Si el backend no responde JSON, dejamos el mensaje por defecto.
      }

      throw new Error(message);
    }

    const refreshedAccounts = await fetchAccounts(getToken);
    setAccounts(refreshedAccounts);
    setCreationFeedback(`Cuenta "${payload.name}" creada correctamente.`);
    setIsCreatingAccount(false);
  }

  return (
    <DashboardShell
      title="Cuentas"
      description="Selecciona una cuenta para revisar su evolución, posiciones vinculadas y métricas."
      actions={
        <button
          type="button"
          onClick={() => {
            setCreationFeedback(null);
            setIsCreatingAccount((current) => !current);
          }}
          className="rounded-2xl bg-accent px-5 py-3 text-sm font-bold text-black transition hover:scale-[1.02]"
        >
          <div className="font-bold">
          {isCreatingAccount ? "Cerrar formulario" : "Nueva cuenta"}
          </div>
          
        </button>
      }
    >
      <div className="grid gap-6">
          {creationFeedback ? (
            <div className="rounded-[24px] border border-emerald-500/20 bg-emerald-500/8 p-4 text-sm text-emerald-300">
              {creationFeedback}
            </div>
          ) : null}

          {isCreatingAccount ? (
            <CreateAccountForm
              onCancel={() => setIsCreatingAccount(false)}
              onCreate={handleCreateAccount}
            />
          ) : null}

          {//CASO: Cargando datos
          loading ? (
            <div className="text-center py-8 text-sm text-text-muted animate-pulse">
              Cargando cuentas...
            </div>
          ) : 
          
          // CASO: Error de la request
          accounts === null ? (
            <div className="rounded-[24px] border border-red-500/20 bg-red-500/5 p-8 text-center">
              <p className="text-sm font-medium text-red-400">
                Hubo un error de conexión con el servidor al intentar cargar tus cuentas.
              </p>
              <p className="mt-1 text-xs text-text-muted">
                Por favor, inténtalo de nuevo más tarde o verifica el estado de tu conexión.
              </p>
            </div>
          ) : 
          
          //CASO 3: usuario sin cuentas
          accounts.length === 0 ? (
            <>
              <div className="flex  w-full flex-col items-center justify-center rounded-[22px] border border-dashed border-border-soft bg-panel p-8 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white">
                  Parece que aún no tienes cuentas creadas
                </h3>
                <h3 className="text-base font-semibold text-text-muted">
                  Por favor crea una cuenta nueva para poder vincular tus datos
                </h3>
                <div className="text-left">
                  <li className="mt-2 max-w-sm text-sm text-text-muted leading-[1.6]">
                    Una vez creada tu cuenta, accede a la pestaña <b>Perfil</b> para poder asociar los datos de tus Certificados de Transacciones a la cuenta
                  </li>
                  <li className="mt-2 max-w-sm text-sm text-text-muted leading-[1.6]">
                    Considera que cuentas en dólares (USD) solo admiten asociar activos de tipos <b>Stocks</b>  y <b>ETF</b>, mientras que las en pesos chilenos (CLP) solo permiten <b>Funds</b> (fondos mutuos)
                  </li>
                </div>
              
              </div>
            </>
            
          ) : (
          //CASO 4: Despliegue de las cuentas mockeadas
          <div className="grid gap-5 md:grid-cols-2">
            {accounts.map((account) => (
              <AccountCard
                key={account.account.id}
                account={account}
              />
            ))}
          </div>

          )}
        
      </div>
    </DashboardShell>
  );
}
