"use client"
import { FileUpload } from "./file-upload"

export function UploadSection() {
  const handleFile = (file) => {
    //console.log("Archivo:", file);
    // agregar lógica del manejo de archivos acá
  };

  return <FileUpload accept=".pdf" onFileSelect={handleFile} />;
}