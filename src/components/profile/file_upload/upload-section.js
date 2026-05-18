"use client"
import { useState } from "react"
import { FileUploadSelector } from "./file-upload"

export function UploadSection() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [accountName, setAccountName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    // Validaciones
    if (!selectedFile) {
      alert("Debes seleccionar un archivo PDF")
      return
    }
    if (!accountName.trim()) {
      alert("Debes ingresar un nombre de cuenta")
      return
    }
    const isValidAccountName = (value) => {
      return /^[a-zA-Z0-9\s_-]+$/.test(value)
    }
    if (!isValidAccountName) {
      alert("Debes ingresar un nombre de cuenta que tenga solo caracteres válidos (letras y números)")
      return
    }
    const sanitizeAccountName = (value) => {
      return value
        .trim() // borrar " " sobrantes
        .replace(/[<>]/g, "") // quitar caracteres peligrosos
        .slice(0, 50) // máximo 50 caracteres
    }

    try {
      setLoading(true)
      const sanitizedName = sanitizeAccountName(accountName)
      /* console.log("Archivo:", selectedFile)
      console.log("Cuenta:", sanitizedName) */
      // Crea FormData y agrega info
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("accountName", sanitizedName)


      // Llamar al backend (TODO: Revisar Endpoint respecto implementado)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BE}/upload`,
        {
          method: "POST",
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error("Error al subir archivo")
      }
      // const data = await response.json()
      // console.log("Archivo subido correctamente:", data)
      alert("Archivo subido correctamente")

      // Reseteo formulario
      setSelectedFile(null)
      setAccountName("")

    } catch (error) {
      console.error("Error subiendo archivo:", error)
      alert("Ocurrió un error al subir el archivo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">

      {/* Input Nombre de cuenta */}
      <div>
        <p className="block text-sm font-medium text-white">
          Nombre de la cuenta
        </p>
        <p className=" mb-3 text-sm text-text-muted ">
          Indica a qué cuenta vas a asociar tus datos
        </p>

        <input
          type="text"
          placeholder="Ej: Fintual USD"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          className="w-full rounded-xl border border-accent/30 bg-panel px-4 py-3 text-white outline-none transition focus:border-accent"
        />
      </div>

      {/* Selector de archivo */}
      <FileUploadSelector
        accept=".pdf"
        selectedFile={selectedFile}
        onFileSelect={setSelectedFile}
      />

      {/* Botón */}
      <div className="flex justify-end font-bold">
         <button
        onClick={handleUpload}
        disabled={!selectedFile || !accountName.trim() || loading}
        className="rounded-xl bg-accent px-5 py-3 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Subiendo..." : "Subir archivo"}
        </button>
      </div>
     
    </div>
  )
}