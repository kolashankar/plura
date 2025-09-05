
import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'

export async function POST(
  req: NextRequest,
  { params }: { params: { automationId: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subAccountId, action } = await req.json()

    const automation = await db.automation.findUnique({
      where: {
        id: params.automationId,
        subAccountId: subAccountId
      },
      include: {
        AutomationInstance: true
      }
    })

    if (!automation) {
      return NextResponse.json({ error: 'Automation not found' }, { status: 404 })
    }

    let updatedAutomation
    
    if (action === 'start') {
      updatedAutomation = await db.automation.update({
        where: { id: params.automationId },
        data: { published: true }
      })

      // Create or update automation instance
      await db.automationInstance.upsert({
        where: { automationId: params.automationId },
        update: { active: true },
        create: {
          automationId: params.automationId,
          active: true
        }
      })
    } else if (action === 'pause') {
      updatedAutomation = await db.automation.update({
        where: { id: params.automationId },
        data: { published: false }
      })

      // Update automation instance
      await db.automationInstance.updateMany({
        where: { automationId: params.automationId },
        data: { active: false }
      })
    }

    return NextResponse.json({
      success: true,
      automation: updatedAutomation,
      action: action,
      timestamp: new Date()
    })

  } catch (error) {
    console.error('Error toggling automation:', error)
    return NextResponse.json(
      { error: 'Failed to toggle automation' },
      { status: 500 }
    )
  }
}
