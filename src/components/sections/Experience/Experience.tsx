import { useRef } from 'react'
import { experience } from '../../../content/experience'
import { SectionHeader } from '../../ui/SectionHeader'
import { Card } from '../../ui/Card'
import { useReveal } from '../../../hooks/useReveal'

function TimelineItem({ role, first }: { role: (typeof experience)[number]; first: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref)

  return (
    <div ref={ref} className="timeline-item">
      <div className="timeline-dot-container">
        {first && <span className="timeline-dot-pulse"></span>}
        <span className="timeline-dot"></span>
      </div>
      <Card className="timeline-content">
        <div className="timeline-header-info">
          <span className="timeline-duration">{role.duration}</span>
          <h3>{role.title}</h3>
          <span className="timeline-company">{role.company}</span>
        </div>
        <ul className="timeline-achievements">
          {role.achievements.map((achievement) => (
            <li key={achievement}>{achievement}</li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

export function Experience() {
  return (
    <section id="experience" className="section experience-section">
      <div className="container">
        <SectionHeader label="HISTORY" title="Professional Experience" />

        <div className="timeline">
          <div className="timeline-line"></div>
          {experience.map((role, i) => (
            <TimelineItem key={role.title + role.duration} role={role} first={i === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}
