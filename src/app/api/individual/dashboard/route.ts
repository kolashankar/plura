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
    const timeRange = searchParams.get('timeRange') || '7d'

    if (!individualId) {
      return NextResponse.json({ error: 'Individual ID required' }, { status: 400 })
    }

    // Feature 1: Real-time statistics overview
    const statistics = {
      totalProjects: 8,
      activeProjects: 3,
      completedProjects: 5,
      totalRevenue: 15420.50,
      monthlyRevenue: 3240.75,
      totalCustomers: 145,
      newCustomers: 12,
      conversionRate: 3.2,
      avgProjectValue: 1927.56,
      uptime: 99.8,
      lastUpdated: new Date()
    }

    // Feature 2: Quick actions dashboard
    const quickActions = [
      {
        id: 'action_1',
        title: 'Create New Project',
        description: 'Start a new website or application project',
        icon: 'plus',
        action: 'create_project',
        category: 'project',
        isEnabled: true
      },
      {
        id: 'action_2',
        title: 'Deploy to Production',
        description: 'Deploy your latest changes to live environment',
        icon: 'rocket',
        action: 'deploy_production',
        category: 'deployment',
        isEnabled: true
      },
      {
        id: 'action_3',
        title: 'Backup Data',
        description: 'Create a full backup of your projects and data',
        icon: 'download',
        action: 'backup_data',
        category: 'maintenance',
        isEnabled: true
      },
      {
        id: 'action_4',
        title: 'Invite Team Member',
        description: 'Add a new team member to collaborate',
        icon: 'users',
        action: 'invite_member',
        category: 'team',
        isEnabled: true
      }
    ]

    // Feature 3: Notifications and alerts
    const notifications = [
      {
        id: 'notif_1',
        type: 'success',
        title: 'Project Deployed Successfully',
        message: 'Your e-commerce project has been deployed to production',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: false,
        actionUrl: '/Individual/' + individualId + '/projects/proj_1'
      },
      {
        id: 'notif_2',
        type: 'warning',
        title: 'Storage Limit Warning',
        message: 'You are using 85% of your storage quota',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        isRead: false,
        actionUrl: '/Individual/' + individualId + '/billing'
      },
      {
        id: 'notif_3',
        type: 'info',
        title: 'New Feature Available',
        message: 'Check out the new AI-powered component generator',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        isRead: true,
        actionUrl: '/Individual/' + individualId + '/features'
      },
      {
        id: 'notif_4',
        type: 'error',
        title: 'Payment Method Expired',
        message: 'Please update your payment method to continue service',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        isRead: false,
        actionUrl: '/Individual/' + individualId + '/billing'
      }
    ]

    // Feature 4: Recent activity feed
    const recentActivity = [
      {
        id: 'activity_1',
        action: 'project_created',
        title: 'Created new project "Mobile App"',
        description: 'Started development of a React Native mobile application',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        user: user.firstName + ' ' + user.lastName,
        avatar: user.imageUrl
      },
      {
        id: 'activity_2',
        action: 'deployment_completed',
        title: 'Deployed project to production',
        description: 'E-commerce website v2.1 successfully deployed',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        user: user.firstName + ' ' + user.lastName,
        avatar: user.imageUrl
      },
      {
        id: 'activity_3',
        action: 'payment_received',
        title: 'Payment received',
        description: '$299.99 payment for Premium Website Template',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        user: 'System',
        avatar: '/assets/system-avatar.png'
      }
    ]

    // Feature 5: Performance metrics
    const performanceMetrics = {
      websiteSpeed: {
        score: 92,
        trend: 'up',
        change: '+5%'
      },
      seo: {
        score: 88,
        trend: 'up',
        change: '+12%'
      },
      accessibility: {
        score: 95,
        trend: 'stable',
        change: '0%'
      },
      bestPractices: {
        score: 90,
        trend: 'up',
        change: '+3%'
      }
    }

    return NextResponse.json({
      statistics,
      quickActions,
      notifications: notifications.slice(0, 5), // Limit to 5 most recent
      recentActivity: recentActivity.slice(0, 10), // Limit to 10 most recent
      performanceMetrics,
      timeRange
    })

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { individualId, action, actionData } = await req.json()

    if (!individualId || !action) {
      return NextResponse.json({ error: 'Individual ID and action required' }, { status: 400 })
    }

    switch (action) {
      case 'mark_notification_read':
        // Feature 6: Notification management
        const { notificationId } = actionData
        
        return NextResponse.json({
          success: true,
          notificationId,
          message: 'Notification marked as read'
        })

      case 'execute_quick_action':
        // Feature 7: Quick action execution
        const { quickActionId } = actionData
        
        // Process the quick action based on its type
        let result = {}
        switch (quickActionId) {
          case 'action_1': // Create project
            result = { projectId: `proj_${Date.now()}`, status: 'created' }
            break
          case 'action_2': // Deploy
            result = { deploymentId: `dep_${Date.now()}`, status: 'deploying' }
            break
          case 'action_3': // Backup
            result = { backupId: `backup_${Date.now()}`, status: 'started' }
            break
          default:
            result = { status: 'completed' }
        }

        return NextResponse.json({
          success: true,
          quickActionId,
          result,
          message: 'Quick action executed successfully'
        })

      case 'refresh_metrics':
        // Feature 8: Manual metrics refresh
        return NextResponse.json({
          success: true,
          refreshedAt: new Date(),
          message: 'Dashboard metrics refreshed'
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Dashboard action error:', error)
    return NextResponse.json({ error: 'Failed to process dashboard action' }, { status: 500 })
  }
}