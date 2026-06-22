"use client";

import { useState, useEffect } from "react"
import { CollapsableShell } from "../collapsable-shell"
import { useAppAuth } from "@/src/lib/client-auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_URL_BE || "";

const RISK_OPTIONS = [
  {
    value: "conservative",
    label: "Conservador",
    description: "Prioriza estabilidad y menor volatilidad.",
    styles: {
      border: "border-blue-500/40",
      bg: "bg-blue-500/10",
      hover: "hover:border-blue-400/70",
      badge: "bg-blue-500",
      text: "text-blue-300"
    }
  },
  {
    value: "moderate",
    label: "Moderado",
    description: "Busca equilibrio entre riesgo y rentabilidad.",
    styles: {
      border: "border-emerald-500/40",
      bg: "bg-[var(--green-attention)]",
      hover: "hover:border-emerald-400/70",
      badge: "bg-emerald-500",
      text: "text-emerald-300"
    }
  },
  {
    value: "agressive",
    label: "Agresivo",
    description: "Acepta mayor volatilidad para buscar mayores retornos.",
    styles: {
      border: "border-red-500/40",
      bg: "bg-[var(--red-attention)]",
      hover: "hover:border-red-400/70",
      badge: "bg-red-500",
      text: "text-red-300",
    },
  },
];

const DEFAULT_RISK_PROFILE = "moderate";

function isValidRiskProfile(value) {
  return RISK_OPTIONS.some((option) => option.value === value);
}

function normalizeRiskProfile(value) {
  if (isValidRiskProfile(value)) {
    return value;
  }

  if (value === "aggressive") {
    return "agressive";
  }

  return DEFAULT_RISK_PROFILE;
}

function getFeedbackClass(tone) {
  if (tone === "error") {
    return "text-danger";
  }

  if (tone === "success") {
    return "text-success";
  }

  return "text-text-muted";
}

export function YourRiskProfileCard() {
  const [selectedRisk, setSelectedRisk] = useState(DEFAULT_RISK_PROFILE);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const { getToken } = useAppAuth();

  useEffect(() => {
    let isMounted = true;

    async function loadRiskProfile() {
      try {
        setIsLoadingProfile(true);
        setFeedback(null);

        const token = await getToken();
        const response = await fetch(`${API_BASE_URL}/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al cargar el perfil de riesgo");
        }

        const profileData = await response.json();

        if (!isMounted) return;

        setSelectedRisk(normalizeRiskProfile(profileData?.risk_profile));
      } catch (error) {
        // console.error("Error fetching risk profile:", error);

        if (!isMounted) return;

        setFeedback({
          tone: "error",
          text: "No se pudo obtener el perfil de riesgo.",
        });
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false);
        }
      }
    }

    loadRiskProfile();

    return () => {
      isMounted = false;
    };
  }, [getToken]);

  async function handleSave() {
    try {
      setIsSaving(true);
      setFeedback(null);

      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          risk_profile: selectedRisk,
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo actualizar el perfil de riesgo");
      }

      const updatedProfile = await response.json();
      setSelectedRisk(normalizeRiskProfile(updatedProfile?.risk_profile));
      setFeedback({
        tone: "success",
        text: "Perfil de riesgo actualizado correctamente.",
      });
    } catch (error) {
      // console.error("Error saving risk profile:", error);
      setFeedback({
        tone: "error",
        text: "Ocurrió un error al actualizar el perfil de riesgo.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <CollapsableShell
      title="Perfil de Riesgo"
      description="Define el nivel de riesgo que mejor representa tus preferencias de inversión"
    >
      <div className="flex flex-col gap-4">
        {isLoadingProfile ? (
          <div className="rounded-2xl border border-border-soft bg-panel p-5 text-sm text-text-muted">
            Cargando tu perfil de riesgo...
          </div>
        ) : null}

        {RISK_OPTIONS.map((option) => {
          const isSelected = selectedRisk === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedRisk(option.value)}
              disabled={isLoadingProfile}
              className={`
                rounded-2xl border bg-panel p-4 text-left transition-all
                ${isSelected
                  ? `${option.styles.border} ${option.styles.bg}`
                  : `border-border-soft ${option.styles.hover}`}
                disabled:cursor-not-allowed disabled:opacity-70
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3
                    className={`font-medium ${isSelected ? option.styles.text : ""}`}
                  >
                    {option.label}
                  </h3>

                  <p className="mt-1 text-sm text-text-muted">
                    {option.description}
                  </p>
                </div>

                <div
                  aria-hidden="true"
                  className={`
                    h-4 w-4 rounded-full border transition-all
                    ${isSelected
                      ? `${option.styles.badge} border-transparent`
                      : "border-border-soft"}
                  `}
                />
              </div>
            </button>
          );
        })}

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
              onClick={handleSave}
              disabled={isSaving || isLoadingProfile}
              className="
                rounded-2xl bg-accent px-5 py-3
                font-bold text-black
                transition hover:scale-[1.02]
                disabled:cursor-not-allowed disabled:opacity-50
              "
            >
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      </div>
    </CollapsableShell>
  );
}
