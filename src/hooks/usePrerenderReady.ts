import { useEffect } from 'react'

/** Signals scripts/prerender.mjs that critical content has mounted and it's
 * safe to capture outerHTML for the static route. */
export function usePrerenderReady() {
  useEffect(() => {
    document.documentElement.setAttribute('data-prerender-ready', 'true')
  }, [])
}
