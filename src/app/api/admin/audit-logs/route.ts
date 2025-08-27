
import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { 
  getAuditLogs,
  getAdminUser 
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
    const entity = searchParams.get('entity')
    const adminUserId = searchParams.get('adminUserId')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const limit = searchParams.get('limit')

    const filters: any = {}
    if (entity) filters.entity = entity
    if (adminUserId) filters.adminUserId = adminUserId
    if (dateFrom) filters.dateFrom = new Date(dateFrom)
    if (dateTo) filters.dateTo = new Date(dateTo)
    if (limit) filters.limit = parseInt(limit)

    const auditLogs = await getAuditLogs(filters)

    return NextResponse.json({ auditLogs })
  } catch (error) {
    console.error('Audit logs fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    )
  }
}
