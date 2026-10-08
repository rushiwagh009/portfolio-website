import { speakingEvents } from '../../../content/speaking'
import { SectionHeader } from '../../ui/SectionHeader'
import { Card } from '../../ui/Card'

export function Speaking() {
  return (
    <section id="speaking" className="section speaking-section bg-secondary">
      <div className="container">
        <SectionHeader label="ENGAGEMENTS" title="Speaking & Workshops" />

        <div className="speaking-grid">
          {speakingEvents.map((event) => (
            <Card className="speaking-card" key={event.title}>
              <div className="speaking-icon">{event.icon}</div>
              <h3>{event.title}</h3>
              <p className="speaking-org">{event.org}</p>
              <p className="speaking-desc">{event.description}</p>
            </Card>
          ))}

          <Card className="speaking-invite-card">
            <h3>Hosting an event or workshop?</h3>
            <p>
              I speak on cloud automation, FinOps, DevSecOps pipelines, Kubernetes management, and
              cybersecurity infrastructure.
            </p>
            <a href="#contact" className="btn btn-primary">
              Invite Me to Speak
            </a>
          </Card>
        </div>
      </div>
    </section>
  )
}
