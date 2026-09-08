# Content Parity Checklist

Tracks every atomic content item from the legacy static site (preserved in `legacy/`) against its status in the React rebuild. Checked off with a literal text diff at the M6 gate, not a visual "looks right" pass.

Legend: ✅ ported · ⏳ not yet built (future milestone) · ⚠️ pending client input (placeholder shipped, grep for `NEEDS CLIENT INPUT`)

## Hero (M1)

- ✅ Headline "Rushi Wagh / AWS DevOps / Engineer", tagline
- ✅ Rotating specialty line (5 phrases)
- ✅ 4 trust metrics (2+, 28%, 7+, 4x)
- ✅ 3 CTAs (Hire Me, View Projects, Book Consultation)
- ⚠️ Calendly link — placeholder, pending real link (`src/content/siteMeta.ts`)
- ✅ Profile photo + 2 floating badges (99.9% Uptime, 40% Cost Saved)
- ✅ Terminal widget (3 cycling command/output blocks)
- ✅ First 3D scene (Hero backdrop) — built through the full render-mode/lazy-load/accessibility pipeline

## Tech stack marquee (M1)

- ✅ 13 looped logo chips

## About (M1)

- ✅ 2 bio paragraphs (verbatim)
- ⚠️ Guinness World Record — badge/title ported, one-line context is a placeholder pending real record detail (`src/content/about.ts`)
- ✅ 6 "Why Work With Me" differentiator cards
- ✅ 7-fact Consultant Overview pills card

## Services — 12 items (M3)

- ⏳ Not yet built

## Case Studies — 5 projects (M2)

- ✅ Category filter tabs (All/Kubernetes-EKS/FinOps/DevSecOps/Observability/CTF), state-driven, matches legacy `.hidden` toggle behavior
- ✅ Featured EKS project: problem/solution, achievements, tech tags, 4 metrics, GitHub-private badge
- ✅ EKS interactive 3D diorama (Overview/AZ-1/AZ-2/AZ-3/Load Balancer/Observability), DOM-drives-3D-state pattern — real buttons + description panel own the state, 3D scene only visualizes it, fully functional with zero 3D (fallback2d/no-JS)
- ✅ Architecture diagram image wired to the lightbox, confirming the extensionless-webp bug fix actually renders (previously broken, now shows correctly)
- ✅ Other 4 case studies (FinOps, DevSecOps w/ pipeline flow, Observability, CTFd) as 2D cards

## Technical Expertise — 18 skill bars + 86-tag directory (M3)

- ⏳ Not yet built
- ⚠️ 6 of 18 skill percentages are currently maxed at 100% in the legacy data — recalibrated values are pending client input; ships against placeholder data until provided

## Professional Experience (M4)

- ⏳ Not yet built
- Decision: restore the previously-commented-out "Cloud Infrastructure Engineer" role (Jan 2024–Apr 2025) into the timeline, per user confirmation

## Certifications — 4x AWS (M4)

- ⏳ Not yet built

## Technical Blog — index.html section + blog.html/blogs/terraform (M2)

- ⏳ Not yet built — migrating to MDX with real `/blog/*` routes

## Speaking & Workshops (M4)

- ⏳ Not yet built

## Testimonials (M5)

- Decision: build the section shell, keep it hidden/unpublished (`isPublished:false`) — no fabricated quotes

## Contact (M5)

- ⏳ Not yet built
- Decision: stays simulated (validates, shows success, doesn't send) — no Lambda wiring in this build
- Budget tiers to convert from INR-only to USD/dual-currency

## Footer + floating chrome (M1)

- ✅ Footer (logo, nav links, copyright, signature)
- ✅ WhatsApp float button
- ✅ Back-to-top button
- ✅ Scroll progress bar
- ✅ Lightbox modal shell (wired to real images starting M2)
- ✅ Preloader boot animation (+ `<noscript>` fallback so JS-disabled visitors aren't stuck behind it)
- ✅ Theme toggle (dark/light, persisted)
- ✅ Mobile nav menu

## Known bugs fixed in M0

- ✅ `3tier-arch-web` → `assets/3tier-arch.webp` (proper extension)
- ✅ All space-containing asset filenames renamed to kebab-case
- ✅ `terraform-chapter1.png.png` / `terraform-chapter-2.png.png` double extensions fixed
- ✅ OG/meta/JSON-LD updated from `rushiwagh.dev` to `rushiwagh.com`, `CNAME` added
- ✅ Unreferenced duplicate `rushi-profile.png` (1.4MB) removed
- ✅ All raster assets converted PNG→WebP (biggest win: hero profile photo 1552KB → 45KB)
- ⏳ INR-only budget tiers → USD/dual-currency (M5, content-only change)
- ⚠️ Calendly bare-homepage link (M1, placeholder shipped pending real link)

## Known non-blocking follow-up

- A React hydration-mismatch warning (error #418) still surfaces in production preview against the prerendered homepage despite fixing every identified non-deterministic source (preloader boot log, 3D canvas mount timing, hero rotator, terminal simulation, metric counters, scroll-reveal classes, active-nav-section). Content renders correctly post-hydration either way (React's hydration recovery re-renders the affected subtree client-side), so this is not a functional break — but it should be tracked down properly during M2's "harden prerendering to all 7 routes" work rather than left permanently.
