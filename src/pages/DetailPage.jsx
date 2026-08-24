import { ArrowUpRight, CheckCircle2, Download, Sparkles } from 'lucide-react'
import './DetailPage.css'

const pageContent = {
  about: {
    number: '01',
    label: 'About',
    title: <>A practical engineer<br /><em>with range.</em></>,
    intro: 'I build and support dependable backend systems, web applications, and engineering automation across enterprise and product environments.',
    sections: [
      ['Working style', 'I like problems that become clearer through evidence: a useful log, a clean API boundary, a query that tells the truth, or an automation that gives a team its time back.'],
      ['Education', 'B.Tech (Honours), Mechanical Engineering\nGovernment Engineering College, Jabalpur · 2022 · CGPA 8.02/10'],
      ['Learning', 'Java Full Stack Development · QSpiders\nFastAPI: Complete Course · Udemy\nGenerative AI and Prompt Engineering · Udemy'],
    ],
  },
  experience: {
    number: '02',
    label: 'Experience',
    title: <>Delivery shaped by<br /><em>real constraints.</em></>,
    intro: 'A client-safe view of the work: backend services, integrations, investigation workflows, and web applications that have to keep moving.',
    sections: [
      ['Project Engineer · Wipro Limited', 'Dec 2024 - Present · Bengaluru, India\nDevelop and enhance Java and Python backend microservices, REST APIs, production fixes, and investigation automation for an enterprise telecom client engagement.'],
      ['Full Stack Web Developer · ITWORKS Infotech', 'Feb 2024 - Dec 2024 · Pune, India\nBuilt and maintained applications for healthcare, e-commerce, and business clients across Java, PHP/Laravel, JavaScript, SQL, and REST APIs.'],
      ['Evidence', '40-60% reduction in manual investigation effort through Python automation.\n30% application-performance improvement through SQL optimisation, refactoring, and systematic debugging.'],
    ],
  },
  skills: {
    number: '03',
    label: 'Skills',
    title: <>The stack behind<br /><em>the outcome.</em></>,
    intro: 'A grouped view of the tools and practices used to build, troubleshoot, and deliver dependable systems.',
    sections: [
      ['Languages', 'Java · Python · JavaScript · SQL · PHP'],
      ['Backend', 'Spring Boot · Spring MVC · FastAPI · EJB · JMS · Microservices · REST APIs'],
      ['Data and frontend', 'Oracle SQL · MySQL · PostgreSQL · HTML5 · CSS3 · JavaScript'],
      ['Delivery and quality', 'Docker · Kubernetes · Jenkins · Git · Maven · Jira · Agile · Scrum · Robot Framework · Root-cause analysis'],
    ],
  },
  projects: {
    number: '04',
    label: 'Projects',
    title: <>Projects are<br /><em>coming soon.</em></>,
    intro: 'This space is ready for standalone case studies with public links, measurable outcomes, and the engineering decisions behind them.',
    sections: [['Content status', 'Project details are intentionally deferred until the approved titles, contributions, technology stacks, outcomes, and public links are supplied. No invented work appears here.']],
  },
  resume: {
    number: '05',
    label: 'Resume',
    title: <>The short version<br /><em>of the work.</em></>,
    intro: 'A readable summary will live here alongside the final approved Java Full Stack resume PDF.',
    sections: [['Current status', 'The final resume asset will be added during implementation. The page remains useful as a structured overview and will not depend on a download to communicate the profile.']],
  },
}

function DetailPage({ page }) {
  const content = pageContent[page] || pageContent.about

  return (
    <main className="detail-page page-grid">
        <section className="detail-hero">
          <div className="detail-number">{content.number}</div>
          <div><p className="eyebrow">{content.number} / {content.label}</p><h1>{content.title}</h1><p className="detail-intro">{content.intro}</p></div>
        </section>
        <section className="detail-body">
          {content.sections.map(([heading, body]) => <article className="detail-section" key={heading}><h2>{heading}</h2><p>{body}</p></article>)}
        </section>
        <div className="detail-actions">
          <a className="button button-primary" href="/#connect">Get in touch <ArrowUpRight size={17} /></a>
          {page === 'resume' && <span className="button button-quiet"><Download size={16} /> PDF coming soon</span>}
          {page === 'projects' && <a className="button button-quiet" href="/briefing"><Sparkles size={16} /> Explore Briefing</a>}
        </div>
        <div className="detail-proof"><CheckCircle2 size={17} /> All published content is grounded in the approved portfolio brief.</div>
    </main>
  )
}

export default DetailPage
