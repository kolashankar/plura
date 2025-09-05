
import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { 
  getAllAgencies, 
  suspendAgency, 
  activateAgency,
  getAdminUser,
  createAuditLog 
} from '@/lib/queries'

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
    const isActive = searchParams.get('isActive')
    const search = searchParams.get('search')

    const filters: any = {}
    if (isActive !== null) filters.isActive = isActive === 'true'
    if (search) filters.search = search

    const agencies = await getAllAgencies(filters)

    await createAuditLog(
      adminUser.id,
      'VIEW_AGENCIES',
      'Agency',
      undefined,
      undefined,
      undefined,
      req.headers.get('x-forwarded-for') || 'unknown',
      req.headers.get('user-agent') || 'unknown'
    )

    return NextResponse.json({ agencies })
  } catch (error) {
    console.error('Admin agencies fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agencies' },
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
    if (!adminUser || !adminUser.isSuperAdmin) {
      return NextResponse.json({ error: 'Super admin access required' }, { status: 403 })
    }

    const { agencyId, action } = await req.json()

    let result
    switch (action) {
      case 'suspend':
        result = await suspendAgency(agencyId, adminUser.id)
        break
      case 'activate':
        result = await activateAgency(agencyId, adminUser.id)
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ success: true, agency: result })
  } catch (error) {
    console.error('Admin agency action error:', error)
    return NextResponse.json(
      { error: 'Failed to perform action' },
      { status: 500 }
    )
  }
}
