# Design System

- **Design Direction:** Cinematic dark landing experience transitioning into a warm-paper decision workspace.

## Typography
* **Instrument Serif (`--font-instrument-serif`, `.display-heading`):** Used for editorial display headings.
* **Inter (`--font-inter`, default `body` font):** Used for interface and body text.
* **IBM Plex Mono (`--font-ibm-plex-mono`, `.data-label`):** Used for ranks, scores, fees, and data labels.

## Color Tokens
### Dark Landing Mood (Cinematic)
* `--color-midnight` (`#070B14`): Deep background color
* `--color-midnight-surface` (`#101827`): Surface background for sections/containers
* `--color-warm-white` (`#F5F3EE`): Text color for high-contrast dark mode display
* `--color-route-indigo` (`#4D78FF`): Accent/route indicators
* `--color-route-amber` (`#F4B740`): Accent/route indicators
* `--color-route-emerald` (`#20B486`): Accent/route indicators

### Warm Product Workspace Mood (Paper Workspace)
* `--color-paper` (`#F7F4EE`): Main application background
* `--color-surface` (`#FFFFFF`): Panel and card background
* `--color-ink` (`#111827`): Primary text color
* `--color-muted` (`#64748B`): Secondary/muted text and icons
* `--color-border` (`#E5E0D7`): Subtle borders and dividers
* `--color-primary` (`#2F5BFF`): Primary interactive action color and selection highlight

### Status Tokens (Engineering Admission Predictability)
* `--color-safe` (`#168866`): Safe admission predictability (Greens)
* `--color-target` (`#D58B18`): Moderate admission target predictability (Oranges)
* `--color-dream` (`#6256D9`): Low predictability/dream choice (Purples)
* `--color-warning` (`#C85A32`): High risk/warning status (Reds)

> [!IMPORTANT]
> - Actual UI components and sections (e.g. Navbar, Hero, Predictor, etc.) have NOT been built yet.
> - Do not build visual components yet.
> - Do not use stock campus imagery in the hero.
> - Do not add excessive animations or template-like SaaS sections.
