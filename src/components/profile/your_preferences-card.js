"use client";

import { useEffect, useState } from "react";
import { useAppAuth } from "@/src/lib/client-auth";
import { CollapsableShell } from "../collapsable-shell";
import { FeedbackCard } from "../feedback-card";

const API_BASE_URL = process.env.NEXT_PUBLIC_URL_BE || "";

const DEFAULT_PREFERENCES = {
  pnl_percentage_account_daily: 10,
  pnl_percentage_asset_daily: 8,
  max_drawdown_portfolio_daily: 7,
  max_drawdown_account_daily: 14,
  asset_weight_weekly: 35,
  currency_exposure_weekly: 50,
};

const PREFERENCE_FIELDS = [
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
      "Avísame si el valor total de mi portafolio ha caído este % respecto a su valor máximo histórico",
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
];

function normalizePreferenceValue(value, fallback) {
  if (value === null || value === undefined) {
    return undefined;
  }
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return fallback;
  }
  // Soporta tanto porcentajes enteros heredados (25) como ratios del backend
  return Math.abs(numericValue) <= 1 ? Math.round(numericValue * 100) : Math.round(numericValue);
}

function normalizePreferences(preferencesData) {
  return {
    pnl_percentage_account_daily: normalizePreferenceValue(
      preferencesData?.pnl_percentage_account_daily,
      DEFAULT_PREFERENCES.pnl_percentage_account_daily
    ),
    pnl_percentage_asset_daily: normalizePreferenceValue(
      preferencesData?.pnl_percentage_asset_daily,
      DEFAULT_PREFERENCES.pnl_percentage_asset_daily
    ),
    max_drawdown_portfolio_daily: normalizePreferenceValue(
      preferencesData?.max_drawdown_portfolio_daily,
      DEFAULT_PREFERENCES.max_drawdown_portfolio_daily
    ),
    max_drawdown_account_daily: normalizePreferenceValue(
      preferencesData?.max_drawdown_account_daily,
      DEFAULT_PREFERENCES.max_drawdown_account_daily
    ),
    asset_weight_weekly: normalizePreferenceValue(
      preferencesData?.asset_weight_weekly,
      DEFAULT_PREFERENCES.asset_weight_weekly
    ),
    currency_exposure_weekly: normalizePreferenceValue(
      preferencesData?.currency_exposure_weekly,
      DEFAULT_PREFERENCES.currency_exposure_weekly
    ),
  };
}

function buildPreferencesPayload(preferences) {
  return Object.fromEntries(
    Object.entries(preferences).map(([key, value]) => {
      // Si el valor es undefined, envia null para borrarlo de la BD
      if (value === undefined) return [key, null];

      const numValue = Number(value);
      return [key, numValue < 1 ? numValue : Number((numValue / 100).toFixed(4))];
    })
  );
}

function getFeedbackClass(tone) {
  if (tone === "error") {
    return "text-danger";
  }

  if (tone === "success") {
    return "text-success";
  }

  return "text-warning";
}

