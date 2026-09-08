import { Suspense, lazy, type ComponentType, type LazyExoticComponent } from 'react'
import { useRenderMode } from './RenderModeProvider'
import { useInViewCanvas } from './useInViewCanvas'
import { SceneErrorBoundary } from './SceneErrorBoundary'

const SceneCanvasHost = lazy(() => import('./SceneCanvasHost'))

interface SceneCanvasBoundaryProps {
  scene: LazyExoticComponent<ComponentType> | ComponentType
  /** Decorative scenes are purely visual backdrop (aria-hidden). Interactive
   * scenes follow the DOM-drives-3D-state pattern — real focusable controls
   * elsewhere own the interaction, this canvas only visualizes it — so they're
   * exposed as a labeled presentation region instead of hidden outright. */
  decorative?: boolean
  label?: string
  className?: string
}

export function SceneCanvasBoundary({
  scene: Scene,
  decorative = true,
  label,
  className,
}: SceneCanvasBoundaryProps) {
  const renderMode = useRenderMode()
  const { ref, inView } = useInViewCanvas<HTMLDivElement>()

  const shouldMount = renderMode !== 'fallback2d' && inView

  return (
    <div
      ref={ref}
      className={`scene-canvas-boundary ${className ?? ''}`.trim()}
      aria-hidden={decorative ? true : undefined}
      role={!decorative ? 'presentation' : undefined}
      aria-label={!decorative ? label : undefined}
    >
      {shouldMount && (
        <SceneErrorBoundary>
          <Suspense fallback={null}>
            <SceneCanvasHost scene={Scene} renderMode={renderMode} />
          </Suspense>
        </SceneErrorBoundary>
      )}
    </div>
  )
}
