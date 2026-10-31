'use client'

import { useEffect, useRef, useState } from 'react'

const TOTAL_FRAMES = 150

// Horizontal anchor: 0 = left edge, 0.5 = center, 1 = right edge
// 0.72 keeps the subject (right side of frame) visible on portrait mobile
const ANCHOR_X = 0.72

// Vertical anchor: 0 = top, 0.5 = center, 1 = bottom
const ANCHOR_Y = 0.5

function pad(n) {
  return String(n).padStart(3, '0')
}

export default function VideoScrub() {
  const canvasRef    = useRef(null)
  const framesRef    = useRef([])
  const rafRef       = useRef(null)
  const curFrameRef  = useRef(-1)
  const scrollEndRef = useRef(1)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function syncSize() {
      const w = window.innerWidth
      const h = window.innerHeight

      canvas.width        = w
      canvas.height       = h
      canvas.style.width  = w + 'px'
      canvas.style.height = h + 'px'

      scrollEndRef.current = Math.max(
        document.documentElement.scrollHeight - h, 1
      )
      if (curFrameRef.current >= 0) drawFrame(curFrameRef.current)
    }

    function drawFrame(idx) {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const img = framesRef.current[idx]
      if (!img || !img.complete || img.naturalWidth === 0) return

      const cw = canvas.width
      const ch = canvas.height
      const iw = img.naturalWidth
      const ih = img.naturalHeight

      const scale = Math.max(cw / iw, ch / ih)
      const dw = iw * scale
      const dh = ih * scale

      // Anchor-based crop — shifts right so subject stays in frame on mobile
      const dx = (cw - dw) * ANCHOR_X
      const dy = (ch - dh) * ANCHOR_Y

      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, dx, dy, dw, dh)
    }

    const images = new Array(TOTAL_FRAMES)
    framesRef.current = images
    let firstPainted = false

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      img.decoding = 'async'
      img.src = `/frames/frame-${pad(i + 1)}.webp`
      img.onload = () => {
        if (!firstPainted && i === 0) {
          firstPainted = true
          curFrameRef.current = 0
          drawFrame(0)
          setLoaded(true)
        }
      }
      images[i] = img
    }

    function tick() {
      const progress = Math.min(window.scrollY / scrollEndRef.current, 1)
      const newFrame = Math.min(
        Math.floor(progress * (TOTAL_FRAMES - 1)),
        TOTAL_FRAMES - 1
      )
      if (newFrame !== curFrameRef.current) {
        curFrameRef.current = newFrame
        drawFrame(newFrame)
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    syncSize()
    rafRef.current = requestAnimationFrame(tick)

    const onResize = () => syncSize()
    const onOrient = () => setTimeout(syncSize, 300)

    window.addEventListener('resize',            onResize, { passive: true })
    window.addEventListener('orientationchange', onOrient, { passive: true })

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize',            onResize)
      window.removeEventListener('orientationchange', onOrient)
    }
  }, [])

  return (
    <>
      <div style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 1, background: '#080808', pointerEvents: 'none',
      }} />

      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          display: 'block',
          zIndex: 2,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none',
        }}
      />

      <div style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 3, pointerEvents: 'none',
        background: [
          'linear-gradient(to right, rgba(8,8,8,0.55) 0%, transparent 40%, transparent 75%, rgba(8,8,8,0.4) 100%)',
          'linear-gradient(to bottom, rgba(8,8,8,0.15) 0%, transparent 20%, transparent 70%, rgba(8,8,8,0.8) 100%)',
        ].join(', '),
      }} />
    </>
  )
}