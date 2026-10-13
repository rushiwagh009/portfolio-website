import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { hero } from '@/content/hero'
import { siteMeta } from '@/content/siteMeta'
import { techStack } from '@/content/techStack'
import { Button } from '@/components/ui/Button'
import { InfiniteSlider } from '@/components/ui/InfiniteSlider'
import { HeroTerminal } from './HeroTerminal'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { isPrerenderCapture } from '@/lib/prerenderCapture'

// Layout from 21st.dev hero-section-5: copy over a rounded background-video
// frame (the header floats inside it at the top), then a "label | logos"
// marquee band. The video, marquee and terminal are approved exceptions to
// MASTER.md section 7; all stay still under reduced motion. Proof metrics
// and the terminal sample sit below the frame.

// Floating badges are presented as static proof metrics: the leading figure
// becomes the value, the remaining words (unchanged) become the label.
const badgeMetrics = hero.floatingBadges.map((b) => {
  const [value, ...rest] = b.title.split(' ')
  return { value, label: `${rest.join(' ')} ${b.desc}` }
})
const metrics = [...hero.metrics, ...badgeMetrics]

const shell = 'mx-auto w-full max-w-(--container) px-(--gutter)'
const iconButton =
  'inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border border-input text-foreground transition-colors duration-150 hover:bg-muted motion-reduce:hidden'

