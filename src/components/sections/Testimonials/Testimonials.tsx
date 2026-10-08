import { testimonials, isPublished } from '../../../content/testimonials'
import { SectionHeader } from '../../ui/SectionHeader'
import { Card } from '../../ui/Card'

/** Not mounted in Home.tsx — see content/testimonials.ts for why. Built now
 * so publishing later is a one-line change (add <Testimonials /> to Home)
 * once isPublished flips to true. */
export function Testimonials() {
  if (!isPublished) return null

  return (
    <section id="testimonials" className="section testimonials-section">
      <div className="container">
        <SectionHeader label="RECOMMENDATIONS" title="Client Reviews" />

        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <Card className="testimonial-card" key={t.name}>
              <span className="quote-mark">&ldquo;</span>
              <p className="testimonial-text">{t.quote}</p>
              <div className="testimonial-author">
                <span className="author-avatar">{t.initials}</span>
                <div>
                  <div className="author-name">{t.name}</div>
                  <div className="author-role">{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="testimonials-cta">
          <p>
            Have we worked together on a cloud initiative?{' '}
            <a href="#contact" className="text-accent">
              I&apos;d love your feedback!
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
