"use client";
import { useRef } from "react";

export function FileUpload({ onFileSelect, accept = ".pdf" }) {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="mt-5 cursor-pointer rounded-3xl border border-dashed border-accent/35 bg-app px-6 py-12 text-center transition hover:border-accent/60 hover:bg-panel"
    >
      <input
        type="file"
        accept={accept}
        ref={inputRef}
        onChange={handleChange}
        className="hidden"
      />

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-2xl text-accent">
        ↑
      </div>

      <p className="mt-5 font-semibold text-white">
        Haz clic para seleccionar un archivo PDF
      </p>
      <p className="mt-2 text-sm text-text-muted">
        o arrastra y suelta aquí
      </p>
    </div>
  );
}