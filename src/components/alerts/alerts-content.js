"use client";

import { Check, Eye, EyeOff, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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

function EmptyAlerts({ isActiveTab }) {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-[22px] border border-dashed border-border-soft bg-surface/20 p-8 text-center">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-full border border-accent/20 bg-accent/10 text-accent">
        <Check className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-white">No tienes alertas {isActiveTab ? "activas" : "inactivas"}</h3>
      <p className="mt-2 max-w-sm text-sm leading-[1.6] text-text-muted">
        {isActiveTab 
          ? "Cuando se detecten eventos importantes dentro de tus inversiones, aparecerán aquí." 
          : "El historial de tus alertas pasadas aparecerá en esta sección."}
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
              {alert.is_read ? "Leída" : "No leída"}
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
            {alert.is_read ? "Marcar no leída" : "Marcar leída"}
          </AlertActionButton>
        </div>
      </div>
    </article>
  );
}

export function AlertsContent() {
  const { getToken } = useAppAuth();
  
  const [alerts, setAlerts] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, active: 0, unread: 0, inactive: 0 });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [updateError, setUpdateError] = useState("");
  
  const [isActiveTab, setIsActiveTab] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 5;

  const baseUrl = process.env.NEXT_PUBLIC_URL_BE || "";

  // Obtener contadores
  const loadCounters = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${baseUrl}/warnings/counters`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        // TODO: Decidir si agregar aquí un caso / banner de "No se encuentra disponible para Counters o mantener con 0s como defecto"
        setMetrics({
          total: data.total || 0,
          active: data.active || 0,
          unread: data.unread || 0,
          inactive: data.inactive || 0,
        });
      }
    } catch (err) {
      // console.error("Fetch Counters Error:", err);
    }
  }, [baseUrl, getToken]);

  // Obtener alertas paginadas
  const loadAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const token = await getToken();
      
      const skip = page * limit;
      const params = new URLSearchParams({
        is_active: isActiveTab,
        skip: skip.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`${baseUrl}/warnings?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al cargar las alertas");
      const data = await response.json();
      setAlerts(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      // console.error("Fetch Alerts Error:", fetchError);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, getToken, isActiveTab, page, limit]);

  // Ejecutar carga inicial y al cambiar pestaña/página
  useEffect(() => {
    loadCounters();
  }, [loadCounters]);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

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
      
      // Actualizar la alerta localmente
      setAlerts((currentAlerts) => (
        currentAlerts.map((alert) => (alert.id === alertId ? updatedAlert : alert))
      ));
      // Recargar los contadores
      loadCounters();
    } catch (fetchError) {
      //console.error("Update Alert Error:", fetchError);
      setUpdateError("No se pudo actualizar la alerta, por favor intenta nuevamente.");
    } finally {
      setUpdatingId(null);
    }
  }

  // Cálculos paginación
  const totalItemsCurrentTab = isActiveTab ? metrics.active : metrics.inactive;
  const totalPages = Math.max(1, Math.ceil(totalItemsCurrentTab / limit));

  const handleTabChange = (activeStatus) => {
    if (isActiveTab === activeStatus) return;
    setIsActiveTab(activeStatus);
    setPage(0); // Volver a la primera página al cambiar de pestaña
  };

  if (loading && alerts.length === 0) {
    return <FeedbackCard title="Cargando alertas..." detail="Estamos obteniendo las alertas generadas por la evolución de tu portafolio." />;
  }

  if (error && alerts.length === 0) {
    return (
      <FeedbackCard
        title="No se pudieron cargar tus alertas"
        detail="Por favor, intenta más tarde o revisa tu conexión"
        tone="error"
      />
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total" value={metrics.total} />
        <MetricCard label="Activas" value={metrics.active} />
        <MetricCard label="No leídas" value={metrics.unread} />
        <MetricCard label="Inactivas" value={metrics.inactive} />
      </div>

      <div className="mt-6">
        <SectionCard 
          title="Alertas de tu Portafolio" 
          description="Revisa las alertas sobre el comportamiento de tu portafolio, cuentas y activos dadas por si sus evoluciones cruzan los umbrales definidos en tus Preferencias de Perfil"
        >
          {updateError && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm font-semibold text-red-300">
              {updateError}
            </div>
          )}

          {/* Selector de Pestañas (Activas / Inactivas) */}
          <div className="mb-6 flex gap-2 rounded-lg bg-surface/50 p-1 w-fit border border-border-soft">
            <button
              onClick={() => handleTabChange(true)}
              className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${
                isActiveTab 
                  ? "bg-accent text-white" 
                  : "text-text-muted hover:bg-surface hover:text-white"
              }`}
            >
              Activas ({metrics.active})
            </button>
            <button
              onClick={() => handleTabChange(false)}
              className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${
                !isActiveTab 
                  ? "bg-warning text-white" 
                  : "text-text-muted hover:bg-surface hover:text-white"
              }`}
            >
              Inactivas ({metrics.inactive})
            </button>
          </div>

          {alerts.length === 0 && !loading ? (
            <EmptyAlerts isActiveTab={isActiveTab} />
          ) : (
            <div className="space-y-4">
              <div className={`space-y-4 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
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

              {/* Controles de Paginación */}
              {totalItemsCurrentTab > 0 && (
                <div className="mt-6 flex items-center justify-between border-t border-border-soft pt-4">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0 || loading}
                    className="inline-flex items-center gap-2 rounded-lg border border-border-soft bg-surface px-3 py-2 text-sm font-semibold text-white transition hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </button>
                  
                  <span className="text-sm text-text-muted">
                    Página <span className="font-semibold text-white">{page + 1}</span> de <span className="font-semibold text-white">{totalPages}</span>
                  </span>

                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1 || loading}
                    className="inline-flex items-center gap-2 rounded-lg border border-border-soft bg-surface px-3 py-2 text-sm font-semibold text-white transition hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </SectionCard>
      </div>
    </>
  );
}