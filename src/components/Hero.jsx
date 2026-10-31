'use client'

import { useEffect, useRef } from 'react'

const STATS = [
  { num: '3+',  label: 'Years Production\nExperience' },
  { num: '40%', label: 'Fewer Deploy\nErrors' },
  { num: '60%', label: 'Faster Incident\nResolution' },
  { num: '10',  label: 'Cloud\nCertifications' },
]

export default function Hero() {
  const sectionRef  = useRef(null)
  const nameRef     = useRef(null)
  const subtitleRef = useRef(null)
  const statsRef    = useRef(null)
  const ctaRef      = useRef(null)
  const scrollRef   = useRef(null)

  useEffect(() => {
    async function init() {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const tl = gsap.timeline({ delay: 0.3 })

      const letters = nameRef.current?.querySelectorAll('.hero-letter')
      if (letters) {
        tl.fromTo(letters,
          { opacity: 0, rotateX: 40, y: 60, transformPerspective: 800 },
          { opacity: 1, rotateX: 0, y: 0, duration: 0.9, stagger: 0.06, ease: 'power4.out' }
        )
      }

      tl.fromTo(subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3'
      )

      tl.fromTo(
        statsRef.current?.children ? Array.from(statsRef.current.children) : [],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.2'
      )

      tl.fromTo(ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2'
      )

      gsap.to(sectionRef.current, {
        opacity: 0, y: -60, ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top', end: 'bottom top', scrub: true,
        },
      })

      gsap.to(scrollRef.current, {
        y: 8, duration: 0.9, yoyo: true, repeat: -1, ease: 'power1.inOut',
      })
    }
    init()
  }, [])

  const scrollToAbout = () => {
    const el = document.getElementById('about')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const firstName = 'Jithendra'
  const lastName  = 'Kantharaju'

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10,
        padding: 'clamp(80px, 15vh, 140px) clamp(16px, 5vw, 80px) 80px',
      }}
    >
      {/* Role label */}
      <div style={{ marginBottom: 24 }}>
        <span className="hero-tag">
          CLOUD &nbsp;/&nbsp; DEVOPS &nbsp;/&nbsp; AI &nbsp;&middot;&nbsp; FDE
        </span>
      </div>

      {/* Name */}
      <div ref={nameRef} style={{ marginBottom: 28, overflow: 'hidden' }}>
        {/* First line: JITHENDRA ghost outline */}
        <div style={{ display: 'block', lineHeight: 1 }}>
          {firstName.split('').map((ch, i) => (
            <span
              key={i}
              className="hero-letter ghost"
              style={{
                display: 'inline-block',
                fontSize: 'clamp(2.6rem, 10vw, 10.5rem)',
                opacity: 0,
              }}
            >
              {ch}
            </span>
          ))}
        </div>
        {/* Second line: KANTHARAJU filled */}
        <div style={{ display: 'block', marginTop: '-0.05em', lineHeight: 1 }}>
          {lastName.split('').map((ch, i) => (
            <span
              key={i}
              className="hero-letter"
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 900,
                fontSize: 'clamp(2.6rem, 10vw, 10.5rem)',
                letterSpacing: '-0.03em',
                lineHeight: 0.9,
                color: 'var(--fg)',
                opacity: 0,
              }}
            >
              {ch}
            </span>
          ))}
        </div>
      </div>

      {/* Subtitle */}
      <div ref={subtitleRef} style={{ opacity: 0, maxWidth: 640, marginBottom: 48 }}>
        <p style={{
          fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
          lineHeight: 1.7,
          color: 'rgba(240,237,232,0.65)',
          fontFamily: 'var(--font-sans)',
        }}>
          AI Engineer with nearly three years of DevOps experience &mdash; built and deployed
          LLM agents, RAG pipelines, and AIOps tooling on AWS EKS end-to-end.
          Currently finishing an MS at USF and certified across AWS, GCP, Azure, OCI,
          Anthropic, and Redis.
        </p>
      </div>

      {/* Stats */}
      <div
        ref={statsRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: 16,
          maxWidth: 600,
          marginBottom: 48,
        }}
      >
        {STATS.map(({ num, label }) => (
          <div key={num} style={{
            padding: '14px 0',
            borderTop: '1px solid rgba(255,107,26,0.3)',
            opacity: 0,
          }}>
            <div className="stat-num">{num}</div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgba(240,237,232,0.45)',
              marginTop: 6,
              whiteSpace: 'pre-line',
            }}>{label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div ref={ctaRef} style={{ display: 'flex', gap: 14, flexWrap: 'wrap', opacity: 0 }}>
        <button className="btn-orange" onClick={scrollToAbout}>
          Explore Work <span>&#8595;</span>
        </button>
        <a href="mailto:jithendra.kantharaju@gmail.com" className="btn-ghost">
          Get In Touch <span style={{ fontSize: '0.9rem' }}>&#8599;</span>
        </a>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        onClick={scrollToAbout}
        style={{
          position: 'absolute',
          bottom: 36, left: '50%', transform: 'translateX(-50%)',
          cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        }}
      >
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
        }}>Scroll</span>
        <div style={{
          width: 1, height: 40,
          background: 'linear-gradient(to bottom, rgba(255,107,26,0.6), transparent)',
        }} />
      </div>
    </section>
  )
}