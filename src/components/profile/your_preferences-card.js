"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { CollapsableShell } from "../collapsable-shell";

export function YourPreferencesCard() {
  const [loading, setLoading] = useState(false);
  const [loadingPreferences, setLoadingPreferences] = useState(true);
  const [message, setMessage] = useState(null);
  const [preferences, setPreferences] = useState({
    pnl_percentage_account_daily: 10,
    pnl_percentage_asset_daily: 8,
    max_drawdown_portfolio_daily: 7,
    max_drawdown_account_daily: 14,

    asset_weight_weekly: 35,
    currency_exposure_weekly: 50,
  });
  const { getToken } = useAuth();

  async function fetchPreferences() {
    try {
      setLoadingPreferences(true);
      setMessage(null);
      const token = await getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BE}/preferences`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener las preferencias");
      }
      
      const preferences_data = await response.json();
      
      setPreferences({
        pnl_percentage_account_daily:
          preferences_data.pnl_percentage_account_daily !== null
          ? Number(preferences_data.pnl_percentage_account_daily)
          : 1,
        pnl_percentage_asset_daily: 
          preferences_data.pnl_percentage_asset_daily !== null
          ? Number(preferences_data.pnl_percentage_asset_daily)
          : 1,
        max_drawdown_portfolio_daily: 
          preferences_data.max_drawdown_portfolio_daily !== null
          ? Number(preferences_data.max_drawdown_portfolio_daily)
          : 1,
        max_drawdown_account_daily:
          preferences_data.max_drawdown_account_daily !== null
          ? Number(preferences_data.max_drawdown_account_daily)
          : 1,
        asset_weight_weekly:
          preferences_data.asset_weight_weekly !== null
          ? Number(preferences_data.asset_weight_weekly)
          : 1,
        currency_exposure_weekly:
          preferences_data.currency_exposure_weekly !== null
          ? Number(preferences_data.currency_exposure_weekly)
          : 1,
      });
      setMessage("Preferencias cargadas correctamente");
    } catch (error) {
      console.error(error);
      setMessage("No se pudieron obtener las preferencias");
    } finally {
      setLoadingPreferences(false);
    }
  }

  useEffect(() => {
    fetchPreferences();
  }, [getToken]);


  function handleChange(key, value) {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function savePreferences() {
    try {
      setLoading(true);
      setMessage(null);
      const token = await getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BE}/preferences`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(preferences),
        }
      );
      console.log(JSON.stringify(preferences))

      if (!response.ok) {
        throw new Error("Error guardando preferencias");
      }

      setMessage("Preferencias guardadas correctamente");
    } catch (error) {
      console.error(error);
      setMessage("No se pudieron guardar las preferencias");
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    {
      key: "pnl_percentage_account_daily",
      label: "Ganancia/Pérdida (P&L %) diaria por Cuenta",
      description:
        "Avísame si una de mis cuentas cae (pierde)/sube (gana) más de este % en un solo día",
      suffix: "%",
      min: 1,
      max: 100,
    },
    {
      key: "pnl_percentage_asset_daily",
      label: "Ganancia/Pérdida (P&L %) diaria por Activo",
      description:
        "Avísame si uno de mis activos cae (pierde)/sube (gana) más de este % en un solo día",
      suffix: "%",
      min: 1,
      max: 100,
    },
    {
      key: "max_drawdown_portfolio_daily",
      label: "Máximo drawdown del Portafolio",
      description:
        "Avísame si mi el valor total de mi portafolio ha caído este % respecto a su valor máximo histórico",
      suffix: "%",
      min: 1,
      max: 100,
    },
    {
      key: "max_drawdown_account_daily",
      label: "Máximo drawdown por Cuenta",
      description:
        "Avísame si el valor total de una de mis cuentas ha caído este % respecto a su valor máximo histórico",
      suffix: "%",
      min: 1,
      max: 100,
    },
    {
      key: "asset_weight_weekly",
      label: "Peso máximo por activo (Concentración)",
      description:
        "Avísame si un solo activo pasa a representar más de este % de todo mi portafolio",
        
      suffix: "%",
      min: 1,
      max: 100,
    },
    {
      key: "currency_exposure_weekly",
      label: "Exposición máxima por moneda (FX)",
      description:
        "Avísame si más de este % de mi dinero queda expuesta a USD o CLP",
      suffix: "%",
      min: 1,
      max: 100,
    },
  ];

  return (
    <CollapsableShell
      title="Preferencias de Alertas"
      description="Define los umbrales que activarán alertas automáticas sobre cambios importantes en tu portafolio"
    >
      <div className="space-y-6">
        {fields.map((field) => (
          <div
            key={field.key}
            className="rounded-2xl border border-border-soft bg-panel p-5"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              
              {/* Text */}
              <div className="max-w-2xl">
                <h3 className="text-lg font-semibold">
                  {field.label}
                </h3>

                <p className="mt-1 text-sm text-text-muted">
                  {field.description}
                </p>
              </div>

              {/* Input */}
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={field.step || 1}
                  value={preferences[field.key]}
                  onChange={(e) =>
                    handleChange(field.key, Number(e.target.value))
                  }
                  className="w-48 accent-accent"
                />

                <div className="min-w-[70px] rounded-xl bg-panel-soft px-3 py-2 text-center text-sm font-medium">
                  {preferences[field.key]}
                  {field.suffix}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Save Button + Menssage */}
        <div className="flex items-center justify-between mt-2">
              {message ? (
                <p className="text-sm text-text-muted">
                  {message}
                </p>
              ) : (
                <div />
              )}

              <div className="font-bold">
                <button
                  type="button"
                  onClick={savePreferences}
                  disabled={loading}
                  className="
                    rounded-2xl bg-accent px-5 py-3
                    font-bold text-black
                    transition hover:scale-[1.02]
                    disabled:cursor-not-allowed disabled:opacity-50
                  "
                >
                  {loading
                    ? "Guardando..."
                    : "Guardar preferencias"}
                </button>
              </div>
            </div>
      </div>
    </CollapsableShell>
  );
}