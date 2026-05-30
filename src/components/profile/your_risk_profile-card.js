"use client"

import { useState, useEffect } from "react"
import { CollapsableShell } from "../collapsable-shell"
import { useAppAuth } from "@/src/lib/client-auth";
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
      text: "text-red-300"
    }
  }
]

const API_BASE_URL = process.env.NEXT_PUBLIC_URL_BE || ""

export function YourRiskProfileCard() {
  const [selectedRisk, setSelectedRisk] = useState("moderate")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const { getToken } = useAppAuth();

  const fetchRiskProfile = async () => {
    try {
      setLoading(true)
      setMessage(null)
      const token = await getToken();
      const response = await fetch(
        `${API_BASE_URL}/user/risk_profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: "include"
        }
      )

      if (!response.ok) {
        throw new Error("Error al cargar el perfil de riesgo")
      }

      const data = await response.json()
      const riskValue = data.risk_profile
      if (RISK_OPTIONS.some(option => option.value === riskValue)) {
        setSelectedRisk(riskValue)
      }
    } catch (error) {
      console.error(error)
      setMessage("No se pudo obtener el perfil de riesgo")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRiskProfile()
  }, [getToken])

  const handleSave = async () => {
    try {
      setLoading(true)
      setMessage(null)
      const token = await getToken();
      const response = await fetch(
        `${API_BASE_URL}/user/risk_profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            risk_profile: selectedRisk
          })
        }
      )
      const data = await response.json()
      const riskValue = data.risk_profile
      if (RISK_OPTIONS.some(option => option.value === riskValue)) {
        setSelectedRisk(riskValue)
      }

      if (!response.ok) {
        throw new Error("No se pudo actualizar el perfil de riesgo")
      }

      setMessage("Perfil de riesgo actualizado correctamente")
    } catch (error) {
      console.error(error)
      setMessage("Ocurrió un error al actualizar el perfil de riesgo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <CollapsableShell
      title="Perfil de Riesgo"
      description="Define el nivel de riesgo que mejor representa tus preferencias de inversión"
    >
      <div className="flex flex-col gap-4">
        {RISK_OPTIONS.map((option) => {
          const isSelected = selectedRisk === option.value

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedRisk(option.value)}
              className={`
                rounded-2xl border p-4 text-left transition-all bg-panel
                ${isSelected
                  ? `${option.styles.border} ${option.styles.bg}`
                  : `border-border-soft ${option.styles.hover}`
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-medium ${isSelected ? option.styles.text : ""}`}>
                    {option.label}
                  </h3>

                  <p className="mt-1 text-sm text-text-muted">
                    {option.description}
                  </p>
                </div>

                <div
                  className={`
                    h-4 w-4 rounded-full border transition-all
                    ${isSelected
                      ? `${option.styles.badge} border-transparent`
                      : "border-border-soft"
                    }
                  `}
                />
              </div>
            </button>
          )
        })}

        <div className="flex items-center justify-between mt-2">
          {message ? (
            <p className="text-sm text-text-muted">{message}</p>
          ) : (
            <div />
          )}

          <div className="font-bold">
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="
                rounded-2xl bg-accent px-5 py-3
                font-bold text-black
                transition hover:scale-[1.02]
                disabled:cursor-not-allowed disabled:opacity-50
              "
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      </div>
    </CollapsableShell>
  )
}
