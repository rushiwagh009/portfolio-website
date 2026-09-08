import { about } from '../../../content/about'
import { SectionHeader } from '../../ui/SectionHeader'
import { Card } from '../../ui/Card'

export function About() {
  return (
    <section id="about" className="section about-section">
      <div className="container">
        <SectionHeader label="01 // IDENTITY" title="About Me" />

        <div className="about-grid">
          <div className="about-left">
            {about.bioParagraphs.map((p, i) => (
              <p className="bio-text" key={i}>
                {p}
              </p>
            ))}

            <a
              href={about.record.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', display: 'inline-block' }}
            >
              <div className="bio-record-badge">
                <img
                  src={about.record.image}
                  alt="Guinness World Record"
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 4,
                    marginRight: 12,
                    objectFit: 'contain',
                  }}
                />
                <div>
                  <div className="record-title text-accent">{about.record.title}</div>
                  <div className="record-desc">{about.record.context}</div>
                </div>
              </div>
            </a>

            <h3 className="subsection-title">Why Work With Me?</h3>
            <div className="differentiators-grid">
              {about.differentiators.map((d) => (
                <Card className="diff-card" key={d.number}>
                  <span className="diff-number">{d.number}</span>
                  <h4>{d.title}</h4>
                  <p>{d.description}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="about-right">
            <Card className="pills-card">
              <h3>Consultant Overview</h3>
              <ul className="info-pills">
                {about.overview.map((pill) => (
                  <li key={pill.label}>
                    <span className="pill-label">{pill.label}</span>
                    <span className={`pill-value${pill.tone === 'success' ? ' text-success' : ''}`}>
                      {pill.value}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
