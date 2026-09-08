import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

interface LightboxState {
  src: string
  alt: string
}

const LightboxContext = createContext<{ open: (src: string, alt: string) => void } | null>(null)

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [image, setImage] = useState<LightboxState | null>(null)

  const open = useCallback((src: string, alt: string) => setImage({ src, alt }), [])
  const close = useCallback(() => setImage(null), [])

  useEffect(() => {
    document.body.classList.toggle('lightbox-open', image !== null)
    if (!image) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [image, close])

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}
      <div
        id="image-lightbox"
        className={`image-lightbox${image ? ' active' : ''}`}
        aria-hidden={image ? 'false' : 'true'}
        onClick={(e) => {
          if (e.target === e.currentTarget) close()
        }}
      >
        <button className="lightbox-close" aria-label="Close zoomed image" onClick={close}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        {image && (
          <img className="lightbox-image" src={image.src} alt={image.alt} onClick={close} />
        )}
      </div>
    </LightboxContext.Provider>
  )
}

export function useLightbox() {
  const ctx = useContext(LightboxContext)
  if (!ctx) throw new Error('useLightbox must be used within LightboxProvider')
  return ctx
}
