# Animation audit and implementation plan

Scope: animation only; retain the current layout, typography, palette, source content, metrics, and EmailJS contract.

| Priority | Before | After | Purpose |
| --- | --- | --- | --- |
| 1 | Static hero and focus layers | Overlapping WAAPI leaf entrances; finite connection trace | Establish reading order without a long wait |
| 2 | Diagram outlines sweep independently | One selected, replayable workflow with packets and explicit stages | Explain cause and effect accurately |
| 3 | Mobile panel mounts/unmounts instantly | Interruptible 240ms entry / 160ms exit | Preserve spatial continuity |
| 4 | Static supporting sections | One-time small leaf reveals and a timeline spine | Make section hierarchy perceptible |
| 5 | Immediate hover and form-state changes | Restrained, touch-safe feedback | Acknowledge interaction |

GSAP and Lenis are installed but unused. There are no active GSAP lifecycle bugs. Existing observers clean up; existing diagram cancellation is a useful foundation. Existing reduced-motion handling and instant keyboard feedback must be retained.

find-animation-opportunities was not present in any searched installed skill directory. The opportunity audit above uses the installed improve-animations, animate, and choreograph guidance. improve-animations is used only for this read-only planning stage; implementation follows the user's explicit instruction to proceed using animate.

## Hero choreography

| Element | Role | Starts | Duration | Motion | Relationship |
| --- | --- | --- | --- | --- | --- |
| Status | Decoration | 0ms | 350ms | Opacity | Establish context |
| Introduction | Support | 30ms | 400ms | 6px rise + opacity | Overlaps status |
| Headline lines | Lead | 70 / 140 / 220ms | 650ms | 12px rise + opacity | Reading order; overlapping |
| Description | Support | 200ms | 400ms | 6px rise + opacity | Overlaps headline |
| CTA group | Support | 260ms | 300ms | 4px rise + opacity | Both actions enter together |
| Focus layers | Support | 150 / 230 / 290ms | 450ms | 6px rise + opacity | Overlaps hero, finite path follows |

Use the existing --ease-out cubic-bezier(0.23, 1, 0.32, 1). No parent entrance around animated children. The navigation shell, page background, metric values, and footer container stay still. Menu links are carried by the panel rather than individually staggered.

## Workflow boundaries

LedgerGuard illustrates one invoice-review route: intake, extraction, policy, matching, human review, audited shadow decision. Human review is conditional in the real architecture; this is one illustration, not the route of every invoice. No ERP posting or real approval is implied.

CloudOps offers cloud delivery and incident diagnosis. RAG remains visible in the original architecture without inventing a documentation corpus. Original architecture text is retained; stage captions supplement it. Only one workflow runs at a time, stops offscreen, and supports replay/interruption. Static diagrams and sequence text remain usable without animation.

## Verification

Run lint, JavaScript type checking, production build, and Chrome CDP checks against the local Next development server at localhost:3000. Test 1440, 768, 390, 320px; actual intermediate animation states; menu reversal and keyboard focus; diagram stage ordering and replay; dynamic reduced-motion changes; no-JS content; overflow; layout shift; and 4x CPU sampling. Capture frame samples for visual review. EmailJS responses are intercepted, never delivered.
