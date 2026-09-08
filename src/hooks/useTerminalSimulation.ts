import { useEffect, type RefObject } from 'react'
import { isPrerenderCapture } from '../lib/prerenderCapture'

interface TerminalCommand {
  input: string
  output: string
}

export function useTerminalSimulation(
  ref: RefObject<HTMLElement | null>,
  commands: TerminalCommand[],
) {
  useEffect(() => {
    const terminal = ref.current
    if (!terminal || commands.length === 0) return

    // Leave just the JSX seed line during prerender capture — whatever command
    // is mid-typing at the moment of capture would otherwise get baked into
    // the static file and mismatch every real visitor's fresh first paint.
    if (isPrerenderCapture()) return

    // Reset any content left by a prior invocation of this effect (React
    // StrictMode's dev-only double-invoke would otherwise duplicate the
    // first prompt line, since runSequence appends synchronously).
    terminal.innerHTML = ''

    let currentCmdIdx = 0
    const timeouts: ReturnType<typeof setTimeout>[] = []
    const schedule = (fn: () => void, delay: number) => {
      const id = setTimeout(fn, delay)
      timeouts.push(id)
      return id
    }

    const runSequence = () => {
      const data = commands[currentCmdIdx]
      const promptLine = document.createElement('p')
      promptLine.innerHTML = `<span class="text-success">rushi@aws-console</span>:<span class="text-accent">~</span>$ `
      const cmdSpan = document.createElement('span')
      cmdSpan.className = 'text-primary'
      promptLine.appendChild(cmdSpan)
      terminal.appendChild(promptLine)

      let charIdx = 0
      const typedText = data.input

      const typeCharacter = () => {
        if (charIdx < typedText.length) {
          cmdSpan.textContent += typedText.charAt(charIdx)
          charIdx++
          terminal.scrollTop = terminal.scrollHeight
          schedule(typeCharacter, 40 + Math.random() * 30)
        } else {
          schedule(() => {
            const outPre = document.createElement('pre')
            outPre.style.color = '#cbd5e1'
            outPre.style.margin = '0.5rem 0 1rem'
            outPre.style.lineHeight = '1.4'
            outPre.style.whiteSpace = 'pre-wrap'
            outPre.style.fontFamily = 'var(--font-mono)'
            outPre.textContent = data.output
            terminal.appendChild(outPre)
            terminal.scrollTop = terminal.scrollHeight

            schedule(() => {
              if (terminal.children.length > 5) terminal.innerHTML = ''
              currentCmdIdx = (currentCmdIdx + 1) % commands.length
              runSequence()
            }, 4000)
          }, 300)
        }
      }

      schedule(typeCharacter, 500)
    }

    runSequence()
    return () => timeouts.forEach(clearTimeout)
  }, [ref, commands])
}