function Icon({ children, className = 'btn-icon' }: { children: ReactNode; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

function PlayPauseIcon({ paused }: { paused: boolean }) {
  return (
    <Icon className="size-5">
      {paused ? (
        <path d="M6 3l14 9-14 9V3z" />
      ) : (
        <>
          <rect x="14" y="4" width="4" height="16" rx="1" />
          <rect x="6" y="4" width="4" height="16" rx="1" />
        </>
      )}
    </Icon>
  )
}

export function Hero() {
  const [stackPaused, setStackPaused] = useState(false)
  const [frameInView, setFrameInView] = useState(true)
  const frameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  // Scroll-linked exit: as the frame scrolls away it shrinks toward the top and
  // fades. Motion values write to the DOM directly (no React re-render per
  // scroll), and at scroll 0 the values are identity, so prerendered markup
  // is unaffected.
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start start', 'end start'] })
  const frameScale = useTransform(scrollYProgress, [0, 1], [1, reducedMotion ? 1 : 0.92])
  const frameOpacity = useTransform(scrollYProgress, [0, 0.9], [1, reducedMotion ? 1 : 0.3])
  // Parallax depth: the video lags behind the page (drifts down within the
  // frame) and zooms in. It starts at 1.1 so the frame always has overscan to
  // hide the edges: at 1.35 the top margin is 17.5% of the height, more than
  // the 12% drift.
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', reducedMotion ? '0%' : '12%'])
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.1, reducedMotion ? 1.1 : 1.35])

  // Don't decode video nobody can see
  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setFrameInView(entry.isIntersecting))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // No autoplay attribute: playback starts here, so reduced-motion visitors
  // only ever see the poster frame (even before hydration).
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (reducedMotion || !frameInView || isPrerenderCapture()) video.pause()
    else video.play().catch(() => {})
  }, [reducedMotion, frameInView])

  return (
    <section id="hero" className="border-b border-border">
      <motion.div
        ref={frameRef}
        style={{ scale: frameScale, opacity: frameOpacity }}
        className="relative isolate origin-top"
      >
        <div
          aria-hidden="true"
          className="absolute inset-1 -z-10 overflow-hidden rounded-3xl border border-border lg:rounded-[3rem]"
        >
          <motion.video
            ref={videoRef}
            style={{ y: videoY, scale: videoScale }}
            src="/assets/hero-bg.mp4"
            poster="/assets/hero-bg-poster.webp"
            muted
            loop
            playsInline
            preload="metadata"
            className="size-full object-cover opacity-60 lg:opacity-75 in-data-[theme=light]:opacity-50 in-data-[theme=light]:invert lg:in-data-[theme=light]:opacity-50"
          />
          {/* Scrim keeps copy at AA contrast over the video's highlights */}
          <div className="absolute inset-0 bg-background/55" />
        </div>

        <div
          className={`${shell} pt-[calc(64px+var(--space-8))] pb-12 lg:pt-[calc(64px+var(--space-12))] lg:pb-16`}
        >
          <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
            <div className="flex flex-col items-start">
              <p className="inline-flex items-center gap-2 text-small text-foreground">
                <span className="size-2 rounded-full bg-success" aria-hidden="true"></span>
                Available for Freelance &amp; Consulting
              </p>

              <h1 className="mt-6 max-w-2xl text-display leading-[1.1] font-semibold tracking-[-0.02em] text-balance">
                {hero.headlineLines[0]}
                <br />
                {hero.headlineLines[1]}
                <br />
                {hero.headlineLines[2]}
              </h1>

              <p className="mt-6 max-w-[52ch] text-lead leading-[1.6] text-balance text-foreground">
                {hero.tagline}
              </p>

              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Specialisms">
                {hero.rotatorWords.map((word) => (
                  <li
                    key={word}
                    className="rounded-sm bg-muted px-3 py-1 text-small text-foreground"
                  >
                    {word}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
                <Button href="#contact" variant="primary">
                  <span className="text-nowrap">Hire Me</span>
                  <Icon>
                    <path d="m9 18 6-6-6-6" />
                  </Icon>
                </Button>
                <Button href="#projects" variant="outline" className="bg-background/60">
                  <span className="text-nowrap">View Projects</span>
                </Button>
                <Button
                  href={siteMeta.social.calendly}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  className="bg-background/60"
                >
                  <span className="text-nowrap">Book Consultation</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </Button>
              </div>
            </div>

            <div className="aspect-[4/5] w-full max-w-64 overflow-hidden rounded-lg border border-border bg-card lg:max-w-80 lg:justify-self-end">
              <img
                src={hero.profileImage}
                alt={hero.profileAlt}
                width={320}
                height={400}
                className="size-full object-cover object-[center_40%]"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div
        className={`${shell} grid grid-cols-[minmax(0,1fr)] gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_42rem] lg:gap-16`}
      >
        <dl className="grid w-full grid-cols-2 content-start gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-2">
          {metrics.map((m) => (
            <div className="flex flex-col-reverse justify-end gap-1" key={m.label}>
              <dt className="text-small text-muted-foreground">{m.label}</dt>
              <dd className="text-[2rem] leading-[1.1] font-semibold tracking-[-0.01em] text-accent">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>

        <HeroTerminal />
      </div>

      <div className="border-t border-border bg-card">
        <div className={`${shell} flex flex-col gap-4 py-6 md:flex-row md:items-center md:gap-6`}>
          <div className="flex items-center justify-between gap-4 md:contents">
            <p
              id="hero-stack-label"
              className="text-label font-medium tracking-[0.08em] text-muted-foreground uppercase md:max-w-44 md:shrink-0 md:border-r md:border-border md:pr-6"
            >
              Core technology stack
            </p>
            <button
              type="button"
              onClick={() => setStackPaused((p) => !p)}
              aria-label={
                stackPaused ? 'Play technology stack animation' : 'Pause technology stack animation'
              }
              className={`${iconButton} bg-transparent md:order-last`}
            >
              <PlayPauseIcon paused={stackPaused} />
            </button>
          </div>

          <InfiniteSlider
            gap={8}
            duration={45}
            durationOnHover={90}
            paused={stackPaused}
            className="min-w-0 flex-1 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] motion-reduce:[mask-image:none]"
          >
            <ul className="flex gap-2 motion-reduce:flex-wrap" aria-labelledby="hero-stack-label">
              {techStack.map((chip) => (
                <li
                  key={chip.name}
                  className="inline-flex items-center gap-2 rounded-sm border border-border bg-background px-3 py-2 text-small font-medium whitespace-nowrap text-foreground"
                >
                  {/* Decorative: the visible name is the accessible label */}
                  <img
                    src={chip.logo}
                    alt=""
                    width={20}
                    height={20}
                    className="size-5 shrink-0 object-contain"
                  />
                  {chip.name}
                </li>
              ))}
            </ul>
          </InfiniteSlider>
        </div>
      </div>
    </section>
  )
}
