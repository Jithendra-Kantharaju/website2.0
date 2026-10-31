'use client'

import { useState, useRef, useEffect } from 'react'

const SERVICE_ID  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  || ''
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || ''
const PUBLIC_KEY  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  || ''

const SOCIALS = [
  {
    label: 'Email',
    href: 'mailto:jithendra.kantharaju@gmail.com',
    display: 'jithendra.kantharaju@gmail.com',
    icon: '✉',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/jithendra-kantharaju/',
    display: 'linkedin.com/in/jithendra-kantharaju',
    icon: 'in',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/jithendra-kantharaju',
    display: 'github.com/jithendra-kantharaju',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    isJSX: true,
  },
]

export default function Contact() {
  const sectionRef = useRef(null)
  const timerRef   = useRef(null)
  const [form,    setForm]    = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    async function init() {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        gsap.fromTo('.contact-reveal',
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 0.8, stagger: 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
          }
        )
      }, sectionRef)

      return () => ctx.revert()
    }
    init()
    return () => clearTimeout(timerRef.current)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all fields.')
      return
    }
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setError('Contact form not yet configured. Please email directly.')
      return
    }
    setSending(true)
    setError('')
    try {
      const emailjs = (await import('@emailjs/browser')).default
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name:  form.name,
        from_email: form.email,
        message:    form.message,
        to_name:    'Jithendra',
      }, PUBLIC_KEY)
      setForm({ name: '', email: '', message: '' })
      setSuccess(true)
      timerRef.current = setTimeout(() => setSuccess(false), 5000)
    } catch {
      setError('Something went wrong. Please email directly.')
    } finally {
      setSending(false)
    }
  }

  const inputBase = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: '11px 14px',
    fontSize: '0.88rem',
    color: 'var(--fg)',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  }

  const labelBase = {
    display: 'block',
    fontSize: '0.65rem',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)',
    marginBottom: 6,
  }

  return (
    <section id="contact" ref={sectionRef} className="section" style={{ paddingBottom: 120 }}>
      <div className="container">

        <div className="contact-reveal" style={{ marginBottom: 12 }}>
          <span className="label">Contact</span>
        </div>
        <h2 className="contact-reveal ghost" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', marginBottom: 12 }}>
          Get In Touch
        </h2>
        <p className="contact-reveal" style={{
          fontSize: '1rem', color: 'rgba(240,237,232,0.55)',
          maxWidth: 540, lineHeight: 1.7, marginBottom: 48,
        }}>
          Whether it&apos;s a role, a project, or just a question about the stack &mdash;
          I read every message and I&apos;m quick to respond.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}>

          {/* Left: info + socials */}
          <div className="contact-reveal">
            {/* Social links */}
            <div style={{
              padding: '24px',
              borderRadius: 14,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              marginBottom: 16,
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
                marginBottom: 18,
              }}>Direct Lines</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {SOCIALS.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      textDecoration: 'none',
                      color: 'rgba(240,237,232,0.65)',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--orange)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,237,232,0.65)'}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(255,107,26,0.08)',
                      border: '1px solid rgba(255,107,26,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.78rem', color: 'var(--orange)', fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {s.isJSX ? s.icon : s.icon}
                    </div>
                    <div>
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--orange)',
                        marginBottom: 2,
                      }}>{s.label}</div>
                      <div style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{s.display}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div style={{
              padding: '16px 20px',
              borderRadius: 10,
              background: 'rgba(52,211,153,0.05)',
              border: '1px solid rgba(52,211,153,0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#34d399',
                  boxShadow: '0 0 8px rgba(52,211,153,0.6)',
                  animation: 'pulse 2s infinite',
                }} />
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: '#34d399',
                  letterSpacing: '0.08em',
                }}>Open to opportunities</span>
              </div>
              <p style={{
                fontSize: '0.78rem',
                color: 'rgba(240,237,232,0.5)',
                marginTop: 8,
                lineHeight: 1.5,
              }}>
                Actively looking for AI Engineer, MLOps, or FDE roles starting 2026.
              </p>
            </div>
          </div>

          {/* Right: contact form */}
          <div className="contact-reveal" style={{
            padding: '24px',
            borderRadius: 14,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            {/* Terminal titlebar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              marginBottom: 20, paddingBottom: 14,
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              {['#ff5f57','#ffbd2e','#28c840'].map(c => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
              ))}
              <span style={{
                marginLeft: 8,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.05em',
              }}>send_message.sh</span>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelBase}>Name</label>
                  <input
                    name="name" type="text" value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    style={inputBase}
                  />
                </div>
                <div>
                  <label style={labelBase}>Email</label>
                  <input
                    name="email" type="email" value={form.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    style={inputBase}
                  />
                </div>
              </div>
              <div>
                <label style={labelBase}>Message</label>
                <textarea
                  name="message" value={form.message}
                  onChange={handleChange}
                  placeholder="Hello, I'd like to talk about..."
                  style={{ ...inputBase, resize: 'none', height: 120, fontFamily: 'var(--font-sans)' }}
                />
              </div>

              {error && (
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                  padding: '8px 12px', borderRadius: 6,
                  color: '#f97316', background: 'rgba(249,115,22,0.08)',
                  border: '1px solid rgba(249,115,22,0.2)',
                }}>{error}</div>
              )}

              {success && (
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                  padding: '8px 12px', borderRadius: 6,
                  color: '#34d399', background: 'rgba(52,211,153,0.08)',
                  border: '1px solid rgba(52,211,153,0.25)',
                }}>&#10003; Message sent! I&apos;ll get back to you soon.</div>
              )}

              <button
                type="submit"
                disabled={sending}
                style={{
                  padding: '13px',
                  borderRadius: 8,
                  background: sending ? 'rgba(255,107,26,0.06)' : 'rgba(255,107,26,0.12)',
                  border: `1px solid rgba(255,107,26,${sending ? 0.2 : 0.45})`,
                  color: sending ? 'rgba(255,107,26,0.45)' : 'var(--orange)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  cursor: sending ? 'not-allowed' : 'pointer',
                  transition: 'all 0.25s',
                }}
              >
                {sending ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </section>
  )
}
