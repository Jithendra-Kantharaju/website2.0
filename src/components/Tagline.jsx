'use client'

import { useEffect, useRef } from 'react'

export default function Tagline() {
  const ref = useRef(null)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const words = [...ref.current.querySelectorAll('[data-word]')]
    let observer
    function setup() {
      observer?.disconnect()
      if (media.matches) { words.forEach(word => word.removeAttribute('data-muted')); return }
      words.forEach(word => word.setAttribute('data-muted', 'true'))
      observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.removeAttribute('data-muted'); observer.unobserve(entry.target) }
      }), { rootMargin: '0px 0px -18% 0px', threshold: 1 })
      words.forEach(word => observer.observe(word))
    }
    setup()
    media.addEventListener('change', setup)
    return () => { observer?.disconnect(); media.removeEventListener('change', setup) }
  }, [])
  return <p ref={ref} className="engineering-statement heading-3"><span className="sr-only">Build with intention. Operate with confidence.</span>{['Build with intention.', 'Operate with confidence.'].map(line => <span className="statement-line" aria-hidden="true" key={line}>{line.split(' ').map((word, index) => <span data-word key={word} style={{ transitionDelay: index * 60 + 'ms' }}>{word} </span>)}</span>)}</p>
}
