'use client'

import { useEffect, useRef, useState } from 'react'

const PROJECTS = [
  {
    num: '01',
    icon: '&#129302;',
    color: '#00d4ff',
    name: 'Enterprise CloudOps AI Platform',
    problem: 'Incident triage took 60+ minutes; teams lacked a live view of EKS health, CloudWatch alerts, and Prometheus metrics simultaneously.',
    desc: 'Deployed 8 microservices (React, Node.js/TypeScript gateway, 5 Python backends, PostgreSQL) to live EKS 1.34 via modular Terraform. GitHub Actions builds all 8 images in parallel with matrix builds, rewrites Kustomize tags, and ArgoCD self-heals on drift.',
    tags: ['EKS 1.34', 'Terraform', 'GitHub Actions', 'ArgoCD', 'AWS Bedrock', 'FastAPI', 'ChromaDB', 'Kustomize', 'Prometheus'],
    github: 'https://github.com/Jithendra-Kantharaju/enterprise-cloudops-ai-platform',
    highlights: [
      'Built "Kira" — AWS Bedrock Agent (Nova Lite) with 3 Lambda tools that auto-diagnoses incidents',
      'RAG assistant (FastAPI + ChromaDB + OpenAI) with on-topic prompt guardrails on the same cluster',
    ],
    img: '/projects/Enterprise CloudOps AI Platform.png',
  },
  {
    num: '02',
    icon: '&#128274;',
    color: '#34d399',
    name: 'DevSecOps Reference Infrastructure',
    problem: 'Security audits took days; static credentials and unscanned images were reaching production undetected.',
    desc: 'An 8-component GitOps security pipeline where Trivy scans and OPA/Conftest (Rego) policy gates block insecure images before they reach the cluster. ArgoCD syncs hardened non-root images from GHCR and rolls back on failure.',
    tags: ['GitHub Actions', 'ArgoCD', 'HashiCorp Vault', 'Falco', 'OPA/Conftest', 'Trivy', 'Datadog', 'OpenTelemetry', 'Terraform'],
    github: 'https://github.com/Jithendra-Kantharaju/devsecops-reference-infrastructure',
    highlights: [
      'Vault secrets injection, default-deny NetworkPolicies, Falco runtime detection',
      'IAM OIDC — no static credentials anywhere in the pipeline',
      'Security audit time dropped 60% via CloudTrail logging to encrypted S3',
    ],
    img: '/projects/DevSecOps_pipeline.png',
  },
  {
    num: '03',
    icon: '&#9881;',
    color: '#a78bfa',
    name: 'GitOps CI/CD Pipeline on AWS EKS',
    problem: 'Manual deploys were error-prone; no quality gates before merges reached production.',
    desc: 'Dual-repository GitOps system separating infrastructure from application delivery. Terraform provisions the EKS cluster; GitHub Actions drives every build, SonarCloud quality gate, and deployment via ArgoCD with parallel matrix builds.',
    tags: ['GitHub Actions', 'GitOps', 'Terraform', 'Docker', 'EKS', 'Helm', 'SonarCloud', 'ECR', 'ArgoCD'],
    github: 'https://github.com/Jithendra-Kantharaju/GitOps-CICD-Pipeline-AWS-EKS-Actions',
    highlights: [
      'Dual-repo pattern — infrastructure and application delivery fully separated',
      'SonarCloud quality gates block bad code before EKS deployment',
      'Release cadence went from 2 to 6 per week without adding headcount',
    ],
    img: '/projects/Gitops.png',
  },
  {
    num: '04',
    icon: '&#127916;',
    color: '#f97316',
    name: 'Multi-Tier Cloud App on AWS',
    problem: 'Manual, hand-run deployment process with no rollback strategy and fragile environment state.',
    desc: 'Production Netflix-replica on EKS with a Jenkins pipeline handling Docker builds, Trivy container scanning, ECR push, and rolling EKS deployments. S3 static assets and RDS PostgreSQL backends fully automated with Terraform.',
    tags: ['Jenkins', 'Docker', 'EKS', 'S3', 'RDS/PostgreSQL', 'Nginx', 'ECR', 'Node.js', 'Terraform'],
    github: 'https://github.com/Jithendra-Kantharaju/Multi-Tier-Cloud-Application-AWS',
    highlights: [
      'Full CI/CD from commit to rolling EKS deployment — zero manual steps',
      'Trivy scans every image before ECR push',
      '99.9% availability across 3 environments with S3 + RDS backends',
    ],
    img: '/projects/Movie_Streaming.png',
  },
  {
    num: '05',
    icon: '&#127908;',
    color: '#e879f9',
    name: 'Detecting Voice Clones in Assistants',
    problem: 'AI voice spoofing attacks on virtual assistants were going undetected by existing input validation.',
    desc: 'ML pipeline to detect AI-generated voice spoofing by extracting MFCC audio features and classifying real vs cloned voices with an SVM model. Built as a defensive research tool for voice-enabled IoT and assistant platforms.',
    tags: ['Python', 'Scikit-learn', 'SVM', 'MFCC', 'Audio DSP', 'ML Pipeline'],
    github: 'https://github.com/Jithendra-Kantharaju/Detecting-Voice-Clones-in-Voice-Assistants',
    highlights: [
      'MFCC feature extraction pipeline for audio fingerprinting',
      'SVM classifier achieving high-precision voice clone detection',
      'Applicable to voice-enabled IoT, assistant platforms, and biometric auth',
    ],
    img: '/projects/voice_clone.png',
  },
]

