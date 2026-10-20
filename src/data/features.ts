import automationIcon from '../assets/icons/feature-automation.svg'
import collaborationIcon from '../assets/icons/feature-collaboration.svg'
import planningIcon from '../assets/icons/feature-planning.svg'

export type FeatureIcon = { src: string } | { text: string; background: string }

export type Feature = {
  title: string
  description: string
  // Figma uses shorter copy in the 375px cards, which have a fixed 76px height.
  shortDescription: string
  icon: FeatureIcon
}

export const features: Feature[] = [
  {
    title: 'Smart Task Planning',
    description: 'Automatically break down goals into actionable tasks with AI.',
    shortDescription: 'Break goals into actionable tasks.',
    icon: { src: planningIcon },
  },
  {
    title: 'AI Suggestions',
    description: 'Get intelligent suggestions to improve your workflow.',
    shortDescription: 'Get intelligent workflow suggestions.',
    icon: { text: 'AI', background: '#8a5cff' },
  },
  {
    title: 'Team Collaboration',
    description: 'Keep everyone aligned with real-time updates.',
    shortDescription: 'Keep everyone aligned in real time.',
    icon: { src: collaborationIcon },
  },
  {
    title: 'Automated Workflows',
    description: 'Save time by automating repetitive tasks.',
    shortDescription: 'Automate repetitive work.',
    icon: { src: automationIcon },
  },
]
