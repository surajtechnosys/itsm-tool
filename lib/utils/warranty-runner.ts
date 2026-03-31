let lastRun: number | null = null

export function shouldRunWarrantyCheck() {
  const now = Date.now()

  // run once every 6 hours (adjust if needed)
  if (!lastRun || now - lastRun > 6 * 60 * 60 * 1000) {
    lastRun = now
    return true
  }

  return false
}