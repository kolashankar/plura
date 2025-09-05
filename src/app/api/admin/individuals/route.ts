import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSessionFromCookies } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  try {
    const adminAuth = await getAdminSessionFromCookies(req.headers.get('cookie') || '')
    if (!adminAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { companyEmail: { contains: search, mode: 'insensitive' } }
      ]
    } : {}

    const individuals = await db.individual.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        companyEmail: true,
        companyPhone: true,
        isActive: true,
        plan: true,
        createdAt: true,
        _count: {
          select: {
            Funnels: true,
            Media: true,
            Contact: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ individuals })
  } catch (error) {
    console.error('Admin individuals fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const adminAuth = await getAdminSessionFromCookies(req.headers.get('cookie') || '')
    if (!adminAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { individualId, action, plan } = await req.json()

    if (!individualId || !action) {
      return NextResponse.json({ error: 'Individual ID and action required' }, { status: 400 })
    }

    let updateData: any = {}

    switch (action) {
      case 'suspend':
        updateData.isActive = false
        break
      case 'activate':
        updateData.isActive = true
        break
      case 'updatePlan':
        if (!plan) {
          return NextResponse.json({ error: 'Plan is required for updatePlan action' }, { status: 400 })
        }
        updateData.plan = plan
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const individual = await db.individual.update({
      where: { id: individualId },
      data: updateData
    })

    // Log the admin action
    await db.auditLog.create({
      data: {
        action: `Individual ${action}`,
        entity: 'Individual',
        entityId: individualId,
        newValues: JSON.stringify(updateData),
        adminUserId: adminAuth.userId,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({ individual })
  } catch (error) {
    console.error('Admin individual update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}