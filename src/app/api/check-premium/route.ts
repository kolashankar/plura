import { NextRequest, NextResponse } from 'next/server'
import { checkPremiumSubscription } from '@/lib/queries'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { subaccountId } = await req.json()

    if (!subaccountId) {
      return NextResponse.json(
        { error: 'Subaccount ID is required' },
        { status: 400 }
      )
    }

    // Get the agency ID from the subaccount
    const subaccount = await db.subAccount.findUnique({
      where: { id: subaccountId },
      select: { agencyId: true },
    })

    if (!subaccount) {
      return NextResponse.json(
        { error: 'Subaccount not found' },
        { status: 404 }
      )
    }

    const isPremium = await checkPremiumSubscription(subaccount.agencyId)

    return NextResponse.json({ isPremium })
  } catch (error) {
    console.error('Error checking premium subscription:', error)
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    // For backwards compatibility, provide a default response
    return NextResponse.json({ 
      isPremium: false,
      plan: 'free',
      canDownload: false
    })
  } catch (error) {
    console.error('Error checking premium status:', error)
    return NextResponse.json({ isPremium: false, plan: 'free', canDownload: false })
  }
}