# Margin signal background

## Audit and concept choice

The existing portfolio uses black (#000000), charcoal surfaces, cyan/violet accents, Geist typography, server-rendered sections, and native WAAPI/CSS motion. The hero already establishes hierarchy, while project diagrams contain explanatory foreground motion. GSAP and Lenis are installed but unused. The best background therefore adds edge detail without another focal point, new content, or continuous rendering work.

| Concept | Design quality / originality | Engineering relevance | Accessibility | Performance / mobile |
| --- | --- | --- | --- | --- |
| Sparse margin signal routes — selected | Asymmetric edge detail with deliberate empty space; avoids a tiled/grid appearance | Suggests routed traffic and system handoffs without claiming live telemetry | Keeps the reading column clear and provides an identical static motif | Two small moving elements; one on phones |
| Deployment strata | Calm layered horizontal strokes, but repeats the page's section-divider language | Suggests infrastructure layers | More horizontal intersections with content | Inexpensive, but occupies more of the screen |
| Service-topology imprints | More illustrative, but competes with architecture figures | Direct service/node associations | Greater visual density and small-screen compression | More geometry and status changes than the selected approach |

No particles, floating orbs, background gradients, decorative grids, WebGL, canvas, video, or cursor effects were added.

The requested find-animation-opportunities skill was absent from the installed skill directories and plugin cache. Its opportunity assessment was performed with the installed design, animate, and choreograph guidance. The requested available skills were read before implementation; landing-page-design was also consulted for compatibility with the established visual system.

## Scope and visual refinement

One global SignalBackdrop component is mounted in the existing root layout. The page structure, typography, colors, section components, technical claims, project data, and EmailJS code remain unchanged. A body stacking context and explicit main/footer layer place the background below all content.

The routes use 20% accent opacity, subdued branches, and 35% terminal outlines. Signals peak at 55% opacity with no glow, blur, or shadow. Each signal is only 1–2px wide. Desktop rails occupy the outer gutters, tablet rails are 32px wide, and phone rails are 16px wide. Both mobile and desktop geometry were verified to stay outside the content container.

The normal, reduced-motion, and no-JavaScript captures were visually inspected. The selected colors and speed were retained after inspection: the center remains black and the traces remain secondary. Mobile preserves only one moving cyan signal; its violet route stays static.

## Choreography

| Element | Role | Starts | Duration | Motion | Relationship |
| --- | --- | --- | --- | --- | --- |
| Existing hero | Lead | Existing timing | Settles by 950ms | Unchanged | Remains the focal point |
| Route geometry | Static | Server render | Always present | None | Establishes a quiet visual motif |
| Cyan signal | Supporting illustration | 1200ms after mount | 3200ms | Transform + opacity | Follows the hero settling |
| Violet signal | Supporting illustration | 1560ms after mount | 3200ms | Transform + opacity | Overlaps the first pass; desktop/tablet only |
| Later section signal | Context feedback | Once per new section, subject to budget | At most 3560ms | Same treatment | Requires a 10-second cooldown |

The first pass ends by 4760ms after mount. Subsequent passes are limited to three total per desktop/tablet visit or two per phone visit, including the first pass. There is no periodic replay timer.

Text, section containers, surfaces, static route geometry, and metric values do not move because of this system. Background passes stop when projects occupy the reading band or a foreground workflow begins. They also stop for keyboard input, input/menu focus, resize, hidden-document events, reduced motion, and forced colors. Returning to a tab does not automatically restart a pass.

## Performance and accessibility review

| Before | After | Why |
| --- | --- | --- |
| Plain black perimeter | Sparse inline SVG paths in the gutters | Adds engineering character without obstructing reading |
| No background motion | Brief native transform/opacity passes with a cooldown and visit cap | Adds motion without an idle loop |
| Foreground animations alone | Explicit background suppression during project workflows | Preserves hierarchy |
| Flat static fallback | The same routes remain static without JS or under reduced motion | Progressive enhancement with no hidden content |

Native WAAPI controls the finite CSS transform/opacity animation; SVG geometry does not animate. No requestAnimationFrame loop, scroll listener, new dependency, inherited per-frame variable, animated stroke-dashoffset, or full-screen filter is used. Only the small runners move. Observers, handles, timers, and listeners clean up.

The backdrop has aria-hidden, contains no focusable controls, and has pointer-events:none. Reduced motion suppresses moving tracks while keeping the static composition. Forced colors hides decorative geometry and stops its playback.

Verdict: approve the background motion implementation, subject to the browser/device verification limits recorded below.

## Files changed

- src/components/SignalBackdrop.jsx — new global component and finite event-driven playback.
- src/components/SignalBackdrop.module.css — isolated paths, layering within the backdrop, responsive gutters, static fallbacks.
- src/app/layout.js — mounts the background.
- src/app/globals.css — isolates body stacking and places main/footer above the background.
- scripts/verify-background.mjs — actual Chrome playback, geometry, accessibility, cancellation, and performance checks.
- docs/BACKGROUND-MOTION.md — concept comparison, timing, review, and verification.
- README.md — local verification instructions.

No section, project-metric, professional-experience, or EmailJS implementation file was modified. No deployment, commit, or Git push was performed.

## Recorded verification

- Production build, ESLint, JavaScript type checks, script linting, and git diff --check passed.
- Development and production captures were inspected at 1440, 768, 390, and 320px in normal and reduced-motion modes.
- Real intermediate opacity/transform values confirmed playback: two active signals on desktop/tablet, one on phones. Each pass settled without an idle loop.
- All four widths: no horizontal overflow, no section-geometry changes when the backdrop was removed, no button hit-test obstruction, zero measured layout shift in the recorded reduced-motion navigations, and zero automated WCAG A/AA violations.
- Input focus, keyboard input, project visibility, foreground workflow events, simulated hidden-document events, and live reduced-motion changes stopped active background motion. Rapid repeated section navigation did not bypass the cooldown.
- Forced-colors and no-JavaScript static rendering passed. Original project and professional-content files match Git HEAD hashes.
- General production regression checks additionally covered 1024px, menu focus trapping, Escape, the skip link, missing anchors/images, and intercepted EmailJS success/error responses. No real messages were sent.
- Active-background 4x CPU sample: 120 frame intervals; p95 16.9ms, maximum 50.0ms, no long tasks, with 2 signals active.
- Same-page static sample at 4x CPU: p95 16.8ms and maximum 16.9ms. The active run contained an isolated 50ms frame gap; these short samples do not establish perfect frame delivery or physical-phone GPU performance.
- Build output reports 116 kB home first-load JavaScript (the same rounded figure as before). No dependencies were added; this is not a claim of zero added bytes or faster performance than a static black background.
- The existing gradient headline remains an automated manual contrast-review item. Its foreground/background colors were not modified.

## Remaining limits

Physical iOS/Android devices, Safari, and Firefox were not tested. Real inbox delivery was not attempted. Hidden-tab cancellation was exercised through the document event path in Chrome, rather than a physical operating-system tab switch. The isolated throttled frame gap remains recorded for device follow-up.

Screenshots and raw reports: artifacts/background/. The general regression report is artifacts/browser-report.json. Temporary test servers and the isolated headless browser are closed after verification.
