export type FeatureTabData = {
  id: string
  label: string
  title: string
  description: string
  stat: { percent: number; label: string }
}

// Plan is the only tab designed in Figma. The Automate and Collaborate copy and their
// percentages are short placeholders written in the same style: they are illustrative
// demo figures, not real customer claims.
export const featureTabs: FeatureTabData[] = [
  {
    id: 'plan',
    label: 'Plan',
    title: 'Break goals into clear tasks',
    description: 'AI-assisted planning keeps priorities visible and actionable.',
    stat: { percent: 40, label: 'Less manual work' },
  },
  {
    id: 'automate',
    label: 'Automate',
    title: 'Let routine work run itself',
    description: 'Automated workflows handle repetitive steps so your team can focus on what matters.',
    stat: { percent: 65, label: 'Fewer repetitive tasks' },
  },
  {
    id: 'collaborate',
    label: 'Collaborate',
    title: 'Keep everyone on the same page',
    description: 'Shared boards and real-time updates keep the whole team aligned.',
    stat: { percent: 85, label: 'Team aligned' },
  },
]
