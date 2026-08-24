let scriptPromise

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.onload = () => resolve(window.turnstile)
    script.onerror = () => reject(new Error('Turnstile could not be loaded.'))
    document.head.appendChild(script)
  })
  return scriptPromise
}

export async function getTurnstileToken() {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
  if (!siteKey) throw new Error('Turnstile site key is not configured.')

  const turnstile = await loadTurnstile()
  const container = document.createElement('div')
  container.setAttribute('aria-hidden', 'true')
  container.style.position = 'fixed'
  container.style.width = '1px'
  container.style.height = '1px'
  container.style.overflow = 'hidden'
  document.body.appendChild(container)

  return new Promise((resolve, reject) => {
    const widgetId = turnstile.render(container, {
      sitekey: siteKey,
      action: 'like',
      execution: 'execute',
      appearance: 'execute',
      callback: (token) => { container.remove(); resolve(token) },
      'error-callback': () => { container.remove(); reject(new Error('Turnstile verification failed.')) },
      'expired-callback': () => { container.remove(); reject(new Error('Turnstile verification expired.')) },
    })
    turnstile.execute(widgetId)
  })
}
