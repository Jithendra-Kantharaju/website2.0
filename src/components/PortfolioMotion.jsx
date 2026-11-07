'use client'

import { useEffect } from 'react'

/** Animate leaves only; server-rendered content is never hidden by CSS. */
export default function PortfolioMotion() {
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const running = new Set()
    const observed = new Map()
    const seen = new WeakSet()
    const ease = getComputedStyle(document.documentElement).getPropertyValue('--ease-out').trim()
    let keyboard = false

    function animate(element, delay = 0, duration = 450, distance = 8, extra = {}) {
      if (!element || media.matches || keyboard || !element.getClientRects().length) return
      const animation = element.animate([
        { opacity: 0, transform: 'translateY(' + distance + 'px)', ...extra },
        { opacity: 1, transform: 'translateY(0px)' }
      ], { delay, duration, easing: ease, fill: 'backwards' })
      running.add(animation)
      animation.finished.then(() => running.delete(animation), () => running.delete(animation))
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || seen.has(entry.target)) return
        seen.add(entry.target)
        observer.unobserve(entry.target)
        observed.get(entry.target)?.()
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' })

    function register(selector, reveal) {
      document.querySelectorAll(selector).forEach((element, index) => {
        observed.set(element, () => reveal(element, index))
        observer.observe(element)
      })
    }
    document.querySelectorAll('[data-hero-motion]').forEach(element => {
      const kind = element.getAttribute('data-hero-motion')
      const timings = {
        status: [0, 350, 0], intro: [30, 400, 6],
        line1: [70, 650, 12], line2: [140, 650, 12], line3: [220, 650, 12],
        description: [200, 400, 6], actions: [260, 300, 4],
        focus1: [150, 450, 6], focus2: [230, 450, 6], focus3: [290, 450, 6]
      }
      animate(element, ...timings[kind])
    })
    document.querySelectorAll('.focus-packet').forEach((element, index) => {
      if (media.matches || !element.getClientRects().length) return
      const animation = element.animate([{opacity:0,transform:'translateY(0px)'},{opacity:1,offset:.25},{opacity:0,transform:'translateY(24px)'}],{duration:450,delay:650+index*180,easing:ease})
      running.add(animation)
      animation.finished.then(()=>running.delete(animation),()=>running.delete(animation))
    })

    register('.section-heading', element => {
      [...element.children].forEach((child, index) => animate(child, [0, 40, 90][index] || 0, 450, index ? 8 : 4))
    })
    register('.about-grid', element => {
      element.querySelectorAll('.prose > p, .about-facts > div').forEach((child, index) => animate(child, Math.min(index * 35, 140), 450, 6))
    })
    register('.experience-list', element => {
      const line = element.querySelector('.timeline-line')
      if (!media.matches && !keyboard && line) {
        const animation = line.animate([{transform:'scaleY(0.01)',opacity:.4},{transform:'scaleY(1)',opacity:1}],{duration:750,easing:ease})
        running.add(animation)
        animation.finished.then(()=>running.delete(animation),()=>running.delete(animation))
      }
    })
    register('.experience-row', element => {
      element.querySelectorAll(':scope > div').forEach((child, index) => animate(child, index * 50, 450, 8))
      animate(element.querySelector('.timeline-milestone'), 0, 350, 0, { transform: 'scale(0.9)' })
    })
    register('.project-intro', element => [...element.children].forEach((child, index) => animate(child, index * 60, 500, 8)))
    register('.project-details, .project-evaluation', element => [...element.children].forEach((child, index) => animate(child, index * 50, 450, 6)))
    register('.skill-group', (element, index) => animate(element, index % 2 ? 60 : 0, 400, 6))
    register('.education-list > article, .credentials-list > li', (element, index) => animate(element, index % 2 ? 40 : 0, 400, 6))
    register('.contact-direct, .contact-form', element => animate(element, 0, 450, 8))

    function finish() { running.forEach(animation => animation.cancel()); running.clear() }
    function onKey() {
      keyboard = true
      document.documentElement.dataset.keyboard = 'true'
      finish()
      // An anchor target must never retain a delayed entrance after keyboard navigation.
    }
    function onPointer(event) {
      keyboard = false
      delete document.documentElement.dataset.keyboard
      running.forEach(animation => {
        if (animation.effect instanceof KeyframeEffect && animation.effect.target instanceof Element && animation.effect.target.contains(event.target)) animation.cancel()
      })
    }
    function onPreference() { if (media.matches) finish() }
    function onAnchor(event) {
      if (event.detail === 0 || media.matches || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
      const anchor = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null
      const target = anchor && document.getElementById(anchor.getAttribute('href').slice(1))
      if (!target) return
      event.preventDefault()
      history.pushState(null, '', anchor.getAttribute('href'))
      target.scrollIntoView({behavior:'smooth',block:'start'})
      target.focus({preventScroll:true})
    }
    document.addEventListener('keydown', onKey, true)
    document.addEventListener('pointerdown', onPointer, true)
    document.addEventListener('click', onAnchor)
    media.addEventListener('change', onPreference)
    return () => {
      finish(); observer.disconnect()
      document.removeEventListener('keydown', onKey, true)
      document.removeEventListener('pointerdown', onPointer, true)
      document.removeEventListener('click', onAnchor)
      media.removeEventListener('change', onPreference)
      delete document.documentElement.dataset.keyboard
    }
  }, [])
  return null
}
