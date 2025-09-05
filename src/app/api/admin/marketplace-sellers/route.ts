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
    const verification = searchParams.get('verification')

    // Mock sellers data - replace with actual seller data from database
    const mockSellers = [
      {
        id: '1',
        name: 'Design Pro Studio',
        email: 'contact@designpro.com',
        company: 'Design Pro Studio LLC',
        status: 'active',
        verificationStatus: 'verified',
        totalRevenue: 45680,
        monthlyRevenue: 8920,
        totalItems: 23,
        totalDownloads: 15600,
        averageRating: 4.8,
        joinedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        payoutInfo: {
          method: 'Bank Transfer',
          details: 'Chase Bank ***1234'
        },
        items: [
          {
            id: 'item1',
            name: 'Modern Business Theme',
            type: 'theme',
            price: 4900,
            downloads: 892,
            revenue: 43708
          },
          {
            id: 'item2',
            name: 'Portfolio Pro Theme',
            type: 'theme',
            price: 3900,
            downloads: 456,
            revenue: 17784
          }
        ],
        revenueHistory: [
          { month: '2024-01', revenue: 12400 },
          { month: '2024-02', revenue: 15600 },
          { month: '2024-03', revenue: 18200 }
        ]
      },
      {
        id: '2',
        name: 'Tech Solutions Inc',
        email: 'sales@techsolutions.com',
        company: 'Tech Solutions Inc',
        status: 'active',
        verificationStatus: 'verified',
        totalRevenue: 32150,
        monthlyRevenue: 6430,
        totalItems: 12,
        totalDownloads: 8940,
        averageRating: 4.6,
        joinedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        payoutInfo: {
          method: 'PayPal',
          details: 'paypal@techsolutions.com'
        },
        items: [
          {
            id: 'item3',
            name: 'E-commerce Plugin Suite',
            type: 'plugin',
            price: 7900,
            downloads: 234,
            revenue: 18486
          },
          {
            id: 'item4',
            name: 'Analytics Dashboard Plugin',
            type: 'plugin',
            price: 5900,
            downloads: 145,
            revenue: 8555
          }
        ],
        revenueHistory: [
          { month: '2024-01', revenue: 8200 },
          { month: '2024-02', revenue: 9400 },
          { month: '2024-03', revenue: 7800 }
        ]
      },
      {
        id: '3',
        name: 'Creative Minds',
        email: 'hello@creativeminds.design',
        company: undefined,
        status: 'pending',
        verificationStatus: 'pending',
        totalRevenue: 5240,
        monthlyRevenue: 1820,
        totalItems: 3,
        totalDownloads: 890,
        averageRating: 4.2,
        joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastActive: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        payoutInfo: {
          method: 'Stripe',
          details: 'Connected Stripe Account'
        },
        items: [
          {
            id: 'item5',
            name: 'Minimalist Blog Theme',
            type: 'theme',
            price: 2900,
            downloads: 67,
            revenue: 1943
          }
        ],
        revenueHistory: [
          { month: '2024-02', revenue: 1200 },
          { month: '2024-03', revenue: 1820 }
        ]
      },
      {
        id: '4',
        name: 'WebDev Masters',
        email: 'info@webdevmasters.com',
        company: 'WebDev Masters LLC',
        status: 'suspended',
        verificationStatus: 'verified',
        totalRevenue: 18750,
        monthlyRevenue: 0,
        totalItems: 8,
        totalDownloads: 4560,
        averageRating: 3.9,
        joinedAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
        lastActive: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        payoutInfo: {
          method: 'Bank Transfer',
          details: 'Wells Fargo ***5678'
        },
        items: [
          {
            id: 'item6',
            name: 'Advanced Form Builder',
            type: 'plugin',
            price: 4900,
            downloads: 156,
            revenue: 7644
          }
        ],
        revenueHistory: [
          { month: '2023-12', revenue: 3200 },
          { month: '2024-01', revenue: 2800 },
          { month: '2024-02', revenue: 0 }
        ]
      },
      {
        id: '5',
        name: 'UX Design Hub',
        email: 'team@uxdesignhub.com',
        company: 'UX Design Hub',
        status: 'active',
        verificationStatus: 'rejected',
        totalRevenue: 2890,
        monthlyRevenue: 950,
        totalItems: 2,
        totalDownloads: 340,
        averageRating: 4.5,
        joinedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        payoutInfo: {
          method: 'Pending',
          details: 'Verification Required'
        },
        items: [
          {
            id: 'item7',
            name: 'Dashboard UI Kit',
            type: 'theme',
            price: 3900,
            downloads: 34,
            revenue: 1326
          }
        ],
        revenueHistory: [
          { month: '2024-02', revenue: 780 },
          { month: '2024-03', revenue: 950 }
        ]
      }
    ]

    let filteredSellers = mockSellers

    if (search) {
      filteredSellers = filteredSellers.filter(seller =>
        seller.name.toLowerCase().includes(search.toLowerCase()) ||
        seller.email.toLowerCase().includes(search.toLowerCase()) ||
        (seller.company && seller.company.toLowerCase().includes(search.toLowerCase()))
      )
    }

    if (status && status !== 'all') {
      filteredSellers = filteredSellers.filter(seller => seller.status === status)
    }

    if (verification && verification !== 'all') {
      filteredSellers = filteredSellers.filter(seller => seller.verificationStatus === verification)
    }

    // Log audit trail
    await db.auditLog.create({
      data: {
        action: 'VIEW_MARKETPLACE_SELLERS',
        entity: 'MarketplaceSeller',
        adminUserId: adminUser.id,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({ sellers: filteredSellers })
  } catch (error) {
    console.error('Error fetching marketplace sellers:', error)
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

    const { sellerId, status, verificationStatus } = await request.json()

    // Mock seller update - replace with actual seller database operations
    const updateData: any = {}
    if (status) updateData.status = status
    if (verificationStatus) updateData.verificationStatus = verificationStatus

    // Log audit trail
    const action = status ? 'UPDATE_SELLER_STATUS' : 'UPDATE_SELLER_VERIFICATION'
    await db.auditLog.create({
      data: {
        action,
        entity: 'MarketplaceSeller',
        entityId: sellerId,
        adminUserId: adminUser.id,
        newValues: JSON.stringify(updateData),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating seller:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}