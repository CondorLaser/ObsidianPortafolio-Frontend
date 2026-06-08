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
  const response = await fetch(`${baseUrl}/accounts`, {
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
            <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-border-soft bg-surface/35 p-12 text-center">
              <div className="max-w-md">
                <h3 className="text-lg font-semibold text-white">No se encontraron cuentas activas</h3>
                <p className="mt-2 text-sm leading-[1.6] text-text-muted">
                  Para reconstruir tu portafolio y ver tus cuentas, es necesario que primero cargues tus Certificados de Transacciones en la plataforma.
                </p>
                
                <div className="mt-6">
                  <Link
                    href="/perfil"
                    className="inline-flex items-center justify-center rounded-2xl bg-accent px-5 py-3 text-sm font-bold text-black transition hover:scale-[1.02]"
                  >
                    Ir a Perfil / Mis Datos
                  </Link>
                </div>
              </div>
            </div>
          ) : (
          //CASO 4: Despliegue de las cuentas mockeadas
          <div className="grid gap-5 md:grid-cols-2">
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
              />
            ))}
          </div>

          )}
        
      </div>
    </DashboardShell>
  );
}
