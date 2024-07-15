export const logger = {
  debug: (message: string, ...values: unknown[]) => {
    console.log(`[DEBUG] ${message}`, ...values)
  },
  warn: (message: string, ...values: unknown[]) => {
    console.log(`[WARN] ${message}`, ...values)
  },
  error: (message: string, ...values: unknown[]) => {
    console.log(`[ERROR] ${message}`, ...values)
  },
}
