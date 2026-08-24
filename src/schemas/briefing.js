export const briefingInputLimits = {
  focusId: 80,
  jobDescription: 3000,
}

export function validateBriefingInput(input) {
  const focusId = typeof input?.focusId === 'string' ? input.focusId.trim() : ''
  const jobDescription = typeof input?.jobDescription === 'string' ? input.jobDescription.trim() : ''

  if (!focusId && !jobDescription) return { valid: false, error: 'Choose a focus or add a role description.' }
  if (focusId.length > briefingInputLimits.focusId) return { valid: false, error: 'That focus is too long.' }
  if (jobDescription.length > briefingInputLimits.jobDescription) return { valid: false, error: 'The role description is too long.' }

  return { valid: true, value: { focusId, jobDescription } }
}

export function isBriefingResponse(value) {
  return Boolean(
    value &&
    typeof value.roleMatch === 'string' &&
    typeof value.engineeringLens === 'string' &&
    Array.isArray(value.interviewPrompts) &&
    Array.isArray(value.contributionPlan),
  )
}
