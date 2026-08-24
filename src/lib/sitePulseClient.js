export async function loadSitePulse() {
  const response = await fetch('/api/metrics')
  if (!response.ok) throw new Error('Site Pulse is temporarily unavailable.')
  return response.json()
}

export async function recordSiteView() {
  const response = await fetch('/api/metrics', { method: 'POST' })
  if (!response.ok) throw new Error('Site Pulse is temporarily unavailable.')
  return response.json()
}

export async function submitSiteLike(token) {
  const response = await fetch('/api/like', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) })
  if (!response.ok) throw new Error('Site Pulse is temporarily unavailable.')
  return response.json()
}
