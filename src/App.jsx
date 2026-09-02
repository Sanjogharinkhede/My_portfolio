import { ArrowUpRight, BriefcaseBusiness, Code2, ExternalLink, GitBranch, Mail, MapPin, Menu, Phone, Sparkles, UsersRound, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { loadAnalytics, trackPageView } from './lib/analytics.js'
import './App.css'
import './features/Avatar.css'
import DetailPage from './pages/DetailPage.jsx'
import { BriefingPage, ConnectPage } from './features/FeaturePage.jsx'
import ConsentBanner from './features/ConsentBanner.jsx'
import SitePulse from './features/SitePulse.jsx'
import SiteLayout from './components/SiteLayout.jsx'

const skills = ['Java', 'Spring Boot', 'REST APIs', 'Python automation', 'Docker', 'Kubernetes']

const experience = [
  { period: 'Dec 2024 - Present', role: 'Project Engineer', company: 'Wipro Limited', detail: 'Enterprise telecom client engagement', outcome: '40-60% less manual investigation effort' },
  { period: 'Feb 2024 - Dec 2024', role: 'Full Stack Web Developer', company: 'ITWORKS Infotech', detail: 'Healthcare, e-commerce, and business applications', outcome: '30% application-performance improvement' },
]

function PortfolioHome() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" onClick={closeMenu}><span className="wordmark-mark">SH</span><span>Sanjog Harinkhede</span></a>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="primary-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}<span className="sr-only">Toggle navigation</span></button>
        <nav id="primary-nav" className={menuOpen ? 'primary-nav is-open' : 'primary-nav'} aria-label="Primary navigation">
          {['About', 'Experience', 'Skills', 'Projects', 'Resume', 'Briefing', 'Connect'].map((item) => <a key={item} href={item === 'Connect' ? '#connect' : `/${item.toLowerCase()}`} onClick={closeMenu}>{item}</a>)}
        </nav>
        <a className="header-contact" href="/connect">Get in touch <ArrowUpRight size={16} /></a>
      </header>

      <main id="top">
        <section className="hero-section page-grid">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> Java Full Stack Developer <span className="eyebrow-rule" /> Bengaluru, India</p>
            <h1>Reliable systems.<br /><em>Useful</em> engineering.</h1>
            <p className="hero-summary">I build dependable backend systems, web applications, and engineering automation with Java, Spring Boot, REST APIs, and Python.</p>
            <div className="hero-actions"><a className="button button-primary" href="#experience">View work <ArrowUpRight size={17} /></a><a className="button button-quiet" href="/resume">Download resume <ExternalLink size={16} /></a></div>
            <div className="hero-meta"><span><BriefcaseBusiness size={15} /> 2+ years experience</span><span><Code2 size={15} /> Backend + full stack</span></div>
          </div>
          <div className="avatar-stage" aria-label="Illustrated neutral developer avatar placeholder" role="img">
            <div className="avatar-orbit orbit-one" /><div className="avatar-orbit orbit-two" />
            <div className="avatar-card card-top"><span>01</span><strong>BUILD</strong><small>Java / Spring</small></div><div className="avatar-card card-bottom"><span>03</span><strong>SHIP</strong><small>Docker / K8s</small></div>
            <img className="avatar-image" src="/assets/developer-avatar.svg" alt="Stylised bearded developer avatar" />
            <p className="avatar-caption">A developer's point of view<br /><span>Building · Investigating · Shipping</span></p>
          </div>
        </section>

        <section className="proof-section page-grid" aria-label="Professional proof points"><div className="section-kicker">At a glance</div><div className="proof-grid"><div><strong>40-60%</strong><span>manual investigation effort reduced</span></div><div><strong>30%</strong><span>application performance improved</span></div><div><strong>Java</strong><span>Spring Boot · REST · Python</span></div></div></section>

        <section className="content-section page-grid" id="experience"><div className="section-intro"><p className="eyebrow">01 / Experience</p><h2>Work that leaves<br /><em>evidence.</em></h2><p>Enterprise systems, production troubleshooting, and practical automation shaped by real delivery constraints.</p><a className="text-link" href="/connect">Discuss a project <ArrowUpRight size={16} /></a></div><div className="experience-list">{experience.map((item) => <article className="experience-item" key={item.company}><div className="experience-date">{item.period}</div><div><h3>{item.role}</h3><p className="company">{item.company}</p><p>{item.detail}</p><span className="outcome-tag">{item.outcome}</span></div></article>)}</div></section>

        <section className="skills-section page-grid" id="skills"><div><p className="eyebrow">02 / Technical strengths</p><h2>Tools for the<br /><em>real world.</em></h2></div><div className="skills-content"><p>From API design to the logs that explain why production broke. A practical stack for dependable delivery.</p><div className="skill-list">{skills.map((skill, index) => <span key={skill}><b>0{index + 1}</b>{skill}</span>)}</div><a className="text-link" href="/briefing">Explore with the Briefing Room <Sparkles size={16} /></a></div></section>

        <section className="projects-section page-grid" id="projects"><div className="project-header"><div><p className="eyebrow">03 / Selected work</p><h2>Projects, <em>soon.</em></h2></div><span className="status-label">CONTENT IN PROGRESS</span></div><div className="project-placeholder"><div className="project-index">04</div><div><h3>Standalone projects are coming</h3><p>The Projects page is ready for case studies with public links, measurable outcomes, and the engineering decisions behind them.</p></div><ArrowUpRight size={24} /></div></section>

        <section className="briefing-section page-grid" id="briefing"><div className="briefing-mark"><Sparkles size={28} /></div><div><p className="eyebrow">04 / Gemini Career Briefing Room</p><h2>Make the role<br /><em>specific.</em></h2><p>Bring a focus or job description. Get a structured view of relevant experience, engineering thinking, interview prompts, and a proposed first 90 days.</p><a className="button button-dark" href="/briefing">Explore the briefing <ArrowUpRight size={17} /></a></div><div className="briefing-note"><span>AI / 01</span><strong>Grounded in<br />approved work</strong></div></section>

        <section className="connect-section page-grid" id="connect"><div><p className="eyebrow">05 / Connect Desk</p><h2>Start a useful<br /><em>conversation.</em></h2><p>For hiring conversations, technical questions, and thoughtful collaboration.</p><a className="text-link" href="/connect">Open the Connect Desk <ArrowUpRight size={16} /></a></div><div className="contact-links"><a href="mailto:sanjogharinkhede@gmail.com"><Mail size={18} /><span>Email<small>sanjogharinkhede@gmail.com</small></span><ArrowUpRight size={16} /></a><a href="tel:+918827444726"><Phone size={18} /><span>Phone<small>+91 8827444726</small></span><ArrowUpRight size={16} /></a><a href="https://linkedin.com/in/sanjogharinkhede" target="_blank" rel="noreferrer"><UsersRound size={18} /><span>LinkedIn<small>/in/sanjogharinkhede</small></span><ArrowUpRight size={16} /></a><a href="https://github.com/sanjogharinkhede" target="_blank" rel="noreferrer"><GitBranch size={18} /><span>GitHub<small>/sanjogharinkhede</small></span><ArrowUpRight size={16} /></a></div></section>
      </main>

      <footer className="site-footer page-grid"><span>© 2026 Sanjog Harinkhede</span><span><MapPin size={14} /> Bengaluru, India</span><SitePulse /><a href="#top">Back to top <ArrowUpRight size={14} /></a></footer><ConsentBanner />
    </div>
  )
}

function App() {
  return <BrowserRouter><AnalyticsBridge /><Routes>
    <Route path="/" element={<PortfolioHome />} />
    {['about', 'experience', 'skills', 'projects', 'resume'].map((page) => <Route key={page} path={`/${page}`} element={<SiteLayout><DetailPage page={page} /></SiteLayout>} />)}
    <Route path="/briefing" element={<SiteLayout><BriefingPage /></SiteLayout>} />
    <Route path="/connect" element={<SiteLayout><ConnectPage /></SiteLayout>} />
    <Route path="*" element={<PortfolioHome />} />
  </Routes></BrowserRouter>
}

function AnalyticsBridge() {
  const location = useLocation()
  useEffect(() => {
    loadAnalytics()
    trackPageView(`${location.pathname}${location.search}`)
  }, [location.pathname, location.search])
  return null
}

export default App
