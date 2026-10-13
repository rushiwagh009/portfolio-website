# Design System Master File — Rushi Wagh Portfolio

> Single source of truth. If any skill or generated output disagrees, **this file wins**.
> Page overrides: `design-system/portfolio/pages/[page].md` (none yet).

**Project:** portfolio · **Category:** B2B consulting (AWS / Kubernetes / Terraform / security)
**Pattern:** Trust & Authority + Conversion — proof (metrics, certs, case studies) before pitch, one clear CTA path.
**Reconciliation note:** the ui-ux-pro-max output (light-first, EB Garamond/Lato, navy) was rejected on palette and type.
Kept from it: shadcn-style semantic token names (so 21st.dev components drop in later), AA contrast rules, 44px targets,
visible focus, reduced motion, SVG icons only, 150–300ms transitions, breakpoints 375/768/1024/1440.

---

## 1. Principles
1. Dark-first, charcoal. Light theme is secondary and must pass the same contrast rules.
2. One accent (cyan). Used only for: links, primary CTA, key metrics, focus ring. Never for decoration.
3. Typography carries the design. Two families: **Inter** (all UI/prose) and **Fira Code** (real code, terminal labels, version strings only).
4. Left-aligned by default. Centre only the short closing CTA.
5. Borders and surface steps for depth. No glows, no gradients, no glass.

## 2. Colour tokens (shadcn-compatible names)

### Dark (default)
| Token | Hex | Role | Contrast |
|---|---|---|---|
| `--background` | `#0D1117` | page | — |
| `--card` | `#151B23` | cards, header | — |
| `--muted` | `#1C242E` | inset / hover surface | — |
| `--foreground` | `#E6EAF0` | body, headings | 15.67:1 on bg, 14.34:1 on card |
| `--muted-foreground` | `#9AA7B5` | secondary text | 7.72:1 bg, 7.06:1 card, 6.39:1 muted |
| `--primary` | `#06B6D4` | primary button fill | — |
| `--primary-foreground` | `#04161B` | text on primary | 7.62:1 |
| `--accent` (text) | `#22D3EE` | links, metrics | 10.47:1 bg, 9.58:1 card |
| `--border` | `#2A3441` | card/divider (decorative) | 1.5:1 (decorative only) |
| `--input` | `#6B7788` | form-field border | ≥3:1 (WCAG 1.4.11) |
| `--ring` | `#22D3EE` | focus ring, 2px + 2px offset | 10.47:1 |
| `--destructive` | `#F87171` | errors | 6.84:1 |
| `--success` | `#4ADE80` | success states | 10.86:1 |

### Light (secondary)
| Token | Hex | Contrast |
|---|---|---|
| `--background` / `--card` | `#F8FAFC` / `#FFFFFF` | — |
| `--foreground` | `#0F172A` | 17.06:1 |
| `--muted-foreground` | `#475569` | 7.24:1 |
| `--primary` / `--primary-foreground` | `#0E7490` / `#FFFFFF` | 5.36:1 |
| `--accent` (text) | `#0E7490` | 5.12:1 |
| `--border` | `#CBD5E1` | decorative |

Legacy tokens (`--bg-primary`, `--text-muted`, …) stay as aliases in Phase 2 and are removed section by section in Phase 3.
Banned: purple/pink, any gradient on text or surfaces, rgba cyan borders.

## 3. Typography
| Role | Family | Size / line | Weight | Tracking |
|---|---|---|---|---|
| Display (hero h1) | Inter | `clamp(2.5rem, 5vw, 3.75rem)` / 1.1 | 600 | -0.02em |
| H2 (section) | Inter | `clamp(1.75rem, 3vw, 2.25rem)` / 1.2 | 600 | -0.01em |
| H3 (card) | Inter | 1.25rem / 1.3 | 600 | 0 |
| H4 | Inter | 1rem / 1.4 | 600 | 0 |
| Body | Inter | 1rem / 1.65 | 400 | 0 |
| Body large (lead) | Inter | 1.125rem / 1.6 | 400 | 0 |
| Small / meta | Inter | 0.875rem / 1.5 | 400–500 | 0 |
| Label (eyebrow) | Inter | 0.75rem / 1.4, uppercase | 500 | 0.08em |
| Code / terminal | Fira Code | 0.875rem / 1.6 | 400 | 0 |
- Max prose width 68ch. Body never below 16px. Eyebrows are Inter, **not** mono, and drop the `01 // …` numbering.
- Weights loaded: Inter 400/500/600; Fira Code 400. Remove 700/800 requests.

