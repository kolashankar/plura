import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Try to find user in agency system
    let userSubscription = await db.user.findUnique({
      where: { email: user.emailAddresses[0]?.emailAddress },
      include: {
        Agency: {
          include: {
            Subscription: true
          }
        }
      }
    })

    // If not found in agency, check individual subscriptions
    if (!userSubscription) {
      const individual = await db.individual.findFirst({
        where: { 
          email: user.emailAddresses[0]?.emailAddress 
        },
        include: {
          Subscription: true
        }
      })

      if (individual?.Subscription) {
        return NextResponse.json({
          plan: individual.Subscription.plan || 'free',
          aiCreditsUsed: 0, // Would fetch from usage tracking table
          automationCount: 0, // Would count automations
          funnelCount: 0, // Would count funnels
          pageCount: 0, // Would count pages
          subscriptionId: individual.Subscription.id,
          active: individual.Subscription.active
        })
      }
    }

    // Check agency subscription
    const agencySubscription = userSubscription?.Agency?.Subscription
    if (agencySubscription?.active) {
      return NextResponse.json({
        plan: agencySubscription.plan || 'free',
        aiCreditsUsed: 0, // Would fetch from usage tracking table
        automationCount: 0, // Would count automations
        funnelCount: 0, // Would count funnels
        pageCount: 0, // Would count pages
        subscriptionId: agencySubscription.id,
        active: agencySubscription.active
      })
    }

    // Default to free plan
    return NextResponse.json({
      plan: 'free',
      aiCreditsUsed: 0,
      automationCount: 0,
      funnelCount: 0,
      pageCount: 0,
      subscriptionId: null,
      active: false
    })

  } catch (error) {
    console.error('Error fetching user subscription:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    )
  }
}