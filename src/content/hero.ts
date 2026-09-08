import type { HeroContent } from './types'

export const hero: HeroContent = {
  headlineLines: ['Rushi Wagh', 'AWS DevOps', 'Engineer'],
  tagline: 'Driving Business Growth Through Cloud Automation and Higher ROI',
  rotatorWords: [
    'Kubernetes Specialist',
    'Terraform Automation Expert',
    'AWS Cost Optimizer (FinOps)',
    'CI/CD Pipeline Architect',
    'DevSecOps Engineer',
  ],
  metrics: [
    { value: '2+', label: 'Years Experience' },
    { value: '28%', label: 'Cloud Cost Saved' },
    { value: '7+', label: 'Microservices Deployed' },
    { value: '4x', label: 'AWS Certified' },
  ],
  profileImage: '/assets/rushi-profile1.webp',
  profileAlt: 'Rushi Wagh - AWS DevOps Consultant',
  floatingBadges: [
    { icon: '✓', glow: 'green', title: '99.9% Uptime', desc: 'Delivered' },
    { icon: '↓', glow: 'cyan', title: '40% Cost Saved', desc: 'Infrastructure' },
  ],
  terminalCommands: [
    {
      input: 'kubectl get pods -n production',
      output: `NAMESPACE    NAME                            READY  STATUS   RESTARTS  AGE
production   eks-rushi-api-7c4fd9bb-a12b     1/1    Running  0         42d
production   eks-rushi-web-96f7c8d9-f56g     1/1    Running  0         42d
production   db-postgres-master-0            1/1    Running  0         180d
production   monitoring-prometheus-0         2/2    Running  0         90d`,
    },
    {
      input: 'terraform plan',
      output: `Terraform will perform the following actions:
  ~ module.security_groups.aws_security_group.ingress
      ~ description = "Allow load balancer traffic" -> "Secure load balancer entry"
  + module.vpc.aws_subnet.public_subnet_c
      cidr_block = "10.0.3.0/24"

Plan: 1 to add, 1 to change, 0 to destroy.`,
    },
    {
      input: 'aws s3 ls --human-readable',
      output: `2024-03-12 08:24:11   0 Bytes   rushi-wagh-tf-state
2024-05-18 14:15:30   2.4 GiB   rushi-wagh-velero-backups
2026-06-01 10:05:02  15.1 MiB   rushi-wagh-cost-reports-2026`,
    },
  ],
}
