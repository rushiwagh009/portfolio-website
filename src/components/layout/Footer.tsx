import { siteMeta } from '../../content/siteMeta'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-left">
          <a href="#hero" className="logo">
            RW<span className="text-accent">.</span>
          </a>
          <p className="footer-title">Rushi Wagh</p>
          <p className="footer-subtitle">AWS DevOps Consultant</p>
        </div>

        <div className="footer-links">
          <a
            href={siteMeta.social.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            GitHub
          </a>
          <a
            href={siteMeta.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            LinkedIn
          </a>
          <a href={`mailto:${siteMeta.social.email}`} aria-label="Email">
            Email
          </a>
        </div>

        <div className="footer-right">
          <p>© {new Date().getFullYear()} Rushi Wagh. All rights reserved.</p>
          <p className="footer-signature">Built with passion for cloud automation</p>
        </div>
      </div>
    </footer>
  )
}
