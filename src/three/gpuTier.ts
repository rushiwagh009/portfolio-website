import { getGPUTier } from 'detect-gpu'

const CACHE_KEY = 'portfolio-gpu-tier'

export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

/** 0 = unsupported/very low end, 1 = low, 2 = mid, 3 = high. Cached so repeat
 * visitors skip the benchmark. */
export async function resolveGpuTier(): Promise<number> {
  const cached = localStorage.getItem(CACHE_KEY)
  if (cached !== null) {
    const parsed = Number(cached)
    if (Number.isFinite(parsed)) return parsed
  }
  try {
    const result = await getGPUTier()
    localStorage.setItem(CACHE_KEY, String(result.tier))
    return result.tier
  } catch {
    return 0
  }
}
