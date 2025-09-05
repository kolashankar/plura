
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'

export async function GET(
  req: NextRequest,
  { params }: { params: { subaccountId: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const timeRange = searchParams.get('range') || '30d'
    const type = searchParams.get('type') || 'overview'

    let dateFilter = {}
    if (timeRange === '7d') {
      dateFilter = { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    } else if (timeRange === '30d') {
      dateFilter = { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }

    switch (type) {
      case 'funnels':
        const funnelAnalytics = await db.funnel.findMany({
          where: { subAccountId: params.subaccountId },
          include: {
            FunnelPages: {
              select: {
                visits: true,
                name: true,
                createdAt: true
              }
            }
          }
        })
        
        return NextResponse.json({
          funnels: funnelAnalytics.map(funnel => ({
            id: funnel.id,
            name: funnel.name,
            totalVisits: funnel.FunnelPages.reduce((sum, page) => sum + page.visits, 0),
            conversionRate: Math.random() * 15 + 5, // Replace with actual calculation
            revenue: Math.random() * 10000
          }))
        })

      case 'team':
        const teamStats = await db.user.findMany({
          where: {
            Permissions: {
              some: {
                subAccountId: params.subaccountId,
                access: true
              }
            }
          },
          include: {
            Ticket: {
              where: { createdAt: dateFilter }
            }
          }
        })

        return NextResponse.json({
          teamMembers: teamStats.length,
          activeUsers: teamStats.filter(u => u.Ticket.length > 0).length,
          productivity: teamStats.map(user => ({
            name: user.name,
            tasksCompleted: user.Ticket.length,
            role: user.role
          }))
        })

      default:
        // Overview analytics
        const overview = {
          totalFunnels: await db.funnel.count({ where: { subAccountId: params.subaccountId } }),
          totalVisits: await db.funnelPage.aggregate({
            where: { Funnel: { subAccountId: params.subaccountId } },
            _sum: { visits: true }
          }),
          activeDeployments: await db.deployment.count({
            where: { subAccountId: params.subaccountId, status: 'DEPLOYED' }
          }),
          teamSize: await db.user.count({
            where: {
              Permissions: {
                some: {
                  subAccountId: params.subaccountId,
                  access: true
                }
              }
            }
          })
        }

        return NextResponse.json(overview)
    }
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
