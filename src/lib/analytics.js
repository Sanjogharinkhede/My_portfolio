const consentKey = 'sanjog-analytics-consent'

export function getAnalyticsConsent() {
  return window.localStorage.getItem(consentKey) === 'granted'
}

export function setAnalyticsConsent(value) {
  window.localStorage.setItem(consentKey, value ? 'granted' : 'declined')
}

export function trackPageView(path) {
  if (!getAnalyticsConsent() || typeof window.gtag !== 'function') return
  window.gtag('config', window.__GA_MEASUREMENT_ID, { page_path: path })
}
