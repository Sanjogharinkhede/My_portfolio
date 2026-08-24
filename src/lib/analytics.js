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

export function loadAnalytics() {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
  if (!measurementId || !getAnalyticsConsent() || window.gtag) return
  window.__GA_MEASUREMENT_ID = measurementId
  window.dataLayer = window.dataLayer || []
  window.gtag = (...args) => window.dataLayer.push(args)
  window.gtag('js', new Date())
  window.gtag('config', measurementId, { anonymize_ip: true, allow_google_signals: false, allow_ad_personalization_signals: false })
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
  document.head.appendChild(script)
}
