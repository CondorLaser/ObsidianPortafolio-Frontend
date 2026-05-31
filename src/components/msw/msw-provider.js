"use client"

import { useEffect, useState } from "react"

export function MswProvider({ children }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    async function init() {
      if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_API_MOCKING !== "disabled") {
        const { worker } = await import("../../mocks/browser")
        await worker.start({
            onUnhandledRequest: "bypass",
        })
      }
      setIsReady(true)
    }

    init()
  }, [])

  if (!isReady && process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_API_MOCKING !== "disabled") {
    return null
  }
  

  return children
}