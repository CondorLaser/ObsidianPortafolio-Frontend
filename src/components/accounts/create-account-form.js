"use client";

import { useState } from "react";

const defaultForm = {
  name: "",
  broker: "Fintual",
  currency: "USD",
};

export function CreateAccountForm({ onCancel, onCreate }) {
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    
    const cleanName = form.name.trim();
    // Nombre no vacío
    if (!cleanName) {
      setError("Debes ingresar un nombre para la cuenta.");
      return;
    }
    // Solo contenga letras, números y espacios (incluye tildes + ñ)
    const validCharacters = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!validCharacters.test(cleanName)) {
      setError("El nombre de la cuenta solo puede contener letras, números y espacios.");
      return;
    }

    if(form.broker != ""){
      const cleanBroker = form.broker.trim();
      // Nombre no vacío
      if (!cleanBroker) {
        setError("Debes ingresar un nombre para el broker.");
        return;
      }
      if(!validCharacters.test(cleanBroker)){
        setError("El nombre del broker solo puede contener letras, números y espacios.");
        return;
      }
    }

    try {
      setSubmitting(true);
      setError(null);

      await onCreate({
        name: form.name.trim(),
        broker: form.broker.trim() || null,
        currency: form.currency,
      });

      setForm(defaultForm);
    } catch (submitError) {
      setError(submitError.message || "No se pudo crear la cuenta.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-[24px] border border-accent/20 bg-surface/45 p-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-[760] uppercase tracking-[0.16em] text-accent">
          Nueva cuenta
        </p>
        <h2 className="text-2xl font-semibold text-white">Crear cuenta de inversión</h2>
        <p className="text-sm leading-[1.6] text-text-muted">
          Registra una cuenta para empezar a asociar posiciones, transacciones y cargas de certificados.
        </p>
        <p className="text-sm leading-[1.6] text-text-muted">
          <b>*Nota:</b> Considera que Fondos Mutuos solo se pueden asociar a cuentas en CLP, mientras que todos los otros tipos de activos 
          (Stocks y ETFs) solo se pueden asociar a cuentas USD
        </p>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-white">Nombre de la cuenta</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Ej: Fintual Growth"
              className="rounded-2xl border border-border-soft bg-panel px-4 py-3 text-white outline-none transition focus:border-accent"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-white">Broker</span>
            <input
              type="text"
              value={"Fintual"}
              onChange={(event) => setForm((current) => ({ ...current, broker: event.target.value }))}
              placeholder="Fintual"
              disabled
              className="rounded-2xl border  bg-panel px-4 py-3 text-white outline-none transition border-accent"
            />
          </label>
        </div>

        <label className="grid max-w-xs gap-2">
          <span className="text-sm font-medium text-white">Moneda base</span>
          <select
            value={form.currency}
            onChange={(event) => setForm((current) => ({ ...current, currency: event.target.value }))}
            className="rounded-2xl border border-border-soft bg-panel px-4 py-3 text-white outline-none transition focus:border-accent"
          >
            <option value="USD">USD</option>
            <option value="CLP">CLP</option>
          </select>
        </label>

        {error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-2xl bg-accent px-5 py-3 text-sm font-bold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="font-bold">
              {submitting ? "Creando..." : "Crear cuenta"}
            </div>
            
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-2xl border border-border-soft px-5 py-3 text-sm font-semibold text-white transition hover:border-accent/40 hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="font-bold">
              Cancelar
            </div>
            
          </button>
        </div>
      </form>
    </section>
  );
}
