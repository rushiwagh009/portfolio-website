export interface SelectOption {
  value: string
  label: string
}

export const serviceOptions: SelectOption[] = [
  { value: 'aws-infrastructure', label: 'AWS Cloud Infrastructure & Architecture' },
  { value: 'cloud-migration', label: 'Cloud Migration Services' },
  { value: 'cost-optimization', label: 'AWS Cost Optimization (FinOps)' },
  { value: 'devops-implementation', label: 'DevOps Implementation & Automation' },
  { value: 'cicd-pipelines', label: 'CI/CD Pipeline Development' },
  { value: 'kubernetes-management', label: 'Kubernetes Consulting & Management' },
  { value: 'iac-terraform', label: 'Infrastructure as Code (Terraform/Ansible)' },
  { value: 'containerization', label: 'Containerization Services (Docker)' },
  { value: 'monitoring-observability', label: 'Monitoring, Logging & Observability' },
  { value: 'cloud-security', label: 'Cloud Security & Best Practices (ISO 27001)' },
  { value: 'production-support', label: 'Production Support & SRE' },
  { value: 'greenfield-deployments', label: 'Greenfield Cloud Deployments' },
]

// Converted from the legacy INR-only tiers to USD, reframed for the
// international-consulting positioning rather than a straight FX conversion.
export const budgetOptions: SelectOption[] = [
  { value: 'tier-1', label: 'Under $1,000' },
  { value: 'tier-2', label: '$1,000 – $5,000' },
  { value: 'tier-3', label: '$5,000 – $15,000' },
  { value: 'tier-4', label: '$15,000+' },
  { value: 'tier-not-sure', label: "Not sure yet — let's discuss" },
]

export interface ContactMethod {
  title: string
  href: string
  label: string
  external?: boolean
}

export const contactMethods: ContactMethod[] = [
  {
    title: 'Email Correspondence',
    href: 'mailto:rushiwagh009@gmail.com',
    label: 'rushiwagh009@gmail.com',
  },
  { title: 'WhatsApp / Voice', href: 'tel:+919146451558', label: '+91 9146451558' },
  {
    title: 'LinkedIn Network',
    href: 'https://www.linkedin.com/in/rushi-wagh-99982223a/',
    label: 'linkedin.com/in/rushi-wagh-99982223a',
    external: true,
  },
  {
    title: 'GitHub Codebase',
    href: 'https://github.com/rushiwagh009',
    label: 'github.com/rushiwagh009',
    external: true,
  },
]
