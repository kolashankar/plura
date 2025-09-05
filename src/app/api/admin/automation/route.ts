import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Check if user is admin
    const adminUser = await db.adminUser.findUnique({
      where: { userId },
      include: { User: true }
    })

    if (!adminUser) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    // Mock automation workflows data - replace with actual n8n integration
    const mockWorkflows = [
      {
        id: '1',
        name: 'Welcome Email Sequence',
        description: 'Automated welcome email series for new users',
        type: 'email',
        status: 'active',
        triggerType: 'user_signup',
        lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        executionCount: 156,
        successRate: 98.5,
        createdBy: {
          name: 'System Admin',
          email: 'admin@example.com'
        },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        configuration: JSON.stringify({
          trigger: 'user_signup',
          actions: [
            { type: 'delay', duration: '1h' },
            { type: 'send_email', template: 'welcome' },
            { type: 'delay', duration: '24h' },
            { type: 'send_email', template: 'getting_started' }
          ]
        }),
        metrics: {
          totalRuns: 156,
          successfulRuns: 154,
          failedRuns: 2,
          avgExecutionTime: 850
        }
      },
      {
        id: '2',
        name: 'Payment Failed Notification',
        description: 'Notify users when payment fails and retry',
        type: 'webhook',
        status: 'active',
        triggerType: 'payment_failed',
        lastRun: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        executionCount: 23,
        successRate: 95.7,
        createdBy: {
          name: 'System Admin',
          email: 'admin@example.com'
        },
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        configuration: JSON.stringify({
          trigger: 'payment_failed',
          actions: [
            { type: 'send_email', template: 'payment_failed' },
            { type: 'retry_payment', attempts: 3 },
            { type: 'notify_admin' }
          ]
        }),
        metrics: {
          totalRuns: 23,
          successfulRuns: 22,
          failedRuns: 1,
          avgExecutionTime: 1200
        }
      },
      {
        id: '3',
        name: 'Monthly Analytics Report',
        description: 'Generate and send monthly analytics reports',
        type: 'scheduled',
        status: 'active',
        triggerType: 'schedule',
        lastRun: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        nextRun: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        executionCount: 12,
        successRate: 100,
        createdBy: {
          name: 'System Admin',
          email: 'admin@example.com'
        },
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        configuration: JSON.stringify({
          trigger: 'monthly_schedule',
          actions: [
            { type: 'generate_report', data: 'analytics' },
            { type: 'send_email', template: 'monthly_report' }
          ]
        }),
        metrics: {
          totalRuns: 12,
          successfulRuns: 12,
          failedRuns: 0,
          avgExecutionTime: 2500
        }
      },
      {
        id: '4',
        name: 'Abandoned Cart Recovery',
        description: 'Send reminders for abandoned shopping carts',
        type: 'trigger',
        status: 'inactive',
        triggerType: 'cart_abandoned',
        lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        executionCount: 89,
        successRate: 87.6,
        createdBy: {
          name: 'Marketing Team',
          email: 'marketing@example.com'
        },
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        configuration: JSON.stringify({
          trigger: 'cart_abandoned',
          conditions: [
            { field: 'cart_value', operator: '>', value: 50 }
          ],
          actions: [
            { type: 'delay', duration: '1h' },
            { type: 'send_email', template: 'cart_reminder' },
            { type: 'delay', duration: '24h' },
            { type: 'send_email', template: 'cart_discount' }
          ]
        }),
        metrics: {
          totalRuns: 89,
          successfulRuns: 78,
          failedRuns: 11,
          avgExecutionTime: 1500
        }
      },
      {
        id: '5',
        name: 'API Rate Limit Monitor',
        description: 'Monitor and alert on API rate limit violations',
        type: 'webhook',
        status: 'error',
        triggerType: 'api_rate_limit',
        lastRun: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        executionCount: 45,
        successRate: 75.5,
        createdBy: {
          name: 'DevOps Team',
          email: 'devops@example.com'
        },
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        configuration: JSON.stringify({
          trigger: 'api_rate_limit_exceeded',
          actions: [
            { type: 'log_incident' },
            { type: 'notify_admin', priority: 'high' },
            { type: 'temporary_throttle' }
          ]
        }),
        metrics: {
          totalRuns: 45,
          successfulRuns: 34,
          failedRuns: 11,
          avgExecutionTime: 650
        }
      }
    ]

    let filteredWorkflows = mockWorkflows

    if (search) {
      filteredWorkflows = filteredWorkflows.filter(workflow =>
        workflow.name.toLowerCase().includes(search.toLowerCase()) ||
        workflow.description.toLowerCase().includes(search.toLowerCase()) ||
        workflow.createdBy.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (status && status !== 'all') {
      filteredWorkflows = filteredWorkflows.filter(workflow => workflow.status === status)
    }

    if (type && type !== 'all') {
      filteredWorkflows = filteredWorkflows.filter(workflow => workflow.type === type)
    }

    // Log audit trail
    await db.auditLog.create({
      data: {
        action: 'VIEW_AUTOMATION_WORKFLOWS',
        entity: 'AutomationWorkflow',
        adminUserId: adminUser.id,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({ workflows: filteredWorkflows })
  } catch (error) {
    console.error('Error fetching automation workflows:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const adminUser = await db.adminUser.findUnique({
      where: { userId },
      include: { User: true }
    })

    if (!adminUser) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const { workflowId, action } = await request.json()

    // Mock workflow status update - replace with actual n8n API calls
    const actionMap = {
      activate: 'activated',
      deactivate: 'deactivated'
    }

    // Log audit trail
    await db.auditLog.create({
      data: {
        action: `${action.toUpperCase()}_AUTOMATION_WORKFLOW`,
        entity: 'AutomationWorkflow',
        entityId: workflowId,
        adminUserId: adminUser.id,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: `Workflow ${actionMap[action as keyof typeof actionMap]} successfully` 
    })
  } catch (error) {
    console.error('Error updating automation workflow:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const adminUser = await db.adminUser.findUnique({
      where: { userId },
      include: { User: true }
    })

    if (!adminUser) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const { workflowId, action } = await request.json()

    if (action === 'execute') {
      // Mock workflow execution - replace with actual n8n API call
      
      // Log audit trail
      await db.auditLog.create({
        data: {
          action: 'EXECUTE_AUTOMATION_WORKFLOW',
          entity: 'AutomationWorkflow',
          entityId: workflowId,
          adminUserId: adminUser.id,
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown'
        }
      })

      return NextResponse.json({ 
        success: true, 
        message: 'Workflow execution triggered successfully' 
      })
    }

    return new NextResponse('Invalid action', { status: 400 })
  } catch (error) {
    console.error('Error executing automation workflow:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}