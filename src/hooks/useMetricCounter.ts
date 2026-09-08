import { useEffect, type RefObject } from 'react'
import { isPrerenderCapture } from '../lib/prerenderCapture'

export function useMetricCounter(
  ref: RefObject<HTMLElement | null>,
  rawValue: string,
  reducedMotion: boolean,
) {
  useEffect(() => {
    const el = ref.current
    // A mid-count-up value captured mid-animation would mismatch every real
    // visitor's fresh first paint (which always starts at the raw JSX value).
    if (!el || reducedMotion || isPrerenderCapture()) return

    const match = rawValue.match(/^([\d.]+)(.*)$/)
    if (!match) return
    const target = parseFloat(match[1])
    const suffix = match[2]
    const isInteger = Number.isInteger(target)
    const duration = 1400

    let raf = 0
    const animate = () => {
      const start = performance.now()
      const frame = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        const current = target * eased
        el.textContent = `${isInteger ? Math.round(current) : current.toFixed(1)}${suffix}`
        if (progress < 1) {
          raf = requestAnimationFrame(frame)
        } else {
          el.textContent = rawValue
        }
      }
      raf = requestAnimationFrame(frame)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate()
          observer.unobserve(el)
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [ref, rawValue, reducedMotion])
}
