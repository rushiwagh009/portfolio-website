export type ProjectCategory = 'kubernetes' | 'finops' | 'devsecops' | 'observability' | 'ctf'

export interface ProjectMetric {
  value: string
  label: string
  tone?: 'success'
}

export interface CaseStudy {
  slug: string
  category: ProjectCategory
  badgeLabel: string
  badgeTone?: 'warning' | 'danger' | 'cyan' | 'primary'
  title: string
  problem: string
  solution: string
  techTags: string[]
  metrics: ProjectMetric[]
  featured?: boolean
  achievements?: string[]
  pipelineFlow?: string[]
  architectureImage?: string
  linkBadge?: string
}

export const filterTabs: { label: string; value: 'all' | ProjectCategory }[] = [
  { label: 'All Projects', value: 'all' },
  { label: 'Kubernetes / EKS', value: 'kubernetes' },
  { label: 'FinOps & Cost', value: 'finops' },
  { label: 'DevSecOps', value: 'devsecops' },
  { label: 'Observability', value: 'observability' },
  { label: 'CTF Platform', value: 'ctf' },
]

export const caseStudies: CaseStudy[] = [
  {
    slug: 'eks-multi-az',
    category: 'kubernetes',
    badgeLabel: 'Hero Project',
    featured: true,
    title: 'Multi-AZ Kubernetes Platform for Microservices on AWS EKS',
    problem:
      'Organization required a scalable, highly available, production-ready platform to host multiple microservices with reliability, observability, backup, and centralized logging.',
    solution:
      'Deployed a production-grade Kubernetes platform on AWS EKS hosting 7+ microservices with Multi-AZ architecture, centralized logging, monitoring, automated backups, internal load balancing, and secure service discovery.',
    achievements: [
      'Successfully deployed and managed 7+ production microservices on EKS',
      'Implemented Multi-AZ high availability architecture',
      'Centralized monitoring and logging stack with Loki + Grafana',
      'Automated Kubernetes backup and recovery using Velero',
      'Secure internal application exposure through Internal Load Balancers',
    ],
    techTags: [
      'AWS EKS',
      'EC2',
      'RDS',
      'S3',
      'Route 53',
      'Kubernetes',
      'Helm',
      'Prometheus',
      'Grafana',
      'Loki',
      'VictoriaMetrics',
      'Velero',
      'Docker',
    ],
    metrics: [
      { value: '7+', label: 'Microservices' },
      { value: '99.9%', label: 'Uptime' },
      { value: 'Multi-AZ', label: 'HA Architecture' },
      { value: 'Automated', label: 'Backup / Recovery' },
    ],
    architectureImage: '/assets/3tier-arch.webp',
    linkBadge: 'GitHub Private',
  },
  {
    slug: 'finops-assessment',
    category: 'finops',
    badgeLabel: 'FinOps',
    badgeTone: 'warning',
    title: 'AWS Cloud Cost Optimization & FinOps Assessment',
    problem:
      'Organization experienced increasing AWS costs without visibility into resource utilization and optimization opportunities.',
    solution:
      'Conducted detailed FinOps assessment, analyzed utilization patterns, identified waste, rightsized workloads, optimized storage and compute, and implemented cost governance recommendations.',
    techTags: ['AWS Cost Explorer', 'Trusted Advisor', 'CloudWatch', 'EC2', 'EBS', 'RDS', 'S3'],
    metrics: [
      { value: '28%', label: 'Monthly Spend Reduced', tone: 'success' },
      { value: '100%', label: 'Resource Visibility' },
    ],
  },
  {
    slug: 'devsecops-pipeline',
    category: 'devsecops',
    badgeLabel: 'DevSecOps',
    badgeTone: 'danger',
    title: 'Automated DevSecOps Pipeline using Jenkins & ArgoCD',
    problem:
      'Manual releases lacking security validation caused deployment delays and high operational vulnerability risk.',
    solution:
      'Designed and deployed a fully automated CI/CD pipeline integrating static scans, container validation, dynamic tests, and GitOps promotions.',
    pipelineFlow: [
      'Code Check',
      'App Build',
      'SAST (SonarQube)',
      'Docker Build',
      'Vulnerability Scan (Trivy)',
      'ECR Push',
      'Deploy to UAT',
      'DAST (OWASP ZAP)',
      'Prod via ArgoCD',
    ],
    techTags: [
      'Jenkins',
      'ArgoCD',
      'Docker',
      'AWS ECR',
      'Kubernetes',
      'SonarQube',
      'Trivy',
      'OWASP ZAP',
    ],
    metrics: [
      { value: 'Zero', label: 'Manual Releases', tone: 'success' },
      { value: '100%', label: 'Security Compliant' },
    ],
  },
  {
    slug: 'observability-platform',
    category: 'observability',
    badgeLabel: 'Observability',
    badgeTone: 'cyan',
    title: 'Centralized Monitoring, Logging & Observability Platform',
    problem:
      'Engineering teams lacked centralized visibility into infrastructure health and application performance, causing delayed incident detection.',
    solution:
      'Complete monitoring and observability stack with metrics collection, visualization, centralized logging, alerting, and performance monitoring.',
    techTags: ['Prometheus', 'Grafana', 'Loki', 'VictoriaMetrics', 'Alertmanager', 'CloudWatch'],
    metrics: [
      { value: '30%', label: 'Faster Resolution', tone: 'success' },
      { value: '360°', label: 'Operational View' },
    ],
  },
  {
    slug: 'ctfd-platform',
    category: 'ctf',
    badgeLabel: 'CTF Platform',
    badgeTone: 'primary',
    title: 'Cloud-Native CTFd Platform Deployment & Operations',
    problem:
      'Cybersecurity organization required a scalable platform to host CTF competitions for hundreds of participants.',
    solution:
      'Designed, deployed, and managed a containerized CTFd platform on AWS with full networking, load balancing, monitoring, and infrastructure management.',
    techTags: ['AWS EC2', 'Docker', 'NGINX', 'Load Balancer', 'VPC', 'VPN'],
    metrics: [
      { value: '10', label: 'EC2 instances' },
      { value: 'Hundreds', label: 'Live Competitors', tone: 'success' },
    ],
  },
]
