import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ isPremium: false, plan: 'free' })
    }

    // Check if user has any active subscription
    const userSubscription = await db.subscription.findFirst({
      where: {
        userId: user.id,
        active: true,
      },
    })

    const plan = userSubscription?.plan || 'free'
    const isPremium = ['basic', 'unlimited'].includes(plan)

    return NextResponse.json({ 
      isPremium,
      plan,
      canDownload: isPremium
    })
  } catch (error) {
    console.error('Error checking premium status:', error)
    return NextResponse.json({ isPremium: false, plan: 'free', canDownload: false })
  }
}