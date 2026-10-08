import { certifications, certificationVerifyUrl } from '../../../content/certifications'
import { SectionHeader } from '../../ui/SectionHeader'
import { Card } from '../../ui/Card'

export function Certifications() {
  return (
    <section id="certifications" className="section certifications-section bg-secondary">
      <div className="container">
        <SectionHeader label="CREDENTIALS" title="Certifications" />

        <div className="certs-grid">
          {certifications.map((cert) => (
            <Card className="cert-card" key={cert.title}>
              <div className="cert-badge-img-wrap">
                <a href={certificationVerifyUrl} target="_blank" rel="noopener noreferrer">
                  <img src={cert.badge} alt={`${cert.title} Badge`} className="cert-badge-img" />
                </a>
              </div>
              <div className="cert-card-body">
                <span className="cert-verified">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  VERIFIED
                </span>
                <h3>
                  <a
                    href={certificationVerifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    {cert.title}
                  </a>
                </h3>
                <p className="cert-issuer">Amazon Web Services</p>
                <p className="cert-date">Issued: {cert.issueDate}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
