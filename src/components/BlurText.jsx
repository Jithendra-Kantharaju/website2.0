'use client'

import { useEffect, useRef } from 'react'

/**
 * BlurText — animates words from blur+translate to clear on mount or trigger.
 * Props:
 *   text       string   — the text to animate
 *   delay      number   — ms between each word (default 60)
 *   duration   number   — animation duration per word in ms (default 500)
 *   className  string   — class for the wrapper span
 *   onComplete fn       — called when animation ends
 */
export default function BlurText({ text = '', delay = 60, duration = 500, className = '', onComplete }) {
  const containerRef = useRef(null)

  const words = text.split(' ').filter(Boolean)

  useEffect(() => {
    const spans = containerRef.current?.querySelectorAll('.blur-word')
    if (!spans || spans.length === 0) return

    spans.forEach((span, i) => {
      span.style.opacity = '0'
      span.style.filter = 'blur(10px)'
      span.style.transform = 'translateY(20px)'
      span.style.transition = `opacity ${duration}ms ease, filter ${duration}ms ease, transform ${duration}ms ease`
      span.style.transitionDelay = `${i * delay}ms`

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          span.style.opacity = '1'
          span.style.filter = 'blur(0px)'
          span.style.transform = 'translateY(0px)'
        })
      })
    })

    if (onComplete) {
      const totalMs = words.length * delay + duration + 50
      const t = setTimeout(onComplete, totalMs)
      return () => clearTimeout(t)
    }
  }, [text, delay, duration, onComplete, words.length])

  return (
    <span ref={containerRef} className={className} style={{ display: 'inline' }}>
      {words.map((word, i) => (
        <span
          key={i}
          className="blur-word"
          style={{ display: 'inline-block', marginRight: '0.28em', willChange: 'opacity, filter, transform' }}
        >
          {word}
        </span>
      ))}
    </span>
  )
}
