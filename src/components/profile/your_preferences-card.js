"use client";

import { useEffect, useState } from "react";

import { useAppAuth } from "@/src/lib/client-auth";

import { CollapsableShell } from "../collapsable-shell";

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

function normalizePreferenceValue(value, fallback) {
  if (value === null || value === undefined) {
    return fallback;
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
    Object.entries(preferences).map(([key, value]) => [
      key,
      Number((Number(value) / 100).toFixed(4)),
    ])
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
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const { getToken } = useAppAuth();

  useEffect(() => {
    let isMounted = true;

    async function loadPreferences() {
      try {
        setIsLoadingPreferences(true);
        setFeedback(null);

        const token = await getToken();
        const response = await fetch(`${API_BASE_URL}/preferences`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 404) {
          if (!isMounted) return;

          setPreferences(DEFAULT_PREFERENCES);
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

        if (!isMounted) return;

        setPreferences(normalizePreferences(preferencesData));
      } catch (error) {
        console.error("Error fetching preferences:", error);

        if (!isMounted) return;

        setFeedback({
          tone: "error",
          text: "No se pudieron obtener las preferencias.",
        });
      } finally {
        if (isMounted) {
          setIsLoadingPreferences(false);
        }
      }
    }

    loadPreferences();

    return () => {
      isMounted = false;
    };
  }, [getToken]);

  function handleChange(key, value) {
    setPreferences((previousPreferences) => ({
      ...previousPreferences,
      [key]: value,
    }));
  }

  async function savePreferences() {
    try {
      setIsSaving(true);
      setFeedback(null);

      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(buildPreferencesPayload(preferences)),
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
      console.error("Error saving preferences:", error);
      setFeedback({
        tone: "error",
        text: "No se pudieron guardar las preferencias.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <CollapsableShell
      title="Preferencias de Alertas"
      description="Define los umbrales que activarán alertas automáticas sobre cambios importantes en tu portafolio"
    >
      <div className="space-y-6">
        {isLoadingPreferences ? (
          <div className="rounded-2xl border border-border-soft bg-panel p-5 text-sm text-text-muted">
            Cargando tus preferencias guardadas...
          </div>
        ) : null}

        <div>
          {feedback && feedback.tone == "info" ? (
            <p
              aria-live="polite"
              className={`text-sm ${getFeedbackClass(feedback.tone)}`}
            >
              {feedback.text}
            </p>
          ) : (
            <div />
          )}
        </div>

        {PREFERENCE_FIELDS.map((field) => {
          const inputId = `preference-${field.key}`;

          return (
            <div
              key={field.key}
              className="rounded-2xl border border-border-soft bg-panel p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <label className="text-lg font-semibold" htmlFor={inputId}>
                    {field.label}
                  </label>

                  <p className="mt-1 text-sm text-text-muted">
                    {field.description}
                  </p>
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
                    className="w-48 accent-accent"
                  />

                  <div className="min-w-[70px] rounded-xl bg-panel-soft px-3 py-2 text-center text-sm font-medium">
                    {preferences[field.key]}
                    {field.suffix}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="mt-2 flex items-center justify-between gap-4">
          {feedback && feedback.tone !== "info"? (
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
    </CollapsableShell>
  );
}
