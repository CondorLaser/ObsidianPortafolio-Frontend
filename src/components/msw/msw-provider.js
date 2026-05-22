"use client"

import { useEffect, useState } from "react"

export function MswProvider({ children }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    async function init() {
      if (process.env.NODE_ENV === "development") {
        const { worker } = await import("../../mocks/browser")
        await worker.start({
            onUnhandledRequest: "bypass",
        })
      }
      setIsReady(true)
    }

    init()
  }, [])

  if (!isReady && process.env.NODE_ENV === "development") {
    return null
  }

  return children
}