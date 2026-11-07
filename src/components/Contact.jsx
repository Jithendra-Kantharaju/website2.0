'use client'

import { useEffect, useRef, useState } from 'react'
import { profile } from '@/data/portfolio'
import SectionHeading from './SectionHeading'
import Arrow from './Arrow'

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || ''
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || ''
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const mounted = useRef(true)
  useEffect(() => { mounted.current = true; return () => { mounted.current = false } }, [])
  function change(event) {
    setForm(value => ({ ...value, [event.target.name]: event.target.value }))
    if (status !== 'sending') { setStatus('idle'); setError('') }
  }
  async function submit(event) {
    event.preventDefault()
    if (status === 'sending') return
    if (!form.name.trim() || !form.message.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setStatus('error'); setError('Enter your name, a valid email address, and a message.'); return
    }
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setStatus('error'); setError('The form is unavailable right now. Please use the email link to contact me directly.'); return
    }
    setStatus('sending'); setError('')
    try {
      const emailjs = (await import('@emailjs/browser')).default
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, { from_name: form.name.trim(), from_email: form.email.trim(), message: form.message.trim(), to_name: 'Jithendra' }, PUBLIC_KEY)
      if (mounted.current) { setStatus('success'); setForm({ name: '', email: '', message: '' }) }
    } catch {
      if (mounted.current) { setStatus('error'); setError('Your message could not be sent. Please try again or email me directly.') }
    }
  }
  return <section id="contact" className="section container contact-section" tabIndex={-1}>
    <SectionHeading number="06" label="Contact" title="Let’s build something dependable.">Open to DevOps, Cloud, SRE, Forward Deployed Engineer, and AI Engineer opportunities in the United States.</SectionHeading>
    <div className="contact-grid"><div className="contact-direct"><p className="eyebrow">Start a conversation</p><a className="contact-email title-1" href={'mailto:' + profile.email}>{profile.email}<Arrow diagonal /></a><p className="body-3">Have a role or an engineering problem in mind? Send a message with a little context.</p><div className="contact-profiles"><a className="text-link" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <Arrow diagonal /></a><a className="text-link" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub <Arrow diagonal /></a></div><p className="caption-2 contact-note">Based in the United States.</p></div>
    <form className="contact-form" onSubmit={submit} aria-label="Contact Jithendra" aria-busy={status === 'sending'}>
      <div className="form-pair"><div><label htmlFor="contact-name" className="title-4">Name</label><input id="contact-name" name="name" autoComplete="name" required maxLength={120} value={form.name} onChange={change} placeholder="Your name" disabled={status === 'sending'} /></div><div><label htmlFor="contact-email" className="title-4">Email</label><input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} value={form.email} onChange={change} placeholder="you@company.com" disabled={status === 'sending'} /></div></div>
      <div><label htmlFor="contact-message" className="title-4">Message</label><textarea id="contact-message" name="message" required rows={5} maxLength={5000} value={form.message} onChange={change} placeholder="Tell me about the role or project…" disabled={status === 'sending'} /></div>
      <p className="caption-2">Your message and contact details are sent through EmailJS.</p>
      <div className="form-status" aria-live="polite" aria-atomic="true">{status === 'error' && <p className="status-error body-6">{error} <a href={'mailto:' + profile.email}>Email directly <span aria-hidden="true">↗</span></a></p>}{status === 'success' && <p className="status-success body-6">Message sent. Thank you for getting in touch.</p>}{status === 'sending' && <p className="caption-2">Sending your message…</p>}</div>
      <button className="button button-primary" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send message'}<Arrow diagonal /></button>
    </form></div>
  </section>
}
