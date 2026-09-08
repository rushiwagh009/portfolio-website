import { useRef } from 'react'
import { useReveal } from '../../hooks/useReveal'

export function SectionHeader({ label, title }: { label: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref)

  return (
    <div ref={ref} className="section-header">
      <span className="section-label">{label}</span>
      <h2 className="section-title">{title}</h2>
    </div>
  )
}
