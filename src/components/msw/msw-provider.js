"use client"

import { useEffect, useState } from "react"

const shouldUseMocks =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_E2E_MODE === "true"

export function MswProvider({ children }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    async function init() {
      if (shouldUseMocks) {
        const { worker } = await import("../../mocks/browser")
        await worker.start({
          onUnhandledRequest: "bypass",
        })
      }
      setIsReady(true)
    }

    init()
  }, [])

  if (!isReady && shouldUseMocks) {
    return null
  }

  return children
}
