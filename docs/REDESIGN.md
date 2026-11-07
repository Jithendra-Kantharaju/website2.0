# Portfolio redesign

## Scope

Preserves Next.js App Router, React, Tailwind, static export, existing verified background information, repository links, and the EmailJS contract. No deployment or Git push was performed.

## Design decisions

A black and charcoal foundation with Geist typography, cyan interaction accents, and violet CloudOps emphasis. Shared type styles, spacing, focus treatment, and section headings replace ad hoc inline visual values. The page order is hero, About, Experience, featured Projects, Skills, Education/Certifications, and Contact.

The primary action is email. Technical evidence is visible without operating a carousel. Work history is separate from education. Skill categories are readable together. Additional repositories remain in a native disclosure.

## Component changes

Rebuilt Navbar, Hero, About, Journey, Projects, Skills, Certifications, Contact, and Footer. Added SectionHeading, Arrow, Tagline, and ArchitectureDiagram. Removed Cursor, VideoScrub, ParticleBackground, and BlurText. The home page and content-heavy sections now render as server components, leaving only navigation, the form, and bounded motion as client components.

## Evidence and claims

Preserved 40% shorter deployment time and approximately 70% less manual setup in the relevant work history. Featured results are 15/16 (93.8%) mocked incident classifications, 21/22 (95.5%) RAG refusal decisions, and zero wrong auto-approvals on 425 synthetic invoices.

Removed the unsupported deployment-error and incident-resolution reductions, generalized unverified availability/incident-frequency claims, and removed broad production assertions from project copy. Credential names, issuers, and listed years are preserved without asserting current validity.

Source links are recorded in README.md and the case-study data. An AWS demo and an evaluation harness are distinct evidence types. Neither project is labeled a maintained live service.

## Animation review

| Before | After | Why |
| --- | --- | --- |
| Whole-page frame sequence; 150 eager image requests | Flat background; semantic architecture flows | Removes decorative decoding, canvas paint, and continuous polling |
| Custom cursor and smooth-scroll loops | Native cursor and scrolling | No idle animation loop or input interception |
| Scroll-driven section fade-outs | Readable content persists | Navigation never hides the material being evaluated |
| Layout-property and unrestricted transitions | Explicit transform/opacity transitions | Avoids animated layout and unexpected property changes |
| Repeated GSAP initialization with lost cleanup | Scoped observers and cancellable WAAPI animations | Effects clean up on unmount and preference changes |
| Missing motion preferences | Static reduced-motion diagrams and statement | Supports motion-sensitive visitors |
| Unbounded decorative movement | One finite flow trace on visibility, optional replay | Motion explains order rather than simulating live infrastructure |

Performance: architecture traces animate only a small outline's opacity and transform. Each runs for 700ms with a 160ms sequence offset. They finish, and no continuous requestAnimationFrame loop remains in application code. The single rAF in navigation schedules focus after the menu closes.

Accessibility: movement is disabled for reduced motion. Hover movement is restricted to fine pointers. Keyboard actions skip movement, and keyboard activation of the flow control focuses the semantic numbered diagram.

Decision: approve the source implementation's motion design. Physical-device performance remains a separate verification limit; use the generated browser report for the actual desktop-throttling sample.

## Verification

Run `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run verify:browser` against the static export. The latter creates screenshots and a JSON report under ignored `artifacts/`.

The gradient hero title may require manual color-contrast review because automated tools cannot resolve text gradients reliably. Its darkest endpoint (#9b9b9b on black) exceeds WCAG AA for text; the cyan emphasis also exceeds AA. All actionable controls have visible keyboard focus.

Browser verification intercepts EmailJS responses; it does not establish real inbox delivery. Physical iOS/Android and Safari/Firefox checks remain advisable. No certification verification links or resume PDF were supplied.

## Recorded verification

- Production build passed; home route first-load JavaScript: 112 kB.
- ESLint passed with zero warnings; JavaScript type check passed.
- Chrome layouts checked: 1440, 1024, 768, 390, and 320 pixels. No horizontal overflow, missing images, or missing section anchors.
- Automated WCAG A/AA checks: zero violations at all five widths and in the open mobile menu. Gradient heading contrast reviewed separately: darkest endpoint 7.56:1 on black.
- Skip link, focus trapping, Escape, section focus, required fields, and intercepted EmailJS success/error responses passed. No real email was sent.
- Reduced motion and primary content without JavaScript passed.
- 4x CPU sample: p95 frame interval 16.8 ms; no long tasks; no remaining animations. This does not establish physical-device performance.
- Repository and evaluation links returned HTTP 200. LinkedIn rejected automated HEAD checks with HTTP 405; its existing URL is preserved.
- git diff --check passed.

## Files changed or added

- `.eslintrc.json`
- `.gitignore`
- `README.md`
- `docs/REDESIGN.md`
- `eslint.config.mjs`
- `jsconfig.json`
- `package-lock.json`
- `package.json`
- `public/fonts/OFL.txt`
- `public/fonts/geist-medium.ttf`
- `public/fonts/geist-regular.ttf`
- `public/fonts/geist-semibold.ttf`
- `public/icon.svg`
- `public/social-card.png`
- `scripts/create-social-card.mjs`
- `scripts/serve-preview.mjs`
- `scripts/verify-browser.mjs`
- `src/app/globals.css`
- `src/app/layout.js`
- `src/app/not-found.js`
- `src/app/page.js`
- `src/app/robots.js`
- `src/app/sitemap.js`
- `src/components/About.jsx`
- `src/components/ArchitectureDiagram.jsx`
- `src/components/Arrow.jsx`
- `src/components/BlurText.jsx`
- `src/components/Certifications.jsx`
- `src/components/Contact.jsx`
- `src/components/Cursor.jsx`
- `src/components/Footer.jsx`
- `src/components/Hero.jsx`
- `src/components/Journey.jsx`
- `src/components/Navbar.jsx`
- `src/components/ParticleBackground.jsx`
- `src/components/Projects.jsx`
- `src/components/SectionHeading.jsx`
- `src/components/Skills.jsx`
- `src/components/Tagline.jsx`
- `src/components/VideoScrub.jsx`
- `src/data/portfolio.js`
- `src/data/projects.js`
- `src/types.d.ts`

The pre-existing untracked .agents directory and skills-lock.json are excluded from this change list. Browser artifacts are ignored.
