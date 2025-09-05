import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSessionFromCookies } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    const adminSession = await getAdminSessionFromCookies(req.headers.get('cookie') || '')
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const timeRange = searchParams.get('timeRange') || '30d'

    // Calculate date range for queries
    const now = new Date()
    const startDate = new Date()
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Get individual users statistics
    const [
      totalIndividuals,
      activeIndividuals,
      premiumIndividuals,
      totalAgencies,
      activeAgencies,
      totalSubAccounts
    ] = await Promise.all([
      db.individual.count(),
      db.individual.count({ where: { isActive: true } }),
      db.individual.count({ 
        where: { 
          Subscription: { 
            plan: { in: ['BASIC', 'UNLIMITED'] },
            active: true 
          } 
        } 
      }),
      db.agency.count(),
      db.agency.count({ where: { isActive: true } }),
      db.subAccount.count()
    ])

    // Get revenue data (mock for now, would come from Stripe/payment system)
    const revenue = {
      monthly: 45680 + Math.floor(Math.random() * 10000),
      total: 1234567 + Math.floor(Math.random() * 100000),
      growth: Math.floor(Math.random() * 20) + 5
    }

    // Get marketplace statistics (mock for now since marketplace tables may not exist)
    const totalProducts = Math.floor(Math.random() * 200) + 100
    const activeProducts = Math.floor(totalProducts * 0.8)

    // Get automation statistics  
    const totalForms = await db.funnelPage.count()
    const submissions = Math.floor(Math.random() * 50000) + 10000 // Would come from form submission tracking
    const activeWorkflows = Math.floor(Math.random() * 1000) + 500 // Would come from automation system

    const stats = {
      individuals: {
        total: totalIndividuals,
        active: activeIndividuals,
        premium: premiumIndividuals,
        growth: Math.floor(Math.random() * 20) + 5
      },
      agencies: {
        total: totalAgencies,
        active: activeAgencies,
        subaccounts: totalSubAccounts,
        growth: Math.floor(Math.random() * 15) + 3
      },
      revenue,
      marketplace: {
        totalProducts,
        activeProducts,
        totalSales: Math.floor(Math.random() * 5000) + 2000
      },
      automations: {
        totalForms,
        submissions,
        activeWorkflows
      }
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Admin dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}