import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** React Router's client-side navigation doesn't trigger the browser's native
 * hash-scroll (that only fires on a real page load) — so a <Link to="/#blog">
 * from another route would otherwise land on Home without scrolling to it. */
export function useScrollToHash() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(hash.slice(1))
    el?.scrollIntoView()
  }, [hash])
}
