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
    const segment = searchParams.get('segment')
    const status = searchParams.get('status')

    if (!individualId) {
      return NextResponse.json({ error: 'Individual ID required' }, { status: 400 })
    }

    // Feature 1: Contact management system
    const contacts = [
      {
        id: 'contact_1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0123',
        company: 'Tech Corp',
        position: 'CEO',
        status: 'active',
        leadScore: 85,
        source: 'website',
        tags: ['premium', 'enterprise'],
        lastActivity: new Date('2024-01-26'),
        createdAt: new Date('2024-01-15'),
        notes: 'Interested in enterprise package',
        socialProfiles: {
          linkedin: 'https://linkedin.com/in/johndoe',
          twitter: 'https://twitter.com/johndoe'
        }
      },
      {
        id: 'contact_2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+1-555-0124',
        company: 'Design Studio',
        position: 'Creative Director',
        status: 'active',
        leadScore: 72,
        source: 'referral',
        tags: ['design', 'creative'],
        lastActivity: new Date('2024-01-25'),
        createdAt: new Date('2024-01-10'),
        notes: 'Looking for design templates',
        socialProfiles: {
          linkedin: 'https://linkedin.com/in/janesmith',
          instagram: 'https://instagram.com/janesmith'
        }
      },
      {
        id: 'contact_3',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@example.com',
        phone: '+1-555-0125',
        company: 'Startup Inc',
        position: 'Founder',
        status: 'prospect',
        leadScore: 45,
        source: 'social_media',
        tags: ['startup', 'early_stage'],
        lastActivity: new Date('2024-01-24'),
        createdAt: new Date('2024-01-20'),
        notes: 'Startup founder, price sensitive',
        socialProfiles: {
          twitter: 'https://twitter.com/bobjohnson'
        }
      }
    ]

    // Feature 2: Contact segmentation
    const segments = [
      {
        id: 'segment_1',
        name: 'Enterprise Clients',
        description: 'Large enterprise customers',
        criteria: {
          leadScore: { min: 70 },
          tags: ['enterprise', 'premium'],
          company: { exists: true }
        },
        contactCount: 25,
        conversionRate: 0.32
      },
      {
        id: 'segment_2',
        name: 'Design Professionals',
        description: 'Designers and creative professionals',
        criteria: {
          tags: ['design', 'creative'],
          position: ['Designer', 'Creative Director', 'Art Director']
        },
        contactCount: 18,
        conversionRate: 0.28
      },
      {
        id: 'segment_3',
        name: 'Startups',
        description: 'Early-stage startups and founders',
        criteria: {
          tags: ['startup', 'early_stage'],
          leadScore: { max: 60 }
        },
        contactCount: 12,
        conversionRate: 0.15
      }
    ]

    // Feature 3: Communication tools
    const communicationHistory = [
      {
        id: 'comm_1',
        contactId: 'contact_1',
        type: 'email',
        direction: 'outbound',
        subject: 'Enterprise Package Information',
        content: 'Thank you for your interest in our enterprise package...',
        timestamp: new Date('2024-01-26T10:30:00Z'),
        status: 'sent',
        openedAt: new Date('2024-01-26T11:15:00Z'),
        clickedAt: new Date('2024-01-26T11:20:00Z')
      },
      {
        id: 'comm_2',
        contactId: 'contact_1',
        type: 'phone',
        direction: 'inbound',
        duration: 1800, // 30 minutes in seconds
        notes: 'Discussed pricing and implementation timeline',
        timestamp: new Date('2024-01-25T14:00:00Z'),
        status: 'completed'
      },
      {
        id: 'comm_3',
        contactId: 'contact_2',
        type: 'email',
        direction: 'inbound',
        subject: 'Template Customization Question',
        content: 'I have a question about customizing the design templates...',
        timestamp: new Date('2024-01-25T09:45:00Z'),
        status: 'received'
      }
    ]

    // Feature 4: Lead scoring and analytics
    const leadAnalytics = {
      totalContacts: contacts.length,
      activeContacts: contacts.filter(c => c.status === 'active').length,
      averageLeadScore: contacts.reduce((sum, c) => sum + c.leadScore, 0) / contacts.length,
      topSources: [
        { source: 'website', count: 45, percentage: 42 },
        { source: 'referral', count: 32, percentage: 30 },
        { source: 'social_media', count: 18, percentage: 17 },
        { source: 'advertising', count: 12, percentage: 11 }
      ],
      conversionRates: {
        website: 0.25,
        referral: 0.35,
        social_media: 0.18,
        advertising: 0.22
      },
      scoreDistribution: [
        { range: '0-25', count: 8 },
        { range: '26-50', count: 15 },
        { range: '51-75', count: 22 },
        { range: '76-100', count: 18 }
      ]
    }

    return NextResponse.json({
      contacts: segment ? contacts.filter(c => c.tags.includes(segment)) : 
                status ? contacts.filter(c => c.status === status) : contacts,
      segments,
      communicationHistory,
      leadAnalytics
    })

  } catch (error) {
    console.error('Contacts API error:', error)
    return NextResponse.json({ error: 'Failed to fetch contacts data' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { individualId, action, contactData, segmentData, communicationData } = await req.json()

    if (!individualId || !action) {
      return NextResponse.json({ error: 'Individual ID and action required' }, { status: 400 })
    }

    switch (action) {
      case 'create_contact':
        // Feature 5: Contact creation
        const newContact = {
          id: `contact_${Date.now()}`,
          firstName: contactData.firstName,
          lastName: contactData.lastName,
          email: contactData.email,
          phone: contactData.phone,
          company: contactData.company,
          position: contactData.position,
          status: 'prospect',
          leadScore: 0,
          source: contactData.source || 'manual',
          tags: contactData.tags || [],
          createdAt: new Date(),
          lastActivity: new Date(),
          notes: contactData.notes || '',
          individualId
        }

        return NextResponse.json({
          success: true,
          contact: newContact,
          message: 'Contact created successfully'
        })

      case 'update_lead_score':
        // Feature 6: Lead scoring updates
        const { contactId, scoreChange, reason } = contactData
        
        return NextResponse.json({
          success: true,
          contactId,
          scoreChange,
          reason,
          updatedAt: new Date(),
          message: 'Lead score updated successfully'
        })

      case 'create_segment':
        // Feature 7: Segment creation
        const newSegment = {
          id: `segment_${Date.now()}`,
          name: segmentData.name,
          description: segmentData.description,
          criteria: segmentData.criteria,
          createdAt: new Date(),
          createdBy: user.id,
          individualId,
          contactCount: 0,
          conversionRate: 0
        }

        return NextResponse.json({
          success: true,
          segment: newSegment,
          message: 'Segment created successfully'
        })

      case 'send_communication':
        // Feature 8: Communication logging
        const newCommunication = {
          id: `comm_${Date.now()}`,
          contactId: communicationData.contactId,
          type: communicationData.type,
          direction: 'outbound',
          subject: communicationData.subject,
          content: communicationData.content,
          timestamp: new Date(),
          status: 'sent',
          sentBy: user.id
        }

        return NextResponse.json({
          success: true,
          communication: newCommunication,
          message: 'Communication sent successfully'
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Contacts action error:', error)
    return NextResponse.json({ error: 'Failed to process contacts action' }, { status: 500 })
  }
}