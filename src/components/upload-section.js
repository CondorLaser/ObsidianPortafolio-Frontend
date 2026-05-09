"use client"
import { FileUploadSelector } from "./file-upload"

export function UploadSection() {
  const handleFile = (file) => {
    //console.log("Archivo:", file);
    // agregar lógica del manejo de archivos acá
  };

  return <FileUploadSelector accept=".pdf" onFileSelect={handleFile} />;
}