export const siteMeta = {
  siteUrl: 'https://rushiwagh.com',
  title: 'Rushi Wagh | AWS DevOps Consultant | Cloud Automation & Cost Optimization',
  description:
    'Rushi Wagh is a professional AWS DevOps Consultant based in Pune, India, specializing in Kubernetes, Terraform, CI/CD, cloud cost optimization, and DevSecOps. Available for freelance and consulting.',
  keywords:
    'AWS DevOps Consultant, Kubernetes Engineer, Cloud Architect, Terraform Expert, CI/CD Automation, DevSecOps, AWS Cost Optimization, Pune India, Freelance DevOps, Cloud Consulting',
  author: 'Rushi Wagh',
  ogImage: '/assets/rushi-profile1.webp',
  social: {
    email: 'rushiwagh009@gmail.com',
    phone: '+919146451558',
    whatsapp: 'https://wa.me/919146451558',
    github: 'https://github.com/rushiwagh009',
    linkedin: 'https://www.linkedin.com/in/rushi-wagh-99982223a/',
    // [[NEEDS CLIENT INPUT: real personal Calendly scheduling link]]
    calendly: 'https://calendly.com',
  },
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Rushi Wagh',
    jobTitle: 'AWS DevOps Consultant',
    description:
      'AWS DevOps Consultant specializing in cloud automation, Kubernetes, Terraform, and CI/CD',
    url: 'https://rushiwagh.com',
    email: 'rushiwagh009@gmail.com',
    telephone: '+919146451558',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Pune',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://github.com/rushiwagh009',
      'https://www.linkedin.com/in/rushi-wagh-99982223a/',
    ],
  },
} as const
