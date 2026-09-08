import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { readMaterialTokens } from '../../../three/materialTokens'

interface SkillsOrbitalSceneProps {
  categoryAverages: number[]
}

/** A radial orbit, one node per skill category, sized and glowing by that
 * category's average proficiency — real (if still-placeholder) data drives
 * the geometry, not invented values. Purely decorative/ambient, positioned
 * behind the skill bars which remain the actual accessible data. */
export function SkillsOrbitalScene({ categoryAverages }: SkillsOrbitalSceneProps) {
  const groupRef = useRef<Group>(null)
  const tokens = useMemo(() => readMaterialTokens(), [])

  const radius = 2.6
  const nodes = useMemo(
    () =>
      categoryAverages.map((avg, i) => {
        const angle = (i / categoryAverages.length) * Math.PI * 2
        return {
          angle,
          scale: 0.18 + (avg / 100) * 0.22,
          intensity: 0.3 + (avg / 100) * 0.9,
        }
      }),
    [categoryAverages],
  )

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.z += delta * 0.06
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={tokens.lightAmbientIntensity} />
      <directionalLight
        position={[2, 3, 4]}
        intensity={tokens.lightKeyIntensity * 0.6}
        color={tokens.colorAccent}
      />

      {nodes.map((node, i) => (
        <mesh key={i} position={[Math.cos(node.angle) * radius, Math.sin(node.angle) * radius, 0]}>
          <sphereGeometry args={[node.scale, 16, 16]} />
          <meshStandardMaterial
            color={tokens.colorSurface}
            metalness={tokens.metalnessGlass}
            roughness={tokens.roughnessGlass}
            emissive={tokens.colorEmissive}
            emissiveIntensity={node.intensity}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  )
}

export default SkillsOrbitalScene
