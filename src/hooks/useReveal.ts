import { useEffect, type RefObject } from 'react'
import { isPrerenderCapture } from '../lib/prerenderCapture'

/** Imperatively toggles reveal-hidden -> reveal-visible on the given node, one-shot,
 * mirroring the legacy site's scroll-reveal IntersectionObserver exactly (including
 * the CSS-driven nth-child stagger, which depends on these being the literal classes
 * on the card/section-header/timeline-item element, not a wrapper). */
export function useReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    // Neither class exists in the JSX-rendered markup — adding either one here
    // during prerender capture would bake a `class` attribute into the static
    // file that mismatches every real visitor's fresh (pre-effect) first paint.
    // Skipping entirely also means the static/no-JS fallback shows content at
    // full opacity immediately, which is the correct fallback behavior anyway.
    if (!el || isPrerenderCapture()) return
    el.classList.add('reveal-hidden')

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('reveal-visible')
          observer.unobserve(el)
        }
      },
      { root: null, rootMargin: '0px 0px -100px 0px', threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
}
