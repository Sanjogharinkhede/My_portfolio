const model = process.env.GEMINI_MODEL ? process.env.GEMINI_MODEL : 'gemini-3.6-flash'
const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
  body: JSON.stringify({ contents: [{ parts: [{ text: 'Reply with OK only.' }] }], generationConfig: { maxOutputTokens: 5 } }),
})
const result = await response.json()
console.log(`Gemini HTTP status: ${response.status}`)
console.log(`Response received: ${Boolean(result.candidates)}`)
if (!response.ok) console.log(`Provider message: ${result.error ? result.error.message : 'unknown error'}`)
if (!response.ok) process.exitCode = 1
