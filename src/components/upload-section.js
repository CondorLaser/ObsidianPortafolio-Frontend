"use client"
import { FileUploadSelector } from "./file-upload"

export function UploadSection() {
  const handleFile = async (file) => {
    try {
      console.log("File:", file)
      // Crea FormData
      const formData = new FormData()
      formData.append("file", file)

      // Llama al backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BE}/upload`,
        {
          method: "POST",
          body: formData,
        }
      )

      // Validar respuesta
      if (!response.ok) {
        throw new Error("Error al subir archivo")
      }

      const data = await response.json()

      console.log("Archivo subido correctamente:", data)

    } catch (error) {
      console.error("Error subiendo archivo:", error)
    }
  }

  return (
    <FileUploadSelector 
      accept=".pdf" 
      onFileSelect={handleFile} />
  )
}