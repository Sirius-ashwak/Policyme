# Design System Specification: The Deterministic Monolith

## 1. Overview & Creative North Star: "The Architectural Sentinel"
This design system is built to convey absolute certainty in an industry defined by risk. Our Creative North Star is **The Architectural Sentinel**—a visual language that feels as grounded as a marble lobby but as precise as a Swiss timepiece. 

We break the "SaaS Template" look by rejecting generic card-and-border layouts. Instead, we use **intentional asymmetry** and **tonal layering**. Elements don't just sit on a grid; they are carved out of the interface through sophisticated color shifts. The experience must feel editorial, quiet, and authoritative, favoring "breathing room" over clutter, and "depth" over decoration.

---

## 2. Color Theory & Surface Strategy
Our palette is anchored in deep, ink-like navies and punctuated by surgical strikes of Emerald and Purple. 

### The "No-Line" Rule
**Standard 1px solid borders are strictly prohibited for sectioning.** To define boundaries, designers must use background color shifts.
- Use `surface` (#f9f9ff) for the global canvas.
- Use `surface_container_low` (#f1f3ff) for large structural sidebars or secondary regions.
- Use `surface_container_lowest` (#ffffff) for the primary content "stage."
This creates a seamless, high-end feel where the UI is defined by light and shadow rather than wireframes.

### Surface Hierarchy & Glassmorphism
*   **The Layering Principle:** Treat the UI as a series of physical layers. A `surface_container_highest` (#d7e2ff) element should only exist to draw immediate, high-priority focus.
*   **The Glass Rule:** For "AI Review" or "Intelligence" overlays, use a semi-transparent `tertiary_container` (#380081) with a `20px` backdrop-blur. This suggests a "lens" through which the AI is viewing the data.
*   **Signature Textures:** For primary CTAs, use a subtle linear gradient from `primary` (#031632) to `primary_container` (#1A2B48) at a 135-degree angle. This adds a "weighted" professional polish.

---

## 3. Typography: The Editorial Balance
We utilize a dual-typeface system to balance high-end sophistication with data-heavy utility.

*   **Display & Headlines (Manrope):** Use `display-lg` through `headline-sm` for high-level summaries and navigation. Manrope’s geometric but warm curves provide the "Editorial" feel. Use `on_surface` (#081b38) with a `-0.02em` letter-spacing for a tighter, more authoritative presence.
*   **Body & Data (Inter):** Use `body-md` and `label-md` for all insurance forms and data tables. Inter’s high x-height ensures legibility in high-density environments.
*   **Visual Hierarchy:** Titles should be significantly larger than body text (e.g., using `display-md` next to `body-md`) to create a clear "Entry Point" for the eye, breaking the monotony of enterprise data.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "noisy" for this system. We use **Ambient Depth**.

*   **Ambient Shadows:** If a floating element (like a modal) is required, use a shadow with a `40px` blur and `4%` opacity. The shadow color must be `on_surface` (#081b38), never pure black, to ensure it feels like a natural part of the Navy environment.
*   **The Ghost Border Fallback:** If a border is required for accessibility in forms, use `outline_variant` (#c5c6ce) at **20% opacity**. It should be felt, not seen.
*   **Depth through Stacking:** Place a `surface_container_lowest` card on top of a `surface_container_low` background. Use `roundedness.md` (0.375rem) to maintain a crisp, professional edge.

---

## 5. Components

### AI Insight Cards
These are the signature elements of the platform.
- **Background:** `surface_container_highest` (#d7e2ff) with a `tertiary` (#1f004e) left-accent bar (4px wide).
- **Content:** Use `title-sm` for the insight heading and `body-sm` for the supporting data.
- **Glass Effect:** Apply a subtle `tertiary_fixed_dim` glow to the "AI" icon to signify active processing.

### High-Density Data Tables
- **Grid:** No horizontal or vertical lines. Use `spacing.2` (0.4rem) for row padding.
- **Separation:** Use `surface_container_low` for the header row and a simple background shift on `hover` to `surface_container_high`.
- **Status Badges:** Use `secondary_container` (#6cf8bb) with `on_secondary_container` (#00714d) for "Approved." Use `tertiary_container` (#380081) with `on_tertiary_container` (#a579ff) for "AI Review."

### Primary Buttons
- **Style:** Solid `primary` (#031632) background.
- **Type:** `label-md` in all-caps with `0.05em` letter-spacing.
- **Rounding:** `roundedness.md` (0.375rem).
- **Interaction:** On hover, transition to `primary_container`.

### Input Fields
- **Default:** `surface_container_lowest` background with a `ghost border` (outline-variant @ 20%).
- **Focus:** Transition the border to `primary` and add a 2px outer glow using `primary_fixed` at 30% opacity.

---

## 6. Do's and Don'ts

### Do:
*   **Use Vertical White Space:** Use `spacing.10` or `spacing.12` to separate major content blocks instead of lines.
*   **Align to a Rigid Grid:** While layouts are asymmetrical, every element must align to the `spacing` scale to maintain a "deterministic" feel.
*   **Embrace the Dark:** Use `primary_container` (#1A2B48) for large dashboard areas to reduce eye strain and increase the "high-trust" executive feel.

### Don't:
*   **Don't use 100% Opaque Outlines:** This shatters the "Architectural" feel and makes the UI look like a legacy application.
*   **Don't use Playful Icons:** Avoid rounded, "bubbly" iconography. Use sharp, thin-stroke (1.5px) icons that match the `outline` token.
*   **Don't Over-Animate:** Transitions should be fast (200ms) and linear-out. We are building a tool for efficiency, not a playground.