import { useEffect, useRef, useState } from 'react'
import { isPrerenderCapture } from '../../lib/prerenderCapture'

const LOGS: { text: string; type: 'info' | 'success' }[] = [
  { text: 'Initializing local portfolio agent bootloader...', type: 'info' },
  { text: 'Loading core system dependencies...', type: 'info' },
  {
    text: 'Checking tools: terraform (v1.8.4), kubectl (v1.29.2), aws-cli (v2.15.22)',
    type: 'success',
  },
  { text: 'Initiating connection to AWS Pune Region (ap-south-1)...', type: 'info' },
  { text: "Scanning state: EKS cluster 'rushi-wagh-prod' is ACTIVE", type: 'success' },
  { text: 'AWS Cost Explorer: 28% optimization potential validated', type: 'success' },
  { text: 'All certificates, research papers, and keys loaded.', type: 'success' },
  { text: 'System boot COMPLETE. Launching developer portal...', type: 'info' },
]

export function Preloader() {
  const outputRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    // Skip the animated boot log entirely during prerender capture — leaving
    // just the JSX-authored seed line, so the snapshot written to disk matches
    // every real visitor's own fresh (pre-timer) first paint exactly.
    if (isPrerenderCapture()) return

    let currentLog = 0
    const timeouts: ReturnType<typeof setTimeout>[] = []

    const printLog = () => {
      const output = outputRef.current
      if (currentLog < LOGS.length && output) {
        const log = LOGS[currentLog]
        const p = document.createElement('p')
        p.innerHTML =
          log.type === 'success'
            ? `<span class="text-success">[OK]</span> ${log.text}`
            : `<span class="text-accent">[INFO]</span> ${log.text}`
        output.appendChild(p)
        output.scrollTop = output.scrollHeight
        currentLog++
        timeouts.push(setTimeout(printLog, 180 + Math.random() * 80))
      } else {
        timeouts.push(
          setTimeout(() => {
            setFading(true)
            timeouts.push(setTimeout(() => setVisible(false), 500))
          }, 500),
        )
      }
    }

    timeouts.push(setTimeout(printLog, 200))
    return () => timeouts.forEach(clearTimeout)
  }, [])

  if (!visible) return null

  return (
    <div
      id="preloader"
      className="preloader"
      style={fading ? { opacity: 0, transition: 'opacity 0.5s ease' } : undefined}
    >
      <div className="loader-terminal">
        <div className="terminal-header">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
          <span className="terminal-title">rushi-wagh-init.sh</span>
        </div>
        <div className="terminal-body" ref={outputRef}>
          <p className="text-accent">$ ./bootstrap_portfolio.sh</p>
        </div>
      </div>
    </div>
  )
}
