"use client";

import { useState } from "react";

import { CollapsableShell } from "./collapsable-shell";

export function YourPreferencesCard() {
  const [loading, setLoading] = useState(false);

  const [preferences, setPreferences] = useState({
    pnlPercentageAccountDaily: 10,
    pnlPercentageAssetDaily: 8,
    maxDrawdownPortfolioDaily: 7,
    maxDrawdownAccountDaily: 14,

    assetWeightWeekly: 35,
    currencyExposureWeekly: 50,
  });

  function handleChange(key, value) {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function savePreferences() {
    try {
      setLoading(true);
      console.log(preferences)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BE}/user/preferences`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(preferences),
        }
      );

      if (!response.ok) {
        throw new Error("Error saving preferences");
      }

      alert("Preferencias guardadas correctamente");
    } catch (error) {
      console.error(error);
      alert("No se pudieron guardar las preferencias");
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    {
      key: "pnlPercentageAccountDaily",
      label: "Ganancia/Pérdida (P&L %) diaria por Cuenta",
      description:
        "Avísame si una de mis cuentas cae (pierde)/sube (gana) más de este % en un solo día",
      suffix: "%",
      min: 1,
      max: 100,
    },
    {
      key: "pnlPercentageAssetDaily",
      label: "Ganancia/Pérdida (P&L %) diaria por Activo",
      description:
        "Avísame si uno de mis activos cae (pierde)/sube (gana) más de este % en un solo día",
      suffix: "%",
      min: 1,
      max: 100,
    },
    {
      key: "maxDrawdownPortfolioDaily",
      label: "Máximo drawdown del Portafolio",
      description:
        "Avísame si mi el valor total de mi portafolio ha caído este % respecto a su valor máximo histórico",
      suffix: "%",
      min: 1,
      max: 100,
    },
    {
      key: "maxDrawdownAccountDaily",
      label: "Máximo drawdown por Cuenta",
      description:
        "Avísame si el valor total de una de mis cuentas ha caído este % respecto a su valor máximo histórico",
      suffix: "%",
      min: 1,
      max: 100,
    },
    {
      key: "assetWeightWeekly",
      label: "Peso máximo por activo (Concentración)",
      description:
        "Avísame si un solo activo pasa a representar más de este % de todo mi portafolio",
        
      suffix: "%",
      min: 1,
      max: 100,
    },
    {
      key: "currencyExposureWeekly",
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
      description="Define los umbrales que activarán alertas automáticas sobre cambios importantes en tu portafolio."
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

        {/* Save Button */}
        <div className="flex justify-end pt-2 font-bold">
          <button
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
    </CollapsableShell>
  );
}