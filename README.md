# Portfolio Website

Rushi Wagh's AWS DevOps consulting portfolio — React + TypeScript + Vite + React Three Fiber, deployed statically to GitHub Pages.

This is a rebuild of a static HTML/CSS/JS site (preserved for reference under [`legacy/`](legacy)) into a WebGL-driven experience, following the plan in `docs/`. See [`docs/content-parity-checklist.md`](docs/content-parity-checklist.md) for what's been ported so far and what's still pending.

## Development

```bash
npm install
npm run dev             # start the dev server
npm run build            # type-check + production build to dist/
npm run prerender        # after build: capture static HTML snapshots for SEO (writes into dist/)
npm run preview           # serve the built dist/ locally
npm run lint              # oxlint
npm run format             # prettier --write
npm run optimize-images    # convert assets/*.png to WebP (one-off, see scripts/optimize-images.mjs)
```

## Architecture notes

- **Content** lives in typed modules under `src/content/` — single source of truth, no content in JSX.
- **3D sections** lazy-load their scene and the `@react-three/fiber` runtime itself (see `src/three/SceneCanvasBoundary.tsx` / `SceneCanvasHost.tsx`) so a `fallback2d` visitor (no WebGL, `prefers-reduced-motion`, or a weak GPU) never downloads three.js at all. Render-mode resolution lives in `src/three/RenderModeProvider.tsx`.
- **Prerendering**: `scripts/prerender.mjs` drives a headless browser against the built `dist/` and writes real HTML back into `dist/<route>/index.html` for crawlers and no-JS visitors. Components with client-only/time-based first paint (preloader boot log, hero rotator, terminal simulation, 3D canvas mount) check `src/lib/prerenderCapture.ts`'s `isPrerenderCapture()` to freeze at their initial state during capture — see the comments on that function for why.
- **Deployment**: `.github/workflows/deploy.yml` builds, lints, prerenders, and publishes to GitHub Pages via `actions/deploy-pages` on push to `main`.
