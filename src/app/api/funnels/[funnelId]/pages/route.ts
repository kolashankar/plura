import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'

export async function GET(
  req: NextRequest,
  { params }: { params: { funnelId: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pages = await db.funnelPage.findMany({
      where: {
        funnelId: params.funnelId,
      },
      orderBy: {
        order: 'asc'
      },
      select: {
        id: true,
        name: true,
        pathName: true,
        order: true,
        content: true,
        visits: true,
      }
    })

    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching funnel pages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    )
  }
}