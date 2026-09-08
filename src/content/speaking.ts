export interface SpeakingEvent {
  icon: string
  title: string
  org: string
  description: string
}

export const speakingEvents: SpeakingEvent[] = [
  {
    icon: '🎤',
    title: 'Alumni Interaction Speaker',
    org: 'SVPCET Nagpur',
    description:
      'Delivering interactive sessions for engineering students on transitioning from academic coding to cloud infrastructure, DevOps practices, and career paths in cloud-native industries.',
  },
  {
    icon: '🛠️',
    title: 'Technical Workshop Conductor',
    org: 'Phoenix Cybersecurity Club',
    description:
      'Leading hands-on deep-dives into AWS VPC networks, Docker containers, Kubernetes EKS configs, and security tools (SonarQube, Trivy) for student communities and cybersecurity enthusiasts.',
  },
]
