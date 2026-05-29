"use client"
import { useEffect, useState } from "react"
import { FileUploadSelector } from "./file-upload"
import { useAuth } from "@clerk/nextjs";

const API_BASE_URL = process.env.NEXT_PUBLIC_URL_BE || ""

export function UploadSection(finantial_file_type) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [accountName, setAccountName] = useState("")
  const [accounts, setAccounts] = useState([])
  const [loadingAccounts, setLoadingAccounts] = useState(true)
  const [loading, setLoading] = useState(false)

  const { getToken } = useAuth();

  // Cargar cuentas del usuario
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoadingAccounts(true)
        const token = await getToken();
        const response = await fetch(
          `${API_BASE_URL}/user/accounts_names`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }            
          }
        )
        if (!response.ok) {
          throw new Error("Error obteniendo cuentas")
        }
        // Por si viene como [] o [{}]
        const data = await response.json()
        const accountsList = Array.isArray(data)
          ? data
          : data.accounts || []
        const accountNames = accountsList.map(account => account.name)
        setAccounts(accountNames)
      } catch (error) {
        console.error("Error obteniendo cuentas:", error)
      } finally {
        setLoadingAccounts(false)
      }
    }
    fetchAccounts()
  }, [getToken])

  


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
      return /^[a-zA-Z0-9\s_-]+$/.test(value) && /[a-zA-Z0-9]/.test(value)
    }
    if (!isValidAccountName(accountName)) {
      alert("Nombre de cuenta inválido: Solo se aceptan nombres de cuenta con letras y números")
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
      const token = await getToken();
      const sanitizedName = sanitizeAccountName(accountName)
      // Crea FormData y agrega info
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("accountName", sanitizedName)

      const endpoint = finantial_file_type === "mutual_funds"
        ? `${API_BASE_URL}/pdf/extract_mutual_funds`
        : `${API_BASE_URL}/pdf/extract_stocks_etf_1`

      // Llamar al backend (TODO: Revisar Endpoint respecto implementado)
      const response = await fetch(
        endpoint,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },         
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error("Error al subir archivo")
      }
      // const data = await response.json()
      //console.log("Archivo subido correctamente:", data)
      alert("Archivo subido correctamente, sus datos serán procesados próximamente")

      // Reseteo formulario
      setSelectedFile(null)
      setAccountName("")

    } catch (error) {
      //console.error("Error subiendo archivo:", error)
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
          list="accounts-list"
          placeholder="Ej: Fintual USD"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          className="w-full rounded-xl border border-accent/30 bg-panel px-4 py-3 text-white outline-none transition focus:border-accent"
        />

        <datalist id="accounts-list">
          {accounts.map((account) => (
            <option key={account} value={account} />
          ))}
        </datalist>

        {loadingAccounts && (
          <p className="mt-2 text-sm text-text-muted">
            Cargando cuentas...
          </p>
        )}
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
