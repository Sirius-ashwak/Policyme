# Design System Specification: Architectural Precision

## 1. Overview & Creative North Star: "The Digital Architect"
This design system rejects the "SaaS-in-a-box" aesthetic in favor of high-end, editorial precision. Our North Star is **The Digital Architect**: a philosophy where trust is built through structural integrity, intentional whitespace, and a deterministic layout. 

Unlike standard enterprise tools that clutter the screen with borders and "containers," this system uses **Tonal Depth** and **Asymmetric Balance**. We treat the screen as a physical workspace of layered, premium materials—think frosted glass, heavy-stock paper, and machined aluminum. Every element must feel "placed" with 100% intent, never "pasted."

---

## 2. Color Theory: Tonal Atmosphere
The palette is a sophisticated range of slates and cool grays, anchored by a singular, high-precision blue. 

### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders (`#outline`) for sectioning or layout containment. Structural boundaries must be defined solely through background shifts. For example, a `surface-container-low` section sitting on a `surface` background creates a clear but soft boundary that feels architectural rather than "boxed in."

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the `surface-container` tiers to create "nested" depth:
- **Base Layer:** `surface` (#faf9fe)
- **Primary Workspaces:** `surface-container-low` (#f4f3f8)
- **Interactive Cards/Elements:** `surface-container-lowest` (#ffffff)
- **Elevated Modals/Popovers:** `surface-container-highest` (#e3e2e7)

### The "Glass & Gradient" Rule
To achieve a premium "Apple-inspired" finish, use **Glassmorphism** for floating navigation and top-level headers. 
- **Recipe:** Apply a semi-transparent `surface` color (80% opacity) with a `backdrop-blur` of 20px. 
- **Signature Textures:** For primary CTAs, use a subtle linear gradient from `primary` (#0052d1) to `primary_container` (#156aff) at a 135-degree angle. This adds "soul" and a tactile, curved feel to flat surfaces.

---

## 3. Typography: The Editorial Voice
We use **Manrope** for its geometric clarity and **Inter** for high-density functional labels.

- **Display & Headlines (`display-lg` to `headline-sm`):** Manrope. Use these to command attention. Wide tracking (letter-spacing: -0.02em) on larger sizes creates a condensed, authoritative feel.
- **Body (`body-lg` to `body-sm`):** Manrope. High readability is paramount. Maintain a line-height of 1.5x for all body text to ensure "air" between lines.
- **Labels (`label-md` to `label-sm`):** Inter. Reserved for data points, table headers, and micro-copy. Its neutrality ensures it doesn't compete with the brand's editorial voice.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "cheap" for this system. We build depth through light and material.

- **The Layering Principle:** Stack `surface-container-lowest` cards on a `surface-container-low` background. This creates a natural "lift" without visual noise.
- **Ambient Shadows:** When an element must float (e.g., a dropdown), use an ultra-diffused shadow:
  - `box-shadow: 0 20px 40px rgba(26, 27, 31, 0.04), 0 10px 10px rgba(26, 27, 31, 0.02);`
  - *Note: Shadow color should be a tint of `on_surface`, never pure black.*
- **The "Ghost Border" Fallback:** If a boundary is strictly required for accessibility, use the `outline_variant` token at **15% opacity**. Pure 100% opaque borders are forbidden.

---

## 5. Components: Precision Primitives

### Buttons: The Tactile Strike
- **Primary:** Gradient-filled (`primary` to `primary_container`), `md` (0.75rem) rounded corners. Text is `on_primary`.
- **Secondary:** No background. `Ghost Border` (outline-variant at 20%) with `primary` text.
- **Interaction:** On hover, the primary button should shift slightly in depth via a 2% scale increase, rather than just changing color.

### High-Density Data Tables
- **Rule:** **Strictly no horizontal or vertical dividers.** 
- **Separation:** Use `spacing-2.5` (0.85rem) vertical padding and a subtle `surface-container-low` hover state on the entire row.
- **Typography:** Headers must be `label-sm` in `on_surface_variant`, all caps, with 0.05em tracking.

### Input Fields
- **State:** Default background is `surface-container-highest` at 40% opacity. 
- **Focus:** Transition to a `surface-container-lowest` background with a 1px `primary` "Ghost Border" (20% opacity). This creates a "glow" effect rather than a harsh line.

### Cards
- **Construction:** Use `surface-container-lowest` background. 
- **Padding:** Use `spacing-6` (2rem) as the standard internal padding to ensure the "Generous Whitespace" requirement.

---

## 6. Do’s and Don’ts

### Do
- **Use Asymmetry:** Place a large `display-md` headline off-center to create a premium, editorial layout.
- **Embrace White Space:** If you think there is enough space, add 20% more. Space is the luxury.
- **Precision Alignment:** All elements must snap to the Spacing Scale. If an element is 23px off, the "architectural" feel is lost.

### Don't
- **Don't use dividers:** Never use a `<hr>` or border to separate content. Use whitespace (`spacing-8` or `spacing-10`) or tonal shifts.
- **Don't use pure black:** Use `on_surface` (#1a1b1f) for text. Pure black is too harsh and breaks the "Apple-inspired" soft-minimalism.
- **Don't use sharp corners:** Every interactive element must use at least `DEFAULT` (0.5rem) or `md` (0.75rem) rounding. Sharp corners feel "industrial," not "architectural."

---

## 7. Spacing & Rhythm
Consistency is the bedrock of trust. Every margin, padding, and gap must be a multiple of the **Spacing Scale**. 

- **Section Gaps:** Use `spacing-16` (5.5rem) or `spacing-20` (7rem).
- **Component Internals:** Use `spacing-3` (1rem) or `spacing-4` (1.4rem).
- **Grid:** Use a 12-column grid with a wide `spacing-8` (2.75rem) gutter to allow the layout to breathe.