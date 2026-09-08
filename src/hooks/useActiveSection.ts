import { useEffect, useState } from 'react'
import { isPrerenderCapture } from '../lib/prerenderCapture'

export function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? '')

  useEffect(() => {
    // Whichever section happens to be in view at the moment of capture would
    // otherwise get baked in as the "active" nav link, which only matches a
    // fresh visitor's initial state (sectionIds[0]) by coincidence of scroll
    // position — pin to the initial value during capture instead of relying on that.
    if (isPrerenderCapture()) return

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 },
    )

    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sectionIds])

  return activeId
}
