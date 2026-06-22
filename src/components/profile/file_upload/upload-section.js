"use client"
import { useEffect, useState } from "react"
import { FileUploadSelector } from "./file-upload"
import { useAppAuth } from "@/src/lib/client-auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_URL_BE || ""

export function UploadSection({ finantial_file_type } = {}) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedAccountId, setSelectedAccountId] = useState("")
  const [accounts, setAccounts] = useState([])
  const [loadingAccounts, setLoadingAccounts] = useState(true)
  const [loading, setLoading] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const { getToken } = useAppAuth();

  const filteredAccounts = finantial_file_type === "mutual_funds"
  ? accounts.filter(account => account.currency !== "USD")
  : accounts.filter(account => account.currency === "USD")


  // Cargar cuentas del usuario
  useEffect(() => {
    const accountsEndpoint = `${API_BASE_URL}/accounts`

    const fetchAccounts = async () => {
      try {
        setLoadingAccounts(true)
        const token = await getToken();

        const response = await fetch(
          accountsEndpoint, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }            
          }
        )

        if (!response.ok) {
          const errorMessage = await response.text()
          throw new Error(`Error ${response.status}: ${errorMessage || "Error obteniendo cuentas"}`)
        }
        // Por si viene como [] o [{}]
        const data = await response.json()        
        const accountsList = Array.isArray(data)
          ? data
          : data.accounts || []
        setAccounts(accountsList)
      } catch (error) {
        /* console.error("[UploadSection] Error fetching accounts", {
          endpoint: accountsEndpoint,
          error,
        }) */
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
      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
          data.detail ||
          `Error ${response.status}`
        )
      }
      alert(data.message)

      // Reseteo formulario
      setSelectedFile(null)
      setSelectedAccountId("")

    } catch (error) {
      /* console.error("[UploadSection] Error uploading PDF", {
        endpoint,
        error,
      }) */
      alert(error.message || "Ocurrió un error al subir el archivo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {loadingAccounts ? (
          <p className="mt-2 text-sm text-text-muted">
            Cargando cuentas...
          </p>
        ) : filteredAccounts.length === 0 ? (
          <div className="flex w-full flex-col items-center justify-center rounded-[22px] border border-dashed border-border-soft bg-warning/20 p-8 text-center">
          <h3 className="text-base font-semibold text-white">No hay cuentas disponibles</h3>
          <p className="mt-2 max-w-sm text-sm leading-[1.6] text-text-muted">
            Parece que aún no tienes cuentas con las cuales asociar este tipo de activo, por favor crea una cuenta acorde en la pestaña de <b>Cuentas</b> y vuelve a intentarlo.
          </p>
        </div>
        ) : (

          <div>
            <p className="block text-sm font-medium text-white">
              Cuenta
            </p>
            <p className=" mb-3 text-sm text-text-muted ">
              Indica a qué cuenta vas a asociar tus datos <br></br> 
            </p>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex w-full items-center justify-between rounded-xl border border-accent/30 bg-panel px-4 py-3 text-left text-white outline-none transition focus:border-accent"
              >
                <span className={!selectedAccountId ? "text-text-muted" : "text-white"}>
                  {(() => {
                    const acc = filteredAccounts.find((acc) => acc.id === selectedAccountId);
                    const name = acc?.name || "Selecciona una cuenta";
                    return name.length > 10 ? name.slice(0, 10) + "..." : name;
                  })()}
                </span>
                <svg
                  className={`h-5 w-5 text-white/50 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <ul className="absolute z-50 mt-1 max-h-[180px] w-full overflow-y-auto rounded-xl border border-accent/30 bg-panel shadow-2xl">
                  {filteredAccounts.map((account) => (
                    <li
                      key={account.id}
                      onClick={() => {
                        setSelectedAccountId(account.id);
                        setIsDropdownOpen(false); // Cierra el menú al seleccionar
                      }}
                      className={`cursor-pointer px-4 py-3 text-sm text-white transition hover:bg-accent/20 ${
                        selectedAccountId === account.id ? "bg-accent/30 font-bold text-accent" : ""
                      }`}
                    >
                      {account.name.length > 10 ? account.name.slice(0,10) + "..." : account.name} <b>({account.currency})</b>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Selector de archivo */}
            <FileUploadSelector
              accept=".pdf"
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
            />

            {/* Botón */}
            <div className="flex justify-end font-bold mt-4">
              <button
              onClick={handleUpload}
              disabled={!selectedFile || !selectedAccountId || loading}
              className="rounded-xl bg-accent px-5 py-3 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Subiendo..." : "Subir archivo"}
              </button>
            </div>


          </div>
        )}

      

      
     
    </div>
  )
}
