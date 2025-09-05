import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const individualId = searchParams.get('individualId')
    const status = searchParams.get('status')
    const category = searchParams.get('category')

    if (!individualId) {
      return NextResponse.json({ error: 'Individual ID required' }, { status: 400 })
    }

    // Feature 1: Workflow automation builder
    const workflows = [
      {
        id: 'workflow_1',
        name: 'Lead Nurturing Sequence',
        description: 'Automated email sequence for new leads',
        category: 'marketing',
        status: 'active',
        triggers: [
          { type: 'form_submission', form: 'contact_form' },
          { type: 'page_visit', page: '/pricing' }
        ],
        actions: [
          { type: 'send_email', template: 'welcome_email', delay: 0 },
          { type: 'add_to_list', list: 'prospects', delay: 0 },
          { type: 'send_email', template: 'follow_up_1', delay: 86400 }, // 24 hours
          { type: 'send_email', template: 'follow_up_2', delay: 259200 } // 72 hours
        ],
        createdAt: new Date('2024-01-15'),
        lastRun: new Date('2024-01-26'),
        totalRuns: 145,
        successRate: 0.92
      },
      {
        id: 'workflow_2',
        name: 'Customer Onboarding',
        description: 'Welcome new customers and guide them through setup',
        category: 'customer_success',
        status: 'active',
        triggers: [
          { type: 'payment_completed', product: 'premium_plan' }
        ],
        actions: [
          { type: 'send_email', template: 'welcome_customer', delay: 0 },
          { type: 'create_task', assignee: 'support_team', delay: 0 },
          { type: 'schedule_call', delay: 86400 }, // 24 hours
          { type: 'send_email', template: 'onboarding_checklist', delay: 172800 } // 48 hours
        ],
        createdAt: new Date('2024-01-10'),
        lastRun: new Date('2024-01-25'),
        totalRuns: 67,
        successRate: 0.95
      }
    ]

    // Feature 2: Trigger management
    const availableTriggers = [
      {
        id: 'trigger_1',
        name: 'Form Submission',
        description: 'Triggered when a specific form is submitted',
        category: 'form',
        parameters: ['form_id', 'field_conditions'],
        isPopular: true
      },
      {
        id: 'trigger_2',
        name: 'Page Visit',
        description: 'Triggered when a user visits a specific page',
        category: 'behavior',
        parameters: ['page_url', 'visit_duration'],
        isPopular: true
      },
      {
        id: 'trigger_3',
        name: 'Payment Completed',
        description: 'Triggered when a payment is successfully processed',
        category: 'ecommerce',
        parameters: ['product_id', 'amount_threshold'],
        isPopular: false
      },
      {
        id: 'trigger_4',
        name: 'Email Opened',
        description: 'Triggered when a recipient opens an email',
        category: 'email',
        parameters: ['campaign_id', 'email_template'],
        isPopular: false
      }
    ]

    // Feature 3: Action sequences
    const availableActions = [
      {
        id: 'action_1',
        name: 'Send Email',
        description: 'Send a personalized email to the user',
        category: 'communication',
        parameters: ['template_id', 'delay', 'personalization'],
        isPopular: true
      },
      {
        id: 'action_2',
        name: 'Add to List',
        description: 'Add the user to a mailing list or segment',
        category: 'list_management',
        parameters: ['list_id', 'tags'],
        isPopular: true
      },
      {
        id: 'action_3',
        name: 'Create Task',
        description: 'Create a task for a team member',
        category: 'task_management',
        parameters: ['assignee', 'priority', 'due_date'],
        isPopular: false
      },
      {
        id: 'action_4',
        name: 'Update Database',
        description: 'Update user information in the database',
        category: 'data',
        parameters: ['fields', 'conditions'],
        isPopular: false
      }
    ]

    // Feature 4: Automation analytics
    const automationAnalytics = {
      totalWorkflows: workflows.length,
      activeWorkflows: workflows.filter(w => w.status === 'active').length,
      totalExecutions: workflows.reduce((sum, w) => sum + w.totalRuns, 0),
      averageSuccessRate: workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length,
      topPerformingWorkflow: workflows.reduce((best, current) => 
        current.successRate > best.successRate ? current : best
      ),
      executionTrends: [
        { date: '2024-01-22', executions: 45 },
        { date: '2024-01-23', executions: 52 },
        { date: '2024-01-24', executions: 38 },
        { date: '2024-01-25', executions: 61 },
        { date: '2024-01-26', executions: 47 }
      ]
    }

    return NextResponse.json({
      workflows: status ? workflows.filter(w => w.status === status) : 
                 category ? workflows.filter(w => w.category === category) : workflows,
      availableTriggers,
      availableActions,
      automationAnalytics
    })

  } catch (error) {
    console.error('Automations API error:', error)
    return NextResponse.json({ error: 'Failed to fetch automation data' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { individualId, action, workflowData, triggerData, actionData } = await req.json()

    if (!individualId || !action) {
      return NextResponse.json({ error: 'Individual ID and action required' }, { status: 400 })
    }

    switch (action) {
      case 'create_workflow':
        // Feature 5: Workflow creation
        const newWorkflow = {
          id: `workflow_${Date.now()}`,
          name: workflowData.name,
          description: workflowData.description,
          category: workflowData.category,
          triggers: workflowData.triggers || [],
          actions: workflowData.actions || [],
          status: 'draft',
          createdAt: new Date(),
          createdBy: user.id,
          individualId,
          totalRuns: 0,
          successRate: 0
        }

        return NextResponse.json({
          success: true,
          workflow: newWorkflow,
          message: 'Workflow created successfully'
        })

      case 'execute_workflow':
        // Feature 6: Manual workflow execution
        const { workflowId, testData } = workflowData
        
        const execution = {
          id: `exec_${Date.now()}`,
          workflowId,
          status: 'running',
          startedAt: new Date(),
          testData,
          steps: [] as any[],
          individualId
        }

        // Simulate workflow execution
        setTimeout(() => {
          execution.status = 'completed'
          execution.steps = [
            { action: 'send_email', status: 'completed', timestamp: new Date() },
            { action: 'add_to_list', status: 'completed', timestamp: new Date() }
          ] as any[]
        }, 2000)

        return NextResponse.json({
          success: true,
          execution,
          message: 'Workflow execution started'
        })

      case 'toggle_workflow':
        // Feature 7: Workflow activation/deactivation
        const { workflowId: toggleWorkflowId, newStatus } = workflowData
        
        return NextResponse.json({
          success: true,
          workflowId: toggleWorkflowId,
          status: newStatus,
          updatedAt: new Date(),
          message: `Workflow ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`
        })

      case 'test_trigger':
        // Feature 8: Trigger testing
        const testResult = {
          triggerId: triggerData.triggerId,
          testData: triggerData.testData,
          result: 'success',
          fired: true,
          timestamp: new Date(),
          conditions: triggerData.conditions || []
        }

        return NextResponse.json({
          success: true,
          testResult,
          message: 'Trigger test completed successfully'
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Automations action error:', error)
    return NextResponse.json({ error: 'Failed to process automation action' }, { status: 500 })
  }
}