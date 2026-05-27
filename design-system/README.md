# Frame Inventory Design System

A focused product design system extracted from the **Frame Inventory** prototype (an OOH out-of-home media operations tool). Built on top of the Global Design System (Global Next theme — Inter type, blue/cyan palette) and extended with the patterns this product introduced: inventory tables, master-data drawers, audit timelines, and stepper-driven creation flows.

## Sources
- `tokens.css` — full Global Design System tokens (Inter font, color palettes, semantic roles, spacing, elevation).
- `styles.css` — component styles built on top of the tokens (buttons, chips, tables, fields, surfaces, banners, timeline).
- `shell.jsx` — app chrome: rail nav, topbar, breadcrumbs, brand mark, icon set.
- `master-data.jsx`, `direction-a.jsx`, `direction-b.jsx` — production-shape examples consumed by the design system.

## Index
- `tokens.css` — design tokens (variables only — copy/import directly).
- `styles.css` — component styles built on those tokens.
- `preview/` — design-system preview cards (rendered in the Design System tab).
- `SKILL.md` — Agent Skill manifest for downstream prompting.
- `Frame Inventory.html` — the prototype that anchors the system.

## Content fundamentals
- **Tone**: operational, factual, second-person where action is required ("Add a frame", "Pick from master data"). Never marketing-y, never exclamatory.
- **Casing**: sentence case for everything — buttons (`New frame`, not `New Frame`), headers, table columns. Acronyms keep their caps (`OOH`, `CMS`, `DSP`).
- **Copy density**: short labels, longer help text below in `--text-secondary`. Inline microcopy preferred over modals.
- **No emoji** in product surfaces. Status uses iconographic dots/chips.
- **Numbers** are factual and contextual ("412 m", "10s · 6/min", "FRM-00214"). Use middle-dot `·` as a soft separator.

## Visual foundations
- **Type**: Inter, 13px body default — dense product UI, not document-style. Headings use the same family with weight (500–600) instead of size jumps.
- **Color**: cool blue primary (`--blue-1000` #046AC4) on near-white surfaces (`--gray-50`). Neutrals do the heavy lifting — color is reserved for status (green/red/orange) and primary actions.
- **Surfaces**: white cards on a `--gray-50` canvas, separated by 1px `--border-subtle` borders. **No drop shadows** on resting surfaces — elevation is reserved for popovers and drawers (`--elev-medium`).
- **Radii**: 4px (`--radius`) for inputs/buttons, 8px (`--radius-lg`) for surfaces, 999px for chips/pills.
- **Spacing**: 8px base — `--sp-1` through `--sp-10`. Most gaps are 16–24px (`--sp-2`, `--sp-3`).
- **Hover**: subtle background tint (`--gray-50` → `--blue-50`), no scale.
- **Press**: darker shade of the same token, no scale.
- **Borders**: 1px solid `--border-subtle` for surfaces, `--border-default` for inputs.
- **Animation**: practically none — drawers slide in 160ms, banners fade 120ms. Product is utilitarian; movement is reserved for state changes.
- **Imagery**: none in the chrome. The product is text- and data-first.
- **Iconography**: hand-rolled stroke icons at 1.8px stroke (Lucide-style), defined inline in `shell.jsx`. Domain glyphs (Station / Roadside / Airport / Mall / Bus Shelter) live alongside the UI icon set.

## Iconography
Inline SVG icons exported from `shell.jsx::Icon`. Stroke weight 1.8px, round caps/joins, single-color (`currentColor`). Domain icons are 16–24px. The system covers ~30 glyphs: `search`, `plus`, `pencil`, `trash`, `chev`, `chevL`, `filter`, `map`, `list`, `pin`, `history`, `more`, `link`, `warn`, `info`, `check`, `x`, `station`, `road`, `airport`, `mall`, `bus`, `frame`, `dash`, `cog`, `report`, `school`, `globe`, `download`, `upload`.

No emoji, no third-party icon CDN. If new icons are needed, draw new SVGs in the same stroke style.

## Caveats
- The system is **product-scoped** to Frame Inventory — not yet a brand-wide system.
- No marketing surfaces (landing pages, emails) are covered.
- Dark mode is not addressed.
- The "Inter via Google Fonts" fallback is in place but the WOFF2 files in `fonts/` are the source of truth.
