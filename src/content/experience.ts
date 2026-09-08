export interface ExperienceRole {
  duration: string
  title: string
  company: string
  achievements: string[]
}

export const experience: ExperienceRole[] = [
  {
    duration: 'May 2025 – Present',
    title: 'DevOps Engineer',
    company: 'Cloud Consulting & Service Provider (Confidential)',
    achievements: [
      'Successfully deployed and managed 7+ production microservices on AWS EKS in Multi-AZ HA architecture.',
      'Reduced infrastructure provisioning effort by 40% through Terraform and Ansible automation.',
      'Built secure DevSecOps pipelines integrating SAST, DAST, and container security scanning.',
      'Accelerated Infrastructure as Code adoption, reducing deployment timelines from 7 days to 3 days.',
      'Identified AWS cloud cost reduction opportunities of 28%+ through FinOps-driven optimization.',
      'Improved resource utilization efficiency by 40%+ across Kubernetes environments.',
      'Implemented comprehensive observability using Prometheus, Grafana, CloudWatch, Loki, and Jaeger.',
      'Increased patch compliance by 70% through automated patch management frameworks.',
    ],
  },
  {
    duration: 'January 2024 – April 2025',
    title: 'Cloud Infrastructure Engineer',
    company: 'Cloud Consulting & Service Provider (Confidential)',
    achievements: [
      'Built centralized monitoring solutions for EC2, RDS, and EKS environments.',
      'Automated deployment of CloudWatch Agent, Fluentd, Node Exporter, Loki, and Jaeger.',
      'Reduced troubleshooting and bottleneck identification time by 30%.',
      'Implemented cluster, node, pod, and application-level Kubernetes observability.',
    ],
  },
  {
    duration: 'January 2023 – Present',
    title: 'Founding Member & DevOps Lead',
    company: 'Phoenix Cybersecurity Club — SVPCET Nagpur',
    achievements: [
      'Built and operated large-scale CTF infrastructure supporting 25+ containerized challenges and 350+ participants.',
      'Grew and led a community of 20+ active members and 35+ alumni across the industry.',
      'Delivered workshops on cloud computing, DevOps, and cybersecurity for aspiring future engineers.',
      'Maintained highly available infrastructure supporting live events and training exercises.',
      'Led financial planning for major club events and managed club finances, budgeting, and expense tracking.',
    ],
  },
]
