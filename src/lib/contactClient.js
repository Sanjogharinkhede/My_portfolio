import { validateContactInput } from '../schemas/contact.js'

export async function sendContact(input) {
  const validation = validateContactInput(input)
  if (!validation.valid) throw new Error(validation.error)

  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validation.value),
  })
  if (!response.ok) throw new Error('Contact delivery is temporarily unavailable.')
  return response.json()
}
