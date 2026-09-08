import { useRef, type HTMLAttributes, type ReactNode } from 'react'
import { useReveal } from '../../hooks/useReveal'
import { useTilt } from '../../hooks/useTilt'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, className = '', ...rest }: CardProps) {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref)
  useTilt(ref)

  return (
    <div ref={ref} className={`card ${className}`.trim()} {...rest}>
      {children}
    </div>
  )
}
