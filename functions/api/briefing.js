const MAX_JOB_DESCRIPTION = 3000
const MAX_FOCUS_ID = 80
const REQUEST_CAP = 25
const TOKEN_CAP = 17500
const TOKEN_RESERVATION = 700

const portfolioContext = `
Sanjog Harinkhede is a Java Full Stack Developer with 2+ years of experience.
Approved strengths: Java, Spring Boot, REST APIs, Python automation, SQL, Docker, Kubernetes, troubleshooting, and AI-assisted engineering.
Approved outcomes: 40-60% reduction in manual investigation effort and 30% application-performance improvement.
Experience: Project Engineer at Wipro Limited for an enterprise telecom client engagement; Full Stack Web Developer at ITWORKS Infotech.
Do not disclose client-confidential information. Proposed approaches and plans are not past work.
`

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

function parseInput(value) {
  const focusId = typeof value?.focusId === 'string' ? value.focusId.trim() : ''
  const jobDescription = typeof value?.jobDescription === 'string' ? value.jobDescription.trim() : ''
  if ((!focusId && !jobDescription) || focusId.length > MAX_FOCUS_ID || jobDescription.length > MAX_JOB_DESCRIPTION) return null
  return { focusId, jobDescription }
}

function parseProviderJson(text) {
  if (typeof text !== 'string') return null
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  try { return JSON.parse(cleaned) } catch {
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start < 0 || end <= start) return null
    try { return JSON.parse(cleaned.slice(start, end + 1)) } catch { return null }
  }
}

function logProviderResponse(context, model, response, text) {
  const mode = context.env.GEMINI_DEBUG_LOGS || 'metadata'
  const candidate = response?.candidates?.[0]
  console.log('Gemini provider response', {
    model,
    candidateCount: Array.isArray(response?.candidates) ? response.candidates.length : 0,
    finishReason: candidate?.finishReason || 'unknown',
    responseLength: typeof text === 'string' ? text.length : 0,
  })
  if (mode === 'preview' && typeof text === 'string') console.log('Gemini response preview', text.slice(0, 1200))
}

async function reserveQuota(db) {
  if (!db) return { reserved: false, reason: 'quota-not-configured' }
  const day = new Date().toISOString().slice(0, 10)
  await db.prepare('INSERT OR IGNORE INTO ai_quota (day, requests, tokens) VALUES (?, 0, 0)').bind(day).run()
  const result = await db.prepare('UPDATE ai_quota SET requests = requests + 1, tokens = tokens + ? WHERE day = ? AND requests < ? AND tokens + ? <= ?').bind(TOKEN_RESERVATION, day, REQUEST_CAP, TOKEN_RESERVATION, TOKEN_CAP).run()
  return { reserved: result.meta.changes === 1, reason: result.meta.changes === 1 ? 'reserved' : 'capacity-reached' }
}

export async function onRequestPost(context) {
  if (!context.env.GEMINI_API_KEY) return json({ error: 'Briefing service is not configured.' }, 503)

  let input
  try { input = parseInput(await context.request.json()) } catch { return json({ error: 'Invalid request.' }, 400) }
  if (!input) return json({ error: 'Choose a focus or provide a bounded role description.' }, 400)
  const quota = await reserveQuota(context.env.AI_QUOTA_DB)
  if (!quota.reserved) return json({ error: quota.reason === 'capacity-reached' ? 'Daily briefing capacity has been reached.' : 'Briefing capacity is not configured.' }, 503)

  const model = context.env.GEMINI_MODEL ? context.env.GEMINI_MODEL : 'gemini-3.6-flash'
  const prompt = `Return JSON with exactly these keys: roleMatch (string), engineeringLens (string), interviewPrompts (array of strings), contributionPlan (array of strings). Ground every factual statement only in this context.\nContext:\n${portfolioContext}\nFocus: ${input.focusId}\nRole description: ${input.jobDescription}`

  try {
    const providerResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${context.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0.2, maxOutputTokens: 700 } }),
    })
    if (!providerResponse.ok) {
      let providerError = 'unknown-provider-error'
      try {
        const details = await providerResponse.json()
        providerError = details?.error?.status || details?.error?.code || providerError
      } catch { /* Keep provider diagnostics out of the public response. */ }
      console.error('Gemini provider request failed', { status: providerResponse.status, reason: providerError, model })
      return json({ error: 'Briefing provider is temporarily unavailable.' }, 503)
    }
    const providerData = await providerResponse.json()
    const text = providerData?.candidates?.[0]?.content?.parts?.[0]?.text
    logProviderResponse(context, model, providerData, text)
    const result = parseProviderJson(text)
    if (!result || typeof result.roleMatch !== 'string' || typeof result.engineeringLens !== 'string' || !Array.isArray(result.interviewPrompts) || !Array.isArray(result.contributionPlan)) return json({ error: 'Briefing response could not be validated.' }, 502)
    return json(result)
  } catch (error) {
    console.error('Gemini provider request exception', { reason: error instanceof Error ? error.name : 'unknown-error', model })
    return json({ error: 'Briefing provider is temporarily unavailable.' }, 503)
  }
}
