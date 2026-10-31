'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const CERTS = [
  {
    name: 'Claude Certified Architect',
    issuer: 'Anthropic',
    img: '/Certs/claude-certified.png',
    color: '#ff6b1a',
    year: '2026',
  },
  {
    name: 'Solutions Architect Associate',
    issuer: 'AWS',
    img: '/Certs/AWS_Solution_Architect.jpg',
    color: '#f97316',
    year: '2026',
  },
  {
    name: 'AWS AI Practitioner',
    issuer: 'AWS',
    img: '/Certs/aws-ai-practitioner.png',
    color: '#f97316',
    year: '2026',
  },
  {
    name: 'AWS Cloud Practitioner',
    issuer: 'AWS',
    img: '/Certs/aws-cloud-practitioner.png',
    color: '#f97316',
    year: '2026',
  },
  {
    name: 'Associate Cloud Engineer',
    issuer: 'Google Cloud',
    img: '/Certs/gcp-ace.png',
    color: '#34d399',
    year: '2026',
  },
  {
    name: 'Azure Fundamentals',
    issuer: 'Microsoft Azure',
    img: '/Certs/azure-fundamentals.png',
    color: '#60a5fa',
    year: '2025',
  },
  {
    name: 'OCI DevOps Professional',
    issuer: 'Oracle Cloud',
    img: '/Certs/oci-devops-2025.png',
    color: '#e879f9',
    year: '2025',
  },
  {
    name: 'OCI Foundations Associate',
    issuer: 'Oracle Cloud',
    img: '/Certs/oci-foundation.png',
    color: '#e879f9',
    year: '2025',
  },
  {
    name: 'OCI AI Foundations',
    issuer: 'Oracle Cloud',
    img: '/Certs/oci-AI_foundation.png',
    color: '#e879f9',
    year: '2025',
  },
  {
    name: 'Redis Certified Developer',
    issuer: 'Redis',
    img: '/Certs/redis_badge.png',
    color: '#fb923c',
    year: '2026',
  },
]

function hexRgb(hex) {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]
}

export default function Certifications() {
  const sectionRef = useRef(null)
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    async function init() {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        gsap.fromTo('.cert-card',
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.6, stagger: 0.07, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
          }
        )

        gsap.to(sectionRef.current, {
          opacity: 0, y: -40, ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'bottom 30%', end: 'bottom top', scrub: true,
          },
        })
      }, sectionRef)

      return () => ctx.revert()
    }
    init()
  }, [])

  return (
    <section id="certs" ref={sectionRef} className="section">
      <div className="container">

        <div style={{ marginBottom: 12 }}>
          <span className="label">Certifications</span>
        </div>
        <h2 className="ghost" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', marginBottom: 12 }}>
          Credentials
        </h2>
        <p style={{
          fontSize: '1rem', color: 'rgba(240,237,232,0.5)',
          fontFamily: 'var(--font-mono)',
          marginBottom: 48,
        }}>
          {CERTS.length} active certifications across Anthropic, AWS, GCP, Azure, OCI & Redis
        </p>

        {/* Cert grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 16,
        }}>
          {CERTS.map((cert, i) => {
            const [r, g, b] = hexRgb(cert.color)
            const isHov = hovered === i
            return (
              <div
                key={cert.name}
                className="cert-card"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  opacity: 0,
                  padding: '20px 16px',
                  borderRadius: 12,
                  background: isHov
                    ? `rgba(${r},${g},${b},0.12)`
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isHov ? `rgba(${r},${g},${b},0.4)` : 'rgba(255,255,255,0.08)'}`,
                  backdropFilter: 'blur(12px)',
                  cursor: 'default',
                  transition: 'background 0.25s, border-color 0.25s, transform 0.2s, box-shadow 0.25s',
                  transform: isHov ? 'translateY(-4px)' : 'none',
                  boxShadow: isHov ? `0 12px 40px rgba(${r},${g},${b},0.15)` : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 12,
                }}
              >
                {/* Badge image */}
                <div style={{
                  width: 72, height: 72, position: 'relative',
                  borderRadius: 8, overflow: 'hidden',
                  background: 'rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Image
                    src={cert.img}
                    alt={cert.name}
                    fill
                    style={{ objectFit: 'contain', padding: 4 }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>

                {/* Text */}
                <div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: cert.color,
                    marginBottom: 4,
                  }}>{cert.issuer}</div>
                  <div style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: isHov ? 'var(--fg)' : 'rgba(240,237,232,0.75)',
                    lineHeight: 1.35,
                    transition: 'color 0.2s',
                  }}>{cert.name}</div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    color: 'rgba(255,255,255,0.25)',
                    marginTop: 4,
                  }}>{cert.year}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Cloud logos row */}
        <div style={{
          marginTop: 48,
          padding: '20px 24px',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 16,
          justifyContent: 'center',
        }}>
          {['Anthropic', 'AWS', 'Google Cloud', 'Microsoft Azure', 'Oracle Cloud', 'Redis'].map(p => (
            <span key={p} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase',
              padding: '4px 12px',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
            }}>{p}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
