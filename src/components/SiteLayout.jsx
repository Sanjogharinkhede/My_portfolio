import { ArrowUpRight, Menu, Phone, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import SitePulse from '../features/SitePulse.jsx'
import ConsentBanner from '../features/ConsentBanner.jsx'

const links = [
  ['About', '/about'],
  ['Experience', '/experience'],
  ['Skills', '/skills'],
  ['Projects', '/projects'],
  ['Resume', '/resume'],
  ['Briefing', '/briefing'],
  ['Connect', '/connect'],
]

function SiteLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    const label = links.find(([, href]) => href === location.pathname)?.[0]
    document.title = label ? `${label} | Sanjog Harinkhede` : 'Sanjog Harinkhede | Java Full Stack Developer'
  }, [location.pathname])

  return <div className="site-shell">
    <header className="site-header">
      <Link className="wordmark" to="/"><span className="wordmark-mark">SH</span><span>Sanjog Harinkhede</span></Link>
      <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="layout-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}<span className="sr-only">Toggle navigation</span></button>
      <nav id="layout-nav" className={menuOpen ? 'primary-nav is-open' : 'primary-nav'} aria-label="Primary navigation">{links.map(([label, href]) => <Link key={href} to={href} onClick={closeMenu}>{label}</Link>)}</nav>
      <Link className="header-contact" to="/connect">Get in touch <ArrowUpRight size={16} /></Link>
    </header>
    {children}
    <footer className="site-footer page-grid"><span>© 2026 Sanjog Harinkhede</span><span><Phone size={14} /> +91 8827444726</span><SitePulse /><Link to="/">Back to home <ArrowUpRight size={14} /></Link></footer>
    <ConsentBanner />
  </div>
}

export default SiteLayout
