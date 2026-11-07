'use client'

import { useEffect, useRef } from 'react'
import styles from './SignalBackdrop.module.css'

function Rail({ side }) {
  const left = side === 'left'
  return <div className={styles.rail + ' ' + (left ? styles.left : styles.right)} data-signal-rail={side}>
    <svg viewBox="0 0 120 760" preserveAspectRatio="none" fill="none" focusable="false" aria-hidden="true">
      <path className={styles.route} vectorEffect="non-scaling-stroke" d={left
        ? 'M0 80H36Q44 80 44 88V286Q44 294 52 294H88Q96 294 96 302V492Q96 500 88 500H36Q28 500 28 508V760'
        : 'M120 24H84Q76 24 76 32V410Q76 418 68 418H40Q32 418 32 426V622Q32 630 40 630H120'} />
      <path className={styles.branch} vectorEffect="non-scaling-stroke" d={left ? 'M44 180H12M96 390H116M28 660H64' : 'M76 154H108M76 318H100M32 524H4'} />
      <g className={styles.terminals} strokeWidth="1" vectorEffect="non-scaling-stroke">
        <circle cx={left ? 44 : 76} cy={left ? 180 : 154} r="2" />
        <circle cx={left ? 96 : 32} cy={left ? 390 : 524} r="2" />
      </g>
    </svg>
    <span className={styles.track} aria-hidden="true"><span className={styles.runner} data-signal-runner={side} /></span>
  </div>
}

/** A finite margin illustration, not live telemetry. No scroll or frame loop. */
export default function SignalBackdrop() {
  const ref = useRef(null)
  useEffect(() => {
    const root = ref.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const forced = window.matchMedia('(forced-colors: active)')
    const small = window.matchMedia('(max-width: 767px)')
    const seen = new Set(['home'])
    const visible = new Set()
    let animations = []
    let queued
    let generation = 0
    let bursts = 0
    let lastRun = -Infinity

    function quiet(reason) {
      generation++
      clearTimeout(queued)
      animations.forEach(animation => animation.cancel())
      animations = []
      root.dataset.phase = 'quiet'
      root.dataset.reason = reason
    }
    function pulse() {
      const focused = document.activeElement
      if (reduced.matches || forced.matches || document.hidden || visible.has('projects') || document.documentElement.hasAttribute('data-keyboard')) return
      if (focused instanceof Element && focused.closest('input, textarea, select, .mobile-navigation, .menu-toggle')) return
      if (bursts >= (small.matches ? 2 : 3) || performance.now() - lastRun < 10000) return
      quiet('start')
      const run = generation
      bursts++
      lastRun = performance.now()
      root.dataset.bursts = String(bursts)
      root.dataset.phase = 'signal'
      const runners = [...root.querySelectorAll('[data-signal-runner]')].slice(0, small.matches ? 1 : 2)
      const easing = getComputedStyle(root).getPropertyValue('--ease-in-out').trim()
      animations = runners.map((runner, index) => runner.animate([
        { transform: 'translateY(0%)', opacity: 0 },
        { opacity: 0.55, offset: 0.16 },
        { opacity: 0.55, offset: 0.74 },
        { transform: 'translateY(100%)', opacity: 0 }
      ], { duration: 3200, delay: index * 360, easing, iterations: 1 }))
      Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
        if (generation === run) { animations = []; root.dataset.phase = 'quiet'; root.dataset.reason = 'settled' }
      })
    }

    // The headline finishes by 950ms. The background supports it after it settles.
    queued = setTimeout(pulse, 1200)
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visible.add(entry.target.id)
        else visible.delete(entry.target.id)
      })
      if (visible.has('projects')) { quiet('projects'); return }
      entries.forEach(entry => {
        if (entry.isIntersecting && !seen.has(entry.target.id)) {
          seen.add(entry.target.id)
          pulse()
        }
      })
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 })
    document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section))

    function preference() { if (reduced.matches || forced.matches) quiet(forced.matches ? 'forced-colors' : 'reduced-motion') }
    function visibility() { if (document.hidden) quiet('hidden') }
    function focus(event) {
      if (event.target instanceof Element && event.target.closest('input, textarea, select, .mobile-navigation, .menu-toggle')) quiet('focus')
    }
    function keyboard() { quiet('keyboard') }
    function workflow() { quiet('workflow') }
    function resize() { quiet('resize') }
    reduced.addEventListener('change', preference)
    forced.addEventListener('change', preference)
    document.addEventListener('visibilitychange', visibility)
    document.addEventListener('focusin', focus)
    document.addEventListener('keydown', keyboard, true)
    document.addEventListener('portfolio:workflow', workflow)
    window.addEventListener('resize', resize)
    return () => {
      quiet('unmount'); observer.disconnect()
      reduced.removeEventListener('change', preference)
      forced.removeEventListener('change', preference)
      document.removeEventListener('visibilitychange', visibility)
      document.removeEventListener('focusin', focus)
      document.removeEventListener('keydown', keyboard, true)
      document.removeEventListener('portfolio:workflow', workflow)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <div ref={ref} className={styles.backdrop} data-background="signal-routes" data-phase="quiet" data-bursts="0" aria-hidden="true">
    <Rail side="left" /><Rail side="right" />
  </div>
}
