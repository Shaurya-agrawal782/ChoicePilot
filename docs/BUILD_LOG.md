# Build Log

## [2026-06-03] Next.js Foundation Initialised

- Initialised Next.js project with TypeScript, ESLint, Tailwind CSS, App Router, and npm.
- Performed starter cleanup:
  - Replaced default Next.js home page with a minimal placeholder page showing ChoicePilot details.
  - Removed unused template SVG files from `public/`.
  - Replaced starter `README.md` with product/status info.
- Prepared the core folder structure (`components/`, `lib/`, `docs/`, `public/` directories).
- Added basic placeholder documentation in `docs/` (`PRODUCT_SPEC.md`, `DESIGN_SYSTEM.md`, `ARCHITECTURE.md`, `DATA_POLICY.md`, `BUILD_LOG.md`).
- Verified build and lint checks pass successfully.

## [2026-06-03] Visual Foundation & Design Tokens Setup

- Installed project dependencies: `motion` and `lucide-react`.
- Configured custom typography in `app/layout.tsx` using `next/font/google`:
  - `Instrument_Serif` for editorial display headings.
  - `Inter` as the default body font.
  - `IBM_Plex_Mono` for ranks, scores, fees, and data labels.
- Set up application title `ChoicePilot — The Decision Atlas` and description metadata.
- Established Visual Design Tokens in `app/globals.css` (Dark landing mood, Warm paper workspace mood, and admission predictability Status tokens).
- Configured simple layout defaults and utility classes (`.display-heading`, `.data-label`) in `app/globals.css`.
- Lightly updated `app/page.tsx` with a typography and token verification screen demonstrating fonts and status color chips (`Dream`, `Target`, `Safe`, `Verified`).
- Documented fonts, colors, and UI reminders in `docs/DESIGN_SYSTEM.md`.
- Verified build and lint checks pass successfully.

## [2026-06-03] Landing Page Hero — Static Composition Pass 1

- Implemented a premium cinematic dark landing hero in `app/page.tsx` using newly created modular components:
  - `components/landing/HeroNavbar.tsx`: Minimal, high-contrast, transparent navbar with product wordmark and links.
  - `components/landing/DecisionAtlasVisual.tsx`: An interactive-looking static visual charting a JEE Main rank profile origin, with routes connecting to `Dream`, `Target` (LNCT Bhopal CSE Match recommendation card), and `Safe` nodes.
  - `components/landing/LandingHero.tsx`: Main hero container using a dark radial gradient background, structured with a two-column responsive layout (single column on mobile, balanced dual columns on desktop).
- Verified responsive behaviors: navigation links and visual elements adjust cleanly to prevent horizontal overflow on smaller screens.
- Verified build and lint checks pass successfully.

## [2026-06-03] Landing Page Hero — Static Refinement Pass 2

- Refined the static landing hero layout to ensure it fits comfortably within the initial desktop viewport (avoiding accidental scrolling/cropping pressure) by bounding container height, reducing vertical paddings, and adjusting right-visual scaling.
- Improved readability of the desktop Decision Atlas visual by increasing opacity on college labels, adjusting SVG path colors/widths, and adding an explicit Target node endpoint aligned on the right.
- Implemented a custom, simplified, highly readable mobile Decision Atlas layout with a compact rank/status top bar, a single recommendation card, a three-route summary panel, and three concise match indicators, ensuring text remains perfectly readable without scaling.
- Polished mobile navigation bar and layout rhythm (headline hierarchy, full-width CTA buttons, and elevated trust-line readability).
- Verified build and lint checks pass successfully.

## [2026-06-03] Landing Page Hero — Static Micro-Polish Pass 3

- Repositioned the desktop trust line to sit directly below the CTA buttons in a tight flex layout to align with the left content column.
- Resolved target duplication in the desktop Decision Atlas map by simplifying the right-side Target endpoint to say `SELECTED ROUTE` and removing the repetitive `LNCT Bhopal` college label.
- Confirmed there is no caret, cursor styling, or typing effect pseudo-element in the description text or stylesheet (ensuring no vertical bar artifacts).
- Adjusted the desktop atlas visual container's maximum width slightly (`lg:max-w-[460px] xl:max-w-[500px]`) for a more confident visual balance on wide viewports.
- Preserved all mobile visual layouts, responsive stacking behavior, and design token definitions.
- Verified build and lint checks pass successfully.

## [2026-06-03] Hero Motion Pass 1 — Controlled Entrance Animation

