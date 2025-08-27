
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subject, description, priority, category, subaccountId } = await req.json()

    const ticket = await db.ticket.create({
      data: {
        name: subject,
        description,
        value: 0,
        order: 0,
        laneId: 'support', // Create a special support lane
        assignedUserId: null,
        customerId: user.id
      }
    })

    // Send notification to support team
    await db.notification.create({
      data: {
        notification: `New support ticket: ${subject}`,
        agencyId: '', // Get from subaccount
        subAccountId: subaccountId,
        userId: user.id
      }
    })

    return NextResponse.json({ success: true, ticketId: ticket.id })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create support ticket' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || 'all'

    const tickets = await db.ticket.findMany({
      where: {
        customerId: user.id,
        ...(status !== 'all' && { Lane: { name: status } })
      },
      include: {
        Assigned: true,
        Tags: true,
        Lane: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ tickets })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch support tickets' },
      { status: 500 }
    )
  }
}
