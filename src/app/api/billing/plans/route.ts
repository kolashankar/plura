import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'

export interface PricingPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'monthly' | 'yearly'
  features: string[]
  limits: {
    funnels: number
    pages: number
    storage: string
    bandwidth: string
    users: number
    automations: number
    aiCredits: number
    customDomains: number
    analytics: boolean
    whiteLabel: boolean
    themeSelling: boolean
    priority: 'low' | 'medium' | 'high'
  }
  popular?: boolean
  stripePriceId?: string
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Basic funnel builder',
      'Up to 3 funnels',
      'Up to 10 pages',
      'Basic templates',
      'Community support',
      '500MB storage'
    ],
    limits: {
      funnels: 3,
      pages: 10,
      storage: '500MB',
      bandwidth: '1GB',
      users: 1,
      automations: 0,
      aiCredits: 0,
      customDomains: 0,
      analytics: false,
      whiteLabel: false,
      themeSelling: false,
      priority: 'low'
    }
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 49,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Advanced funnel builder',
      'Unlimited funnels',
      'Unlimited pages',
      'AI component generation',
      'Premium templates',
      'Email support',
      '10GB storage',
      'Custom branding'
    ],
    limits: {
      funnels: -1, // unlimited
      pages: -1, // unlimited
      storage: '10GB',
      bandwidth: '50GB',
      users: 5,
      automations: 0,
      aiCredits: 1000,
      customDomains: 3,
      analytics: true,
      whiteLabel: false,
      themeSelling: false,
      priority: 'medium'
    },
    popular: true
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    price: 199,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Everything in Basic',
      'Advanced automations',
      'Social media scheduler',
      'Lead nurturing workflows',
      'Advanced analytics',
      'White-label options',
      'Priority support',
      '100GB storage',
      'API access'
    ],
    limits: {
      funnels: -1,
      pages: -1,
      storage: '100GB',
      bandwidth: '500GB',
      users: 25,
      automations: -1, // unlimited
      aiCredits: 10000,
      customDomains: 10,
      analytics: true,
      whiteLabel: true,
      themeSelling: false,
      priority: 'high'
    }
  },
  {
    id: 'agency',
    name: 'Agency Pro',
    price: 450,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Everything in Unlimited',
      'Theme marketplace access',
      'Sell custom themes',
      'Multi-agency management',
      'Sub-account billing',
      'Advanced reporting',
      'Dedicated account manager',
      'Unlimited storage',
      'Custom integrations'
    ],
    limits: {
      funnels: -1,
      pages: -1,
      storage: 'unlimited',
      bandwidth: 'unlimited',
      users: -1, // unlimited
      automations: -1,
      aiCredits: -1, // unlimited
      customDomains: -1, // unlimited
      analytics: true,
      whiteLabel: true,
      themeSelling: true,
      priority: 'high'
    }
  }
]

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({
      plans: PRICING_PLANS,
      success: true
    })
  } catch (error) {
    console.error('Error fetching pricing plans:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pricing plans' },
      { status: 500 }
    )
  }
}