import { isBriefingResponse, validateBriefingInput } from '../schemas/briefing.js'

export async function getBriefingCapacity() {
  const response = await fetch('/api/briefing')
  if (!response.ok) throw new Error('Briefing capacity is temporarily unavailable.')
  return response.json()
}

export async function createBriefing(input) {
  const validation = validateBriefingInput(input)
  if (!validation.valid) throw new Error(validation.error)

  const response = await fetch('/api/briefing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validation.value),
  })

  if (!response.ok) throw new Error('The briefing service is temporarily unavailable.')
  const result = await response.json()
  if (!isBriefingResponse(result)) throw new Error('The briefing response could not be validated.')
  return result
}
