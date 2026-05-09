"use client";

import { useState } from "react";

import { CollapsableShell } from "./collapsable-shell";

export function YourPreferencesCard() {
  const [loading, setLoading] = useState(false);

  const [preferences, setPreferences] = useState({
    pnlPercentage: 10,
    priceChange: 15,

    dailyReturn: 2,
    weeklyReturn: 5,
    monthlyReturn: 10,

    volatility: 20,
    maxDrawdown: 15,

    diversification: 60,
    assetWeight: 35,
    currencyExposure: 50,

    sharpeRatio: 1.2,
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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/alerts/preferences`,
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
      key: "pnlPercentage",
      label: "Ganancia/Pérdida (%)",
      description:
        "Activa alertas cuando tu portafolio gane o pierda más de este porcentaje.",
      suffix: "%",
      min: 1,
      max: 100,
    },
    {
      key: "priceChange",
      label: "Cambio de precio",
      description:
        "Recibe alertas cuando un activo cambie rápidamente de precio.",
      suffix: "%",
      min: 1,
      max: 50,
    },
    {
      key: "dailyReturn",
      label: "Retorno diario",
      description:
        "Notifica según variaciones diarias del rendimiento.",
      suffix: "%",
      min: 1,
      max: 30,
    },
    {
      key: "weeklyReturn",
      label: "Retorno semanal",
      description:
        "Detecta variaciones importantes acumuladas durante la semana del rendimiento.",
      suffix: "%",
      min: 1,
      max: 50,
    },
    {
      key: "monthlyReturn",
      label: "Retorno mensual",
      description:
        "Activa alertas por movimientos relevantes del rendimeinto por mes.",
      suffix: "%",
      min: 1,
      max: 100,
    },
    {
      key: "volatility",
      label: "Volatilidad",
      description:
        "Recibe alertas cuando un activo o el portafolio se vuelva muy volátil.",
      suffix: "%",
      min: 1,
      max: 100,
    },
    {
      key: "maxDrawdown",
      label: "Máximo drawdown",
      description:
        "Detecta caídas fuertes desde precios máximos recientes.",
      suffix: "%",
      min: 1,
      max: 100,
    },
    {
      key: "diversification",
      label: "Nivel mínimo de diversificación",
      description:
        "Te alerta si tu portafolio queda demasiado concentrado.",
      suffix: "%",
      min: 1,
      max: 100,
    },
    {
      key: "assetWeight",
      label: "Peso máximo por activo",
      description:
        "Recibe alertas si un activo supera este peso dentro del portafolio (ve la relevancia de un activo con respecto a todo el portafolio).",
      suffix: "%",
      min: 1,
      max: 100,
    },
    {
      key: "currencyExposure",
      label: "Exposición máxima por moneda",
      description:
        "Controla cuánto del portafolio está expuesto a una moneda específica.",
      suffix: "%",
      min: 1,
      max: 100,
    },
    {
      key: "sharpeRatio",
      label: "Sharpe ratio mínimo",
      description:
        "Detecta deterioro en la relación riesgo-retorno del portafolio.",
      suffix: "",
      min: 0,
      max: 5,
      step: 0.1,
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