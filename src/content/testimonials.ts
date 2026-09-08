export interface Testimonial {
  quote: string
  initials: string
  name: string
  role: string
}

// Carried over verbatim from the legacy site's commented-out testimonials
// markup (pre-existing content, not authored here). The user's explicit
// decision was to keep this section unpublished until real, ready-to-use
// quotes exist — isPublished stays false and this component is not mounted
// in Home.tsx. Flip both when real quotes are confirmed.
export const isPublished = false

export const testimonials: Testimonial[] = [
  {
    quote:
      'Rushi helped us migration our container applications to AWS EKS with zero downtime. His expertise in Kubernetes and Terraform saved us weeks of manual work and built a scalable platform we can count on.',
    initials: 'AK',
    name: 'Anand K.',
    role: 'Director of Engineering, Fintech Startup',
  },
  {
    quote:
      'Our AWS costs were spiral out of control. Rushi did a thorough FinOps review, identified unused resources, rightsized our RDS clusters, and configured S3 lifecycle hooks. Our monthly cloud bill dropped by 28% instantly!',
    initials: 'MS',
    name: 'Meera S.',
    role: 'CTO, E-commerce Scaleup',
  },
  {
    quote:
      'The DevSecOps pipeline Rushi created using Jenkins and Trivy has completely transformed our release process. We now automatically scan for security risks in real-time, shipping code faster and with complete confidence.',
    initials: 'RV',
    name: 'Rahul V.',
    role: 'Principal Architect, SaaS Provider',
  },
]
