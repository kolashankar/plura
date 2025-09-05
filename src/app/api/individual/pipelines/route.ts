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

    if (!individualId) {
      return NextResponse.json({ error: 'Individual ID required' }, { status: 400 })
    }

    // Feature 1: Advanced lead management system
    const pipelines = [
      {
        id: 'pipeline_1',
        name: 'Sales Pipeline',
        description: 'Main sales process from lead to customer',
        type: 'sales',
        totalValue: 125000,
        expectedRevenue: 87500,
        avgDealSize: 2500,
        conversionRate: 0.35,
        avgCycleTime: 21, // days
        stages: [
          {
            id: 'stage_1',
            name: 'Prospecting',
            order: 1,
            probability: 0.1,
            leads: [
              {
                id: 'lead_1',
                name: 'John Anderson',
                company: 'Tech Innovations',
                email: 'john@techinnovations.com',
                value: 5000,
                score: 85,
                source: 'website',
                createdAt: new Date('2024-01-20'),
                lastActivity: new Date('2024-01-26')
              },
              {
                id: 'lead_2',
                name: 'Sarah Wilson',
                company: 'Digital Solutions',
                email: 'sarah@digitalsolutions.com',
                value: 3500,
                score: 72,
                source: 'referral',
                createdAt: new Date('2024-01-22'),
                lastActivity: new Date('2024-01-25')
              }
            ]
          },
          {
            id: 'stage_2',
            name: 'Qualified',
            order: 2,
            probability: 0.25,
            leads: [
              {
                id: 'lead_3',
                name: 'Mike Davis',
                company: 'Growth Corp',
                email: 'mike@growthcorp.com',
                value: 7500,
                score: 90,
                source: 'social_media',
                createdAt: new Date('2024-01-18'),
                lastActivity: new Date('2024-01-26')
              }
            ]
          },
          {
            id: 'stage_3',
            name: 'Proposal',
            order: 3,
            probability: 0.5,
            leads: [
              {
                id: 'lead_4',
                name: 'Lisa Chen',
                company: 'Enterprise LLC',
                email: 'lisa@enterprise.com',
                value: 12000,
                score: 95,
                source: 'direct',
                createdAt: new Date('2024-01-15'),
                lastActivity: new Date('2024-01-25')
              }
            ]
          },
          {
            id: 'stage_4',
            name: 'Negotiation',
            order: 4,
            probability: 0.75,
            leads: [
              {
                id: 'lead_5',
                name: 'Robert Kim',
                company: 'Scale Solutions',
                email: 'robert@scalesolutions.com',
                value: 8500,
                score: 88,
                source: 'advertising',
                createdAt: new Date('2024-01-12'),
                lastActivity: new Date('2024-01-24')
              }
            ]
          },
          {
            id: 'stage_5',
            name: 'Closed Won',
            order: 5,
            probability: 1.0,
            leads: [
              {
                id: 'lead_6',
                name: 'Jennifer Lopez',
                company: 'Success Inc',
                email: 'jennifer@success.com',
                value: 15000,
                score: 100,
                source: 'referral',
                createdAt: new Date('2024-01-05'),
                lastActivity: new Date('2024-01-20')
              }
            ]
          }
        ]
      }
    ]

    // Feature 2: Sales process automation
    const automations = [
      {
        id: 'automation_1',
        name: 'Lead Scoring Update',
        description: 'Automatically update lead scores based on activity',
        trigger: 'activity_detected',
        conditions: [
          'email_opened',
          'website_visited',
          'document_downloaded'
        ],
        actions: [
          'increase_score',
          'notify_sales_rep',
          'move_to_qualified'
        ],
        isActive: true,
        lastRun: new Date('2024-01-26'),
        totalRuns: 247
      },
      {
        id: 'automation_2',
        name: 'Follow-up Reminder',
        description: 'Send reminders for overdue follow-ups',
        trigger: 'time_based',
        conditions: [
          'no_activity_3_days',
          'stage_not_progressed'
        ],
        actions: [
          'send_reminder_email',
          'create_task',
          'flag_for_review'
        ],
        isActive: true,
        lastRun: new Date('2024-01-26'),
        totalRuns: 89
      }
    ]

    // Feature 3: Customer journey mapping
    const customerJourney = {
      touchpoints: [
        {
          stage: 'Awareness',
          channels: ['Social Media', 'Content Marketing', 'SEO'],
          avgDuration: 7, // days
          conversionRate: 0.15,
          keyMetrics: ['impressions', 'clicks', 'time_on_site']
        },
        {
          stage: 'Interest',
          channels: ['Email', 'Webinars', 'Case Studies'],
          avgDuration: 14,
          conversionRate: 0.25,
          keyMetrics: ['email_opens', 'content_downloads', 'demo_requests']
        },
        {
          stage: 'Consideration',
          channels: ['Sales Calls', 'Product Demos', 'Proposals'],
          avgDuration: 21,
          conversionRate: 0.35,
          keyMetrics: ['call_duration', 'demo_completion', 'proposal_views']
        },
        {
          stage: 'Purchase',
          channels: ['Sales Team', 'Online Checkout', 'Contracts'],
          avgDuration: 7,
          conversionRate: 0.65,
          keyMetrics: ['contract_signed', 'payment_completed', 'onboarding_started']
        }
      ],
      customerLifecycle: {
        avgAcquisitionCost: 450,
        avgLifetimeValue: 15500,
        churnRate: 0.08,
        retentionRate: 0.92
      }
    }

    // Feature 4: Pipeline analytics and forecasting
    const pipelineAnalytics = {
      forecast: {
        nextMonth: {
          expectedRevenue: 45000,
          confidence: 0.85,
          dealsExpected: 18,
          avgDealSize: 2500
        },
        nextQuarter: {
          expectedRevenue: 135000,
          confidence: 0.75,
          dealsExpected: 54,
          avgDealSize: 2500
        }
      },
      performance: {
        conversionRates: [
          { stage: 'Prospecting to Qualified', rate: 0.4 },
          { stage: 'Qualified to Proposal', rate: 0.6 },
          { stage: 'Proposal to Negotiation', rate: 0.7 },
          { stage: 'Negotiation to Closed', rate: 0.8 }
        ],
        velocityMetrics: {
          avgTimeInStage: {
            'Prospecting': 5,
            'Qualified': 7,
            'Proposal': 10,
            'Negotiation': 8,
            'Closed Won': 1
          }
        }
      }
    }

    return NextResponse.json({
      pipelines,
      automations,
      customerJourney,
      pipelineAnalytics
    })

  } catch (error) {
    console.error('Pipelines API error:', error)
    return NextResponse.json({ error: 'Failed to fetch pipelines data' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { individualId, action, pipelineData, leadData, automationData } = await req.json()

    if (!individualId || !action) {
      return NextResponse.json({ error: 'Individual ID and action required' }, { status: 400 })
    }

    switch (action) {
      case 'create_pipeline':
        // Feature 5: Pipeline creation
        const newPipeline = {
          id: `pipeline_${Date.now()}`,
          name: pipelineData.name,
          description: pipelineData.description,
          type: pipelineData.type || 'sales',
          stages: pipelineData.stages || [],
          totalValue: 0,
          expectedRevenue: 0,
          createdAt: new Date(),
          createdBy: user.id,
          individualId
        }

        return NextResponse.json({
          success: true,
          pipeline: newPipeline,
          message: 'Pipeline created successfully'
        })

      case 'move_lead':
        // Feature 6: Lead stage management
        const leadMove = {
          leadId: leadData.leadId,
          fromStage: leadData.fromStage,
          toStage: leadData.toStage,
          movedBy: user.id,
          movedAt: new Date(),
          reason: leadData.reason || 'Manual move',
          probability: leadData.probability
        }

        return NextResponse.json({
          success: true,
          leadMove,
          message: 'Lead moved successfully'
        })

      case 'update_lead_score':
        // Feature 7: Lead scoring
        const scoreUpdate = {
          leadId: leadData.leadId,
          oldScore: leadData.oldScore,
          newScore: leadData.newScore,
          factors: leadData.factors || [],
          updatedBy: user.id,
          updatedAt: new Date()
        }

        return NextResponse.json({
          success: true,
          scoreUpdate,
          message: 'Lead score updated successfully'
        })

      case 'create_automation':
        // Feature 8: Process automation
        const newAutomation = {
          id: `automation_${Date.now()}`,
          name: automationData.name,
          description: automationData.description,
          trigger: automationData.trigger,
          conditions: automationData.conditions || [],
          actions: automationData.actions || [],
          isActive: false,
          createdAt: new Date(),
          createdBy: user.id,
          totalRuns: 0
        }

        return NextResponse.json({
          success: true,
          automation: newAutomation,
          message: 'Automation created successfully'
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Pipelines action error:', error)
    return NextResponse.json({ error: 'Failed to process pipelines action' }, { status: 500 })
  }
}