'use client'

import { useEffect, useRef } from 'react'

const QUICK_FACTS = [
  { icon: '🎓', label: 'Education', value: 'MS Computer Engineering, University of South Florida' },
  { icon: '📍', label: 'Location',  value: 'United States' },
  { icon: '💼', label: 'Current',   value: 'AI Systems Engineer @ Face Friends Foundation' },
  { icon: '🤖', label: 'Focus',     value: 'LLM Agents · RAG Pipelines · AIOps · EKS' },
  { icon: '🏆', label: 'Certs',     value: '10 Cloud + AI Certifications' },
  { icon: '📧', label: 'Email',     value: 'jithendra.kantharaju@gmail.com' },
]

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    async function init() {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        gsap.fromTo('.about-reveal',
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0,
            duration: 0.8, stagger: 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
          }
        )

        gsap.to(sectionRef.current, {
          opacity: 0, y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'bottom 30%',
            end: 'bottom top',
            scrub: true,
          },
        })
      }, sectionRef)

      return () => ctx.revert()
    }
    init()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="section">
      <div className="container">

        {/* Label */}
        <div className="about-reveal" style={{ marginBottom: 12 }}>
          <span className="label">About</span>
        </div>

        {/* Ghost heading */}
        <h2
          className="about-reveal ghost"
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', marginBottom: 40 }}
        >
          Who I Am
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 40,
          alignItems: 'start',
        }}>

          {/* Left: bio text */}
          <div>
            <p className="about-reveal" style={{
              fontSize: '1.05rem', lineHeight: 1.8,
              color: 'rgba(240,237,232,0.75)',
              marginBottom: 20,
            }}>
              I&apos;m an AI Engineer and Forward Deployed Engineer who builds production-grade
              AI systems — LLM agents, RAG pipelines, and AIOps tooling that run reliably on
              AWS EKS. My background spans nearly three years of DevOps engineering in India
              and the United States, where I&apos;ve shipped infrastructure for teams of 10,000+ users.
            </p>
            <p className="about-reveal" style={{
              fontSize: '1.05rem', lineHeight: 1.8,
              color: 'rgba(240,237,232,0.75)',
              marginBottom: 32,
            }}>
              I specialize in closing the gap between ML research and production reality —
              writing the Terraform, Helm charts, GitHub Actions pipelines, and observability
              stacks that keep AI systems running at scale. Currently finishing my MS in
              Computer Engineering at the University of South Florida.
            </p>

            {/* Links — GitHub and LinkedIn only */}
            <div className="about-reveal" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a
                href="https://github.com/jithendra-kantharaju"
                target="_blank" rel="noopener noreferrer"
                className="btn-orange"
                style={{ padding: '10px 20px', fontSize: '0.75rem' }}
              >
                GitHub &#8599;
              </a>
              <a
                href="https://www.linkedin.com/in/jithendra-kantharaju/"
                target="_blank" rel="noopener noreferrer"
                className="btn-ghost"
                style={{ padding: '10px 20px', fontSize: '0.75rem' }}
              >
                LinkedIn &#8599;
              </a>
            </div>
          </div>

          {/* Right: quick-facts grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 12,
          }}>
            {QUICK_FACTS.map(({ icon, label, value }) => (
              <div
                key={label}
                className="about-reveal glass-card"
                style={{ padding: '16px 18px', display: 'flex', gap: 14, alignItems: 'flex-start' }}
              >
                <span style={{ fontSize: '1.2rem', lineHeight: 1, marginTop: 2 }}>{icon}</span>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--orange)',
                    marginBottom: 4,
                  }}>{label}</div>
                  <div style={{
                    fontSize: '0.85rem',
                    color: 'rgba(240,237,232,0.75)',
                    lineHeight: 1.4,
                  }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}