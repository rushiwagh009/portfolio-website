import { useEffect, type RefObject } from 'react'

const MAX_TILT = 6

export function useTilt(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!supportsFinePointer || reducedMotion) return

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const percentX = (x / rect.width) * 100
      const percentY = (y / rect.height) * 100
      const rotateY = (x / rect.width - 0.5) * MAX_TILT * 2
      const rotateX = (y / rect.height - 0.5) * -MAX_TILT * 2

      el.style.setProperty('--mx', `${percentX}%`)
      el.style.setProperty('--my', `${percentY}%`)
      el.style.transform = `translateY(-4px) perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`
    }
    const onMouseLeave = () => {
      el.style.transform = ''
    }

    el.addEventListener('mousemove', onMouseMove)
    el.addEventListener('mouseleave', onMouseLeave)
    return () => {
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [ref])
}
