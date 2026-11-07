'use client'

import { useEffect, useRef, useState } from 'react'
import { profile } from '@/data/portfolio'
import Arrow from './Arrow'

const items = [['About','about'],['Experience','experience'],['Projects','projects'],['Skills','skills'],['Credentials','credentials'],['Contact','contact']]

export default function Navbar() {
  const [open,setOpen] = useState(false)
  const [present,setPresent] = useState(false)
  const [active,setActive] = useState('')
  const toggle = useRef(null)
  const panel = useRef(null)
  const animation = useRef(null)
  const instant = useRef(false)

  function changeMenu(next, immediate = false) {
    instant.current = immediate || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (panel.current && animation.current) {
      const current = getComputedStyle(panel.current)
      panel.current.style.opacity = current.opacity
      panel.current.style.transform = current.transform
      animation.current.cancel()
    }
    if (next) setPresent(true)
    else if (instant.current) setPresent(false)
    setOpen(next)
  }
  useEffect(()=>{
    if (!present || !panel.current) return
    const element = panel.current
    if (instant.current) { element.style.opacity='1';element.style.transform='none';return }
    const current=getComputedStyle(element)
    animation.current = element.animate([
      {opacity:element.style.opacity || (open ? 0 : current.opacity),transform:element.style.transform || (open?'translateY(-8px)':current.transform)},
      {opacity:open?1:0,transform:open?'translateY(0px)':'translateY(-8px)'}
    ],{duration:open?240:160,easing:current.getPropertyValue('--ease-drawer').trim(),fill:'forwards'})
    animation.current.finished.then(()=>{if(!open)setPresent(false)},()=>{})
    return ()=>animation.current?.cancel()
  },[open,present])

  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)
      if(visible.length)setActive(visible[0].target.id)
    },{rootMargin:'-15% 0px -55% 0px'})
    ;['home',...items.map(([,id])=>id)].forEach(id=>{const element=document.getElementById(id);if(element)observer.observe(element)})
    return ()=>observer.disconnect()
  },[])

  useEffect(()=>{
    if(!open)return
    const previous=document.body.style.overflow
    document.body.style.overflow='hidden'
    panel.current?.querySelector('a')?.focus()
    function keyboard(event){
      if(event.key==='Escape'){changeMenu(false,true);toggle.current?.focus()}
      if(event.key==='Tab'){
        // Keyboard feedback is immediate, even if the panel was opened by touch.
        animation.current?.finish()
        const links=[...panel.current.querySelectorAll('a')]
        const first=toggle.current,last=links.at(-1)
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
      }
    }
    const desktop=window.matchMedia('(min-width: 1024px)')
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)')
    function resize(event){if(event.matches){changeMenu(false,true);const brand=document.querySelector('.brand');if(brand instanceof HTMLElement)brand.focus()}}
    function preference(event){if(event.matches)animation.current?.finish()}
    document.addEventListener('keydown',keyboard)
    desktop.addEventListener('change',resize);reduced.addEventListener('change',preference)
    return ()=>{document.body.style.overflow=previous;document.removeEventListener('keydown',keyboard);desktop.removeEventListener('change',resize);reduced.removeEventListener('change',preference)}
  },[open])

  function navigate(id,event) {
    changeMenu(false,event.detail===0)
    requestAnimationFrame(()=>document.getElementById(id)?.focus({preventScroll:true}))
  }
  return <header className="site-header">
    <nav className="nav-shell" aria-label="Main navigation">
      <a className="brand" href="#home" onClick={event=>navigate('home',event)} aria-label="Jithendra Kantharaju, home"><span className="brand-mark">jk<span>.</span></span><span className="brand-name">Jithendra K.</span></a>
      <div className="desktop-nav">{items.slice(0,5).map(([label,id])=><a key={id} href={'#'+id} aria-current={active===id?'location':undefined}>{label}<span className="nav-indicator" aria-hidden="true" /></a>)}</div>
      <a className="nav-contact" href={'mailto:'+profile.email}>Let’s talk <Arrow diagonal /></a>
      <button ref={toggle} className="menu-toggle" aria-label={open?'Close navigation menu':'Open navigation menu'} aria-expanded={open} aria-controls={present?'mobile-navigation':undefined} onClick={event=>changeMenu(!open,event.detail===0)}>
        <span className={open?'menu-line is-open':'menu-line'} /><span className={open?'menu-line is-open':'menu-line'} />
      </button>
    </nav>
    {present&&<div className="mobile-navigation" id="mobile-navigation" ref={panel} inert={!open} aria-hidden={!open}>
      <p className="eyebrow">Navigation</p>
      {items.map(([label,id],index)=><a key={id} href={'#'+id} onClick={event=>navigate(id,event)} aria-current={active===id?'location':undefined}><span className="caption-4">0{index+1}</span>{label}<Arrow /></a>)}
      <p className="caption-2">Cloud infrastructure. Reliable delivery. Applied AI.</p>
    </div>}
  </header>
}
