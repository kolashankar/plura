import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admin users can process payouts
    const adminUser = await db.adminUser.findFirst({
      where: { userId: user.id }
    })

    if (!adminUser) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { period } = await req.json()
    
    if (!period) {
      return NextResponse.json({ error: 'Period is required (format: YYYY-MM)' }, { status: 400 })
    }

    // Calculate creator earnings for the specified period
    const startDate = new Date(`${period}-01`)
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)

    // Get all theme purchases for the period
    const themePurchases = await db.purchasedTheme.findMany({
      where: {
        purchaseDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        theme: true
      }
    })

    // Get all plugin purchases for the period
    const pluginPurchases = await db.purchasedPlugin.findMany({
      where: {
        purchaseDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        plugin: true
      }
    })

    // Group earnings by creator
    const creatorEarnings = new Map<string, { totalEarnings: number, platformFees: number }>()

    // Process theme earnings
    for (const purchase of themePurchases) {
      const creatorId = purchase.theme.authorId
      const current = creatorEarnings.get(creatorId) || { totalEarnings: 0, platformFees: 0 }
      current.totalEarnings += purchase.creatorEarnings
      current.platformFees += purchase.platformFee
      creatorEarnings.set(creatorId, current)
    }

    // Process plugin earnings
    for (const purchase of pluginPurchases) {
      const creatorId = purchase.plugin.authorId
      const current = creatorEarnings.get(creatorId) || { totalEarnings: 0, platformFees: 0 }
      current.totalEarnings += purchase.creatorEarnings
      current.platformFees += purchase.platformFee
      creatorEarnings.set(creatorId, current)
    }

    // Create payout records
    const payoutResults = []
    
    for (const [creatorId, earnings] of creatorEarnings) {
      if (earnings.totalEarnings < 10) {
        // Skip payouts under $10 minimum
        continue
      }

      // Check if payout already exists for this period
      const existingPayout = await db.creatorPayout.findUnique({
        where: {
          creatorId_period: {
            creatorId,
            period
          }
        }
      })

      if (existingPayout) {
        continue // Skip if already processed
      }

      // Create payout record
      const payout = await db.creatorPayout.create({
        data: {
          creatorId,
          period,
          totalEarnings: earnings.totalEarnings,
          platformFees: earnings.platformFees,
          payoutAmount: earnings.totalEarnings,
          status: 'PENDING'
        }
      })

      payoutResults.push(payout)
    }

    return NextResponse.json({
      message: `Processed ${payoutResults.length} payouts for period ${period}`,
      payouts: payoutResults
    })

  } catch (error) {
    console.error('Error processing payouts:', error)
    return NextResponse.json({ error: 'Failed to process payouts' }, { status: 500 })
  }
}