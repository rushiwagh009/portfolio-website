/**
 * Reads the --three-* design tokens from src/styles/tokens.css at runtime so
 * 3D materials/lights stay in sync with the CSS palette instead of
 * duplicating hex/numeric values in TS.
 */
export interface MaterialTokens {
  colorAccent: string
  colorAccentDark: string
  colorSurface: string
  colorSurfaceDark: string
  colorEmissive: string
  metalnessStructure: number
  roughnessStructure: number
  metalnessGlass: number
  roughnessGlass: number
  emissiveIntensity: number
  lightKeyIntensity: number
  lightFillIntensity: number
  lightRimIntensity: number
  lightAmbientIntensity: number
}

function readVar(styles: CSSStyleDeclaration, name: string): string {
  return styles.getPropertyValue(name).trim()
}

function readNumber(styles: CSSStyleDeclaration, name: string): number {
  const value = parseFloat(readVar(styles, name))
  return Number.isFinite(value) ? value : 0
}

export function readMaterialTokens(target: Element = document.documentElement): MaterialTokens {
  const styles = getComputedStyle(target)
  return {
    colorAccent: readVar(styles, '--three-color-accent'),
    colorAccentDark: readVar(styles, '--three-color-accent-dark'),
    colorSurface: readVar(styles, '--three-color-surface'),
    colorSurfaceDark: readVar(styles, '--three-color-surface-dark'),
    colorEmissive: readVar(styles, '--three-color-emissive'),
    metalnessStructure: readNumber(styles, '--three-metalness-structure'),
    roughnessStructure: readNumber(styles, '--three-roughness-structure'),
    metalnessGlass: readNumber(styles, '--three-metalness-glass'),
    roughnessGlass: readNumber(styles, '--three-roughness-glass'),
    emissiveIntensity: readNumber(styles, '--three-emissive-intensity'),
    lightKeyIntensity: readNumber(styles, '--three-light-key-intensity'),
    lightFillIntensity: readNumber(styles, '--three-light-fill-intensity'),
    lightRimIntensity: readNumber(styles, '--three-light-rim-intensity'),
    lightAmbientIntensity: readNumber(styles, '--three-light-ambient-intensity'),
  }
}
