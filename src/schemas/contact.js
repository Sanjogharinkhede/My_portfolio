export function validateContactInput(input) {
  const name = typeof input?.name === 'string' ? input.name.trim() : ''
  const email = typeof input?.email === 'string' ? input.email.trim() : ''
  const message = typeof input?.message === 'string' ? input.message.trim() : ''
  const consentAccepted = input?.consentAccepted === true

  if (!name || name.length > 120) return { valid: false, error: 'Enter your name.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) return { valid: false, error: 'Enter a valid email address.' }
  if (!message || message.length > 1500) return { valid: false, error: 'Add a message under 1500 characters.' }
  if (!consentAccepted) return { valid: false, error: 'Please accept the contact notice.' }

  return { valid: true, value: { name, email, message, consentAccepted } }
}
