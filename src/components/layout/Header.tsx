import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { useActiveSection } from '../../hooks/useActiveSection'

const SECTION_IDS = [
  'about',
  'services',
  'projects',
  'skills',
  'experience',
  'certifications',
  'blog',
  'contact',
]
const NAV_LABELS: Record<string, string> = {
  about: 'About',
  services: 'Services',
  projects: 'Projects',
  skills: 'Skills',
  experience: 'Experience',
  certifications: 'Certifications',
  blog: 'Blog',
  contact: 'Contact',
}

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const activeId = useActiveSection(SECTION_IDS)
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  // On any route other than home, these anchor targets don't exist on the
  // current page — link to the home route's hash instead (Home is
  // prerendered, so the browser's native hash-scroll still works pre-hydration).
  const NAV_LINKS = SECTION_IDS.map((id) => ({
    href: isHome ? `#${id}` : `/#${id}`,
    id,
    label: NAV_LABELS[id],
  }))

  useEffect(() => {
    document.body.classList.toggle('nav-open', menuOpen)
  }, [menuOpen])

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (
        menuOpen &&
        navRef.current &&
        hamburgerRef.current &&
        !navRef.current.contains(e.target as Node) &&
        !hamburgerRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('click', onClickOutside)
    return () => document.removeEventListener('click', onClickOutside)
  }, [menuOpen])

  return (
    <header className="header">
      <div className="nav-container">
        <a href={isHome ? '#hero' : '/#hero'} className="logo">
          RW<span className="text-accent">.</span>
        </a>

        <nav ref={navRef} className={`nav-menu${menuOpen ? ' active' : ''}`} id="nav-menu">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`nav-link${isHome && activeId === link.id ? ' active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            id="theme-toggle"
            className="theme-toggle-btn"
            aria-label="Toggle Light/Dark Mode"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <svg
                className="icon-moon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg
                className="icon-sun"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>

          <button
            ref={hamburgerRef}
            className={`hamburger-btn${menuOpen ? ' active' : ''}`}
            id="hamburger-btn"
            aria-label="Open Navigation Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </div>
    </header>
  )
}
