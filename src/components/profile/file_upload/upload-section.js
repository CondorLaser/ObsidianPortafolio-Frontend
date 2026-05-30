"use client"
import { useEffect, useState } from "react"
import { FileUploadSelector } from "./file-upload"
import { useAuth } from "@clerk/nextjs";

const API_BASE_URL = process.env.NEXT_PUBLIC_URL_BE || ""

export function UploadSection({ finantial_file_type } = {}) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedAccountId, setSelectedAccountId] = useState("")
  const [accounts, setAccounts] = useState([])
  const [loadingAccounts, setLoadingAccounts] = useState(true)
  const [loading, setLoading] = useState(false)

  const { getToken } = useAuth();

  // Cargar cuentas del usuario
  useEffect(() => {
    const accountsEndpoint = `${API_BASE_URL}/user/accounts_names`

    const fetchAccounts = async () => {
      try {
        setLoadingAccounts(true)
        const token = await getToken();

        console.log("[UploadSection] Fetching accounts", {
          endpoint: accountsEndpoint,
          hasToken: Boolean(token),
          realUpload: process.env.NEXT_PUBLIC_REAL_UPLOAD === "true",
        })

        const response = await fetch(
          accountsEndpoint, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }            
          }
        )

        console.log("[UploadSection] Accounts response", {
          endpoint: accountsEndpoint,
          ok: response.ok,
          status: response.status,
        })

        if (!response.ok) {
          const errorMessage = await response.text()
          throw new Error(`Error ${response.status}: ${errorMessage || "Error obteniendo cuentas"}`)
        }
        // Por si viene como [] o [{}]
        const data = await response.json()
        const accountsList = Array.isArray(data)
          ? data
          : data.accounts || []
        const normalizedAccounts = accountsList
          .filter((account) => account?.id && account?.name)
          .map((account) => ({
            id: account.id,
            name: account.name,
          }))
        setAccounts(normalizedAccounts)
      } catch (error) {
        console.error("[UploadSection] Error fetching accounts", {
          endpoint: accountsEndpoint,
          error,
        })
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
    if (!selectedAccountId) {
      alert("Debes seleccionar una cuenta")
      return
    }
    

    let endpoint = ""

    try {
      setLoading(true)
      const token = await getToken();
      // Crea FormData y agrega info
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("account_id", selectedAccountId)

      endpoint = finantial_file_type === "mutual_funds"
        ? `${API_BASE_URL}/pdf/extract_mutual_funds`
        : `${API_BASE_URL}/pdf/extract_stocks_etf_1`

      console.log("[UploadSection] Uploading PDF", {
        endpoint,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        accountId: selectedAccountId,
        uploadType: finantial_file_type || "stocks_etf",
        hasToken: Boolean(token),
      })

      // Llamar al backend (TODO: Revisar Endpoint respecto implementado)
      const response = await fetch(
        endpoint,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },         
          body: formData,
        }
      )

      console.log("[UploadSection] Upload response", {
        endpoint,
        ok: response.ok,
        status: response.status,
      })

      if (!response.ok) {
        const errorMessage = await response.text()
        throw new Error(`Error ${response.status}: ${errorMessage || response.statusText}`)
      }
      // const data = await response.json()
      //console.log("Archivo subido correctamente:", data)
      alert("Archivo subido correctamente, sus datos serán procesados próximamente")

      // Reseteo formulario
      setSelectedFile(null)
      setSelectedAccountId("")

    } catch (error) {
      console.error("[UploadSection] Error uploading PDF", {
        endpoint,
        error,
      })
      alert(error.message || "Ocurrió un error al subir el archivo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">

      {/* Selector de cuenta */}
      <div>
        <p className="block text-sm font-medium text-white">
          Cuenta
        </p>
        <p className=" mb-3 text-sm text-text-muted ">
          Indica a qué cuenta vas a asociar tus datos
        </p>

        <select
          value={selectedAccountId}
          onChange={(e) => setSelectedAccountId(e.target.value)}
          className="w-full rounded-xl border border-accent/30 bg-panel px-4 py-3 text-white outline-none transition focus:border-accent"
        >
          <option value="" disabled>
            Selecciona una cuenta
          </option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>

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
        disabled={!selectedFile || !selectedAccountId || loading}
        className="rounded-xl bg-accent px-5 py-3 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Subiendo..." : "Subir archivo"}
        </button>
      </div>
     
    </div>
  )
}
