import type { ReactNode } from 'react'

export interface Service {
  title: string
  description: string
  icon: ReactNode
}

const iconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '2',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const services: Service[] = [
  {
    title: 'AWS Cloud Infrastructure & Architecture',
    description:
      'Designing, deploying, and managing secure, scalable, highly available AWS environments for startups, SMEs, and growing businesses.',
    icon: (
      <svg {...iconProps}>
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    ),
  },
  {
    title: 'Cloud Migration Services',
    description:
      'Seamless migration from on-premises or other cloud providers to AWS with minimal downtime and zero data loss.',
    icon: (
      <svg {...iconProps}>
        <path d="M12 22v-8M17 17l-5-5-5 5M12 12V2M17 7l-5-5-5 5"></path>
      </svg>
    ),
  },
  {
    title: 'AWS Cost Optimization',
    description:
      'Analyzing cloud environments, identifying waste, rightsizing resources, and implementing cost-saving strategies to maximize ROI.',
    icon: (
      <svg {...iconProps}>
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    ),
  },
  {
    title: 'DevOps Implementation & Automation',
    description:
      'Building end-to-end DevOps workflows to improve deployment speed, reliability, and operational efficiency.',
    icon: (
      <svg {...iconProps}>
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
        <rect x="9" y="9" width="6" height="6"></rect>
        <line x1="9" y1="1" x2="9" y2="4"></line>
        <line x1="15" y1="1" x2="15" y2="4"></line>
        <line x1="9" y1="20" x2="9" y2="23"></line>
        <line x1="15" y1="20" x2="15" y2="23"></line>
        <line x1="20" y1="9" x2="23" y2="9"></line>
        <line x1="20" y1="15" x2="23" y2="15"></line>
        <line x1="1" y1="9" x2="4" y2="9"></line>
        <line x1="1" y1="15" x2="4" y2="15"></line>
      </svg>
    ),
  },
  {
    title: 'CI/CD Pipeline Development',
    description:
      'Automated build, test, and deployment pipelines using Jenkins, GitHub Actions, and ArgoCD.',
    icon: (
      <svg {...iconProps}>
        <circle cx="18" cy="18" r="3"></circle>
        <circle cx="6" cy="6" r="3"></circle>
        <circle cx="6" cy="18" r="3"></circle>
        <line x1="6" y1="9" x2="6" y2="15"></line>
        <path d="M9 6h9a3 3 0 0 1 3 3v6"></path>
      </svg>
    ),
  },
  {
    title: 'Kubernetes Consulting & Management',
    description:
      'Deploying, configuring, and managing Kubernetes clusters on AWS EKS and on-premises with full monitoring.',
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 2v20M2 12h20M12 12a15.3 15.3 0 0 1 4-10M12 12a15.3 15.3 0 0 0 4 10M12 12a15.3 15.3 0 0 1-4-10M12 12a15.3 15.3 0 0 0-4 10"></path>
      </svg>
    ),
  },
  {
    title: 'Infrastructure as Code (IaC)',
    description:
      'Automating cloud infrastructure provisioning using Terraform and Ansible for consistency and speed.',
    icon: (
      <svg {...iconProps}>
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    ),
  },
  {
    title: 'Containerization Services',
    description:
      'Containerizing applications with Docker and implementing orchestration platforms for portability and scalability.',
    icon: (
      <svg {...iconProps}>
        <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <line x1="12" y1="2" x2="12" y2="22"></line>
      </svg>
    ),
  },
  {
    title: 'Monitoring, Logging & Observability',
    description:
      'Prometheus, Grafana, CloudWatch, ELK Stack solutions for complete infrastructure and application visibility.',
    icon: (
      <svg {...iconProps}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    ),
  },
  {
    title: 'Cloud Security & Best Practices',
    description:
      'IAM policies, network security, secrets management, and cloud governance aligned with ISO 27001.',
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    ),
  },
  {
    title: 'Production Support & SRE',
    description:
      'Supporting mission-critical applications, troubleshooting infrastructure, and optimizing system performance.',
    icon: (
      <svg {...iconProps}>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
      </svg>
    ),
  },
  {
    title: 'Greenfield Cloud Deployments',
    description:
      'Building complete cloud environments from scratch — networking, security, compute, CI/CD, monitoring, and operational readiness.',
    icon: (
      <svg {...iconProps}>
        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
      </svg>
    ),
  },
]
