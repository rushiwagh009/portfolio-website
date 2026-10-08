import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Mesh, MeshStandardMaterial } from 'three'
import { readMaterialTokens } from '../../../three/materialTokens'

interface AzGroup {
  id: 'az1' | 'az2' | 'az3'
  center: [number, number, number]
  nodeOffsets: [number, number, number][]
}

const AZ_GROUPS: AzGroup[] = [
  {
    id: 'az1',
    center: [-2.2, 1.1, 0],
    nodeOffsets: [
      [0, 0, 0],
      [0.5, 0.3, 0.2],
      [-0.3, 0.4, -0.2],
    ],
  },
  {
    id: 'az2',
    center: [2.2, 1.1, 0],
    nodeOffsets: [
      [0, 0, 0],
      [0.5, -0.3, 0.2],
      [-0.4, 0.3, 0.3],
    ],
  },
  {
    id: 'az3',
    center: [0, -1.7, 0],
    nodeOffsets: [
      [0, 0, 0],
      [0.5, 0.2, -0.3],
      [-0.5, 0.2, 0.2],
    ],
  },
]

const HUB_POSITION: [number, number, number] = [0, 0, 0]
const OBSERVABILITY_POSITION: [number, number, number] = [0, 0, -2.4]

interface EksDioramaProps {
  selected: string
}

export function EksDiorama({ selected }: EksDioramaProps) {
  const rootRef = useRef<Group>(null)
  const tokens = useMemo(() => readMaterialTokens(), [])

  useFrame((_, delta) => {
    if (rootRef.current) rootRef.current.rotation.y += delta * 0.05
  })

  return (
    <group ref={rootRef}>
      <ambientLight intensity={tokens.lightAmbientIntensity} />
      <directionalLight position={[3, 4, 3]} intensity={tokens.lightKeyIntensity} color="#ffffff" />
      <directionalLight
        position={[-4, -2, -2]}
        intensity={tokens.lightFillIntensity}
        color="#ffffff"
      />

      <HubNode level={levelFor(selected, ['lb'])} tokens={tokens} />

      {AZ_GROUPS.map((az) => (
        <AzCluster key={az.id} group={az} level={levelFor(selected, [az.id])} tokens={tokens} />
      ))}

      <ObservabilityNode level={levelFor(selected, ['observability'])} tokens={tokens} />

      {AZ_GROUPS.map((az) => (
        <Edge key={`edge-${az.id}`} from={HUB_POSITION} to={az.center} tokens={tokens} />
      ))}
      <Edge from={HUB_POSITION} to={OBSERVABILITY_POSITION} tokens={tokens} />
    </group>
  )
}

type Tokens = ReturnType<typeof readMaterialTokens>

/** 1 = the selected component, 0.5 = overview (nothing singled out), 0.15 = de-emphasised. */
function levelFor(selected: string, ids: string[]) {
  if (ids.includes(selected)) return 1
  return selected === 'overview' ? 0.5 : 0.15
}

const opacityFor = (level: number) => 0.12 + 0.6 * level
const glowFor = (level: number) => 0.1 + 1.3 * level

function useEmphasis(
  level: number,
  materialRef: React.RefObject<MeshStandardMaterial | null>,
  base: number,
) {
  useFrame(() => {
    const mat = materialRef.current
    if (!mat) return
    const glow = base * glowFor(level)
    const opacity = opacityFor(level)
    mat.emissiveIntensity += (glow - mat.emissiveIntensity) * 0.1
    mat.opacity += (opacity - mat.opacity) * 0.1
  })
}

function HubNode({ level, tokens }: { level: number; tokens: Tokens }) {
  const materialRef = useRef<MeshStandardMaterial>(null)
  useEmphasis(level, materialRef, tokens.emissiveIntensity * 0.5)

  return (
    <mesh position={HUB_POSITION}>
      <octahedronGeometry args={[0.35, 0]} />
      <meshStandardMaterial
        ref={materialRef}
        transparent
        color={tokens.colorSurface}
        metalness={tokens.metalnessStructure}
        roughness={tokens.roughnessStructure}
        emissive={tokens.colorEmissive}
        emissiveIntensity={tokens.emissiveIntensity * 0.5 * glowFor(level)}
        opacity={opacityFor(level)}
      />
    </mesh>
  )
}

function ObservabilityNode({ level, tokens }: { level: number; tokens: Tokens }) {
  const materialRef = useRef<MeshStandardMaterial>(null)
  useEmphasis(level, materialRef, tokens.emissiveIntensity * 0.4)

  return (
    <mesh position={OBSERVABILITY_POSITION}>
      <torusGeometry args={[0.28, 0.1, 12, 24]} />
      <meshStandardMaterial
        ref={materialRef}
        transparent
        color={tokens.colorSurface}
        metalness={tokens.metalnessStructure}
        roughness={tokens.roughnessStructure}
        emissive={tokens.colorAccentDark}
        emissiveIntensity={tokens.emissiveIntensity * 0.4 * glowFor(level)}
        opacity={opacityFor(level)}
      />
    </mesh>
  )
}

function AzCluster({ group, level, tokens }: { group: AzGroup; level: number; tokens: Tokens }) {
  return (
    <group position={group.center}>
      {group.nodeOffsets.map((offset, i) => (
        <AzNode key={i} offset={offset} level={level} tokens={tokens} />
      ))}
    </group>
  )
}

function AzNode({
  offset,
  level,
  tokens,
}: {
  offset: [number, number, number]
  level: number
  tokens: Tokens
}) {
  const meshRef = useRef<Mesh>(null)
  const materialRef = useRef<MeshStandardMaterial>(null)
  useEmphasis(level, materialRef, tokens.emissiveIntensity * 0.3)

  useFrame(() => {
    if (!meshRef.current) return
    const targetScale = level === 1 ? 1.1 : 1
    meshRef.current.scale.x += (targetScale - meshRef.current.scale.x) * 0.1
    meshRef.current.scale.y = meshRef.current.scale.z = meshRef.current.scale.x
  })

  return (
    <mesh ref={meshRef} position={offset}>
      <boxGeometry args={[0.32, 0.32, 0.32]} />
      <meshStandardMaterial
        ref={materialRef}
        transparent
        color={tokens.colorSurface}
        metalness={tokens.metalnessStructure}
        roughness={tokens.roughnessStructure}
        emissive={tokens.colorEmissive}
        emissiveIntensity={tokens.emissiveIntensity * 0.3 * glowFor(level)}
        opacity={opacityFor(level)}
      />
    </mesh>
  )
}

function Edge({
  from,
  to,
  tokens,
}: {
  from: [number, number, number]
  to: [number, number, number]
  tokens: Tokens
}) {
  const positions = useMemo(() => new Float32Array([...from, ...to]), [from, to])
  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={2}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={tokens.colorAccent} transparent opacity={0.3} />
    </line>
  )
}

export default EksDiorama
