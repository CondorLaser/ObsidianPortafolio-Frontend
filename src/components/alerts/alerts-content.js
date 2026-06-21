"use client";

import { Check, Eye, EyeOff, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FeedbackCard } from "@/src/components/feedback-card";
import { MetricCard } from "@/src/components/metric-card";
import { SectionCard } from "@/src/components/section-card";
import { useAppAuth } from "@/src/lib/client-auth";

const typeLabels = {
  pnl: "P&L",
  drawdown: "Drawdown",
  weight: "Peso",
  volatility: "Volatilidad",
};

const pillClasses = {
  active: "border-accent/20 bg-accent/10 text-accent",
  muted: "border-border-soft bg-panel text-text-muted",
  warning: "border-amber-500/20 bg-amber-500/10 text-warning",
};

function formatDate(value) {
  if (!value) return "Sin fecha";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin fecha";

  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatNumber(value) {
  if (value === null || value === undefined) return "-";

  const number = Number(value);
  if (Number.isNaN(number)) return "-";

  return new Intl.NumberFormat("es-CL", {
    maximumFractionDigits: 4,
  }).format(number);
}

function formatType(type) {
  if (!type) return "Alerta";
  return typeLabels[type] ?? type.replaceAll("_", " ");
}

function AlertPill({ children, tone = "muted" }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${pillClasses[tone] ?? pillClasses.muted}`}>
      {children}
    </span>
  );
}

function AlertActionButton({ children, icon: Icon, loading, ...props }) {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-soft bg-surface px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}

function EmptyAlerts() {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-[22px] border border-dashed border-border-soft bg-surface/20 p-8 text-center">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-full border border-accent/20 bg-accent/10 text-accent">
        <Check className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-white">No tienes alertas activas</h3>
      <p className="mt-2 max-w-sm text-sm leading-[1.6] text-text-muted">
        Cuando el backend detecte eventos importantes del portafolio, apareceran aqui.
      </p>
    </div>
  );
}

function AlertCard({ alert, onUpdate, updating }) {
  const title = formatType(alert.type);

  return (
    <article className="rounded-2xl border border-border-soft bg-app p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-base font-semibold text-white">{title}</h3>
            <AlertPill tone={alert.is_active ? "active" : "muted"}>
              {alert.is_active ? "Activa" : "Inactiva"}
            </AlertPill>
            <AlertPill tone={alert.is_read ? "muted" : "warning"}>
              {alert.is_read ? "Leida" : "No leida"}
            </AlertPill>
          </div>

          <p className="mt-3 text-sm leading-[1.7] text-text-muted">{alert.msg}</p>

          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-border-soft bg-panel px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">Valor</dt>
              <dd className="mt-1 font-semibold text-white">{formatNumber(alert.trigger_value)}</dd>
            </div>
            <div className="rounded-xl border border-border-soft bg-panel px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">Umbral</dt>
              <dd className="mt-1 font-semibold text-white">{formatNumber(alert.threshold_value)}</dd>
            </div>
            <div className="rounded-xl border border-border-soft bg-panel px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">Creada</dt>
              <dd className="mt-1 font-semibold text-white">{formatDate(alert.created_at)}</dd>
            </div>
          </dl>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">
          <AlertActionButton
            icon={alert.is_read ? EyeOff : Eye}
            loading={updating === "read"}
            onClick={() => onUpdate(alert.id, { is_read: !alert.is_read }, "read")}
          >
            {alert.is_read ? "Marcar no leida" : "Marcar leida"}
          </AlertActionButton>
        </div>
      </div>
    </article>
  );
}

export function AlertsContent() {
  const { getToken } = useAppAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [updateError, setUpdateError] = useState("");

  const baseUrl = process.env.NEXT_PUBLIC_URL_BE || "";

  const loadAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const token = await getToken();
      const response = await fetch(`${baseUrl}/warnings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al cargar las alertas");

      const data = await response.json();
      setAlerts(Array.isArray(data) ? [...data].sort((a, b) => b.is_active - a.is_active) : []);
    } catch (fetchError) {
      console.error("Fetch Alerts Error:", fetchError);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, getToken]);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  const metrics = useMemo(() => {
    const active = alerts.filter((alert) => alert.is_active).length;
    const unread = alerts.filter((alert) => !alert.is_read).length;
    const inactive = alerts.length - active;

    return {
      total: alerts.length,
      active,
      unread,
      inactive,
    };
  }, [alerts]);

  async function updateAlert(alertId, payload, action) {
    try {
      setUpdatingId(`${alertId}:${action}`);
      setUpdateError("");
      const token = await getToken();
      const response = await fetch(`${baseUrl}/warnings/${alertId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error al actualizar la alerta");

      const updatedAlert = await response.json();
      setAlerts((currentAlerts) => (
        currentAlerts.map((alert) => (alert.id === alertId ? updatedAlert : alert))
      ));
    } catch (fetchError) {
      console.error("Update Alert Error:", fetchError);
      setUpdateError("No se pudo actualizar la alerta. Intenta nuevamente.");
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return <FeedbackCard title="Cargando alertas..." detail="Estamos obteniendo los eventos detectados en tu portafolio." />;
  }

  if (error) {
    return (
      <FeedbackCard
        title="No se pudieron cargar las alertas"
        detail="Revisa que el backend este disponible y que NEXT_PUBLIC_URL_BE apunte a la API correcta."
        tone="error"
      />
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total" value={metrics.total} />
        <MetricCard label="Activas" value={metrics.active} />
        <MetricCard label="No leidas" value={metrics.unread} />
        <MetricCard label="Inactivas" value={metrics.inactive} />
      </div>

      <div className="mt-6">
        <SectionCard title="Alertas del sistema" description="Eventos generados por los umbrales y reglas configuradas en el backend.">
          {updateError ? (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm font-semibold text-red-300">
              {updateError}
            </div>
          ) : null}

          {alerts.length === 0 ? (
            <EmptyAlerts />
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  updating={
                    updatingId?.startsWith(`${alert.id}:`)
                      ? updatingId.split(":").at(-1)
                      : null
                  }
                  onUpdate={updateAlert}
                />
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </>
  );
}
