function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

export async function onRequestGet(context) {
  if (!context.env.SITE_PULSE_KV) return json({ error: 'Site Pulse is not configured.' }, 503)
  const views = Number(await context.env.SITE_PULSE_KV.get('views')) || 0
  const likes = Number(await context.env.SITE_PULSE_KV.get('likes')) || 0
  return json({ views, likes })
}

export async function onRequestPost(context) {
  if (!context.env.SITE_PULSE_KV) return json({ error: 'Site Pulse is not configured.' }, 503)
  const views = Number(await context.env.SITE_PULSE_KV.get('views')) || 0
  const nextViews = views + 1
  await context.env.SITE_PULSE_KV.put('views', String(nextViews))
  const likes = Number(await context.env.SITE_PULSE_KV.get('likes')) || 0
  return json({ views: nextViews, likes })
}