- Converted `LandingHero.tsx` to a client component (`"use client"`) to enable motion.
- Added controlled entrance animations via the `motion` package (`motion/react`):
  - **Navbar:** Single restrained unit entrance (opacity 0→1, translateY -10→0, ~0.55s).
  - **Left hero content:** Staggered entrance for 7 items (eyebrow label, 3 headline lines, description, CTA row, trust line) with ~0.09s stagger gaps and opacity + subtle translateY (16px) reveals.
  - **Decision Atlas panel:** Whole-panel entrance (opacity 0→1, translateY 16→0, scale 0.985→1, ~0.7s, delayed by 0.5s).
- Reduced-motion support implemented via `useReducedMotion()`: no translate/scale movement when preferred; simple short opacity reveal only.
- Internal Atlas routes, nodes, cards, grid lines, and score labels are intentionally not animated (deferred to next reviewed pass).
- Verified build and lint checks pass successfully.

## [2026-06-03] Decision Atlas Motion Pass 2 — Restrained Route-Calculation Sequence

- Checkpointed the approved Hero Motion Pass 1 entrance animation locally.
- Implemented Decision Atlas Motion Pass 2 adding restrained internal animations:
  - **Rank Badge & Profile Node:** Soft fade and subtle scaling reveals starting at 0.7s.
  - **Route Paths:** Draw outward progressively using SVG `pathLength` drawing. Target route draws first (0.8s - 1.45s), followed shortly by Dream and Safe supporting routes (0.95s - 1.45s).
  - **Endpoint Nodes:** Dream, Safe, and Selected Route target labels fade in cleanly after their respective routes reach them.
  - **Recommendation Card:** Settle/fade-in animation (opacity 0→1, y 8→0, scale 0.98→1, 0.5s duration) starting at 1.15s after the target route draws enough.
  - **Mobile Layout:** Compact top row, recommendation card, and route summary row fade in sequentially (0.7s, 0.85s, 1.0s) without layout shifts.
- Supported reduced-motion: disables path drawing, scale, and translations, revealing components with short simple opacity fades.
- Verified build and lint checks pass successfully.

## [2026-06-03] Landing Section 2 — Static Decision Story Composition

- Checkpointed the approved Decision Atlas route-calculation animations locally.
- Created and refined `components/landing/DecisionStorySection.tsx` directly below the hero:
  - Replaced the linear gradient transition with a crisp, premium, curved paper-edge SVG path transitioning smoothly from `bg-midnight` to `bg-paper`.
  - Structured desktop narrative flow to read cleanly top-to-bottom: Editorial Header → Horizontal Factor Card Sequence (Rank, Branch Priority, Annual Budget, Decision Priority) → Inputs Divider Connector → Centered Generated Route Outcome Card.
  - Added a restrained static inputs-to-route connection divider (`INPUTS RESOLVED INTO ROUTE` flanked by thin horizontal lines) to suggest a decision-engine flow.
  - Refined factor card density by reducing vertical heights/paddings and spacing to make them tighter and keep focus on the outcome card.
  - Maintained mobile stacking order (Header → Cards 01-04 → Generated Route Card) without overflow.
- Scroll/story animation for this new section remains intentionally deferred pending visual approval.
- Refined hero-to-story vertical handoff to reduce excess dark dead space while preserving the approved dark-to-warm narrative transition.
- Verified build and lint checks pass successfully.

## [2026-06-03] Decision Story Motion Pass 1 — Viewport Narrative Entrance

- Checkpointed the approved static Decision Story section and spacing vertical handoff locally.
- Implemented Decision Story Motion Pass 1 adding restrained in-view entrance reveals:
  - **Section Header:** Eyebrow, heading, and description reveal as a calm unit (opacity 0→1, y 16px→0, 0.6s duration) triggered only once when in view.
  - **Factor Cards:** Staggered sequence reveal (stagger gap 0.08s, duration 0.5s per card, y 18px→0) in Rank → Branch → Budget → Goal reading order.
  - **Connector:** Inputs connector label and divider lines reveal with a clean fade-in (opacity 0→1, y 8px→0) delayed by 0.2s.
  - **Generated Route Card:** Center outcome card reveals last (opacity 0→1, y 16px→0, scale 0.99→1, 0.6s duration) delayed by 0.35s to make the output relationship clear.
  - **Trigger and Timing:** Viewport-triggered reveals using `whileInView` with `once: true`. Desktop animation completes within 0.95s once triggered. Mobile cards reveal independently as the user scrolls to avoid wait times.
- Supported reduced-motion: disables translations and scaling, opting for immediate or short opacity reveals.
- Heavy scroll-stack interaction was intentionally avoided to preserve clarity.
- Verified build and lint checks pass successfully.





