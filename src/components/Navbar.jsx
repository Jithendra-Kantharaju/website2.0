'use client'

import { useEffect, useRef, useState } from 'react'

const NAV_ITEMS = [
  { label: 'Home',     id: 'hero' },
  { label: 'About',    id: 'about' },
  { label: 'Journey',  id: 'journey' },
  { label: 'Skills',   id: 'skills' },
  { label: 'Certs',    id: 'certs' },
  { label: 'Projects', id: 'projects' },
  { label: 'Contact',  id: 'contact' },
]

export default function Navbar() {
  const navRef = useRef(null)
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    async function init() {
      const g  = await import('gsap')
      const st = await import('gsap/ScrollTrigger')
      const gsap          = g.gsap || g.default
      const ScrollTrigger = st.ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)

      gsap.fromTo(navRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' }
      )
    }
    init()

    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    setOpen(false)
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 1000,
          padding: '18px clamp(16px, 5vw, 48px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled ? 'rgba(8,8,8,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
          transition: 'background 0.4s, border-color 0.4s',
          opacity: 0,
        }}
      >
        {/* Logo — also scrolls to top */}
        <button
          onClick={() => scrollTo('hero')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: 'var(--fg)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          <span style={{
            width: 24, height: 24,
            background: 'var(--orange)',
            borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', fontWeight: 900, color: '#fff',
          }}>JK</span>
          <span style={{ color: 'rgba(255,255,255,0.7)' }}>Jithendra K.</span>
        </button>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}
          className="desktop-nav">
          {NAV_ITEMS.map(({ label, id }) => (
            <button key={id} onClick={() => scrollTo(id)} className="nav-link">
              {label}
            </button>
          ))}
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'none', flexDirection: 'column', gap: 5, padding: 4,
          }}
          className="burger-btn"
          aria-label="Menu"
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block', width: 22, height: 2,
              background: 'var(--fg)',
              borderRadius: 1,
              transform: open
                ? i === 0 ? 'rotate(45deg) translate(5px, 5px)'
                  : i === 2 ? 'rotate(-45deg) translate(5px, -5px)'
                  : 'scaleX(0)'
                : 'none',
              transition: 'transform 0.25s',
            }} />
          ))}
        </button>
      </nav>

      {/* Mobile fullscreen overlay */}
      {open && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(8,8,8,0.97)',
          backdropFilter: 'blur(20px)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
        }}>
          {NAV_ITEMS.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '2.5rem',
                fontWeight: 700,
                color: 'var(--fg)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--orange)'}
              onMouseLeave={e => e.target.style.color = 'var(--fg)'}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        .nav-link {
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          transition: color 0.2s;
          padding: 4px 0;
        }
        .nav-link:hover {
          color: var(--orange);
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .burger-btn  { display: flex !important; }
        }
        @media (min-width: 769px) {
          .burger-btn { display: none !important; }
        }
      `}</style>
    </>
  )
}