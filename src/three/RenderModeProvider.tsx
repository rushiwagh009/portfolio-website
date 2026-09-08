import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { resolveGpuTier, supportsWebGL } from './gpuTier'
import { isPrerenderCapture } from '../lib/prerenderCapture'

export type RenderMode = 'full3d' | 'reduced3d' | 'fallback2d'

const RenderModeContext = createContext<RenderMode>('fallback2d')

/** Resolves once per session, before any three.js/R3F module is imported anywhere
 * downstream — sections gate their lazy 3D chunk import on this value so a
 * fallback2d visitor never fetches three.js at all. Defaults to fallback2d until
 * resolved, which is also the correct safe state (nothing 3D renders by default). */
export function RenderModeProvider({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion()
  const [renderMode, setRenderMode] = useState<RenderMode>('fallback2d')

  useEffect(() => {
    // Stay at fallback2d forever during prerender capture — a 3D canvas that
    // resolves mid-capture would get baked into the static snapshot, which
    // would then permanently mismatch every real visitor's own fresh
    // (not-yet-resolved) first paint.
    if (isPrerenderCapture()) return

    let cancelled = false

    if (!supportsWebGL() || reducedMotion) {
      setRenderMode('fallback2d')
      return
    }

    resolveGpuTier().then((tier) => {
      if (cancelled) return
      setRenderMode(tier >= 2 ? 'full3d' : tier >= 1 ? 'reduced3d' : 'fallback2d')
    })

    return () => {
      cancelled = true
    }
  }, [reducedMotion])

  return <RenderModeContext.Provider value={renderMode}>{children}</RenderModeContext.Provider>
}

export function useRenderMode() {
  return useContext(RenderModeContext)
}