export function YourPreferencesCard() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [preferences, setPreferences] = useState({});
  const [error, setError] = useState(false)
  const [hasPreferences, setHasPreferences] = useState(true)
  const { getToken } = useAppAuth();

  useEffect(() => {
    async function loadPreferences() {
      try {
        setIsLoadingPreferences(true);
        setFeedback(null);
        setError(false)
        setHasPreferences(true)

        const token = await getToken();
        const response = await fetch(`${API_BASE_URL}/preferences`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 404) {
          setHasPreferences(false)
          setFeedback({
            tone: "info",
            text: "Aún no tienes preferencias guardadas. Puedes configurarlas abajo.",
          });
          return;
        }

        if (!response.ok) {
          throw new Error("Error al obtener las preferencias");
        }

        const preferencesData = await response.json();
        setPreferences(normalizePreferences(preferencesData));
      } catch (error) {
        //console.error("Error fetching preferences:", error);
        setError(true)
        setFeedback({
          tone: "error",
          text: "No se pudieron obtener las preferencias.",
        });
      } finally {
        setIsLoadingPreferences(false);
      }
    }

    loadPreferences();
  }, [getToken]);

  function handleChange(key, value) {
    setPreferences((previousPreferences) => ({
      ...previousPreferences,
      [key]: value,
    }));
  }

  function handleClear(key) {
  setPreferences((prev) => ({
    ...prev,
    [key]: undefined,
  }));
}

  async function savePreferences() {
    try {
      setIsSaving(true);
      setFeedback(null);
      if (preferences && Object.keys(preferences).length === 0) {
        setFeedback({
          tone: "error",
          text: "Define el valor de al menos 1 métrica para poder guardar tus preferencias",
        });
        return 
      }
      const token = await getToken();
      const preferences_to_send = buildPreferencesPayload(preferences)
      const response = await fetch(`${API_BASE_URL}/preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(preferences_to_send),
      });

      if (!response.ok) {
        throw new Error("Error guardando preferencias");
      }

      const savedPreferences = await response.json();
      setPreferences(normalizePreferences(savedPreferences));
      setFeedback({
        tone: "success",
        text: "Preferencias guardadas correctamente.",
      });
    } catch (error) {
      // console.error("Error saving preferences:", error);
      setFeedback({
        tone: "error",
        text: "No se pudieron guardar las preferencias.",
      });
    } finally {
      setIsSaving(false);
    }
  }
  // Caso cargando
  if(isLoadingPreferences){
    return (
      <CollapsableShell
      title="Preferencias de Alertas"
      description="Define los umbrales que activarán alertas automáticas sobre cambios importantes en tu portafolio"
      >
        <div>
          <FeedbackCard title="Cargando tus preferencias..." detail="Estamos obteniendo las preferencias que guían la activación de tus alertas." />
        </div>
      </CollapsableShell>
    )
  }
  // Caso error
  if (error) {
    return (
      <CollapsableShell
      title="Preferencias de Alertas"
      description="Define los umbrales que activarán alertas automáticas sobre cambios importantes en tu portafolio"
      >
        <FeedbackCard
          title="No se pudieron cargar tus preferencias"
          detail="Por favor, intenta más tarde o revisa tu conexión."
          tone="error"
        />
      </CollapsableShell>      
    );
  }
  // Caso debe setear métricas
  if(!hasPreferences){
    return(
      <CollapsableShell
      title="Preferencias de Alertas"
      description="Define los umbrales que activarán alertas automáticas sobre cambios importantes en tu portafolio"
      >
        <div className="space-y-6">
        <div className="flex  w-full flex-col items-center justify-center rounded-[22px] border border-dashed border-border-soft bg-panel p-8 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-white">
            Todavía no tienes preferencias definidas
          </h3>
          <div>
            <li className="text-left text-text-muted">
              Define tus preferencias para poder activar las alertas, mueve el slider para poder modificar el valor y aprieta el botón para guardar los cambios 
            </li>
            <li className="text-left text-text-muted">
              Puedes no activarlas también o no activarlas todas, esto determina qué alertas se podrán activar
            </li>
          </div>
        </div>
        
        <div>
          {/* Campos-sliders */}
          {PREFERENCE_FIELDS.map((field) => {
            const isDefined = preferences[field.key] !== undefined;
            const inputId = `preference-${field.key}`;
            return (
              <div key={field.key} className="rounded-2xl bg-panel p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl">
                    <label className="text-lg font-semibold">{field.label}</label>
                    <p className="mt-1 text-sm text-text-muted">{field.description}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      id={inputId}
                      aria-label={field.label}
                      type="range"
                      min={field.min}
                      max={field.max}
                      step={field.step || 1}
                      value={preferences[field.key]}
                      onChange={(event) =>
                        handleChange(field.key, Number(event.target.value))
                      }
                      className="w-48 accent-warning"
                    />

                    <div className="min-w-[70px] rounded-xl bg-panel-soft px-3 py-2 text-center text-sm font-medium">
                      {preferences[field.key]}
                      {field.suffix}
                    </div>
                  </div>
                  {isDefined && (
                    <button 
                      onClick={() => handleClear(field.key)}
                      className="text-gray-400 hover:text-red-500 p-2"
                      title="Desactivar esta alerta"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {/* Feedback inferior + botón */}
          <div className="mt-2 flex items-center justify-between gap-4">
            {feedback ? (
              <p
                aria-live="polite"
                className={`text-sm ${getFeedbackClass(feedback.tone)}`}
              >
                {feedback.text}
              </p>
            ) : (
              <div />
            )}

            <div className="font-bold">
              <button
                type="button"
                onClick={savePreferences}
                disabled={isSaving || isLoadingPreferences}
                className="
                  rounded-2xl bg-accent px-5 py-3
                  font-bold text-black
                  transition hover:scale-[1.02]
                  disabled:cursor-not-allowed disabled:opacity-50
                "
              >
                {isSaving ? "Guardando..." : "Guardar preferencias"}
              </button>
            </div>
          </div>
        </div>
      </div>
      </CollapsableShell>
    )
  }
  // Caso real/hay datos guardado
  return (
    <CollapsableShell
      title="Preferencias de Alertas"
      description="Define los umbrales que activarán alertas automáticas sobre cambios importantes en tu portafolio"
    >
      <div className="space-y-6">
        <div>
          {/* Campos-sliders */}
          {PREFERENCE_FIELDS.map((field) => {
            const inputId = `preference-${field.key}`;
            const isDefined = preferences[field.key] !== undefined;
            return (
              <div key={field.key} className="rounded-2xl bg-panel p-5">
                
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl">
                    <label className="text-lg font-semibold">{field.label}</label>
                    <p className="mt-1 text-sm text-text-muted">{field.description}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      id={inputId}
                      aria-label={field.label}
                      type="range"
                      min={field.min}
                      max={field.max}
                      step={field.step || 1}
                      value={preferences[field.key]}
                      onChange={(event) =>
                        handleChange(field.key, Number(event.target.value))
                      }
                      className={`w-48 ${preferences[field.key] !== undefined ? "accent-success": "accent-warning"}`}
                    />

                    <div className="min-w-[70px] rounded-xl bg-panel-soft px-3 py-2 text-center text-sm font-medium">
                      {preferences[field.key]}
                      {field.suffix}
                    </div>
                  </div>

                  {isDefined && (
                    <button 
                      onClick={() => handleClear(field.key)}
                      className="text-gray-400 hover:text-red-500 p-2"
                      title="Desactivar esta alerta"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {/* Feedback inferior + botón */}
          <div className="mt-2 flex items-center justify-between gap-4">
            {feedback ? (
              <p
                aria-live="polite"
                className={`text-sm ${getFeedbackClass(feedback.tone)}`}
              >
                {feedback.text}
              </p>
            ) : (
              <div />
            )}

            <div className="font-bold">
              <button
                type="button"
                onClick={savePreferences}
                disabled={isSaving || isLoadingPreferences}
                className="
                  rounded-2xl bg-accent px-5 py-3
                  font-bold text-black
                  transition hover:scale-[1.02]
                  disabled:cursor-not-allowed disabled:opacity-50
                "
              >
                {isSaving ? "Guardando..." : "Guardar preferencias"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </CollapsableShell>
  );
}
