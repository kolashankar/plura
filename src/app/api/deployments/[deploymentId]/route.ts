
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { rmSync } from 'fs'
import { join } from 'path'

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
