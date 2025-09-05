
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'

export async function GET(
  req: NextRequest,
  { params }: { params: { subAccountId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const deployments = await db.deployment.findMany({
      where: {
        subAccountId: params.subAccountId
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        subAccount: {
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
  { params }: { params: { subAccountId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, url } = body

    const deployment = await db.deployment.create({
      data: {
        name,
        url,
        status: 'pending',
        subAccountId: params.subAccountId
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
