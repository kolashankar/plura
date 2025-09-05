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

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const plan = searchParams.get('plan')

    // Get subscriptions from database
    const subscriptions = await db.subscription.findMany({
      where: {
        ...(status && status !== 'all' ? { active: status === 'active' } : {}),
        ...(plan && plan !== 'all' ? { plan } : {}),
        ...(search ? {
          OR: [
            { Agency: { name: { contains: search, mode: 'insensitive' } } },
            { Agency: { companyEmail: { contains: search, mode: 'insensitive' } } }
          ]
        } : {})
      },
      include: {
        Agency: {
          include: {
            User: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Format subscriptions for frontend
    const formattedSubscriptions = subscriptions.map(sub => ({
      id: sub.id,
      customerId: sub.customerId || '',
      priceId: sub.priceId,
      status: sub.active ? 'active' : 'canceled',
      plan: sub.plan,
      amount: parseFloat(sub.priceId.includes('pro') ? '4900' : sub.priceId.includes('unlimited') ? '9900' : '0'), // Mock pricing
      currency: 'usd',
      currentPeriodStart: sub.createdAt.toISOString(),
      currentPeriodEnd: new Date(sub.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
      customer: {
        name: sub.Agency?.User?.name || 'Unknown',
        email: sub.Agency?.User?.email || 'unknown@example.com',
        type: 'agency' as const
      },
      agency: sub.Agency ? {
        name: sub.Agency.name,
        id: sub.Agency.id
      } : undefined,
      createdAt: sub.createdAt.toISOString(),
      updatedAt: sub.updatedAt.toISOString()
    }))

    // Log audit trail
    await db.auditLog.create({
      data: {
        action: 'VIEW_SUBSCRIPTIONS',
        entity: 'Subscription',
        adminUserId: adminUser.id,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({ subscriptions: formattedSubscriptions })
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const adminUser = await db.adminUser.findUnique({
      where: { userId },
      include: { User: true }
    })

    if (!adminUser) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const { subscriptionId, action } = await request.json()

    if (action === 'cancel') {
      // Update subscription in database
      await db.subscription.update({
        where: { id: subscriptionId },
        data: { active: false }
      })

      // Log audit trail
      await db.auditLog.create({
        data: {
          action: 'CANCEL_SUBSCRIPTION',
          entity: 'Subscription',
          entityId: subscriptionId,
          adminUserId: adminUser.id,
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown'
        }
      })

      return NextResponse.json({ success: true })
    }

    return new NextResponse('Invalid action', { status: 400 })
  } catch (error) {
    console.error('Error updating subscription:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}