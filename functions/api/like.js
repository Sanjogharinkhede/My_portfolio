function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

export async function onRequestPost(context) {
  if (!context.env.SITE_PULSE_KV) return json({ error: 'Site Pulse is not configured.' }, 503)
  if (context.env.TURNSTILE_SECRET_KEY) {
    let token
    try { token = (await context.request.json()).token } catch { return json({ error: 'Anti-abuse verification is required.' }, 400) }
    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ secret: context.env.TURNSTILE_SECRET_KEY, response: token || '' }) })
    const result = await verification.json()
    if (!result.success) return json({ error: 'Anti-abuse verification failed.' }, 403)
  }
  const likes = Number(await context.env.SITE_PULSE_KV.get('likes')) || 0
  const nextLikes = likes + 1
  await context.env.SITE_PULSE_KV.put('likes', String(nextLikes))
  const views = Number(await context.env.SITE_PULSE_KV.get('views')) || 0
  return json({ views, likes: nextLikes })
}
