import { NextRequest, NextResponse } from 'next/server'
import { checkPremiumSubscription } from '@/lib/queries'

export async function POST(req: NextRequest) {
  try {
    const { agencyId } = await req.json()

    if (!agencyId) {
      return NextResponse.json(
        { error: 'Agency ID is required' },
        { status: 400 }
      )
    }

    const isPremium = await checkPremiumSubscription(agencyId)

    return NextResponse.json({ isPremium })
  } catch (error) {
    console.error('Error checking premium subscription:', error)
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    )
  }
}