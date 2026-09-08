import { useEffect, useRef, useState } from 'react'

/** Tracks in/out of view continuously (not one-shot) so off-screen 3D scenes can
 * unmount and free their WebGL context — browsers cap concurrent contexts, and
 * this is a multi-section 3D site. rootMargin mounts slightly before entering
 * the viewport so there's no visible pop-in. */
export function useInViewCanvas<T extends HTMLElement>(rootMargin = '200px 0px') {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      root: null,
      rootMargin,
      threshold: 0,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  return { ref, inView }
}
