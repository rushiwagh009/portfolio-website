import { useScrollProgress } from '../../hooks/useScrollProgress'

export function BackToTop() {
  const { pastThreshold } = useScrollProgress()
  return (
    <button
      id="back-to-top"
      className={`back-to-top${pastThreshold ? ' show' : ''}`}
      aria-label="Back to Top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    </button>
  )
}
