'use client'

import { useEffect, useRef, useState } from 'react'

const SKILL_CATEGORIES = [
  {
    name: 'AIOps & ML',
    color: '#ff6b1a',
    skills: ['LangGraph', 'AWS Bedrock', 'RAG / LLM', 'FastAPI', 'ChromaDB', 'OpenAI', 'LangChain', 'Anthropic Claude'],
  },
  {
    name: 'Infrastructure as Code',
    color: '#e879f9',
    skills: ['Terraform', 'Ansible', 'Helm', 'Pulumi', 'Kustomize'],
  },
  {
    name: 'Containers & Orchestration',
    color: '#34d399',
    skills: ['Kubernetes', 'Docker', 'AWS EKS', 'ArgoCD', 'Tekton'],
  },
  {
    name: 'CI / CD',
    color: '#60a5fa',
    skills: ['GitHub Actions', 'Jenkins', 'GitLab CI', 'Tekton', 'SonarCloud'],
  },
  {
    name: 'Cloud Platforms',
    color: '#facc15',
    skills: ['AWS', 'GCP', 'Azure', 'OCI', 'AWS Lambda', 'S3', 'RDS', 'CloudWatch'],
  },
  {
    name: 'Observability',
    color: '#f97316',
    skills: ['Prometheus', 'Grafana', 'ELK Stack', 'OpenTelemetry', 'Datadog', 'CloudTrail'],
  },
  {
    name: 'Security',
    color: '#a78bfa',
    skills: ['HashiCorp Vault', 'Trivy', 'OPA / Conftest', 'SonarQube', 'Falco', 'IAM OIDC'],
  },
  {
    name: 'Languages',
    color: '#38bdf8',
    skills: ['Python', 'Bash', 'Go', 'JavaScript', 'TypeScript', 'SQL', 'HCL', 'Rego'],
  },
]

export default function Skills() {
  const sectionRef  = useRef(null)
  const activeRef   = useRef(0)
  const [active, setActive] = [activeRef.current, (i) => { activeRef.current = i }]

  const [activeCat, setActiveCat] = useState(0)

  useEffect(() => {
    async function init() {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        gsap.fromTo('.skill-cat',
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0,
            duration: 0.6, stagger: 0.08, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
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

  const cat = SKILL_CATEGORIES[activeCat]

  return (
    <section id="skills" ref={sectionRef} className="section">
      <div className="container">

        <div style={{ marginBottom: 12 }}>
          <span className="label">Technical Arsenal</span>
        </div>
        <h2 className="ghost" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', marginBottom: 48 }}>
          Skills
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 32,
          alignItems: 'start',
        }}>

          {/* Category selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {SKILL_CATEGORIES.map((c, i) => (
              <button
                key={c.name}
                className="skill-cat"
                onClick={() => setActiveCat(i)}
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 8,
                  textAlign: 'left',
                  opacity: 0,
                  background: i === activeCat
                    ? `rgba(${hexToRgbStr(c.color)}, 0.08)`
                    : 'transparent',
                  transition: 'background 0.2s',
                }}
              >
                {/* Accent bar */}
                <div style={{
                  width: 3,
                  height: i === activeCat ? 28 : 14,
                  borderRadius: 2,
                  background: i === activeCat ? c.color : 'rgba(255,255,255,0.15)',
                  flexShrink: 0,
                  transition: 'height 0.3s, background 0.3s',
                }} />
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  letterSpacing: '0.06em',
                  color: i === activeCat ? c.color : 'rgba(255,255,255,0.5)',
                  transition: 'color 0.2s',
                }}>{c.name}</span>
                <span style={{
                  marginLeft: 'auto',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: 'rgba(255,255,255,0.25)',
                }}>{c.skills.length}</span>
              </button>
            ))}
          </div>

          {/* Skills pills for active category */}
          <div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              color: cat.color,
              marginBottom: 8,
              fontWeight: 900,
            }}>{cat.name}</div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.1em',
              marginBottom: 24,
            }}>{cat.skills.length} tools & technologies</div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
            }}>
              {cat.skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    padding: '8px 16px',
                    borderRadius: 4,
                    border: `1px solid rgba(${hexToRgbStr(cat.color)}, 0.3)`,
                    color: cat.color,
                    background: `rgba(${hexToRgbStr(cat.color)}, 0.07)`,
                    transition: 'background 0.2s, transform 0.15s',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `rgba(${hexToRgbStr(cat.color)}, 0.18)`
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = `rgba(${hexToRgbStr(cat.color)}, 0.07)`
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* All skills summary */}
            <div style={{
              marginTop: 40,
              padding: '20px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
                marginBottom: 12,
              }}>All categories</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {SKILL_CATEGORIES.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setActiveCat(SKILL_CATEGORIES.indexOf(c))}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      padding: '4px 10px',
                      borderRadius: 20,
                      border: `1px solid rgba(${hexToRgbStr(c.color)}, 0.3)`,
                      color: c.color,
                      background: `rgba(${hexToRgbStr(c.color)}, 0.06)`,
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function hexToRgbStr(hex) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `${r},${g},${b}`
}
