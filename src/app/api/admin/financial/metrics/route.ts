import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Check if user is admin
    const adminUser = await db.adminUser.findUnique({
      where: { userId },
      include: { User: true }
    })

    if (!adminUser) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    // Get subscription metrics from database
    const totalSubscriptions = await db.subscription.count()
    const activeSubscriptions = await db.subscription.count({
      where: { active: true }
    })

    // Calculate basic metrics
    const totalAgencies = await db.agency.count()
    
    // Mock financial metrics - replace with actual Stripe analytics
    const mockMetrics = {
      totalRevenue: 2847650, // $28,476.50 in cents
      monthlyRevenue: 234580, // $2,345.80 in cents
      activeSubscriptions,
      churnRate: 3.2,
      averageRevenuePerUser: 4900, // $49.00 in cents
      lifetimeValue: 24500, // $245.00 in cents
      pendingPayments: 8,
      failedPayments: 15,
      refunds: 23,
      chargebacks: 3
    }

    // Log audit trail
    await db.auditLog.create({
      data: {
        action: 'VIEW_FINANCIAL_METRICS',
        entity: 'FinancialMetrics',
        adminUserId: adminUser.id,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({ metrics: mockMetrics })
  } catch (error) {
    console.error('Error fetching financial metrics:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}