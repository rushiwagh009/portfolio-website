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
      <directionalLight
        position={[3, 4, 3]}
        intensity={tokens.lightKeyIntensity}
        color={tokens.colorAccent}
      />
      <directionalLight
        position={[-4, -2, -2]}
        intensity={tokens.lightFillIntensity}
        color={tokens.colorAccentDark}
      />

      <HubNode active={selected === 'overview' || selected === 'lb'} tokens={tokens} />

      {AZ_GROUPS.map((az) => (
        <AzCluster
          key={az.id}
          group={az}
          active={selected === 'overview' || selected === az.id}
          tokens={tokens}
        />
      ))}

      <ObservabilityNode
        active={selected === 'overview' || selected === 'observability'}
        tokens={tokens}
      />

      {AZ_GROUPS.map((az) => (
        <Edge key={`edge-${az.id}`} from={HUB_POSITION} to={az.center} tokens={tokens} />
      ))}
      <Edge from={HUB_POSITION} to={OBSERVABILITY_POSITION} tokens={tokens} />
    </group>
  )
}

type Tokens = ReturnType<typeof readMaterialTokens>

function useEmphasis(
  active: boolean,
  materialRef: React.RefObject<MeshStandardMaterial | null>,
  base: number,
) {
  useFrame(() => {
    const mat = materialRef.current
    if (!mat) return
    const target = active ? base * 2.2 : base
    mat.emissiveIntensity += (target - mat.emissiveIntensity) * 0.1
  })
}

function HubNode({ active, tokens }: { active: boolean; tokens: Tokens }) {
  const materialRef = useRef<MeshStandardMaterial>(null)
  useEmphasis(active, materialRef, tokens.emissiveIntensity * 0.5)

  return (
    <mesh position={HUB_POSITION}>
      <octahedronGeometry args={[0.35, 0]} />
      <meshStandardMaterial
        ref={materialRef}
        color={tokens.colorSurface}
        metalness={tokens.metalnessStructure}
        roughness={tokens.roughnessStructure}
        emissive={tokens.colorEmissive}
        emissiveIntensity={tokens.emissiveIntensity * 0.5}
      />
    </mesh>
  )
}

function ObservabilityNode({ active, tokens }: { active: boolean; tokens: Tokens }) {
  const materialRef = useRef<MeshStandardMaterial>(null)
  useEmphasis(active, materialRef, tokens.emissiveIntensity * 0.4)

  return (
    <mesh position={OBSERVABILITY_POSITION}>
      <torusGeometry args={[0.28, 0.1, 12, 24]} />
      <meshStandardMaterial
        ref={materialRef}
        color={tokens.colorSurface}
        metalness={tokens.metalnessStructure}
        roughness={tokens.roughnessStructure}
        emissive={tokens.colorAccentDark}
        emissiveIntensity={tokens.emissiveIntensity * 0.4}
      />
    </mesh>
  )
}

function AzCluster({ group, active, tokens }: { group: AzGroup; active: boolean; tokens: Tokens }) {
  return (
    <group position={group.center}>
      {group.nodeOffsets.map((offset, i) => (
        <AzNode key={i} offset={offset} active={active} tokens={tokens} />
      ))}
    </group>
  )
}

function AzNode({
  offset,
  active,
  tokens,
}: {
  offset: [number, number, number]
  active: boolean
  tokens: Tokens
}) {
  const meshRef = useRef<Mesh>(null)
  const materialRef = useRef<MeshStandardMaterial>(null)
  useEmphasis(active, materialRef, tokens.emissiveIntensity * 0.3)

  useFrame(() => {
    if (!meshRef.current) return
    const targetScale = active ? 1.15 : 1
    meshRef.current.scale.x += (targetScale - meshRef.current.scale.x) * 0.1
    meshRef.current.scale.y = meshRef.current.scale.z = meshRef.current.scale.x
  })

  return (
    <mesh ref={meshRef} position={offset}>
      <boxGeometry args={[0.32, 0.32, 0.32]} />
      <meshStandardMaterial
        ref={materialRef}
        color={tokens.colorSurface}
        metalness={tokens.metalnessStructure}
        roughness={tokens.roughnessStructure}
        emissive={tokens.colorEmissive}
        emissiveIntensity={tokens.emissiveIntensity * 0.3}
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
