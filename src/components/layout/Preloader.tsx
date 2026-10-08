import { useEffect, useState } from 'react'
import { isPrerenderCapture } from '../../lib/prerenderCapture'

const HOLD_MS = 400

export function Preloader() {
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    // Prerender capture keeps the first-paint markup static so the snapshot
    // written to disk matches every real visitor's pre-timer first paint.
    if (isPrerenderCapture()) return

    const timeouts: ReturnType<typeof setTimeout>[] = []
    timeouts.push(
      setTimeout(() => {
        setFading(true)
        timeouts.push(setTimeout(() => setVisible(false), 250))
      }, HOLD_MS),
    )
    return () => timeouts.forEach(clearTimeout)
  }, [])

  if (!visible) return null

  return (
    <div id="preloader" className={`preloader${fading ? ' is-fading' : ''}`} aria-hidden="true">
      <span className="logo">
        RW<span className="text-accent">.</span>
      </span>
    </div>
  )
}
