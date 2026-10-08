import { hero } from '../../../content/hero'
import { siteMeta } from '../../../content/siteMeta'
import { Button } from '../../ui/Button'

// Floating badges are presented as static proof metrics: the leading figure
// becomes the value, the remaining words (unchanged) become the label.
const badgeMetrics = hero.floatingBadges.map((b) => {
  const [value, ...rest] = b.title.split(' ')
  return { value, label: `${rest.join(' ')} ${b.desc}` }
})
const metrics = [...hero.metrics, ...badgeMetrics]
const sampleCommand = hero.terminalCommands[0]

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="btn-icon"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="container hero-container">
        <div className="hero-left">
          <p className="hero-status">
            <span className="status-dot" aria-hidden="true"></span>
            Available for Freelance &amp; Consulting
          </p>

          <h1 className="hero-title">
            {hero.headlineLines[0]}
            <br />
            {hero.headlineLines[1]}
            <br />
            {hero.headlineLines[2]}
          </h1>

          <p className="hero-tagline">{hero.tagline}</p>

          <ul className="hero-capabilities">
            {hero.rotatorWords.map((word) => (
              <li key={word}>{word}</li>
            ))}
          </ul>

          <div className="hero-actions">
            <Button href="#contact" variant="primary">
              <Icon>
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </Icon>
              Hire Me
            </Button>
            <Button href="#projects" variant="outline">
              <Icon>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </Icon>
              View Projects
            </Button>
            <Button
              href={siteMeta.social.calendly}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
            >
              <Icon>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </Icon>
              Book Consultation
            </Button>
          </div>

          <dl className="hero-metrics">
            {metrics.map((m) => (
              <div className="metric-item" key={m.label}>
                <dt className="metric-label">{m.label}</dt>
                <dd className="metric-value">{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero-right">
          <div className="profile-frame">
            <img src={hero.profileImage} alt={hero.profileAlt} className="profile-photo" />
          </div>

          <div className="terminal-widget">
            <div className="terminal-header">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="terminal-title">rushi@aws-console:~</span>
            </div>
            <div className="terminal-body">
              <p>
                <span className="text-success">rushi@aws-console</span>:
                <span className="text-accent">~</span>$ {sampleCommand.input}
              </p>
              <pre>{sampleCommand.output}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
