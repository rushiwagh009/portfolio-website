import { useEffect, useRef, useState } from 'react'
import { hero } from '@/content/hero'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { isPrerenderCapture } from '@/lib/prerenderCapture'

const commands = hero.terminalCommands
const TYPE_MS = 45
const OUTPUT_DELAY_MS = 350
const HOLD_MS = 3500

function Prompt() {
  return (
    <>
      <span className="text-success">rushi@aws-console</span>:<span className="text-accent">~</span>
      ${' '}
    </>
  )
}

// Cycles through the real sample commands: types each one, then prints its
// output. First render is the first command, complete, so prerendered markup
// and hydration agree. Holds still under reduced motion, off-screen, and while
// hovered (so it can be read). Every command is also stacked invisibly in the
// same grid cell, so the panel is sized for the longest output and never jumps.
export function HeroTerminal() {
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState(commands[0].input.length)
  const [showOutput, setShowOutput] = useState(true)
  const [inView, setInView] = useState(false)
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const active = inView && !hovered && !reducedMotion && !isPrerenderCapture()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!active) return
    const command = commands[index]
    const timer =
      typed < command.input.length
        ? setTimeout(() => setTyped(typed + 1), TYPE_MS)
        : !showOutput
          ? setTimeout(() => setShowOutput(true), OUTPUT_DELAY_MS)
          : setTimeout(() => {
              setIndex((index + 1) % commands.length)
              setTyped(0)
              setShowOutput(false)
            }, HOLD_MS)
    return () => clearTimeout(timer)
  }, [active, index, typed, showOutput])

  const current = commands[index]
  const typing = typed < current.input.length

  return (
    <figure
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full overflow-hidden rounded-md border border-border bg-card"
    >
      <div className="flex items-center gap-2 border-b border-border bg-muted px-4 py-3">
        <span className="size-2.5 rounded-full bg-input" aria-hidden="true"></span>
        <span className="size-2.5 rounded-full bg-input" aria-hidden="true"></span>
        <span className="size-2.5 rounded-full bg-input" aria-hidden="true"></span>
        <figcaption className="ml-2 font-mono text-label text-muted-foreground">
          rushi@aws-console:~
          <span className="sr-only">
            {' '}
            — sample session: {commands.map((c) => c.input).join(', ')}
          </span>
        </figcaption>
      </div>
      {/* Real code, so mono is allowed here */}
      <div
        aria-hidden="true"
        className="grid overflow-x-auto p-4 font-mono text-label leading-[1.6] text-foreground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {commands.map((c) => (
          <div key={c.input} className="invisible col-start-1 row-start-1">
            <p className="whitespace-pre">
              <Prompt />
              {c.input}
            </p>
            <pre className="mt-2 font-mono whitespace-pre">{c.output}</pre>
          </div>
        ))}
        <div className="col-start-1 row-start-1">
          <p className="whitespace-pre">
            <Prompt />
            {current.input.slice(0, typed)}
            {(typing || !showOutput) && (
              <span className="ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.15em] bg-foreground" />
            )}
          </p>
          {showOutput && (
            <pre className="mt-2 font-mono whitespace-pre text-muted-foreground">
              {current.output}
            </pre>
          )}
        </div>
      </div>
    </figure>
  )
}
