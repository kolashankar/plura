
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createReadStream, existsSync } from 'fs'
import { join } from 'path'
import archiver from 'archiver'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { deploymentId, userSubscription } = await req.json()
    
    // Check if user has enterprise subscription
    if (userSubscription !== 'enterprise') {
      return NextResponse.json(
        { error: 'Enterprise subscription required for code download' },
        { status: 403 }
      )
    }

    const deployment = await prisma.deployment.findUnique({
      where: { id: deploymentId }
    })

    if (!deployment) {
      return NextResponse.json(
        { error: 'Deployment not found' },
        { status: 404 }
      )
    }

    const deploymentPath = join(process.cwd(), 'deployments', deploymentId)
    
    if (!existsSync(deploymentPath)) {
      return NextResponse.json(
        { error: 'Deployment files not found' },
        { status: 404 }
      )
    }

    // Create zip archive
    const archive = archiver('zip', { zlib: { level: 9 } })
    
    // Add all files to archive
    archive.directory(deploymentPath, false)
    archive.finalize()

    // Return zip file
    return new NextResponse(archive as any, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${deployment.name || 'project'}.zip"`
      }
    })
  } catch (error) {
    console.error('Failed to download code:', error)
    return NextResponse.json(
      { error: 'Failed to download code' },
      { status: 500 }
    )
  }
}
