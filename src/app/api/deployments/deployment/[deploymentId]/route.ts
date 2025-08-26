
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
    const deployment = await prisma.deployment.findUnique({
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

export async function PUT(
  req: NextRequest,
  { params }: { params: { deploymentId: string } }
) {
  try {
    const { name, status, deploymentUrl } = await req.json()
    
    const deployment = await prisma.deployment.update({
      where: { id: params.deploymentId },
      data: {
        name,
        status,
        deploymentUrl,
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
