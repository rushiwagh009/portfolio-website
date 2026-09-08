export interface DioramaNode {
  id: string
  label: string
  description: string
}

export const eksDioramaNodes: DioramaNode[] = [
  {
    id: 'overview',
    label: 'Overview',
    description:
      'A production-grade Kubernetes platform on AWS EKS hosting 7+ microservices, spread across three Availability Zones for high availability.',
  },
  {
    id: 'az1',
    label: 'AZ-1 Node Group',
    description:
      'EKS worker nodes running production microservice pods, isolated to Availability Zone 1 so a single-AZ outage never takes the whole platform down.',
  },
  {
    id: 'az2',
    label: 'AZ-2 Node Group',
    description:
      'A second, independent set of EKS worker nodes in Availability Zone 2 — the Kubernetes scheduler spreads replicas across all three zones automatically.',
  },
  {
    id: 'az3',
    label: 'AZ-3 Node Group',
    description:
      'The third EKS node group, completing the Multi-AZ architecture that delivers 99.9% uptime for the hosted microservices.',
  },
  {
    id: 'lb',
    label: 'Internal Load Balancer',
    description:
      'Routes traffic between microservices via secure internal load balancers, keeping service-to-service communication off the public internet.',
  },
  {
    id: 'observability',
    label: 'Observability Stack',
    description:
      'Centralized monitoring and logging with Prometheus, Grafana, Loki, and VictoriaMetrics, plus automated backup and recovery via Velero.',
  },
]