## 4. Spacing (8px scale)
`--space-1` 4 · `2` 8 · `3` 12 · `4` 16 · `6` 24 · `8` 32 · `12` 48 · `16` 64 · `24` 96 · `32` 128
- Section vertical padding: **96px desktop (≥1024), 72px tablet, 56px mobile**. Same on every section.
- Container: max-width 1200px, side gutter 24px (16px under 480px).
- Grid: 12-col desktop, 2-col tablet, 1-col mobile; gap 24px. Cards in a row share equal height (`align-items: stretch`).

## 5. Radius and shadow
- Radius: `--radius-sm` 4px (inputs, chips), `--radius-md` 8px (buttons, cards), `--radius-lg` 12px (large panels). No pills except status chips.
- Shadow: none on cards (border + surface step). One overlay shadow only for menus/toasts: `0 8px 24px rgb(0 0 0 / 0.4)`.

## 6. Components
- **Button primary:** `--primary` fill, `--primary-foreground` text, 44px min height, 8px radius, 600 weight. Hover: lighten via `#22D3EE`, no transform. One primary per viewport.
- **Button secondary:** transparent, 1px `--input` border, foreground text. Hover: `--muted` fill.
- **Link:** `--accent`, underline on hover/focus.
- **Card:** `--card` fill, 1px `--border`, 8px radius, 24px padding, no hover lift. Hover (only if clickable): border → `--input`.
- **Field:** 44px height, `--background` fill, 1px `--input` border, label above (never placeholder-only), error text `--destructive` + icon, `aria-describedby`.
- **Icons:** inline SVG, 20px, 1.5px stroke, `currentColor` (Lucide-style). No emoji, no icon fonts.
- **Chips/tags:** 4px radius, `--muted` fill, 0.75rem Inter.
- **Floating chrome:** only the header and one back-to-top. WhatsApp becomes a normal Contact-section link.

## 7. Motion
- Duration 150–250ms, easing `cubic-bezier(0.16, 1, 0.3, 1)`. Properties: `opacity`, `transform: translateY(≤8px)` only.
- Section reveal: once, 200ms, 8px translate. Never leave content invisible waiting on JS (content must be readable if the observer fails).
- One animated element per viewport. No infinite loops (blobs, marquee, pulse, spin, blinking cursor, floating badges).
- **Approved exception (2026-10-08, owner decision):** the hero technology-stack marquee. Real stack logos only
  (`content/techStack.ts`), visible pause/play control, slows on hover, static wrapped row under reduced motion. No other loops.
- **Approved exception (2026-10-08, owner decision):** the hero background video in a rounded frame (21st.dev hero-section-5),
  with a token scrim for AA text contrast, offscreen pause, and the poster only under reduced motion (no pause button, by
  owner request). The hero terminal types through the sample commands; it holds on hover, off-screen and under reduced motion.
  The header floats transparently inside that frame at the top of the home page and is solid (section 8) once scrolled.
- `prefers-reduced-motion: reduce` → all transitions/animations off; 3D diorama renders a static frame.
- 3D: only the EKS diorama stays; lazy-mounted when in view.

## 8. Layout and accessibility
- Breakpoints: 480 · 768 · 1024 · 1440. Check 375/768/1024/1440.
- Focus: 2px `--ring` outline, 2px offset, on every interactive element. Skip link to `#main`.
- Touch targets ≥ 44×44px. Text contrast ≥ 4.5:1, UI components ≥ 3:1.
- Header: 64px, solid `--background` with 1px bottom border (no blur).
- Section header: eyebrow label + H2 + optional lead, left-aligned, 48px below.

## 9. Anti-patterns (remove on sight)
Emoji as icons · gradient text · glows · glassmorphism · blobs/particles · looping typing effects · percentage skill bars ·
centred-everything · purple/pink · mono for non-code · fake boot/preloader text · floating metric badges · more than one primary CTA per view.

## 10. Pre-delivery checklist
- [ ] No emoji icons (SVG only) · [ ] `cursor: pointer` on clickable · [ ] hover 150–250ms · [ ] contrast AA both themes
- [ ] visible focus · [ ] reduced-motion respected · [ ] 375/768/1024/1440 no horizontal scroll · [ ] build passes, console clean
- [ ] routes, anchors (#about … #contact), form, meta tags, prerender intact · [ ] content unchanged (diff content/*.ts text only)

## 11. 21st.dev readiness (next stage)
Token names above match shadcn (`--background`, `--primary`, `--ring`, `--radius`). When donors arrive: add Tailwind v4,
`@/` alias, `components.json`, `cn()`; map `@theme` to these variables. No visual re-theming required.
