
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  req: NextRequest,
  { params }: { params: { subaccountId: string } }
) {
  try {
    // Fetch deployments for the subaccount
    const deployments = await prisma.deployment.findMany({
      where: {
        subaccountId: params.subaccountId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      deployments: deployments.map(deployment => ({
        id: deployment.id,
        name: deployment.name,
        platform: deployment.platform,
        status: deployment.status,
        url: deployment.deploymentUrl,
        createdAt: deployment.createdAt,
        lastUpdated: deployment.updatedAt,
        isResponsive: deployment.isResponsive
      }))
    })
  } catch (error) {
    console.error('Failed to fetch deployments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deployments' },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { subaccountId: string } }
) {
  try {
    const { name, platform, funnelPageId, codeStructure, isResponsive } = await req.json()
    
    // Create new deployment record
    const deployment = await prisma.deployment.create({
      data: {
        name,
        platform,
        subaccountId: params.subaccountId,
        funnelPageId,
        codeStructure: JSON.stringify(codeStructure),
        isResponsive: isResponsive || false,
        status: 'building',
        deploymentUrl: `https://generated-${Date.now()}.replit.app`
      }
    })

    return NextResponse.json({
      success: true,
      deployment
    })
  } catch (error) {
    console.error('Failed to create deployment:', error)
    return NextResponse.json(
      { error: 'Failed to create deployment' },
      { status: 500 }
    )
  }
}
