import { lazy, useRef } from 'react'
import { hero } from '../../../content/hero'
import { siteMeta } from '../../../content/siteMeta'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'
import { useHeroRotator } from '../../../hooks/useHeroRotator'
import { useTerminalSimulation } from '../../../hooks/useTerminalSimulation'
import { useMetricCounter } from '../../../hooks/useMetricCounter'
import { Button } from '../../ui/Button'
import { SceneCanvasBoundary } from '../../../three/SceneCanvasBoundary'

const HeroScene = lazy(() => import('./HeroScene'))

function Metric({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  useMetricCounter(ref, value, reducedMotion)

  return (
    <div className="metric-item">
      <div className="metric-value" ref={ref}>
        {value}
      </div>
      <div className="metric-label">{label}</div>
    </div>
  )
}

export function Hero() {
  const reducedMotion = usePrefersReducedMotion()
  const rotatorText = useHeroRotator(hero.rotatorWords, reducedMotion)
  const terminalRef = useRef<HTMLDivElement>(null)
  useTerminalSimulation(terminalRef, hero.terminalCommands)

  return (
    <section id="hero" className="hero">
      <SceneCanvasBoundary scene={HeroScene} decorative />
      <div className="hero-bg-grid"></div>
      <div className="hero-glow"></div>
      <div className="container hero-container">
        <div className="hero-left">
          <div className="badge-availability animate-fade-in">
            <span className="pulse-dot"></span>
            Available for Freelance &amp; Consulting
          </div>

          <h1 className="hero-title animate-fade-up">
            {hero.headlineLines[0]}
            <br />
            <span className="text-gradient">{hero.headlineLines[1]}</span>
            <br />
            {hero.headlineLines[2]}
          </h1>

          <p className="hero-tagline animate-fade-up">{hero.tagline}</p>

          <div className="hero-rotator animate-fade-up">
            <span className="rotator-prefix">$</span>
            <span className="rotator-text">{rotatorText}</span>
            <span className="rotator-cursor">|</span>
          </div>

          <div className="hero-metrics animate-fade-up">
            {hero.metrics.map((m) => (
              <Metric key={m.label} value={m.value} label={m.label} />
            ))}
          </div>

          <div className="hero-actions animate-fade-up">
            <Button href="#contact" variant="primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="btn-icon"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              Hire Me
            </Button>
            <Button href="#projects" variant="outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="btn-icon"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              View Projects
            </Button>
            <Button
              href={siteMeta.social.calendly}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="btn-icon"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Book Consultation
            </Button>
          </div>
        </div>

        <div className="hero-right">
          <div className="profile-container animate-fade-in">
            <div className="conic-spin-ring"></div>
            <div className="profile-frame">
              <img src={hero.profileImage} alt={hero.profileAlt} className="profile-photo" />
            </div>

            {hero.floatingBadges.map((badge) => (
              <div
                key={badge.title}
                className={`floating-badge ${badge.title.includes('Uptime') ? 'top-right' : 'bottom-left'}`}
              >
                <span className={`badge-icon ${badge.glow}-glow`}>{badge.icon}</span>
                <div>
                  <div className="badge-title">{badge.title}</div>
                  <div className="badge-desc">{badge.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="terminal-widget animate-fade-up">
            <div className="terminal-header">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
              <span className="terminal-title">rushi@aws-console:~</span>
            </div>
            <div className="terminal-body" ref={terminalRef}>
              <p>
                <span className="text-success">rushi@aws-console</span>:
                <span className="text-accent">~</span>$ <span className="cmd-type"></span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
