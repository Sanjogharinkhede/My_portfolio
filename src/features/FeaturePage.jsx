import { ArrowUpRight, CheckCircle2, Mail, Phone, Send, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { createBriefing } from '../lib/briefingClient.js'
import { sendContact } from '../lib/contactClient.js'
import './FeaturePage.css'

const focusOptions = ['Backend engineering', 'Production reliability', 'AI automation']

function BriefingPage() {
  const [focus, setFocus] = useState('Backend engineering')
  const [jobDescription, setJobDescription] = useState('')
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const geminiEnabled = import.meta.env.VITE_ENABLE_GEMINI === 'true'

  const submitBriefing = async (event) => {
    event.preventDefault()
    if (!focus && !jobDescription.trim()) return
    setStatus('loading')
    if (!geminiEnabled) {
      window.setTimeout(() => setStatus('preview'), 550)
      return
    }
    try {
      setResult(await createBriefing({ focusId: focus, jobDescription }))
      setStatus('success')
    } catch (error) {
      setStatus('error')
      setResult({ error: error.message })
    }
  }

  return (
    <main className="feature-page page-grid">
      <section className="feature-hero"><div className="feature-icon"><Sparkles size={25} /></div><div><p className="eyebrow">04 / Gemini Career Briefing Room</p><h1>Make the role<br /><em>specific.</em></h1><p>Turn a role focus into an evidence-led view of relevant experience, engineering thinking, interview prompts, and a proposed first 90 days.</p></div><div className="capacity-badge"><span>AI CAPACITY</span><strong>10 briefings / day</strong><small>{geminiEnabled ? 'Live endpoint enabled' : 'Local preview mode'}</small></div></section>
      <section className="feature-grid">
        <form className="feature-form" onSubmit={submitBriefing}><label>Choose a focus<select value={focus} onChange={(event) => setFocus(event.target.value)}>{focusOptions.map((option) => <option key={option}>{option}</option>)}</select></label><div className="form-divider">or add a role description</div><label>Job description <span className="optional">optional</span><textarea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} maxLength={3000} placeholder="Paste a non-confidential role description..." /><small className="character-count">{jobDescription.length} / 3000</small></label><p className="privacy-note">Do not submit confidential, proprietary, or personal information.</p><button className="button button-dark" type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Preparing briefing...' : 'Create briefing'} <ArrowUpRight size={17} /></button></form>
        <div className="briefing-result">{status === 'idle' && <div className="empty-feature"><Sparkles size={21} /><h2>Your briefing will appear here.</h2><p>Select a focus to preview the structured report. Gemini will use only approved public portfolio content.</p></div>}{status === 'loading' && <div className="empty-feature"><div className="loading-line" /><div className="loading-line short" /><div className="loading-line" /><p>Preparing an evidence-led briefing...</p></div>}{status === 'error' && <div className="empty-feature"><Sparkles size={21} /><h2>Briefing temporarily unavailable.</h2><p>{result?.error} Retry when the protected Gemini service is ready.</p></div>}{(status === 'preview' || status === 'success') && <div className="report-preview"><div className="report-heading"><span>ROLE MATCH / {status === 'preview' ? 'PREVIEW' : 'LIVE'}</span><CheckCircle2 size={19} /></div><h2>{status === 'success' ? 'Briefing ready' : 'Backend engineering'}</h2><p>{result?.roleMatch || 'Relevant experience includes Java, Spring Boot, REST APIs, Python automation, distributed troubleshooting, and delivery in Docker and Kubernetes environments.'}</p><div className="report-list"><span>Engineering lens <b>{result?.engineeringLens || 'Structured API and root-cause thinking'}</b></span><span>Interview prompts <b>{result?.interviewPrompts?.[0] || 'Evidence-led discussion starters'}</b></span><span>30 / 60 / 90 plan <b>{result?.contributionPlan?.[0] || 'Proposal based on the selected focus'}</b></span></div><small className="preview-label">{status === 'success' ? 'Grounded response · validated by the protected endpoint' : 'Local preview · protected Gemini endpoint will connect when configured'}</small></div>}</div>
      </section>
    </main>
  )
}

function ConnectPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const submit = async (event) => {
    event.preventDefault()
    setStatus('sending')
    if (import.meta.env.VITE_ENABLE_CONTACT !== 'true') {
      window.setTimeout(() => setStatus('preview'), 400)
      return
    }
    try { await sendContact({ ...form, consentAccepted: true }); setStatus('sent') } catch { setStatus('error') }
  }

  return <main className="feature-page page-grid"><section className="feature-hero connect-hero"><div className="feature-icon"><Send size={24} /></div><div><p className="eyebrow">05 / Connect Desk</p><h1>Start a useful<br /><em>conversation.</em></h1><p>A concise way to reach out about a role, a technical question, or thoughtful collaboration.</p></div></section><section className="connect-grid"><form className="feature-form" onSubmit={submit}><label>Name<input required value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Your name" /></label><label>Email<input required type="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="you@example.com" /></label><label>Message<textarea required value={form.message} onChange={(event) => update('message', event.target.value)} maxLength={1500} placeholder="What would you like to discuss?" /><small className="character-count">{form.message.length} / 1500</small></label><label className="consent" htmlFor="contact-consent"><input id="contact-consent" required type="checkbox" /> <span>I understand this message is forwarded solely to respond.</span></label>{status === 'sent' || status === 'preview' ? <div className="sent-message"><CheckCircle2 size={18} /> {status === 'sent' ? 'Message delivered.' : 'Local preview complete; protected delivery is not configured.'}</div> : status === 'error' ? <div className="sent-message error-message">Delivery is temporarily unavailable. Please use the direct email link.</div> : <button className="button button-primary" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending...' : 'Send inquiry'} <ArrowUpRight size={17} /></button>}</form><aside className="direct-contact"><p className="eyebrow">Direct channels</p><a href="mailto:sanjogharinkhede@gmail.com"><Mail size={18} /><span>Email<small>sanjogharinkhede@gmail.com</small></span></a><a href="tel:+918827444726"><Phone size={18} /><span>Phone<small>+91 8827444726</small></span></a><p className="contact-note">Protected delivery will use the configured free provider. No form data is stored in this local preview.</p></aside></section></main>
}

export { BriefingPage, ConnectPage }
