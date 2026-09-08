import { Suspense, lazy, type ComponentType, type LazyExoticComponent } from 'react'
import { useRenderMode } from './RenderModeProvider'
import { useInViewCanvas } from './useInViewCanvas'
import { SceneErrorBoundary } from './SceneErrorBoundary'

const SceneCanvasHost = lazy(() => import('./SceneCanvasHost')) as ComponentType<{
  scene: ComponentType<object>
  sceneProps: object
  renderMode: 'full3d' | 'reduced3d'
}>

interface SceneCanvasBoundaryProps<P extends object> {
  scene: LazyExoticComponent<ComponentType<P>> | ComponentType<P>
  /** Props forwarded to the scene component once it mounts — the DOM-drives-3D-state
   * pattern for interactive scenes (real focusable controls own state, the 3D scene
   * only visualizes it) flows through here. */
  sceneProps?: P
  /** Decorative scenes are purely visual backdrop (aria-hidden). Interactive
   * scenes follow the DOM-drives-3D-state pattern — real focusable controls
   * elsewhere own the interaction, this canvas only visualizes it — so they're
   * exposed as a labeled presentation region instead of hidden outright. */
  decorative?: boolean
  label?: string
  className?: string
}

export function SceneCanvasBoundary<P extends object = object>({
  scene,
  sceneProps,
  decorative = true,
  label,
  className,
}: SceneCanvasBoundaryProps<P>) {
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
            <SceneCanvasHost
              scene={scene as ComponentType<object>}
              sceneProps={(sceneProps ?? {}) as object}
              renderMode={renderMode}
            />
          </Suspense>
        </SceneErrorBoundary>
      )}
    </div>
  )
}
