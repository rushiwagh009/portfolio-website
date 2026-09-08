export interface SkillItem {
  name: string
  percent: number
}

export interface SkillCategory {
  title: string
  logo?: string
  skills: SkillItem[]
}

// [[NEEDS CLIENT INPUT: recalibrated skill percentages — 6 of 18 below are
// maxed at 100%, which the client brief flags as undermining credibility.
// Carried over from the legacy site as-is pending real values; see
// docs/content-parity-checklist.md.]]
export const skillCategories: SkillCategory[] = [
  {
    title: 'AWS Cloud',
    logo: '/assets/aws-logo.webp',
    skills: [
      { name: 'AWS (EC2, EKS, RDS, S3, Lambda, etc.)', percent: 100 },
      { name: 'Networking (VPC, TGW, VPN, Direct Connect)', percent: 70 },
      { name: 'Cloud Security (IAM, WAF, KMS, SCPs)', percent: 80 },
    ],
  },
  {
    title: 'Containers & Orchestration',
    skills: [
      { name: 'Kubernetes (EKS, Kubeadm, Helm)', percent: 100 },
      { name: 'Docker & Docker Compose', percent: 100 },
      { name: 'Helm Charts & ArgoCD', percent: 90 },
    ],
  },
  {
    title: 'CI/CD & GitOps',
    skills: [
      { name: 'Jenkins & Pipelines', percent: 100 },
      { name: 'ArgoCD & GitOps Workflows', percent: 90 },
      { name: 'GitHub Actions', percent: 70 },
    ],
  },
  {
    title: 'IaC & Automation',
    skills: [
      { name: 'Terraform & Modules', percent: 90 },
      { name: 'Ansible & Playbooks', percent: 70 },
      { name: 'Bash Scripting', percent: 80 },
    ],
  },
  {
    title: 'Monitoring & Observability',
    skills: [
      { name: 'Prometheus & Grafana', percent: 100 },
      { name: 'Loki & VictoriaMetrics', percent: 100 },
      { name: 'ELK Stack & Fluent Bit', percent: 90 },
    ],
  },
  {
    title: 'Security (DevSecOps)',
    logo: '/assets/linux-logo.webp',
    skills: [
      { name: 'SonarQube & Trivy (SAST/CSCA)', percent: 80 },
      { name: 'OWASP ZAP (DAST)', percent: 80 },
      { name: 'Linux & OS Hardening', percent: 80 },
    ],
  },
]

export const tagDirectory: string[] = [
  'EC2',
  'VPC',
  'EKS',
  'ECS',
  'ECR',
  'RDS',
  'S3',
  'Lambda',
  'CloudFront',
  'Route 53',
  'CloudWatch',
  'SNS',
  'SQS',
  'IAM',
  'SSM',
  'Secrets Manager',
  'ACM',
  'Cost Explorer',
  'Trusted Advisor',
  'CloudTrail',
  'Transit Gateway',
  'Site-to-Site VPN',
  'AWS Config',
  'Docker',
  'Kubernetes',
  'Helm',
  'Containerd',
  'Kubectl',
  'Metrics Server',
  'NGINX Ingress',
  'AWS LB Controller',
  'Terraform',
  'Terraform Modules',
  'Remote State',
  'Ansible',
  'Ansible Roles',
  'Jenkins',
  'Jenkins Dynamic Agents',
  'GitHub Actions',
  'ArgoCD',
  'GitOps',
  'Webhooks',
  'Git',
  'GitHub',
  'Prometheus',
  'Grafana',
  'Alertmanager',
  'Loki',
  'ELK Stack',
  'Fluent Bit',
  'VictoriaMetrics',
  'SonarQube',
  'Trivy',
  'OWASP ZAP',
  'ISO 27001',
  'GDPR',
  'TCP/IP',
  'DNS',
  'DHCP',
  'SSL/TLS',
  'NGINX',
  'Apache',
  'VPN',
  'Bastion Hosts',
  'Amazon Linux',
  'RHEL',
  'CentOS',
  'Ubuntu',
  'Bash',
  'Python',
  'YAML',
  'JSON',
  'MySQL',
  'MariaDB',
  'PostgreSQL',
  'RDS Admin',
  'Agile',
  'Scrum',
  'SDLC',
]
