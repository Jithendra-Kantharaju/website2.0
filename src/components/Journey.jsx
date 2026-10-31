'use client'

import { useEffect, useRef } from 'react'

const EXPERIENCE = [
  {
    type: 'work',
    role: 'AI Systems Engineer',
    org: 'Face Friends Foundation',
    location: 'United States',
    period: 'Sep 2026 – Present',
    current: true,
    bullets: [
      'Architecting AI-powered fundraising workflows across Symphony, Bitrix24, and Wix platforms',
      'Publishing weekly intelligence briefs synthesizing AI and nonprofit sector developments',
      'Producing volunteer training documentation to accelerate team onboarding',
    ],
    tags: ['AI Workflows', 'Symphony', 'Bitrix24', 'Wix', 'LLM', 'Automation'],
  },
  {
    type: 'work',
    role: 'Technical Operations Analyst',
    org: 'Compass Group USA',
    location: 'United States',
    period: 'Aug 2025 – May 2026',
    bullets: [
      'Maintained 99.9% POS system uptime across 10,000+ user environments',
      'Reduced incident frequency by 25% through proactive monitoring and runbook automation',
      'Authored operational runbooks that standardized incident response procedures',
    ],
    tags: ['POS Systems', 'Incident Management', 'Runbooks', 'Monitoring', 'SLA'],
  },
  {
    type: 'work',
    role: 'DevOps Engineer',
    org: 'Corezeal Technologies',
    location: 'India',
    period: 'Mar 2022 – Dec 2024',
    bullets: [
      'Reduced manual infrastructure operations ~70% using Terraform and Ansible across 4 environments',
      'Cut deployment time 40% via GitHub Actions and GitLab CI pipelines with ArgoCD GitOps',
      'Secured the pipeline end-to-end: HashiCorp Vault secrets injection, Trivy image scanning, OPA policy gates',
      'Implemented Prometheus + Grafana + ELK observability stack for production workloads on EKS',
    ],
    tags: ['Terraform', 'Ansible', 'Kubernetes', 'ArgoCD', 'HashiCorp Vault', 'Trivy', 'AWS EKS', 'GitHub Actions'],
  },
  {
    type: 'work',
    role: 'Engineering Intern',
    org: 'Agimus Technologies Pvt Ltd.',
    location: 'India',
    period: 'Sep 2021 – Oct 2021',
    bullets: [
      'Built a Python-based IoT healthcare monitoring platform delivering patient alerts under 30 seconds',
      'Integrated sensor data pipelines with real-time alerting for critical patient vitals',
    ],
    tags: ['Python', 'IoT', 'Healthcare', 'Real-time Alerting'],
  },
]

const EDUCATION = [
  {
    type: 'edu',
    role: 'MS Computer Engineering',
    org: 'University of South Florida',
    location: 'United States',
    period: '2024 – Present',
    bullets: ['Graduate coursework in Machine Learning, Distributed Systems, and Cloud Computing'],
    tags: ['ML', 'Distributed Systems', 'Cloud'],
  },
  {
    type: 'edu',
    role: 'BE Electronics & Communication',
    org: 'Siddaganga Institute of Technology',
    location: 'India',
    period: '2017 – 2021',
    bullets: ['Bachelor of Engineering with focus on embedded systems and signal processing'],
    tags: ['Embedded Systems', 'Signal Processing'],
  },
]

export default function Journey() {
  const sectionRef = useRef(null)

  useEffect(() => {
    async function init() {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        gsap.fromTo('.journey-item',
          { opacity: 0, x: -30 },
          {
            opacity: 1, x: 0,
            duration: 0.7, stagger: 0.15, ease: 'power3.out',
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
    <section id="journey" ref={sectionRef} className="section">
      <div className="container">

        <div style={{ marginBottom: 12 }}>
          <span className="label">Experience & Education</span>
        </div>
        <h2 className="ghost" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', marginBottom: 48 }}>
          The Journey
        </h2>

        {/* Experience */}
        <div style={{ marginBottom: 56 }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--orange)',
            marginBottom: 24,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span>Work Experience</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,107,26,0.2)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {EXPERIENCE.map((item, i) => (
              <TimelineItem key={i} item={item} />
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
            marginBottom: 24,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span>Education</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {EDUCATION.map((item, i) => (
              <TimelineItem key={i} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TimelineItem({ item }) {
  return (
    <div
      className="journey-item"
      style={{
        display: 'flex',
        gap: 24,
        paddingBottom: 32,
        opacity: 0,
      }}
    >
      {/* Timeline spine */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexShrink: 0,
        width: 20,
        paddingTop: 4,
      }}>
        <div className="timeline-dot" style={{
          background: item.type === 'edu' ? 'rgba(255,255,255,0.4)' : undefined,
        }} />
        <div style={{
          flex: 1,
          width: 1,
          background: item.type === 'edu'
            ? 'rgba(255,255,255,0.08)'
            : 'rgba(255,107,26,0.2)',
          marginTop: 8,
        }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, paddingTop: 0 }}>
        {/* Header row */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 8,
          marginBottom: 6,
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '1.15rem',
              fontWeight: 700,
              color: 'var(--fg)',
              marginBottom: 2,
            }}>{item.role}</div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--orange)',
            }}>
              {item.org}
              {' '}
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>&middot; {item.location}</span>
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
          }}>
            {item.current && (
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                padding: '3px 8px',
                borderRadius: 20,
                background: 'rgba(255,107,26,0.15)',
                border: '1px solid rgba(255,107,26,0.4)',
                color: 'var(--orange)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>Current</span>
            )}
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.35)',
            }}>{item.period}</span>
          </div>
        </div>

        {/* Bullets */}
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: '10px 0 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}>
          {item.bullets.map((b, i) => (
            <li key={i} style={{
              display: 'flex',
              gap: 10,
              fontSize: '0.88rem',
              lineHeight: 1.65,
              color: 'rgba(240,237,232,0.6)',
            }}>
              <span style={{ color: 'var(--orange)', flexShrink: 0, marginTop: 2 }}>&#8250;</span>
              {b}
            </li>
          ))}
        </ul>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {item.tags.map(t => (
            <span key={t} className="skill-pill" style={{ fontSize: '0.65rem' }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
