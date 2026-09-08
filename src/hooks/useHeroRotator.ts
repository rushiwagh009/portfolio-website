import { useEffect, useState } from 'react'
import { isPrerenderCapture } from '../lib/prerenderCapture'

const TYPING_SPEED = 55
const DELETING_SPEED = 28
const HOLD_TIME = 1700
const GAP_TIME = 400

export function useHeroRotator(words: string[], reducedMotion: boolean) {
  const [text, setText] = useState(reducedMotion ? words[0] : '')

  useEffect(() => {
    if (reducedMotion) {
      setText(words[0])
      return
    }

    // Freeze at the empty initial state during prerender capture — whatever
    // partial word is mid-typing at the moment of capture would otherwise get
    // baked into the static file and mismatch every real visitor's fresh
    // (empty) first paint.
    if (isPrerenderCapture()) return

    let wordIndex = 0
    let charIndex = 0
    let deleting = false
    let timeoutId: ReturnType<typeof setTimeout>

    const tick = () => {
      const currentWord = words[wordIndex]
      if (!deleting) {
        charIndex++
        setText(currentWord.slice(0, charIndex))
        if (charIndex === currentWord.length) {
          deleting = true
          timeoutId = setTimeout(tick, HOLD_TIME)
          return
        }
        timeoutId = setTimeout(tick, TYPING_SPEED + Math.random() * 40)
      } else {
        charIndex--
        setText(currentWord.slice(0, charIndex))
        if (charIndex === 0) {
          deleting = false
          wordIndex = (wordIndex + 1) % words.length
          timeoutId = setTimeout(tick, GAP_TIME)
          return
        }
        timeoutId = setTimeout(tick, DELETING_SPEED)
      }
    }

    timeoutId = setTimeout(tick, 900)
    return () => clearTimeout(timeoutId)
  }, [words, reducedMotion])

  return text
}
