import { useEffect, useState, type RefObject } from 'react'
import { isPrerenderCapture } from '../lib/prerenderCapture'

/** One-shot: becomes true once the given section is ~10% visible, then stays
 * true. Unlike useReveal (which tracks each element independently), this
 * gates on a single container — matching the legacy site's skill-bar
 * behavior, where every bar in the Skills section fills together the moment
 * the section comes into view, rather than each bar animating independently
 * as it individually crosses the viewport threshold. */
export function useSectionReveal(ref: RefObject<HTMLElement | null>): boolean {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || isPrerenderCapture()) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return revealed
}
