import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const subAccountId = searchParams.get('subAccountId')

    // Mock data for nurture sequences
    const mockSequences = [
      {
        id: '1',
        name: 'Welcome Series',
        description: 'Onboard new leads with a 5-email welcome sequence',
        triggerEvent: 'form_submission',
        isActive: true,
        totalLeads: 152,
        convertedLeads: 34,
        conversionRate: 22.4,
        steps: [
          {
            id: '1',
            type: 'email',
            delay: 0,
            title: 'Welcome Email',
            content: 'Welcome to our community! Here\'s what to expect...',
          },
          {
            id: '2',
            type: 'delay',
            delay: 24,
            title: '24 Hour Delay',
            content: '',
          },
          {
            id: '3',
            type: 'email',
            delay: 0,
            title: 'Getting Started Guide',
            content: 'Here\'s how to get the most out of our platform...',
          },
          {
            id: '4',
            type: 'delay',
            delay: 72,
            title: '3 Day Delay',
            content: '',
          },
          {
            id: '5',
            type: 'email',
            delay: 0,
            title: 'Success Stories',
            content: 'See how others have succeeded with our tools...',
          }
        ]
      },
      {
        id: '2',
        name: 'Cart Abandonment',
        description: 'Re-engage users who abandoned their shopping cart',
        triggerEvent: 'cart_abandoned',
        isActive: true,
        totalLeads: 89,
        convertedLeads: 23,
        conversionRate: 25.8,
        steps: [
          {
            id: '1',
            type: 'delay',
            delay: 2,
            title: '2 Hour Delay',
            content: '',
          },
          {
            id: '2',
            type: 'email',
            delay: 0,
            title: 'Reminder Email',
            content: 'You left something in your cart...',
          },
          {
            id: '3',
            type: 'delay',
            delay: 24,
            title: '24 Hour Delay',
            content: '',
          },
          {
            id: '4',
            type: 'email',
            delay: 0,
            title: 'Discount Offer',
            content: 'Complete your purchase with 10% off!',
          }
        ]
      }
    ]

    return NextResponse.json(mockSequences)
  } catch (error) {
    console.error('Error fetching nurture sequences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sequences' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sequenceData = await req.json()
    const { name, description, triggerEvent, subAccountId, automationId } = sequenceData

    // Validate input
    if (!name?.trim() || !triggerEvent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new sequence (in production, save to database)
    const newSequence = {
      id: Math.random().toString(36).substring(7),
      name,
      description: description || '',
      triggerEvent,
      isActive: false,
      totalLeads: 0,
      convertedLeads: 0,
      conversionRate: 0,
      steps: [],
      createdAt: new Date(),
      subAccountId,
      automationId
    }

    return NextResponse.json(newSequence)
  } catch (error) {
    console.error('Error creating nurture sequence:', error)
    return NextResponse.json(
      { error: 'Failed to create sequence' },
      { status: 500 }
    )
  }
}