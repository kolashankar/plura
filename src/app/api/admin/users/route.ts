
import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { 
  getAllUsers, 
  suspendUser, 
  activateUser, 
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
    const role = searchParams.get('role')
    const isActive = searchParams.get('isActive')
    const agencyId = searchParams.get('agencyId')
    const search = searchParams.get('search')

    const filters: any = {}
    if (role) filters.role = role
    if (isActive !== null) filters.isActive = isActive === 'true'
    if (agencyId) filters.agencyId = agencyId
    if (search) filters.search = search

    const users = await getAllUsers(filters)

    await createAuditLog(
      adminUser.id,
      'VIEW_USERS',
      'User',
      undefined,
      undefined,
      undefined,
      req.headers.get('x-forwarded-for') || 'unknown',
      req.headers.get('user-agent') || 'unknown'
    )

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Admin users fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminUser = await getAdminUser(user.id)
    if (!adminUser) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { userId, action, plan, isActive } = await req.json()

    let result
    if (action) {
      switch (action) {
        case 'suspend':
          result = await suspendUser(userId, adminUser.id)
          break
        case 'activate':
          result = await activateUser(userId, adminUser.id)
          break
        default:
          return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
      }
    } else {
      // Handle direct field updates
      const updateData: any = {}
      if (plan !== undefined) updateData.plan = plan
      if (isActive !== undefined) updateData.isActive = isActive

      result = await db.user.update({
        where: { id: userId },
        data: updateData
      })

      await createAuditLog(
        adminUser.id,
        'UPDATE_USER',
        'User',
        userId,
        undefined,
        updateData,
        req.headers.get('x-forwarded-for') || 'unknown',
        req.headers.get('user-agent') || 'unknown'
      )
    }

    return NextResponse.json({ success: true, user: result })
  } catch (error) {
    console.error('Admin user action error:', error)
    return NextResponse.json(
      { error: 'Failed to perform action' },
      { status: 500 }
    )
  }
}
