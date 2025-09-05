
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { join } from 'path'
import { rmSync } from 'fs'

export async function POST(
  request: NextRequest,
  { params }: { params: { deploymentId: string } }
) {
  try {
    const body = await request.json()
    const { action } = body

    const deployment = await db.deployment.findUnique({
      where: {
        id: params.deploymentId,
      },
    })

    if (!deployment) {
      return NextResponse.json(
        { error: 'Deployment not found' },
        { status: 404 }
      )
    }

    let updatedDeployment

    switch (action) {
      case 'start':
        updatedDeployment = await db.deployment.update({
          where: {
            id: params.deploymentId,
          },
          data: {
            status: 'building',
            updatedAt: new Date(),
          },
        })
        break

      case 'stop':
        updatedDeployment = await db.deployment.update({
          where: {
            id: params.deploymentId,
          },
          data: {
            status: 'stopped',
            updatedAt: new Date(),
          },
        })
        break

      case 'redeploy':
        updatedDeployment = await db.deployment.update({
          where: {
            id: params.deploymentId,
          },
          data: {
            status: 'building',
            updatedAt: new Date(),
          },
        })
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json(updatedDeployment)
  } catch (error) {
    console.error('Error managing deployment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


export async function GET(
  req: NextRequest,
  { params }: { params: { deploymentId: string } }
) {
  try {
    const deployment = await db.deployment.findUnique({
      where: { id: params.deploymentId }
    })

    if (!deployment) {
      return NextResponse.json(
        { error: 'Deployment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(deployment)
  } catch (error) {
    console.error('Failed to fetch deployment:', error)
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
    const deployment = await db.deployment.findUnique({
      where: { id: params.deploymentId }
    })

    if (!deployment) {
      return NextResponse.json(
        { error: 'Deployment not found' },
        { status: 404 }
      )
    }

    // Clean up deployment files
    try {
      const deploymentPath = join(process.cwd(), 'temp', params.deploymentId)
      rmSync(deploymentPath, { recursive: true, force: true })
    } catch (error) {
      console.error('Failed to clean up deployment files:', error)
    }

    // Delete from database
    await db.deployment.delete({
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

export async function PUT(
  req: NextRequest,
  { params }: { params: { deploymentId: string } }
) {
  try {
    const { name, status, url } = await req.json()
    
    const deployment = await db.deployment.update({
      where: { id: params.deploymentId },
      data: {
        name,
        status,
        url,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(deployment)
  } catch (error) {
    console.error('Failed to update deployment:', error)
    return NextResponse.json(
      { error: 'Failed to update deployment' },
      { status: 500 }
    )
  }
}
