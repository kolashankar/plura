
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'

export async function GET(
  req: NextRequest,
  { params }: { params: { subaccountId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const deployments = await db.deployment.findMany({
      where: {
        subaccountId: params.subaccountId
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        funnel: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json(deployments)
  } catch (error) {
    console.error('Error fetching deployments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { subaccountId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { funnelId, name, domain } = body

    const deployment = await db.deployment.create({
      data: {
        name,
        domain,
        status: 'pending',
        subaccountId: params.subaccountId,
        funnelId,
        deployedBy: userId
      }
    })

    return NextResponse.json(deployment)
  } catch (error) {
    console.error('Error creating deployment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