function hexRgb(hex) {
  const h = hex.replace('#', '')
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`
}

export default function Projects() {
  const sectionRef = useRef(null)
  const [cur, setCur] = useState(0)
  const N = PROJECTS.length
  const move = (dir) => setCur(c => (c + dir + N) % N)

  useEffect(() => {
    async function init() {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        gsap.fromTo(sectionRef.current.querySelectorAll('.proj-reveal'),
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 0.8, stagger: 0.15, ease: 'power3.out',
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

  const p   = PROJECTS[cur]
  const rgb = hexRgb(p.color)

  return (
    <section id="projects" ref={sectionRef} className="section">
      <div className="container">

        <div className="proj-reveal" style={{ marginBottom: 12 }}>
          <span className="label">Work</span>
        </div>
        <h2 className="proj-reveal ghost" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', marginBottom: 12 }}>
          Projects
        </h2>
        <p className="proj-reveal" style={{
          color: 'rgba(240,237,232,0.5)',
          fontSize: '0.9rem',
          fontFamily: 'var(--font-mono)',
          marginBottom: 48,
        }}>
          Production systems — not demos. Real problems, real stacks, measured outcomes.
        </p>

        {/* ── DESKTOP layout: deck + detail side by side ── */}
        <div className="proj-reveal proj-desktop" style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 260px) 1fr',
          gap: 32,
          alignItems: 'start',
        }}>
          {/* Deck stack */}
          <div style={{ position: 'relative', height: 300, perspective: '900px' }}>
            {PROJECTS.map((proj, i) => {
              const diff = (i - cur + N) % N
              let st = { transform: 'translateY(34px) scale(0.85)', opacity: 0, zIndex: 0 }
              if (diff === 0) st = { transform: 'translateY(0) scale(1)',       opacity: 1,    zIndex: N }
              if (diff === 1) st = { transform: 'translateY(14px) scale(0.95)', opacity: 0.55, zIndex: N-1 }
              if (diff === 2) st = { transform: 'translateY(26px) scale(0.90)', opacity: 0.28, zIndex: N-2 }
              const prgb = hexRgb(proj.color)
              return (
                <div key={i} onClick={() => setCur(i)} style={{
                  ...st,
                  position: 'absolute',
                  width: 240, height: 270,
                  borderRadius: 14,
                  padding: '18px 16px',
                  background: `rgba(${prgb}, ${i === cur ? 0.1 : 0.05})`,
                  backdropFilter: 'blur(16px)',
                  border: `1px solid rgba(${prgb}, ${i === cur ? 0.45 : 0.15})`,
                  cursor: 'pointer',
                  transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
                  boxShadow: i === cur ? `0 16px 48px rgba(${prgb},0.18)` : 'none',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  overflow: 'hidden',
                }}>
                  {proj.img && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      backgroundImage: `url(${proj.img})`,
                      backgroundSize: 'cover', backgroundPosition: 'center',
                      opacity: 0.07, borderRadius: 14,
                    }} />
                  )}
                  <div style={{ position: 'relative' }}>
                    <div style={{ fontSize: 28, marginBottom: 10 }} dangerouslySetInnerHTML={{ __html: proj.icon }} />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                      {proj.tags.slice(0, 3).map(t => (
                        <span key={t} className="project-tag"
                          style={{ borderColor: `rgba(${prgb},0.3)`, color: `rgba(${prgb},0.9)`, background: `rgba(${prgb},0.08)` }}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.3, color: 'var(--fg)' }}>
                      {proj.name}
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)' }}>
                    {proj.num} / {String(N).padStart(2,'0')}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Detail panel */}
          <DetailPanel p={p} rgb={rgb} cur={cur} setCur={setCur} move={move} N={N} PROJECTS={PROJECTS} />
        </div>

        {/* ── MOBILE layout: full-width card slider ── */}
        <div className="proj-mobile">
          {/* Dot nav + arrows */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
            {PROJECTS.map((_, i) => (
              <button key={i} onClick={() => setCur(i)} style={{
                width: 8, height: 8, borderRadius: '50%',
                background: i === cur ? p.color : 'rgba(255,255,255,0.2)',
                border: 'none', cursor: 'pointer',
                transition: 'background 0.2s, transform 0.2s',
                transform: i === cur ? 'scale(1.3)' : 'scale(1)',
                padding: 0,
              }} />
            ))}
            <div style={{ flex: 1 }} />
            {[['&#8249;', -1], ['&#8250;', 1]].map(([label, dir]) => (
              <button key={dir} onClick={() => move(dir)} style={{
                width: 34, height: 34, borderRadius: '50%', cursor: 'pointer',
                border: `1px solid rgba(${rgb},0.3)`,
                background: `rgba(${rgb},0.08)`,
                color: p.color, fontSize: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }} dangerouslySetInnerHTML={{ __html: label }} />
            ))}
          </div>

          {/* Mobile card — full width, no overlap */}
          <div style={{
            borderRadius: 14,
            background: `rgba(${rgb}, 0.06)`,
            backdropFilter: 'blur(16px)',
            border: `1px solid rgba(${rgb}, 0.25)`,
            overflow: 'hidden',
          }}>
            {/* Image banner */}
            {p.img && (
              <div style={{
                height: 160,
                backgroundImage: `url(${p.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.7,
              }} />
            )}
            <div style={{ padding: '18px 16px' }}>
              {/* Icon + counter */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 28 }} dangerouslySetInnerHTML={{ __html: p.icon }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>
                  {p.num} / {String(N).padStart(2,'0')}
                </span>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
                {p.tags.slice(0, 4).map(t => (
                  <span key={t} className="project-tag"
                    style={{ borderColor: `rgba(${rgb},0.3)`, color: `rgba(${rgb},0.9)`, background: `rgba(${rgb},0.08)` }}>
                    {t}
                  </span>
                ))}
              </div>

              <h3 style={{
                fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 700,
                fontSize: '1.15rem', color: 'var(--fg)', marginBottom: 10,
              }}>{p.name}</h3>

              {/* Problem */}
              <div style={{
                fontSize: '0.72rem', fontFamily: 'var(--font-mono)',
                padding: '8px 10px', borderRadius: 7,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: 'rgba(240,237,232,0.5)',
                lineHeight: 1.6, marginBottom: 12,
              }}>
                <span style={{ color: 'var(--orange)', fontWeight: 700 }}>Problem: </span>
                {p.problem}
              </div>

              <p style={{
                fontSize: '0.83rem', lineHeight: 1.7,
                color: 'rgba(240,237,232,0.6)', marginBottom: 14,
              }}>{p.desc}</p>

              {/* Highlights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
                {p.highlights.map((h, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, fontSize: '0.8rem', lineHeight: 1.6, color: 'rgba(240,237,232,0.65)' }}>
                    <span style={{ color: p.color, fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {h}
                  </div>
                ))}
              </div>

              <a href={p.github} target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                color: p.color, textDecoration: 'none',
                padding: '7px 18px', borderRadius: 20,
                border: `1px solid rgba(${rgb},0.35)`,
                background: `rgba(${rgb},0.08)`,
              }}>
                &#8599; View on GitHub
              </a>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .proj-mobile  { display: none; }
        .proj-desktop { display: grid; }
        @media (max-width: 768px) {
          .proj-mobile  { display: block !important; }
          .proj-desktop { display: none !important; }
        }
      `}</style>
    </section>
  )
}

/* Extracted detail panel — used only on desktop */
function DetailPanel({ p, rgb, cur, setCur, move, N, PROJECTS }) {
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center' }}>
        {PROJECTS.map((_, i) => (
          <button key={i} onClick={() => setCur(i)} style={{
            width: 8, height: 8, borderRadius: '50%',
            background: i === cur ? p.color : 'rgba(255,255,255,0.2)',
            border: 'none', cursor: 'pointer',
            transition: 'background 0.2s, transform 0.2s',
            transform: i === cur ? 'scale(1.3)' : 'scale(1)',
            padding: 0,
          }} />
        ))}
        <div style={{ flex: 1 }} />
        {[['&#8249;', -1], ['&#8250;', 1]].map(([label, dir]) => (
          <button key={dir} onClick={() => move(dir)} style={{
            width: 34, height: 34, borderRadius: '50%', cursor: 'pointer',
            border: `1px solid rgba(${rgb},0.3)`,
            background: `rgba(${rgb},0.08)`,
            color: p.color, fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }} dangerouslySetInnerHTML={{ __html: label }} />
        ))}
      </div>

      <div style={{
        padding: '20px 22px', borderRadius: 14,
        background: `rgba(${rgb}, 0.05)`,
        backdropFilter: 'blur(16px)',
        border: `1px solid rgba(${rgb}, 0.2)`,
        transition: 'border-color 0.3s, background 0.3s',
      }}>
        <div style={{
          fontSize: '0.72rem', fontFamily: 'var(--font-mono)',
          marginBottom: 12, padding: '8px 12px', borderRadius: 7,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          color: 'rgba(240,237,232,0.45)', lineHeight: 1.6,
        }}>
          <span style={{ color: 'var(--orange)', fontWeight: 700 }}>Problem: </span>
          {p.problem}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {p.tags.map(t => (
            <span key={t} className="project-tag"
              style={{ borderColor: `rgba(${rgb},0.3)`, color: `rgba(${rgb},0.95)`, background: `rgba(${rgb},0.08)` }}>
              {t}
            </span>
          ))}
        </div>

        <h3 style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 700,
          fontSize: '1.25rem', color: 'var(--fg)', marginBottom: 10,
        }}>{p.name}</h3>

        <p style={{
          fontSize: '0.85rem', lineHeight: 1.75,
          color: 'rgba(240,237,232,0.6)', marginBottom: 14,
        }}>{p.desc}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
          {p.highlights.map((h, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, fontSize: '0.83rem', lineHeight: 1.6, color: 'rgba(240,237,232,0.65)' }}>
              <span style={{ color: p.color, fontWeight: 700, flexShrink: 0 }}>✓</span>
              {h}
            </div>
          ))}
        </div>

        <a href={p.github} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
          color: p.color, textDecoration: 'none',
          padding: '7px 18px', borderRadius: 20,
          border: `1px solid rgba(${rgb},0.35)`,
          background: `rgba(${rgb},0.08)`,
          transition: 'background 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = `rgba(${rgb},0.18)`}
          onMouseLeave={e => e.currentTarget.style.background = `rgba(${rgb},0.08)`}
        >
          &#8599; View on GitHub
        </a>
      </div>
    </div>
  )
}