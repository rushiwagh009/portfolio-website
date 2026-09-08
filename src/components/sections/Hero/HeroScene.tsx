import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { readMaterialTokens } from '../../../three/materialTokens'

const NODE_POSITIONS: [number, number, number][] = [
  [0, 0, 0],
  [1.6, 0.8, -0.4],
  [-1.5, 0.6, 0.3],
  [0.6, -1.1, 0.6],
  [-1.1, -0.9, -0.5],
  [1.9, -0.4, 0.8],
]

const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 5],
  [3, 5],
]

/** A deliberately simple "cloud infrastructure cluster" — nodes standing in for
 * EC2/EKS/S3/RDS, connected and slowly orbiting. This is the reference
 * implementation for the render-mode -> lazy-load -> viewport-gated -> aria-hidden
 * pipeline; later sections' scenes reuse this same structure, not this content. */
export function HeroScene() {
  const groupRef = useRef<Group>(null)
  const tokens = useMemo(() => readMaterialTokens(), [])

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.08
  })

  return (
    <>
      <ambientLight intensity={tokens.lightAmbientIntensity} />
      <directionalLight
        position={[3, 4, 2]}
        intensity={tokens.lightKeyIntensity}
        color={tokens.colorAccent}
      />
      <directionalLight
        position={[-4, -2, -3]}
        intensity={tokens.lightFillIntensity}
        color={tokens.colorAccentDark}
      />
      <directionalLight
        position={[0, 2, -5]}
        intensity={tokens.lightRimIntensity}
        color={tokens.colorEmissive}
      />

      <group ref={groupRef} position={[1.6, 0, 0]}>
        {EDGES.map(([a, b], i) => {
          const positions = new Float32Array([...NODE_POSITIONS[a], ...NODE_POSITIONS[b]])
          return (
            <line key={i}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[positions, 3]}
                  count={2}
                  array={positions}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color={tokens.colorAccent} transparent opacity={0.35} />
            </line>
          )
        })}

        {NODE_POSITIONS.map((pos, i) => (
          <mesh key={i} position={pos}>
            <icosahedronGeometry args={[0.4, 0]} />
            <meshStandardMaterial
              color={tokens.colorSurface}
              metalness={tokens.metalnessStructure}
              roughness={tokens.roughnessStructure}
              emissive={tokens.colorEmissive}
              emissiveIntensity={
                i === 0 ? tokens.emissiveIntensity * 0.6 : tokens.emissiveIntensity * 0.25
              }
            />
          </mesh>
        ))}
      </group>
    </>
  )
}

export default HeroScene
