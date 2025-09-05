
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { type, data, subAccountId, workflowId } = await req.json()

    // Find automations that should be triggered
    const automations = await db.automation.findMany({
      where: {
        subAccountId,
        published: true,
        ...(workflowId && { id: workflowId }),
        Trigger: {
          type: type
        }
      },
      include: {
        Action: {
          orderBy: { order: 'asc' }
        },
        Trigger: true
      }
    })

    const executionPromises = automations.map(async (automation) => {
      try {
        // Execute the automation workflow
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/automations/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            workflowId: automation.id,
            triggerData: data,
            subAccountId
          })
        })
        
        return await response.json()
      } catch (error) {
        console.error(`Failed to execute automation ${automation.id}:`, error)
        return { error: `Failed to execute automation ${automation.id}` }
      }
    })

    const results = await Promise.all(executionPromises)

    return NextResponse.json({
      success: true,
      triggeredAutomations: automations.length,
      results
    })

  } catch (error) {
    console.error('Trigger handling error:', error)
    return NextResponse.json(
      { error: 'Failed to handle trigger' },
      { status: 500 }
    )
  }
}

// Webhook trigger endpoint
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const webhookId = searchParams.get('webhook')
  const subAccountId = searchParams.get('subAccount')

  if (!webhookId || !subAccountId) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
  }

  try {
    // Find automation by webhook ID
    const automation = await db.automation.findFirst({
      where: {
        subAccountId,
        published: true,
        Trigger: {
          type: 'WEBHOOK',
          // You might store webhook ID in trigger config
        }
      },
      include: {
        Trigger: true,
        Action: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!automation) {
      return NextResponse.json({ error: 'Automation not found' }, { status: 404 })
    }

    // Execute the automation
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/automations/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workflowId: automation.id,
        triggerData: { webhook: webhookId, timestamp: new Date() },
        subAccountId
      })
    })

    const result = await response.json()

    return NextResponse.json({
      message: 'Webhook received and automation triggered',
      automationId: automation.id,
      result
    })

  } catch (error) {
    console.error('Webhook trigger error:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}
