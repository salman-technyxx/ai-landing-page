// Options exactly as written in the assessment brief.
export const teamSizes = ['1-10', '11-50', '51-200', '200+'] as const
export const demoTimes = ['Morning', 'Afternoon', 'Evening'] as const

export type TeamSize = (typeof teamSizes)[number]
export type DemoTime = (typeof demoTimes)[number]

// Choosing this team size reveals the required "Preferred Demo Time" field.
export const DEMO_TIME_TEAM_SIZE: TeamSize = '200+'

export const NAME_MIN_LENGTH = 3
export const MESSAGE_MIN_LENGTH = 20
export const MESSAGE_MAX_LENGTH = 300

export const SUBMIT_DELAY_MS = 1000
export const SUCCESS_MESSAGE = 'Thanks! Our team will contact you shortly.'
