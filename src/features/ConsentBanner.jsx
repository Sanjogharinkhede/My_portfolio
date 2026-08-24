import { useState } from 'react'
import { setAnalyticsConsent, getAnalyticsConsent } from '../lib/analytics.js'
import './ConsentBanner.css'

function ConsentBanner() {
  const [visible, setVisible] = useState(() => !window.localStorage.getItem('sanjog-analytics-consent'))
  if (!visible || getAnalyticsConsent()) return null

  const choose = (granted) => {
    setAnalyticsConsent(granted)
    setVisible(false)
  }

  return <aside className="consent-banner" aria-label="Analytics consent"><div><strong>Keep the useful signals private.</strong><p>Optional aggregate analytics help understand which pages are useful. No contact or AI input is collected.</p></div><div className="consent-actions"><button type="button" onClick={() => choose(false)}>Decline</button><button type="button" onClick={() => choose(true)}>Allow analytics</button></div></aside>
}

export default ConsentBanner
