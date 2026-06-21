"use client"

import { useEffect, useState } from "react"

const shouldUseMocks =
  (process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_API_MOCKING !== "disabled") ||
  process.env.NEXT_PUBLIC_E2E_MODE === "true"

const mockedApiPrefixes = [
  "/assets",
  "/portfolio",
  "/positions",
  "/pdf",
  "/profile",
  "/preferences",
  "/warnings",
  "/accounts",
  "/user",
]

export function MswProvider({ children }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    async function init() {
      if (shouldUseMocks) {
        const { worker } = await import("../../mocks/browser")
        await worker.start({
          onUnhandledRequest(request, print) {
            if (process.env.NEXT_PUBLIC_E2E_MODE !== "true") {
              return
            }

            const { pathname } = new URL(request.url)
            const isMockedApiRequest = mockedApiPrefixes.some(
              (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
            )

            if (isMockedApiRequest) {
              print.error()
            }
          },
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
