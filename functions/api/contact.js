function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

function validEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 200
}

export async function onRequestPost(context) {
  if (!context.env.RESEND_API_KEY || !context.env.CONTACT_RECIPIENT || !context.env.CONTACT_FROM) return json({ error: 'Contact delivery is not configured.' }, 503)

  let input
  try { input = await context.request.json() } catch { return json({ error: 'Invalid request.' }, 400) }
  const name = typeof input?.name === 'string' ? input.name.trim() : ''
  const email = typeof input?.email === 'string' ? input.email.trim() : ''
  const message = typeof input?.message === 'string' ? input.message.trim() : ''
  if (!name || name.length > 120 || !validEmail(email) || !message || message.length > 1500 || input?.consentAccepted !== true) return json({ error: 'Please check the required contact fields.' }, 400)

  try {
    const providerResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${context.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: context.env.CONTACT_FROM, to: [context.env.CONTACT_RECIPIENT], reply_to: email, subject: `Portfolio inquiry from ${name}`, text: `Name: ${name}\nEmail: ${email}\n\n${message}` }),
    })
    if (!providerResponse.ok) return json({ error: 'Contact delivery is temporarily unavailable.' }, 503)
    return json({ status: 'sent' })
  } catch { return json({ error: 'Contact delivery is temporarily unavailable.' }, 503) }
}
