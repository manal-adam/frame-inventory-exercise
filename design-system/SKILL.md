---
name: frame-inventory-design
description: Use this skill to generate well-branded interfaces and assets for Frame Inventory (an OOH media operations product), either for production or throwaway prototypes/mocks. Contains design tokens, type, color, and UI patterns for dense data product UI built on the Global Design System.
user-invocable: true
---

Read the README.md file within this skill and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy `tokens.css` + `styles.css` into the target and import them; reuse the component patterns in `shell.jsx`, `direction-a.jsx`, `direction-b.jsx`, and `master-data.jsx`. If working on production code, treat tokens.css as the source of truth.

If the user invokes this skill without other guidance, ask what they want to build, then act as an expert designer for dense operational product UI — sentence case, no emoji, near-white surfaces, blue primary, stroke icons at 1.8px.
