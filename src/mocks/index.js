async function enableMocking() {
  if (typeof window !== "undefined") {
    const { worker } = await import("./browser")
    await worker.start()
  }
}

export default enableMocking