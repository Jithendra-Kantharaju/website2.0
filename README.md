# Jithendra Kantharaju — Cinematic Portfolio

Next.js 15 cinematic portfolio with WebGL particle background, GSAP ScrollTrigger animations, Lenis smooth scroll, and a 3D holographic design aesthetic.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19
- **Animations**: GSAP + ScrollTrigger, per-word BlurText reveal
- **Smooth Scroll**: Lenis
- **WebGL**: Custom particle field (WebGL2) — fixed cinematic background
- **Styling**: CSS custom properties + minimal Tailwind
- **Images**: Next.js `<Image>` optimized
- **Contact**: EmailJS (optional)

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Production Build

```bash
npm run build
npm start
```

## Adding Your Resume PDF

Place your resume at:
```
public/Resume_Jithendra.pdf
```

## Contact Form Setup (EmailJS)

1. Copy `.env.local.example` to `.env.local`
2. Create a free EmailJS account at https://www.emailjs.com/
3. Add your Service ID, Template ID, and Public Key
4. The form will automatically start working

Without these keys, the form shows a friendly error directing visitors to email directly.

## Image Assets

Certification badges: `public/Certs/`
Project screenshots: `public/projects/`

**Note:** `aws-ai-practitioner.png` and `aws-cloud-practitioner.png` placeholders are referenced but may need the actual badge images added to `public/Certs/`.

## Deployment

Works out of the box on:
- **Vercel** (recommended — zero config)
- **Netlify** — set build command: `npm run build`, publish dir: `.next`
- **Any Node.js host** — `npm start` after build

## Structure

```
src/
  app/
    globals.css       — design tokens, grain overlay, type scale
    layout.js         — metadata + root layout
    page.js           — Lenis init + GSAP ticker + section assembly
  components/
    Cursor.jsx        — Orange dot + ring cursor (mouse-tracking)
    ParticleBackground.jsx — WebGL2 particle field
    Navbar.jsx        — Sticky nav with mobile overlay
    Hero.jsx          — Per-letter flip animation + stats
    About.jsx         — Bio + quick facts grid
    Journey.jsx       — Timeline: work + education
    Skills.jsx        — Category selector + pill grid
    Certifications.jsx — 10 cert cards with hover glow
    Projects.jsx      — 3D deck stack + detail panel
    Contact.jsx       — EmailJS form + social links
    Footer.jsx        — Stack credits + links
    BlurText.jsx      — Per-word blur reveal utility
public/
  Certs/              — Certification badge images
  projects/           — Project screenshots
```
