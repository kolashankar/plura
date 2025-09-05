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
    const projectId = searchParams.get('projectId')

    if (!individualId) {
      return NextResponse.json({ error: 'Individual ID required' }, { status: 400 })
    }

    // Feature 1: Team member management
    const teamMembers = [
      {
        id: 'member_1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'Project Manager',
        permissions: ['read', 'write', 'admin'],
        status: 'active',
        avatar: '/assets/avatar-1.jpg',
        joinedAt: new Date('2024-01-10'),
        lastActive: new Date('2024-01-25')
      },
      {
        id: 'member_2',
        name: 'Bob Smith',
        email: 'bob@example.com', 
        role: 'Developer',
        permissions: ['read', 'write'],
        status: 'active',
        avatar: '/assets/avatar-2.jpg',
        joinedAt: new Date('2024-01-15'),
        lastActive: new Date('2024-01-26')
      },
      {
        id: 'member_3',
        name: 'Carol Davis',
        email: 'carol@example.com',
        role: 'Designer',
        permissions: ['read', 'write'],
        status: 'pending',
        avatar: '/assets/avatar-3.jpg',
        joinedAt: new Date('2024-01-20'),
        lastActive: null
      }
    ]

    // Feature 2: Project collaboration
    const projects = [
      {
        id: 'proj_1',
        name: 'E-commerce Website Redesign',
        description: 'Complete redesign of the main e-commerce platform',
        status: 'in_progress',
        priority: 'high',
        progress: 65,
        assignedMembers: ['member_1', 'member_2'],
        startDate: new Date('2024-01-15'),
        dueDate: new Date('2024-02-15'),
        tasks: 12,
        completedTasks: 8
      },
      {
        id: 'proj_2',
        name: 'Mobile App Development',
        description: 'Native mobile app for iOS and Android',
        status: 'planning',
        priority: 'medium',
        progress: 25,
        assignedMembers: ['member_2', 'member_3'],
        startDate: new Date('2024-02-01'),
        dueDate: new Date('2024-04-01'),
        tasks: 20,
        completedTasks: 5
      }
    ]

    // Feature 3: Communication hub
    const messages = [
      {
        id: 'msg_1',
        senderId: 'member_1',
        senderName: 'Alice Johnson',
        content: 'The new design mockups are ready for review',
        timestamp: new Date('2024-01-26T10:30:00Z'),
        type: 'text',
        projectId: 'proj_1',
        isRead: false
      },
      {
        id: 'msg_2',
        senderId: 'member_2',
        senderName: 'Bob Smith',
        content: 'API integration completed successfully',
        timestamp: new Date('2024-01-26T14:15:00Z'),
        type: 'text',
        projectId: 'proj_1',
        isRead: true
      }
    ]

    // Feature 4: Activity feed
    const activities = [
      {
        id: 'activity_1',
        userId: 'member_1',
        userName: 'Alice Johnson',
        action: 'created_task',
        target: 'Design Header Component',
        projectId: 'proj_1',
        timestamp: new Date('2024-01-26T09:00:00Z')
      },
      {
        id: 'activity_2',
        userId: 'member_2',
        userName: 'Bob Smith',
        action: 'completed_task',
        target: 'API Documentation',
        projectId: 'proj_1',
        timestamp: new Date('2024-01-26T11:30:00Z')
      }
    ]

    return NextResponse.json({
      teamMembers,
      projects: projectId ? projects.filter(p => p.id === projectId) : projects,
      messages,
      activities
    })

  } catch (error) {
    console.error('Team collaboration API error:', error)
    return NextResponse.json({ error: 'Failed to fetch team data' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { individualId, action, memberData, projectData, messageData } = await req.json()

    if (!individualId || !action) {
      return NextResponse.json({ error: 'Individual ID and action required' }, { status: 400 })
    }

    switch (action) {
      case 'invite_member':
        // Feature 5: Team member invitation
        const invitation = {
          id: `inv_${Date.now()}`,
          email: memberData.email,
          role: memberData.role,
          permissions: memberData.permissions || ['read'],
          invitedBy: user.id,
          individualId,
          status: 'pending',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          createdAt: new Date()
        }

        return NextResponse.json({
          success: true,
          invitation,
          message: 'Team member invited successfully'
        })

      case 'create_project':
        // Feature 6: Project creation
        const newProject = {
          id: `proj_${Date.now()}`,
          ...projectData,
          individualId,
          createdBy: user.id,
          status: 'planning',
          progress: 0,
          createdAt: new Date()
        }

        return NextResponse.json({
          success: true,
          project: newProject,
          message: 'Project created successfully'
        })

      case 'send_message':
        // Feature 7: Team messaging
        const newMessage = {
          id: `msg_${Date.now()}`,
          senderId: user.id,
          senderName: user.firstName + ' ' + user.lastName,
          content: messageData.content,
          type: messageData.type || 'text',
          projectId: messageData.projectId,
          timestamp: new Date(),
          isRead: false
        }

        return NextResponse.json({
          success: true,
          message: newMessage,
          messageResponse: 'Message sent successfully'
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Team collaboration action error:', error)
    return NextResponse.json({ error: 'Failed to process team action' }, { status: 500 })
  }
}