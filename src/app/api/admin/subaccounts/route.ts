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
    const search = searchParams.get('search')

    const whereClause = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { companyEmail: { contains: search, mode: 'insensitive' } },
        { Agency: { name: { contains: search, mode: 'insensitive' } } }
      ]
    } : {}

    const subAccounts = await db.subAccount.findMany({
      where: whereClause,
      include: {
        Agency: {
          select: {
            name: true,
            isActive: true
          }
        },
        _count: {
          select: {
            Funnels: true,
            Media: true,
            Contact: true,
            Permissions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform data to match component expectations
    const transformedSubAccounts = subAccounts.map(subAccount => ({
      id: subAccount.id,
      name: subAccount.name,
      companyEmail: subAccount.companyEmail,
      companyPhone: subAccount.companyPhone,
      address: subAccount.address,
      city: subAccount.city,
      zipCode: subAccount.zipCode,
      state: subAccount.state,
      country: subAccount.country,
      isActive: subAccount.isActive,
      createdAt: subAccount.createdAt.toISOString(),
      agencyId: subAccount.agencyId,
      agency: {
        name: subAccount.Agency.name,
        isActive: subAccount.Agency.isActive
      },
      _count: subAccount._count
    }))

    return NextResponse.json({ subAccounts: transformedSubAccounts })

  } catch (error) {
    console.error('Admin sub accounts fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sub accounts' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // Verify admin authentication
    const adminSession = await getAdminSessionFromCookies(req.headers.get('cookie') || '')
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subAccountId, action } = await req.json()

    if (!subAccountId || !action) {
      return NextResponse.json(
        { error: 'Sub account ID and action are required' },
        { status: 400 }
      )
    }

    let updateData: any = {}

    switch (action) {
      case 'activate':
        updateData.isActive = true
        break

      case 'suspend':
        updateData.isActive = false
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    await db.subAccount.update({
      where: { id: subAccountId },
      data: updateData
    })

    // Log the admin action
    await db.auditLog.create({
      data: {
        action: `SubAccount ${action}`,
        entity: 'SubAccount',
        entityId: subAccountId,
        newValues: JSON.stringify(updateData),
        adminUserId: adminSession.userId,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Admin sub account update error:', error)
    return NextResponse.json(
      { error: 'Failed to update sub account' },
      { status: 500 }
    )
  }
}