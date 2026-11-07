import { profile } from '@/data/portfolio'
import Arrow from './Arrow'

export default function Hero() {
  return <section id="home" className="hero container" tabIndex={-1} aria-labelledby="hero-title">
    <div className="hero-main">
      <p data-hero-motion="status" className="eyebrow"><span className="status-dot" />Based in the United States · Open to opportunities</p>
      <p data-hero-motion="intro" className="hero-intro title-2">Hi, I’m Jithendra Kantharaju.</p>
      <h1 id="hero-title" className="heading-1"><span className="hero-line" data-hero-motion="line1">Cloud infrastructure.</span><br /><span className="hero-line" data-hero-motion="line2">Reliable delivery.</span><br /><span className="hero-line hero-accent" data-hero-motion="line3">Applied AI.</span></h1>
      <p data-hero-motion="description" className="hero-description body-3">I build the infrastructure, automation, and AI workflows that turn complex engineering problems into dependable systems.</p>
      <div data-hero-motion="actions" className="hero-actions"><a className="button button-primary" href={'mailto:' + profile.email}>Get in touch <Arrow diagonal /></a><a className="button button-secondary" href="#projects">Explore my work <Arrow /></a></div>
      <div className="hero-socials"><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub <Arrow diagonal /></a><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <Arrow diagonal /></a></div>
    </div>
    <aside className="hero-note" aria-label="Engineering focus">
      <div className="note-top"><span className="eyebrow">Engineering focus</span><span aria-hidden="true">↗</span></div>
      <div className="focus-stack"><div data-hero-motion="focus1"><span className="focus-packet" aria-hidden="true" /><span className="caption-4">01 / FOUNDATION</span><h2 className="title-1">Cloud & platform</h2><p className="body-6">AWS · Kubernetes · Terraform</p></div><div data-hero-motion="focus2"><span className="focus-packet" aria-hidden="true" /><span className="caption-4">02 / OPERATIONS</span><h2 className="title-1">Delivery & reliability</h2><p className="body-6">GitOps · CI/CD · Observability</p></div><div data-hero-motion="focus3"><span className="caption-4">03 / INTELLIGENCE</span><h2 className="title-1">AI systems</h2><p className="body-6">LangGraph · RAG · Evaluation</p></div></div>
      <p className="note-foot caption-2">From infrastructure to the systems running on it.</p>
    </aside>
    <div className="hero-bottom"><span className="caption-4">DEVOPS / CLOUD / SRE / FDE / AI</span><a href="#about" className="caption-2">A closer look <span aria-hidden="true">↓</span></a></div>
  </section>
}
