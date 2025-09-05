import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const creatorId = searchParams.get('creatorId')
    const period = searchParams.get('period')

    if (!creatorId || !period) {
      return NextResponse.json({ 
        error: 'Creator ID and period are required' 
      }, { status: 400 })
    }

    // Calculate earnings for themes and plugins
    const startDate = new Date(`${period}-01`)
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)

    const [themeEarnings, pluginEarnings] = await Promise.all([
      db.purchasedTheme.aggregate({
        where: {
          theme: { authorId: creatorId },
          purchaseDate: {
            gte: startDate,
            lte: endDate
          }
        },
        _sum: {
          creatorEarnings: true,
          platformFee: true
        },
        _count: {
          id: true
        }
      }),
      db.purchasedPlugin.aggregate({
        where: {
          plugin: { authorId: creatorId },
          purchaseDate: {
            gte: startDate,
            lte: endDate
          }
        },
        _sum: {
          creatorEarnings: true,
          platformFee: true
        },
        _count: {
          id: true
        }
      })
    ])

    const totalEarnings = (themeEarnings._sum.creatorEarnings || 0) + (pluginEarnings._sum.creatorEarnings || 0)
    const totalPlatformFees = (themeEarnings._sum.platformFee || 0) + (pluginEarnings._sum.platformFee || 0)
    const totalSales = (themeEarnings._count.id || 0) + (pluginEarnings._count.id || 0)

    // Check for existing payout
    const existingPayout = await db.creatorPayout.findUnique({
      where: {
        creatorId_period: {
          creatorId,
          period
        }
      }
    })

    return NextResponse.json({
      creatorId,
      period,
      totalEarnings,
      totalPlatformFees,
      totalSales,
      payoutStatus: existingPayout?.status || 'NOT_CREATED',
      minimumPayout: 10.00,
      eligibleForPayout: totalEarnings >= 10.00
    })

  } catch (error) {
    console.error('Error calculating creator earnings:', error)
    return NextResponse.json({ error: 'Failed to calculate earnings' }, { status: 500 })
  }
}