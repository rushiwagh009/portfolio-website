import type { AboutContent } from './types'

export const about: AboutContent = {
  bioParagraphs: [
    "I'm Rushi Wagh, a DevOps Engineer specializing in AWS Cloud, Kubernetes, Infrastructure as Code, and CI/CD automation. I help organizations build scalable, secure, and cost-effective cloud environments that improve operational efficiency and maximize ROI.",
    'My expertise includes AWS cloud cost optimization, greenfield cloud deployments, infrastructure migration, and designing automated deployment pipelines. With hands-on experience architecting cloud solutions, implementing Kubernetes platforms, and managing production workloads, I transform complex infrastructure into reliable, automated systems that enable businesses to innovate faster, reduce costs, and scale with confidence.',
  ],
  record: {
    image: '/assets/guiness_world_record.webp',
    title: 'Guinness World Record Holder',
    // [[NEEDS CLIENT INPUT: one-line context on what the record is for/when — see docs/content-parity-checklist.md]]
    context: '[[NEEDS CLIENT INPUT: record context]]',
    verifyUrl: 'https://www.linkedin.com/in/rushi-wagh-99982223a/details/certifications/',
  },
  differentiators: [
    {
      number: '01',
      title: 'Business-First Mindset',
      description:
        'Every engineering initiative is driven by clear business value and ROI alignment.',
    },
    {
      number: '02',
      title: 'AWS Cost Optimization',
      description:
        'Proven metrics in pruning wasteful cloud resources, saving an average of 28%+ monthly.',
    },
    {
      number: '03',
      title: 'Greenfield Deployments',
      description:
        'Architecting production-ready networks, security configurations, and integrations from scratch.',
    },
    {
      number: '04',
      title: 'Security-Conscious',
      description:
        'DevSecOps integration: vulnerability scans, SAST/DAST, and secure IAM privileges at all steps.',
    },
    {
      number: '05',
      title: 'Kubernetes & Cloud-Native',
      description:
        'Production-grade container deployment, configuration management, and cluster automation.',
    },
    {
      number: '06',
      title: 'End-to-End Ownership',
      description:
        'From initial design workshops, terraform templating, to operational runbooks and pager alerts.',
    },
  ],
  overview: [
    { label: 'EXPERIENCE', value: '2+ Years in AWS & DevOps' },
    { label: 'PRIMARY REGIONS', value: 'Pune, Maharashtra, India (Hybrid/Remote)' },
    { label: 'CERTIFICATIONS', value: '4x AWS Certified Architect & Partner' },
    { label: 'EDUCATION', value: 'B.Tech Computer Engineering, SVPCET (2024)' },
    { label: 'ACADEMIC RESEARCH', value: 'Published 2 papers (GAMEOPS + Digital Forensics)' },
    { label: 'AVAILABILITY', value: 'Open for Consulting & Contracts', tone: 'success' },
    { label: 'ENGAGEMENT MODEL', value: 'Direct Freelance, B2B Consulting, Agency Contracts' },
  ],
}
