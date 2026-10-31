'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const pos = useRef({ x: -100, y: -100 })
  const ring = useRef({ x: -100, y: -100 })
  const rafId = useRef(null)
  const hover = useRef(false)

  useEffect(() => {
    const dot = dotRef.current
    const ringEl = ringRef.current
    if (!dot || !ringEl) return

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }

    const onEnter = () => { hover.current = true }
    const onLeave = () => { hover.current = false }

    document.addEventListener('mousemove', onMove)
    document.querySelectorAll('a, button, [data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    function lerp(a, b, n) { return a + (b - a) * n }

    function animate() {
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.12)
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.12)

      dot.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`
      ringEl.style.transform = `translate(${ring.current.x - 20}px, ${ring.current.y - 20}px) scale(${hover.current ? 1.8 : 1})`
      ringEl.style.borderColor = hover.current ? 'rgba(255,107,26,0.8)' : 'rgba(255,107,26,0.5)'

      rafId.current = requestAnimationFrame(animate)
    }
    rafId.current = requestAnimationFrame(animate)

    // Hide on mobile
    const isMobile = window.matchMedia('(hover: none)').matches
    if (isMobile) {
      dot.style.display = 'none'
      ringEl.style.display = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', onMove)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" style={{ position: 'fixed', pointerEvents: 'none', zIndex: 10000 }} />
      <div ref={ringRef} className="cursor-ring" style={{ position: 'fixed', pointerEvents: 'none', zIndex: 10000 }} />
    </>
  )
}
