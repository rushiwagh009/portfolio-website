import type { ReactNode } from 'react'

/** Renders the legacy site's Obsidian-style [[wikilinks]] as decorative,
 * non-navigating tags — matches the current live site's behavior exactly;
 * turning these into real cross-chapter links is a future content
 * enhancement, not part of this migration. */
export function WikiTag({ children }: { children: ReactNode }) {
  return (
    <span className="tag bg-cyan-glow wiki-tag" title="Wiki link representation">
      {children}
    </span>
  )
}
