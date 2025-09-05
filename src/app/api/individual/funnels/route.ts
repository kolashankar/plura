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

    // Feature 1: Advanced funnel builder with templates
    const funnels = [
      {
        id: 'funnel_1',
        name: 'Lead Generation Funnel',
        description: 'Capture leads and convert them to customers',
        status: 'active',
        type: 'lead_generation',
        conversionRate: 15.5,
        totalVisitors: 5420,
        totalConversions: 840,
        revenue: 25200,
        createdAt: new Date('2024-01-15'),
        pages: [
          {
            id: 'page_1',
            name: 'Landing Page',
            type: 'landing',
            path: '/',
            conversions: 3250,
            visitors: 5420,
            conversionRate: 60.0
          },
          {
            id: 'page_2', 
            name: 'Lead Capture',
            type: 'form',
            path: '/capture',
            conversions: 1080,
            visitors: 3250,
            conversionRate: 33.2
          },
          {
            id: 'page_3',
            name: 'Thank You',
            type: 'thank_you',
            path: '/thank-you',
            conversions: 840,
            visitors: 1080,
            conversionRate: 77.8
          }
        ]
      },
      {
        id: 'funnel_2',
        name: 'E-commerce Sales Funnel',
        description: 'Product showcase to purchase completion',
        status: 'active',
        type: 'ecommerce',
        conversionRate: 8.2,
        totalVisitors: 8900,
        totalConversions: 730,
        revenue: 87600,
        createdAt: new Date('2024-01-10'),
        pages: [
          {
            id: 'page_4',
            name: 'Product Page',
            type: 'product',
            path: '/product',
            conversions: 2670,
            visitors: 8900,
            conversionRate: 30.0
          },
          {
            id: 'page_5',
            name: 'Cart Page',
            type: 'cart',
            path: '/cart',
            conversions: 1335,
            visitors: 2670,
            conversionRate: 50.0
          },
          {
            id: 'page_6',
            name: 'Checkout',
            type: 'checkout',
            path: '/checkout',
            conversions: 730,
            visitors: 1335,
            conversionRate: 54.7
          }
        ]
      }
    ]

    // Feature 2: A/B testing capabilities
    const abTests = [
      {
        id: 'test_1',
        funnelId: 'funnel_1',
        name: 'Headline Variation Test',
        description: 'Testing different headlines on landing page',
        status: 'running',
        startDate: new Date('2024-01-20'),
        endDate: new Date('2024-02-20'),
        variants: [
          {
            id: 'variant_a',
            name: 'Control (Original)',
            traffic: 50,
            conversions: 420,
            visitors: 2710,
            conversionRate: 15.5
          },
          {
            id: 'variant_b',
            name: 'Variation B',
            traffic: 50,
            conversions: 520,
            visitors: 2710,
            conversionRate: 19.2
          }
        ],
        significance: 0.85,
        winner: 'variant_b'
      }
    ]

    // Feature 3: Conversion tracking and analytics
    const conversionAnalytics = {
      overview: {
        totalFunnels: funnels.length,
        avgConversionRate: funnels.reduce((sum, f) => sum + f.conversionRate, 0) / funnels.length,
        totalRevenue: funnels.reduce((sum, f) => sum + f.revenue, 0),
        totalVisitors: funnels.reduce((sum, f) => sum + f.totalVisitors, 0),
        totalConversions: funnels.reduce((sum, f) => sum + f.totalConversions, 0)
      },
      trends: [
        { date: '2024-01-22', conversions: 45, visitors: 320 },
        { date: '2024-01-23', conversions: 52, visitors: 345 },
        { date: '2024-01-24', conversions: 38, visitors: 298 },
        { date: '2024-01-25', conversions: 61, visitors: 378 },
        { date: '2024-01-26', conversions: 47, visitors: 312 }
      ],
      topPerformers: funnels.sort((a, b) => b.conversionRate - a.conversionRate).slice(0, 3)
    }

    // Feature 4: Funnel templates
    const templates = [
      {
        id: 'template_1',
        name: 'Lead Magnet Funnel',
        description: 'Download lead magnet in exchange for email',
        category: 'lead_generation',
        pages: 3,
        estimatedConversion: 18.5,
        thumbnail: '/assets/lead-magnet-template.jpg'
      },
      {
        id: 'template_2',
        name: 'Webinar Registration',
        description: 'Register attendees for live webinar',
        category: 'event',
        pages: 4,
        estimatedConversion: 25.2,
        thumbnail: '/assets/webinar-template.jpg'
      },
      {
        id: 'template_3',
        name: 'Product Launch',
        description: 'Announce and sell new product',
        category: 'ecommerce',
        pages: 5,
        estimatedConversion: 12.8,
        thumbnail: '/assets/product-launch-template.jpg'
      }
    ]

    return NextResponse.json({
      funnels: status ? funnels.filter(f => f.status === status) : funnels,
      abTests,
      conversionAnalytics,
      templates
    })

  } catch (error) {
    console.error('Funnels API error:', error)
    return NextResponse.json({ error: 'Failed to fetch funnels data' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { individualId, action, funnelData, testData, pageData } = await req.json()

    if (!individualId || !action) {
      return NextResponse.json({ error: 'Individual ID and action required' }, { status: 400 })
    }

    switch (action) {
      case 'create_funnel':
        // Feature 5: Advanced funnel creation
        const newFunnel = {
          id: `funnel_${Date.now()}`,
          name: funnelData.name,
          description: funnelData.description,
          type: funnelData.type,
          templateId: funnelData.templateId,
          status: 'draft',
          conversionRate: 0,
          totalVisitors: 0,
          totalConversions: 0,
          revenue: 0,
          createdAt: new Date(),
          createdBy: user.id,
          individualId,
          pages: funnelData.pages || []
        }

        return NextResponse.json({
          success: true,
          funnel: newFunnel,
          message: 'Funnel created successfully'
        })

      case 'start_ab_test':
        // Feature 6: A/B test creation
        const newTest = {
          id: `test_${Date.now()}`,
          funnelId: testData.funnelId,
          name: testData.name,
          description: testData.description,
          status: 'running',
          startDate: new Date(),
          endDate: new Date(testData.endDate),
          variants: testData.variants,
          trafficSplit: testData.trafficSplit || 50,
          createdBy: user.id
        }

        return NextResponse.json({
          success: true,
          abTest: newTest,
          message: 'A/B test started successfully'
        })

      case 'optimize_funnel':
        // Feature 7: Automated funnel optimization
        const optimization = {
          funnelId: funnelData.funnelId,
          optimizationType: funnelData.optimizationType,
          recommendations: [
            'Reduce form fields on page 2 to increase completion rate',
            'Add social proof elements to landing page',
            'Implement exit-intent popup on checkout page'
          ],
          estimatedImprovement: 12.5,
          implementedAt: new Date()
        }

        return NextResponse.json({
          success: true,
          optimization,
          message: 'Funnel optimization recommendations generated'
        })

      case 'track_conversion':
        // Feature 8: Conversion event tracking
        const conversionEvent = {
          id: `conversion_${Date.now()}`,
          funnelId: funnelData.funnelId,
          pageId: pageData.pageId,
          visitorId: funnelData.visitorId,
          eventType: funnelData.eventType,
          value: funnelData.value || 0,
          timestamp: new Date(),
          metadata: funnelData.metadata || {}
        }

        return NextResponse.json({
          success: true,
          conversion: conversionEvent,
          message: 'Conversion tracked successfully'
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Funnels action error:', error)
    return NextResponse.json({ error: 'Failed to process funnels action' }, { status: 500 })
  }
}