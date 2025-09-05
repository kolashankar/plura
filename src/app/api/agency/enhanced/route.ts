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
    const agencyId = searchParams.get('agencyId')

    if (!agencyId) {
      return NextResponse.json({ error: 'Agency ID required' }, { status: 400 })
    }

    // Enhanced Agency Dashboard with 2 Demo Subaccounts
    const agencyDashboard = {
      agency: {
        id: agencyId,
        name: 'Digital Marketing Pro Agency',
        description: 'Full-service digital marketing and web development agency',
        logo: '/assets/agency-logo.png',
        website: 'https://digitalmarketingpro.com',
        phone: '+1-555-0199',
        email: 'contact@digitalmarketingpro.com',
        address: '123 Business Ave, Suite 456, New York, NY 10001',
        founded: new Date('2020-01-15'),
        teamSize: 25,
        clientsServed: 150,
        projectsCompleted: 320
      },
      
      // Feature 1: Two fully configured subaccounts
      subAccounts: [
        {
          id: 'subaccount_1',
          name: 'TechStart Solutions',
          description: 'B2B SaaS startup specializing in project management tools',
          logo: '/assets/techstart-logo.png',
          website: 'https://techstartsolutions.com',
          industry: 'Technology',
          clientSince: new Date('2023-06-15'),
          monthlyRevenue: 45000,
          activeProjects: 3,
          teamMembers: 4,
          status: 'active',
          services: ['Web Development', 'SEO', 'PPC Advertising', 'Content Marketing'],
          metrics: {
            websiteTraffic: 25000,
            conversionRate: 3.2,
            leadGeneration: 150,
            socialEngagement: 8500
          },
          currentCampaigns: [
            {
              id: 'campaign_1',
              name: 'Product Launch Campaign',
              type: 'integrated',
              budget: 15000,
              spent: 8500,
              startDate: new Date('2024-01-01'),
              endDate: new Date('2024-02-29'),
              status: 'active'
            }
          ]
        },
        {
          id: 'subaccount_2', 
          name: 'EcoFriendly Retail',
          description: 'Sustainable products e-commerce platform',
          logo: '/assets/ecofriendly-logo.png',
          website: 'https://ecofriendlyretail.com',
          industry: 'E-commerce',
          clientSince: new Date('2023-09-20'),
          monthlyRevenue: 32000,
          activeProjects: 5,
          teamMembers: 6,
          status: 'active',
          services: ['E-commerce Development', 'Email Marketing', 'Social Media', 'Analytics'],
          metrics: {
            websiteTraffic: 18000,
            conversionRate: 4.1,
            averageOrderValue: 85.50,
            socialEngagement: 12000
          },
          currentCampaigns: [
            {
              id: 'campaign_2',
              name: 'Holiday Sales Campaign',
              type: 'ecommerce',
              budget: 12000,
              spent: 7200,
              startDate: new Date('2024-01-15'),
              endDate: new Date('2024-02-14'),
              status: 'active'
            }
          ]
        }
      ],

      // Feature 2: Agency-wide analytics
      agencyAnalytics: {
        totalRevenue: 125000,
        monthlyRecurring: 77000,
        clientRetentionRate: 0.92,
        averageProjectValue: 15500,
        teamUtilization: 0.85,
        profitMargin: 0.35,
        growthRate: 0.28,
        clientSatisfaction: 4.7,
        revenueByService: [
          { service: 'Web Development', revenue: 45000, percentage: 36 },
          { service: 'Digital Marketing', revenue: 38000, percentage: 30.4 },
          { service: 'SEO Services', revenue: 25000, percentage: 20 },
          { service: 'Consulting', revenue: 17000, percentage: 13.6 }
        ]
      },

      // Feature 3: Team management
      teamManagement: {
        departments: [
          {
            name: 'Development',
            headCount: 8,
            manager: 'Sarah Johnson',
            budget: 35000,
            utilization: 0.88
          },
          {
            name: 'Marketing',
            headCount: 6,
            manager: 'Mike Chen',
            budget: 28000,
            utilization: 0.82
          },
          {
            name: 'Design',
            headCount: 5,
            manager: 'Emily Rodriguez',
            budget: 22000,
            utilization: 0.90
          },
          {
            name: 'Sales',
            headCount: 4,
            manager: 'David Kim',
            budget: 18000,
            utilization: 0.75
          },
          {
            name: 'Support',
            headCount: 2,
            manager: 'Lisa Wang',
            budget: 12000,
            utilization: 0.95
          }
        ],
        totalEmployees: 25,
        remoteWorkers: 12,
        contractorCount: 8,
        averageSalary: 75000
      },

      // Feature 4: Resource allocation
      resourceAllocation: {
        projectCapacity: {
          total: 100,
          allocated: 85,
          available: 15
        },
        skillsets: [
          { skill: 'React Development', demand: 85, supply: 90 },
          { skill: 'SEO Optimization', demand: 70, supply: 80 },
          { skill: 'PPC Management', demand: 60, supply: 75 },
          { skill: 'UI/UX Design', demand: 90, supply: 85 },
          { skill: 'Content Writing', demand: 55, supply: 70 }
        ],
        upcomingDeadlines: [
          {
            project: 'TechStart Website Redesign',
            client: 'TechStart Solutions',
            deadline: new Date('2024-02-15'),
            progress: 75,
            risk: 'low'
          },
          {
            project: 'EcoFriendly Mobile App',
            client: 'EcoFriendly Retail',
            deadline: new Date('2024-02-28'),
            progress: 45,
            risk: 'medium'
          }
        ]
      }
    }

    return NextResponse.json(agencyDashboard)

  } catch (error) {
    console.error('Enhanced Agency API error:', error)
    return NextResponse.json({ error: 'Failed to fetch agency data' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { agencyId, action, subaccountData, teamData, resourceData } = await req.json()

    if (!agencyId || !action) {
      return NextResponse.json({ error: 'Agency ID and action required' }, { status: 400 })
    }

    switch (action) {
      case 'create_subaccount':
        // Feature 5: Enhanced subaccount creation
        const newSubaccount = {
          id: `subaccount_${Date.now()}`,
          name: subaccountData.name,
          description: subaccountData.description,
          industry: subaccountData.industry,
          logo: subaccountData.logo || '/assets/default-client-logo.png',
          website: subaccountData.website,
          clientSince: new Date(),
          monthlyRevenue: 0,
          activeProjects: 0,
          teamMembers: 1,
          status: 'onboarding',
          services: subaccountData.services || [],
          agencyId,
          createdBy: user.id
        }

        return NextResponse.json({
          success: true,
          subaccount: newSubaccount,
          message: 'Subaccount created successfully'
        })

      case 'assign_team_member':
        // Feature 6: Team assignment
        const assignment = {
          memberId: teamData.memberId,
          subaccountId: teamData.subaccountId,
          role: teamData.role,
          startDate: new Date(),
          utilization: teamData.utilization || 1.0,
          assignedBy: user.id
        }

        return NextResponse.json({
          success: true,
          assignment,
          message: 'Team member assigned successfully'
        })

      case 'allocate_resources':
        // Feature 7: Resource allocation
        const allocation = {
          projectId: resourceData.projectId,
          resources: resourceData.resources,
          startDate: new Date(resourceData.startDate),
          endDate: new Date(resourceData.endDate),
          budget: resourceData.budget,
          priority: resourceData.priority || 'medium',
          allocatedBy: user.id
        }

        return NextResponse.json({
          success: true,
          allocation,
          message: 'Resources allocated successfully'
        })

      case 'update_metrics':
        // Feature 8: Metrics updates
        const metricsUpdate = {
          subaccountId: subaccountData.subaccountId,
          metrics: subaccountData.metrics,
          period: subaccountData.period || 'monthly',
          updatedAt: new Date(),
          updatedBy: user.id
        }

        return NextResponse.json({
          success: true,
          metricsUpdate,
          message: 'Metrics updated successfully'
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Enhanced Agency action error:', error)
    return NextResponse.json({ error: 'Failed to process agency action' }, { status: 500 })
  }
}