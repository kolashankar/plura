import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

export async function GET(
  req: NextRequest,
  { params }: { params: { deploymentId: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { deploymentId } = params
    
    // Get deployment from database
    const deployment = await db.deployment.findUnique({
      where: { id: deploymentId },
      include: {
        subAccount: {
          select: { 
            name: true,
            Agency: {
              select: { ownerId: true }
            }
          }
        }
      }
    })

    if (!deployment) {
      return NextResponse.json({ error: 'Deployment not found' }, { status: 404 })
    }

    // Check if user has access to this deployment
    const hasAccess = deployment.subAccount?.Agency?.ownerId === user.id || 
                      user.id === deployment.subAccount?.Agency?.ownerId

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get code structure from deployment path
    const deploymentPath = join(process.cwd(), 'deployments', deploymentId)
    const codeStructure = getDirectoryStructure(deploymentPath)
    
    return NextResponse.json({
      deployment: {
        id: deployment.id,
        name: deployment.name,
        status: deployment.status,
        platform: deployment.platform,
        deploymentUrl: deployment.deploymentUrl,
        createdAt: deployment.createdAt
      },
      codeStructure
    })

  } catch (error) {
    console.error('Error fetching deployment code:', error)
    return NextResponse.json({ error: 'Failed to fetch code' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { deploymentId: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { filePath } = await req.json()
    const { deploymentId } = params
    
    // Verify deployment access
    const deployment = await db.deployment.findUnique({
      where: { id: deploymentId },
      include: {
        subAccount: {
          select: { 
            Agency: {
              select: { ownerId: true }
            }
          }
        }
      }
    })

    if (!deployment) {
      return NextResponse.json({ error: 'Deployment not found' }, { status: 404 })
    }

    const hasAccess = deployment.subAccount?.Agency?.ownerId === user.id

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Read specific file content
    const deploymentPath = join(process.cwd(), 'deployments', deploymentId)
    const fullPath = join(deploymentPath, filePath)
    
    // Security check - ensure file is within deployment directory
    if (!fullPath.startsWith(deploymentPath)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
    }

    try {
      const content = readFileSync(fullPath, 'utf8')
      return NextResponse.json({ content, filePath })
    } catch (fileError) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

  } catch (error) {
    console.error('Error reading file:', error)
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 })
  }
}

function getDirectoryStructure(dirPath: string, relativePath = ''): any {
  try {
    const items = readdirSync(dirPath)
    const structure: any = {
      type: 'directory',
      name: relativePath || 'root',
      children: {}
    }

    for (const item of items) {
      if (item.startsWith('.') || item === 'node_modules') continue

      const itemPath = join(dirPath, item)
      const itemRelativePath = relativePath ? join(relativePath, item) : item
      const stats = statSync(itemPath)

      if (stats.isDirectory()) {
        structure.children[item] = getDirectoryStructure(itemPath, itemRelativePath)
      } else {
        structure.children[item] = {
          type: 'file',
          name: item,
          path: itemRelativePath,
          size: stats.size,
          extension: item.split('.').pop() || ''
        }
      }
    }

    return structure
  } catch (error) {
    return {
      type: 'directory',
      name: relativePath || 'root',
      children: {},
      error: 'Cannot read directory'
    }
  }
}