
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { automationId: string } }
) {
  try {
    const { searchParams } = new URL(req.url)
    const subAccountId = searchParams.get('subAccountId')

    if (!subAccountId) {
      return NextResponse.json({ error: 'subAccountId is required' }, { status: 400 })
    }

    const automation = await db.automation.findUnique({
      where: {
        id: params.automationId,
        subAccountId: subAccountId
      },
      include: {
        AutomationInstance: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    if (!automation) {
      return NextResponse.json({ error: 'Automation not found' }, { status: 404 })
    }

    // Get execution history (you might want to create a separate table for this)
    const executionCount = await getExecutionCount(params.automationId)
    const lastExecution = await getLastExecution(params.automationId)

    return NextResponse.json({
      id: automation.id,
      name: automation.name,
      isRunning: automation.published && automation.AutomationInstance[0]?.active,
      published: automation.published,
      executionCount,
      lastExecution,
      createdAt: automation.createdAt,
      updatedAt: automation.updatedAt
    })

  } catch (error) {
    console.error('Error fetching automation status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch automation status' },
      { status: 500 }
    )
  }
}

async function getExecutionCount(automationId: string): Promise<number> {
  // This would typically query an execution log table
  // For now, returning a mock value
  return Math.floor(Math.random() * 100)
}

async function getLastExecution(automationId: string): Promise<Date | null> {
  // This would typically query an execution log table
  // For now, returning a recent date
  return new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
}
