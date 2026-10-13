import { useEffect, useRef, useState, type ReactNode } from 'react'
import { animate, motion, useMotionValue, type AnimationPlaybackControls } from 'motion/react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { isPrerenderCapture } from '@/lib/prerenderCapture'

// Port of ibelick/infinite-slider (21st.dev) to `motion/react`. Changes from
// the original:
// - `paused` prop so callers can offer a pause control (WCAG 2.2.2).
// - Never animates under prefers-reduced-motion or during prerender capture;
//   the duplicate copy is hidden by CSS (motion-reduce:) rather than by a
//   render branch, so prerendered markup always matches hydration.
// - The duplicate is aria-hidden and inert, so screen readers and keyboard
//   users meet the content once.
// - ResizeObserver instead of the react-use-measure dependency.
// - Hover transition duration measured against one loop (see below).

type InfiniteSliderProps = {
  children: ReactNode
  gap?: number
  /** Seconds for one full loop */
  duration?: number
  /** Seconds for one full loop while hovered (larger = slower) */
  durationOnHover?: number
  direction?: 'horizontal' | 'vertical'
  reverse?: boolean
  paused?: boolean
  className?: string
}

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = 'horizontal',
  reverse = false,
  paused = false,
  className,
}: InfiniteSliderProps) {
  const [currentDuration, setCurrentDuration] = useState(duration)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [key, setKey] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<AnimationPlaybackControls | null>(null)
  const pausedRef = useRef(paused)
  const translation = useMotionValue(0)
  const reducedMotion = usePrefersReducedMotion()
  const isStatic = reducedMotion || isPrerenderCapture()

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const observer = new ResizeObserver(() =>
      setSize({ width: el.offsetWidth, height: el.offsetHeight }),
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const trackSize = direction === 'horizontal' ? size.width : size.height
    if (isStatic || trackSize === 0) {
      translation.set(0)
      return
    }

    const contentSize = trackSize + gap
    const from = reverse ? -contentSize / 2 : 0
    const to = reverse ? 0 : -contentSize / 2

    const controls = isTransitioning
      ? animate(translation, [translation.get(), to], {
          ease: 'linear',
          // One loop travels contentSize / 2; the original divided by the full
          // contentSize, so hover only reached half the requested slowdown.
          duration: currentDuration * Math.abs((translation.get() - to) / (contentSize / 2)),
          onComplete: () => {
            setIsTransitioning(false)
            setKey((k) => k + 1)
          },
        })
      : animate(translation, [from, to], {
          ease: 'linear',
          duration: currentDuration,
          repeat: Infinity,
          repeatType: 'loop',
          repeatDelay: 0,
          onRepeat: () => translation.set(from),
        })

    controlsRef.current = controls
    if (pausedRef.current) controls.pause()
    return () => controls.stop()
  }, [key, translation, currentDuration, size, gap, isTransitioning, direction, reverse, isStatic])

  useEffect(() => {
    pausedRef.current = paused
    if (paused) controlsRef.current?.pause()
    else controlsRef.current?.play()
  }, [paused])

  const hoverProps =
    durationOnHover && !paused && !isStatic
      ? {
          onHoverStart: () => {
            setIsTransitioning(true)
            setCurrentDuration(durationOnHover)
          },
          onHoverEnd: () => {
            setIsTransitioning(true)
            setCurrentDuration(duration)
          },
        }
      : {}

  return (
    <div className={cn('overflow-hidden', className)}>
      <motion.div
        ref={trackRef}
        className="flex w-max motion-reduce:w-auto"
        style={{
          ...(direction === 'horizontal' ? { x: translation } : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
        }}
        {...hoverProps}
      >
        {children}
        <div aria-hidden="true" inert className="flex motion-reduce:hidden">
          {children}
        </div>
      </motion.div>
    </div>
  )
}
