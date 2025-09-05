
import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { 
  getPlatformAnalytics, 
  updatePlatformAnalytics,
  getAdminUser,
  createAuditLog 
} from '@/lib/queries'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminUser = await getAdminUser(user.id)
    if (!adminUser) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    // Get platform analytics
    const analytics = await getPlatformAnalytics(
      dateFrom ? new Date(dateFrom) : undefined,
      dateTo ? new Date(dateTo) : undefined
    )

    // Get real-time stats
    const totalUsers = await db.user.count()
    const totalAgencies = await db.agency.count()
    const totalSubAccounts = await db.subAccount.count()
    const activeUsers = await db.user.count({
      where: {
        lastLoginAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    })

    const realtimeStats = {
      totalUsers,
      totalAgencies,
      totalSubAccounts,
      activeUsers
    }

    await createAuditLog(
      adminUser.id,
      'VIEW_ANALYTICS',
      'Analytics',
      undefined,
      undefined,
      undefined,
      req.headers.get('x-forwarded-for') || 'unknown',
      req.headers.get('user-agent') || 'unknown'
    )

    return NextResponse.json({ analytics, realtimeStats })
  } catch (error) {
    console.error('Admin analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
