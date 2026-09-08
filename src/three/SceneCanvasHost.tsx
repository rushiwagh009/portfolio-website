import type { ComponentType } from 'react'
import { Canvas } from '@react-three/fiber'
import type { RenderMode } from './RenderModeProvider'

interface SceneCanvasHostProps<P extends object> {
  scene: ComponentType<P>
  sceneProps: P
  renderMode: Exclude<RenderMode, 'fallback2d'>
}

/** Isolated so the @react-three/fiber (and transitively three.js) import only
 * happens once a 3D-capable, in-view visitor actually needs it — imported here
 * via a dynamic import() from SceneCanvasBoundary, never statically. */
export default function SceneCanvasHost<P extends object>({
  scene: Scene,
  sceneProps,
  renderMode,
}: SceneCanvasHostProps<P>) {
  return (
    <Canvas
      dpr={[1, renderMode === 'full3d' ? 2 : 1]}
      frameloop={renderMode === 'full3d' ? 'always' : 'demand'}
      gl={{ antialias: renderMode === 'full3d', alpha: true }}
    >
      <Scene {...sceneProps} />
    </Canvas>
  )
}
