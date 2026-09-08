import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Object3D, type InstancedMesh } from 'three'
import { readMaterialTokens } from '../../../three/materialTokens'

const COUNT = 48
const dummy = new Object3D()

interface InstanceData {
  basePosition: [number, number, number]
  speed: number
  offset: number
}

/** Ambient, decorative-only backdrop — instanced geometry per the brief's
 * guidance to keep draw calls low for repeated elements. Deliberately subtle:
 * this section's real content is the 2D grid, the 3D layer is atmosphere,
 * matching the tier of the About section rather than competing for attention. */
export function ServicesScene() {
  const meshRef = useRef<InstancedMesh>(null)
  const tokens = useMemo(() => readMaterialTokens(), [])

  // Lazy useState initializer, not useMemo — this is React's sanctioned spot
  // for one-time non-deterministic setup (oxlint's purity rule flags
  // Math.random() directly in the render body/useMemo).
  const [instances] = useState<InstanceData[]>(() =>
    Array.from({ length: COUNT }, () => ({
      basePosition: [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4 - 2,
      ],
      speed: 0.15 + Math.random() * 0.25,
      offset: Math.random() * Math.PI * 2,
    })),
  )

  useFrame(({ clock }) => {
    const mesh = meshRef.current
    if (!mesh) return
    const t = clock.getElapsedTime()

    instances.forEach((inst, i) => {
      const [x, y, z] = inst.basePosition
      dummy.position.set(x, y + Math.sin(t * inst.speed + inst.offset) * 0.4, z)
      dummy.rotation.set(t * 0.1 + inst.offset, t * 0.15, 0)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      <ambientLight intensity={tokens.lightAmbientIntensity} />
      <directionalLight
        position={[2, 3, 4]}
        intensity={tokens.lightKeyIntensity * 0.5}
        color={tokens.colorAccent}
      />

      <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
        <icosahedronGeometry args={[0.08, 0]} />
        <meshStandardMaterial
          color={tokens.colorSurface}
          metalness={tokens.metalnessGlass}
          roughness={tokens.roughnessGlass}
          emissive={tokens.colorAccent}
          emissiveIntensity={0.5}
          transparent
          opacity={0.35}
        />
      </instancedMesh>
    </>
  )
}

export default ServicesScene
