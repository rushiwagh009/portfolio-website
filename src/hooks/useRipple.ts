import type { MouseEvent } from 'react'

export function useRipple() {
  return (e: MouseEvent<HTMLElement>) => {
    const btn = e.currentTarget
    const rect = btn.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const ripple = document.createElement('span')

    ripple.className = 'btn-ripple'
    ripple.style.width = `${size}px`
    ripple.style.height = `${size}px`
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`

    btn.appendChild(ripple)
    setTimeout(() => ripple.remove(), 650)
  }
}
