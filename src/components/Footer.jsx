'use client'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{
      position: 'relative',
      zIndex: 10,
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '28px clamp(16px, 5vw, 48px)',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 16,
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      {/* Left: name + copyright */}
      <div>
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: '1rem',
          color: 'var(--fg)',
          marginBottom: 2,
        }}>Jithendra Kantharaju</div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.08em',
        }}>
          &copy; {year} &middot; All rights reserved
        </div>
      </div>

      {/* Center: stack */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        color: 'rgba(255,255,255,0.2)',
        letterSpacing: '0.1em',
        textAlign: 'center',
      }}>
        Built with Next.js 15 &middot; GSAP &middot; WebGL &middot; Lenis
      </div>

      {/* Right: links */}
      <div style={{ display: 'flex', gap: 20 }}>
        {[
          { label: 'GitHub',   href: 'https://github.com/jithendra-kantharaju' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jithendra-kantharaju/' },
          { label: 'Email',    href: 'mailto:jithendra.kantharaju@gmail.com' },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--orange)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
          >
            {label}
          </a>
        ))}
      </div>
    </footer>
  )
}
