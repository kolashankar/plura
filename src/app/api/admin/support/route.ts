
import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { 
  getSupportTickets, 
  updateSupportTicket,
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
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const category = searchParams.get('category')
    const assignedTo = searchParams.get('assignedTo')

    const filters: any = {}
    if (status) filters.status = status
    if (priority) filters.priority = priority
    if (category) filters.category = category
    if (assignedTo) filters.assignedTo = assignedTo

    const tickets = await getSupportTickets(filters)

    await createAuditLog(
      adminUser.id,
      'VIEW_SUPPORT_TICKETS',
      'SupportTicket',
      undefined,
      undefined,
      undefined,
      req.headers.get('x-forwarded-for') || 'unknown',
      req.headers.get('user-agent') || 'unknown'
    )

    return NextResponse.json({ tickets })
  } catch (error) {
    console.error('Support tickets fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch support tickets' },
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

    const { ticketId, status, priority, assignedTo, resolution } = await req.json()

    const ticket = await updateSupportTicket(ticketId, {
      status,
      priority,
      assignedTo,
      resolution
    })

    await createAuditLog(
      adminUser.id,
      'UPDATE_SUPPORT_TICKET',
      'SupportTicket',
      ticketId,
      undefined,
      { status, priority, assignedTo, resolution },
      req.headers.get('x-forwarded-for') || 'unknown',
      req.headers.get('user-agent') || 'unknown'
    )

    return NextResponse.json({ ticket })
  } catch (error) {
    console.error('Support ticket update error:', error)
    return NextResponse.json(
      { error: 'Failed to update support ticket' },
      { status: 500 }
    )
  }
}
