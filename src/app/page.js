'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Journey from '@/components/Journey'
import Skills from '@/components/Skills'
import Certifications from '@/components/Certifications'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import Cursor from '@/components/Cursor'

const VideoScrub = dynamic(() => import('@/components/VideoScrub'), { ssr: false })

export default function Home() {
  const lenisRef = useRef(null)

  useEffect(() => {
    function setVh() {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    setVh()
    window.addEventListener('resize',            setVh, { passive: true })
    window.addEventListener('orientationchange', setVh, { passive: true })

    let lenis, rafId

    async function init() {
      const [LenisModule, gsapModule, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      const gsap = gsapModule.gsap || gsapModule.default
      gsap.registerPlugin(ScrollTrigger)

      lenis = new (LenisModule.default || LenisModule.Lenis)({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      })
      lenisRef.current = lenis

      function raf(time) {
        lenis.raf(time)
        ScrollTrigger.update()
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)

      document.querySelectorAll('.fade-up').forEach((el) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        })
      })
    }

    init()

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      if (lenisRef.current) lenisRef.current.destroy()
      window.removeEventListener('resize',            setVh)
      window.removeEventListener('orientationchange', setVh)
    }
  }, [])

  return (
    <>
      <Cursor />
      <VideoScrub />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Journey />
        <Skills />
        <Certifications />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}