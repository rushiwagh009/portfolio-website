const QUERY_PARAM = '__prerender'

/** True only inside the specific capture session scripts/prerender.mjs drives
 * (it navigates with a ?__prerender=1 marker) — deliberately NOT a generic
 * navigator.webdriver check, since that would also match Lighthouse CI/e2e/
 * accessibility test runs and freeze the preloader for them too.
 *
 * Components with client-only, time-based first paint (the preloader's boot
 * log, the 3D canvas's async render-mode/in-view resolution) must skip that
 * behavior during capture so the snapshot written to disk matches what a real
 * visitor's hydration first-pass expects — otherwise the captured markup
 * (frozen at whatever moment capture happened) permanently mismatches every
 * fresh hydration afterwards. */
export function isPrerenderCapture(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get(QUERY_PARAM) === '1'
}
