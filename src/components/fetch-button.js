"use client";
import { useState } from "react";

export function FetchButton() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_URL_BE);
      if (!res.ok) throw new Error("Error en la request");

      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleFetch}
        className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold text-sm h-11 px-4"
      >
        {loading ? <p className="fonts-bold">Cargando...</p> : <p className="font-bold">Hacer request</p>}
      </button>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      {data && (
        <pre className="bg-slate-900 p-4 rounded-xl text-sm overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}