import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// The token type scale (tailwind.css) adds font sizes tailwind-merge doesn't
// know about; without this it reads `text-lead` as a colour and drops it when
// merged with `text-foreground`.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['display', 'lead', 'small', 'label'] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
