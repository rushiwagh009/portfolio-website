export interface Certification {
  title: string
  badge: string
  issueDate: string
}

export const certificationVerifyUrl =
  'https://skillsprofile.skillbuilder.aws/user/RushiWagh/certification-badges'

export const certifications: Certification[] = [
  {
    title: 'AWS Certified Solutions Architect – Associate',
    badge: '/assets/aws-certified-solutions-architect-associate-logo.webp',
    issueDate: 'May 24, 2026',
  },
  {
    title: 'AWS Certified Cloud Practitioner',
    badge: '/assets/aws-certified-cloud-practitioner-logo.webp',
    issueDate: 'September 10, 2025',
  },
  {
    title: 'AWS Partner: Sales Accreditation',
    badge: '/assets/aws-partner-sales-accreditation-badge.webp',
    issueDate: 'June 16, 2025',
  },
  {
    title: 'AWS Partner: Technical Accreditation',
    badge: '/assets/aws-partner-technical-accreditation-badge.webp',
    issueDate: 'June 16, 2025',
  },
]
