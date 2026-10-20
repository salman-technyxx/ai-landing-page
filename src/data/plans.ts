export type Plan = {
  id: string
  name: string
  // Monthly price in dollars. Figma shows monthly pricing only (no yearly prices exist).
  price: number
  tagline: string
  features: string[]
  featured?: boolean
}

export const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    tagline: 'For individuals getting started',
    features: ['Up to 3 projects', 'Basic AI suggestions', 'Community support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19,
    tagline: 'For growing teams',
    features: ['Unlimited projects', 'Advanced AI suggestions', 'Team collaboration', 'Priority support'],
    featured: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: 49,
    tagline: 'For larger organizations',
    features: ['Everything in Pro', 'Advanced automations', 'Custom integrations', 'Dedicated support'],
  },
]
