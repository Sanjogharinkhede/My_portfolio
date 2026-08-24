const DEFAULT_REQUEST_CAP = 25
const DEFAULT_TOKEN_CAP = 17500

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function createQuotaLedger(storage = new Map()) {
  return {
    status() {
      const key = todayKey()
      const current = storage.get(key) || { requests: 0, tokens: 0 }
      return {
        usedRequests: current.requests,
        requestCap: DEFAULT_REQUEST_CAP,
        remainingRequests: Math.max(DEFAULT_REQUEST_CAP - current.requests, 0),
        usedTokens: current.tokens,
        tokenCap: DEFAULT_TOKEN_CAP,
        resetAt: `${key}T23:59:59.999Z`,
        available: current.requests < DEFAULT_REQUEST_CAP && current.tokens < DEFAULT_TOKEN_CAP,
      }
    },
    reserve(requestUnits = 1, tokenUnits = 700) {
      const key = todayKey()
      const current = storage.get(key) || { requests: 0, tokens: 0 }
      if (current.requests + requestUnits > DEFAULT_REQUEST_CAP || current.tokens + tokenUnits > DEFAULT_TOKEN_CAP) return { reserved: false, status: this.status() }
      const next = { requests: current.requests + requestUnits, tokens: current.tokens + tokenUnits }
      storage.set(key, next)
      return { reserved: true, status: this.status() }
    },
  }
}

export { todayKey }
