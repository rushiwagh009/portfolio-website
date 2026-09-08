import { lazy } from 'react'
import { services } from '../../../content/services'
import { SectionHeader } from '../../ui/SectionHeader'
import { Card } from '../../ui/Card'
import { SceneCanvasBoundary } from '../../../three/SceneCanvasBoundary'

const ServicesScene = lazy(() => import('./ServicesScene'))

export function Services() {
  return (
    <section id="services" className="section services-section bg-secondary">
      <SceneCanvasBoundary scene={ServicesScene} decorative />
      <div className="container">
        <SectionHeader label="02 // CAPABILITIES" title="Consulting Services" />

        <div className="services-grid">
          {services.map((service) => (
            <Card className="service-card" key={service.title}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
