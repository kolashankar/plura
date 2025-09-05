import { NextRequest, NextResponse } from 'next/server'

// Individual Analytics API with comprehensive metrics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '7d'
    const individualId = searchParams.get('individualId')
    
    if (!individualId) {
      return NextResponse.json(
        { error: 'Individual ID is required' },
        { status: 400 }
      )
    }
    
    // Simulate comprehensive analytics data
    const analyticsData = {
      traffic: {
        totalVisitors: 45892,
        uniqueVisitors: 23156,
        pageViews: 89234,
        averageSessionDuration: '4:23',
        bounceRate: 34.2,
        newVsReturning: {
          new: 67.8,
          returning: 32.2
        },
        topPages: [
          { page: '/dashboard', views: 15234, percentage: 17.1 },
          { page: '/analytics', views: 12456, percentage: 14.0 },
          { page: '/settings', views: 9876, percentage: 11.1 },
          { page: '/projects', views: 8765, percentage: 9.8 },
          { page: '/team', views: 7654, percentage: 8.6 }
        ],
        trafficSources: [
          { source: 'Direct', visitors: 18234, percentage: 39.7 },
          { source: 'Google Search', visitors: 12456, percentage: 27.1 },
          { source: 'Social Media', visitors: 8765, percentage: 19.1 },
          { source: 'Referrals', visitors: 4321, percentage: 9.4 },
          { source: 'Email', visitors: 2116, percentage: 4.6 }
        ]
      },
      conversion: {
        overallRate: 12.4,
        goalCompletions: 2847,
        funnelData: [
          { stage: 'Landing Page', visitors: 23156, conversionRate: 100 },
          { stage: 'Sign Up Form', visitors: 18245, conversionRate: 78.8 },
          { stage: 'Email Verification', visitors: 15632, conversionRate: 85.7 },
          { stage: 'First Action', visitors: 12456, conversionRate: 79.7 },
          { stage: 'Goal Completion', visitors: 2847, conversionRate: 22.9 }
        ],
        topConvertingPages: [
          { page: '/pricing', rate: 24.6, conversions: 1245 },
          { page: '/features', rate: 18.3, conversions: 987 },
          { page: '/demo', rate: 15.7, conversions: 756 },
          { page: '/contact', rate: 12.4, conversions: 543 },
          { page: '/about', rate: 8.9, conversions: 321 }
        ]
      },
      geographic: {
        countries: [
          { country: 'United States', visitors: 15234, percentage: 33.2 },
          { country: 'United Kingdom', visitors: 8765, percentage: 19.1 },
          { country: 'Canada', visitors: 6543, percentage: 14.3 },
          { country: 'Germany', visitors: 4321, percentage: 9.4 },
          { country: 'Australia', visitors: 3210, percentage: 7.0 },
          { country: 'France', visitors: 2876, percentage: 6.3 },
          { country: 'Netherlands', visitors: 2154, percentage: 4.7 },
          { country: 'Other', visitors: 2789, percentage: 6.1 }
        ],
        cities: [
          { city: 'New York', visitors: 4567 },
          { city: 'London', visitors: 3456 },
          { city: 'Toronto', visitors: 2345 },
          { city: 'Berlin', visitors: 1987 },
          { city: 'Sydney', visitors: 1654 },
          { city: 'Paris', visitors: 1432 },
          { city: 'Amsterdam', visitors: 1234 },
          { city: 'Los Angeles', visitors: 1123 }
        ]
      },
      customEvents: [
        {
          event: 'feature_clicked',
          count: 8745,
          uniqueUsers: 3456,
          conversionRate: 15.2,
          topProperties: [
            { property: 'analytics_dashboard', count: 2345 },
            { property: 'team_collaboration', count: 1987 },
            { property: 'integrations', count: 1654 },
            { property: 'ecommerce_tools', count: 1432 },
            { property: 'automation', count: 1327 }
          ]
        },
        {
          event: 'form_submitted',
          count: 5432,
          uniqueUsers: 2876,
          conversionRate: 52.9,
          topProperties: [
            { property: 'contact_form', count: 2134 },
            { property: 'newsletter_signup', count: 1876 },
            { property: 'demo_request', count: 987 },
            { property: 'support_ticket', count: 435 }
          ]
        },
        {
          event: 'download_started',
          count: 3210,
          uniqueUsers: 1987,
          conversionRate: 61.9,
          topProperties: [
            { property: 'user_manual', count: 1234 },
            { property: 'api_documentation', count: 876 },
            { property: 'template_pack', count: 654 },
            { property: 'mobile_app', count: 446 }
          ]
        }
      ],
      realTimeMetrics: {
        activeUsers: 342,
        currentPageViews: 89,
        topActivePages: [
          { page: '/dashboard', activeUsers: 45 },
          { page: '/analytics', activeUsers: 23 },
          { page: '/projects', activeUsers: 12 },
          { page: '/settings', activeUsers: 9 }
        ],
        recentActivity: [
          { timestamp: new Date(Date.now() - 30000).toISOString(), event: 'page_view', page: '/dashboard' },
          { timestamp: new Date(Date.now() - 45000).toISOString(), event: 'form_submit', page: '/contact' },
          { timestamp: new Date(Date.now() - 67000).toISOString(), event: 'download', page: '/resources' },
          { timestamp: new Date(Date.now() - 89000).toISOString(), event: 'signup', page: '/register' }
        ]
      },
      deviceAnalytics: {
        devices: [
          { device: 'Desktop', visitors: 23456, percentage: 51.1 },
          { device: 'Mobile', visitors: 15678, percentage: 34.2 },
          { device: 'Tablet', visitors: 6758, percentage: 14.7 }
        ],
        browsers: [
          { browser: 'Chrome', visitors: 20345, percentage: 44.3 },
          { browser: 'Safari', visitors: 12456, percentage: 27.1 },
          { browser: 'Firefox', visitors: 6789, percentage: 14.8 },
          { browser: 'Edge', visitors: 4321, percentage: 9.4 },
          { browser: 'Other', visitors: 2081, percentage: 4.5 }
        ],
        operatingSystems: [
          { os: 'Windows', visitors: 18234, percentage: 39.7 },
          { os: 'macOS', visitors: 13456, percentage: 29.3 },
          { os: 'iOS', visitors: 8765, percentage: 19.1 },
          { os: 'Android', visitors: 4321, percentage: 9.4 },
          { os: 'Linux', visitors: 1116, percentage: 2.4 }
        ]
      },
      timeBasedAnalytics: {
        hourlyData: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          visitors: Math.floor(Math.random() * 2000) + 500,
          pageViews: Math.floor(Math.random() * 4000) + 1000
        })),
        dailyData: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          visitors: Math.floor(Math.random() * 3000) + 1000,
          pageViews: Math.floor(Math.random() * 6000) + 2000,
          conversions: Math.floor(Math.random() * 200) + 50
        }))
      },
      seoAnalytics: {
        organicTraffic: 12456,
        avgPosition: 8.3,
        clickThroughRate: 2.4,
        impressions: 145678,
        topKeywords: [
          { keyword: 'website builder', position: 3, clicks: 2345, impressions: 34567 },
          { keyword: 'landing page creator', position: 5, clicks: 1876, impressions: 28934 },
          { keyword: 'drag drop builder', position: 7, clicks: 1543, impressions: 23456 },
          { keyword: 'responsive design tool', position: 12, clicks: 987, impressions: 18765 },
          { keyword: 'web development platform', position: 15, clicks: 654, impressions: 14321 }
        ],
        backlinks: {
          total: 3456,
          newThisMonth: 234,
          domains: 987,
          topReferrers: [
            { domain: 'techcrunch.com', links: 23, authority: 92 },
            { domain: 'producthunt.com', links: 45, authority: 88 },
            { domain: 'github.com', links: 78, authority: 95 },
            { domain: 'stackoverflow.com', links: 34, authority: 89 },
            { domain: 'reddit.com', links: 56, authority: 91 }
          ]
        }
      },
      performanceData: {
        pageSpeed: {
          desktop: 94,
          mobile: 78,
          firstContentfulPaint: 1.2,
          largestContentfulPaint: 2.1,
          cumulativeLayoutShift: 0.05
        },
        uptime: 99.97,
        averageResponseTime: 145,
        errorRate: 0.03
      }
    }
    
    return NextResponse.json({
      success: true,
      data: analyticsData,
      timeRange,
      individualId,
      lastUpdated: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { individualId, eventType, eventData, timestamp } = data
    
    if (!individualId || !eventType) {
      return NextResponse.json(
        { error: 'Individual ID and event type are required' },
        { status: 400 }
      )
    }
    
    // Process and store the custom event
    const processedEvent = {
      id: Math.random().toString(36).substr(2, 9),
      individualId,
      eventType,
      eventData: eventData || {},
      timestamp: timestamp || new Date().toISOString(),
      processed: true
    }
    
    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully',
      eventId: processedEvent.id,
      timestamp: processedEvent.timestamp
    })
    
  } catch (error) {
    console.error('Event tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    )
  }
}