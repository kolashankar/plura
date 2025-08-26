import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rmSync } from 'fs'
import { join } from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { deploymentId: string } }
) {
  try {
    const deployment = await db.deployment.findUnique({
      where: {
        id: params.deploymentId,
      },
      include: {
        subAccount: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!deployment) {
      return NextResponse.json(
        { error: 'Deployment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(deployment)
  } catch (error) {
    console.error('Error fetching deployment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { deploymentId: string } }
) {
  try {
    const body = await request.json()
    const { name, status, config } = body

    const deployment = await db.deployment.update({
      where: {
        id: params.deploymentId,
      },
      data: {
        name,
        status,
        config,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(deployment)
  } catch (error) {
    console.error('Error updating deployment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { deploymentId: string } }
) {
  try {
    // Delete deployment files if they exist
    const deploymentPath = join(process.cwd(), 'deployments', params.deploymentId)
    try {
      rmSync(deploymentPath, { recursive: true, force: true })
    } catch (fileError) {
      console.warn('Could not delete deployment files:', fileError)
    }

    // Delete from database
    await db.deployment.delete({
      where: {
        id: params.deploymentId,
      },
    })

    return NextResponse.json({ message: 'Deployment deleted successfully' })
  } catch (error) {
    console.error('Error deleting deployment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

const prisma = new PrismaClient()

export async function GET(
  req: NextRequest,
  { params }: { params: { deploymentId: string } }
) {
  try {
    const deployment = await prisma.deployment.findUnique({
      where: { id: params.deploymentId }
    })

    if (!deployment) {
      return NextResponse.json(
        { error: 'Deployment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      deployment
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch deployment' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { deploymentId: string } }
) {
  try {
    const deployment = await prisma.deployment.findUnique({
      where: { id: params.deploymentId }
    })

    if (!deployment) {
      return NextResponse.json(
        { error: 'Deployment not found' },
        { status: 404 }
      )
    }

    // Delete deployment files
    try {
      const deploymentPath = join(process.cwd(), 'deployments', params.deploymentId)
      rmSync(deploymentPath, { recursive: true, force: true })
    } catch (fileError) {
      console.warn('Failed to delete deployment files:', fileError)
    }

    // Delete from database
    await prisma.deployment.delete({
      where: { id: params.deploymentId }
    })

    return NextResponse.json({
      success: true,
      message: 'Deployment deleted successfully'
    })
  } catch (error) {
    console.error('Failed to delete deployment:', error)
    return NextResponse.json(
      { error: 'Failed to delete deployment' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { deploymentId: string } }
) {
  try {
    const { status, deploymentUrl } = await req.json()

    const deployment = await prisma.deployment.update({
      where: { id: params.deploymentId },
      data: {
        status,
        deploymentUrl,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      deployment
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update deployment' },
      { status: 500 }
    )
  }
}