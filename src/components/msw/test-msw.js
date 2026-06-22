"use client"

import { useEffect, useState } from "react"

export function TestMSW() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchAssets() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_URL_BE || ""
        const response = await fetch(
          `${baseUrl}/assets`
        )

        const json = await response.json()

        setData(json)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [])

  if (loading) {
    return <p>Cargando...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  return (
    <div>
      <h2>MSW funcionando</h2>

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
