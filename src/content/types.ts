export interface HeroMetric {
  value: string
  label: string
}

export interface HeroContent {
  headlineLines: [string, string, string]
  tagline: string
  rotatorWords: string[]
  metrics: HeroMetric[]
  profileImage: string
  profileAlt: string
  floatingBadges: { icon: string; glow: 'green' | 'cyan'; title: string; desc: string }[]
  terminalCommands: { input: string; output: string }[]
}

export interface Differentiator {
  number: string
  title: string
  description: string
}

export interface InfoPill {
  label: string
  value: string
  tone?: 'success'
}

export interface AboutContent {
  bioParagraphs: string[]
  record: {
    image: string
    title: string
    context: string
    verifyUrl: string
  }
  differentiators: Differentiator[]
  overview: InfoPill[]
}
