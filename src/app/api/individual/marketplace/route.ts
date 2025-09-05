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
    const category = searchParams.get('category')
    const type = searchParams.get('type')

    if (!individualId) {
      return NextResponse.json({ error: 'Individual ID required' }, { status: 400 })
    }

    // Feature 1: Enhanced marketplace with themes, plugins, and digital products
    const marketplaceItems = [
      {
        id: 'item_1',
        name: 'Modern E-commerce Theme',
        description: 'Sleek and responsive e-commerce theme with cart functionality',
        category: 'themes',
        type: 'web',
        price: 79.99,
        currency: 'USD',
        rating: 4.8,
        reviewCount: 124,
        downloads: 2500,
        seller: {
          id: 'seller_1',
          name: 'Design Studio Pro',
          avatar: '/assets/seller-1.jpg',
          rating: 4.9
        },
        images: ['/assets/theme-1-preview.jpg', '/assets/theme-1-detail.jpg'],
        features: ['Responsive Design', 'Shopping Cart', 'Payment Integration', 'SEO Optimized'],
        tags: ['ecommerce', 'responsive', 'modern'],
        createdAt: new Date('2024-01-15'),
        lastUpdated: new Date('2024-01-20'),
        isPopular: true,
        isFeatured: true
      },
      {
        id: 'item_2',
        name: 'Advanced Analytics Plugin',
        description: 'Comprehensive analytics and reporting plugin with custom dashboards',
        category: 'plugins',
        type: 'analytics',
        price: 49.99,
        currency: 'USD',
        rating: 4.6,
        reviewCount: 89,
        downloads: 1800,
        seller: {
          id: 'seller_2',
          name: 'Analytics Pro',
          avatar: '/assets/seller-2.jpg',
          rating: 4.7
        },
        images: ['/assets/plugin-1-preview.jpg'],
        features: ['Custom Dashboards', 'Real-time Data', 'Export Reports', 'API Integration'],
        tags: ['analytics', 'dashboard', 'reporting'],
        createdAt: new Date('2024-01-10'),
        lastUpdated: new Date('2024-01-25'),
        isPopular: false,
        isFeatured: false
      },
      {
        id: 'item_3',
        name: 'SEO Optimization Toolkit',
        description: 'Complete SEO toolkit with keyword research and optimization tools',
        category: 'tools',
        type: 'seo',
        price: 29.99,
        currency: 'USD',
        rating: 4.9,
        reviewCount: 156,
        downloads: 3200,
        seller: {
          id: 'seller_3',
          name: 'SEO Masters',
          avatar: '/assets/seller-3.jpg',
          rating: 4.8
        },
        images: ['/assets/tool-1-preview.jpg'],
        features: ['Keyword Research', 'Site Audit', 'Competitor Analysis', 'Rank Tracking'],
        tags: ['seo', 'optimization', 'keywords'],
        createdAt: new Date('2024-01-05'),
        lastUpdated: new Date('2024-01-22'),
        isPopular: true,
        isFeatured: true
      }
    ]

    // Feature 2: Revenue sharing and seller dashboard
    const sellerMetrics = {
      totalEarnings: 2450.75,
      monthlyEarnings: 450.25,
      totalSales: 89,
      monthlySales: 12,
      avgRating: 4.7,
      totalReviews: 67,
      conversionRate: 0.085,
      topSellingItem: 'Modern E-commerce Theme',
      earnings: [
        { month: 'Jan', amount: 450.25 },
        { month: 'Dec', amount: 380.50 },
        { month: 'Nov', amount: 520.75 }
      ],
      payoutHistory: [
        {
          id: 'payout_1',
          amount: 380.50,
          status: 'completed',
          date: new Date('2024-01-01'),
          method: 'PayPal'
        },
        {
          id: 'payout_2',
          amount: 520.75,
          status: 'pending',
          date: new Date('2024-01-15'),
          method: 'Bank Transfer'
        }
      ]
    }

    // Feature 3: Digital downloads and licensing
    const purchases = [
      {
        id: 'purchase_1',
        itemId: 'item_1',
        itemName: 'Modern E-commerce Theme',
        price: 79.99,
        purchaseDate: new Date('2024-01-20'),
        licenseType: 'extended',
        downloadUrl: '/downloads/theme-1-extended.zip',
        downloadCount: 3,
        maxDownloads: 10,
        expiresAt: new Date('2025-01-20'),
        status: 'active'
      },
      {
        id: 'purchase_2',
        itemId: 'item_3',
        itemName: 'SEO Optimization Toolkit',
        price: 29.99,
        purchaseDate: new Date('2024-01-15'),
        licenseType: 'standard',
        downloadUrl: '/downloads/seo-toolkit-standard.zip',
        downloadCount: 1,
        maxDownloads: 5,
        expiresAt: new Date('2025-01-15'),
        status: 'active'
      }
    ]

    // Feature 4: Advanced search and filtering
    const categories = [
      { id: 'themes', name: 'Themes', count: 245, icon: 'palette' },
      { id: 'plugins', name: 'Plugins', count: 189, icon: 'puzzle' },
      { id: 'tools', name: 'Tools', count: 156, icon: 'tool' },
      { id: 'templates', name: 'Templates', count: 298, icon: 'layout' },
      { id: 'graphics', name: 'Graphics', count: 423, icon: 'image' }
    ]

    const filters = {
      priceRanges: [
        { id: 'free', label: 'Free', min: 0, max: 0, count: 89 },
        { id: 'under-25', label: 'Under $25', min: 0.01, max: 25, count: 156 },
        { id: '25-50', label: '$25 - $50', min: 25, max: 50, count: 234 },
        { id: '50-100', label: '$50 - $100', min: 50, max: 100, count: 189 },
        { id: 'over-100', label: 'Over $100', min: 100, max: 9999, count: 67 }
      ],
      ratings: [
        { stars: 5, count: 234 },
        { stars: 4, count: 189 },
        { stars: 3, count: 98 },
        { stars: 2, count: 34 },
        { stars: 1, count: 12 }
      ],
      sortOptions: [
        { id: 'popular', label: 'Most Popular' },
        { id: 'newest', label: 'Newest First' },
        { id: 'price-low', label: 'Price: Low to High' },
        { id: 'price-high', label: 'Price: High to Low' },
        { id: 'rating', label: 'Highest Rated' }
      ]
    }

    return NextResponse.json({
      marketplaceItems: category ? marketplaceItems.filter(item => item.category === category) :
                       type ? marketplaceItems.filter(item => item.type === type) : marketplaceItems,
      sellerMetrics,
      purchases,
      categories,
      filters
    })

  } catch (error) {
    console.error('Marketplace API error:', error)
    return NextResponse.json({ error: 'Failed to fetch marketplace data' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { individualId, action, itemData, purchaseData, sellerData } = await req.json()

    if (!individualId || !action) {
      return NextResponse.json({ error: 'Individual ID and action required' }, { status: 400 })
    }

    switch (action) {
      case 'purchase_item':
        // Feature 5: Item purchasing
        const newPurchase = {
          id: `purchase_${Date.now()}`,
          itemId: purchaseData.itemId,
          itemName: purchaseData.itemName,
          price: purchaseData.price,
          licenseType: purchaseData.licenseType || 'standard',
          purchaseDate: new Date(),
          purchasedBy: user.id,
          downloadUrl: `/downloads/${purchaseData.itemId}-${purchaseData.licenseType}.zip`,
          downloadCount: 0,
          maxDownloads: purchaseData.licenseType === 'extended' ? 10 : 5,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
          status: 'active'
        }

        return NextResponse.json({
          success: true,
          purchase: newPurchase,
          message: 'Item purchased successfully'
        })

      case 'submit_item':
        // Feature 6: Item submission for sellers
        const newItem = {
          id: `item_${Date.now()}`,
          name: itemData.name,
          description: itemData.description,
          category: itemData.category,
          type: itemData.type,
          price: itemData.price,
          currency: 'USD',
          features: itemData.features || [],
          tags: itemData.tags || [],
          images: itemData.images || [],
          status: 'pending_review',
          submittedBy: user.id,
          submittedAt: new Date(),
          seller: {
            id: user.id,
            name: user.firstName + ' ' + user.lastName,
            avatar: user.imageUrl,
            rating: 0
          }
        }

        return NextResponse.json({
          success: true,
          item: newItem,
          message: 'Item submitted for review successfully'
        })

      case 'download_item':
        // Feature 7: Digital download
        const { purchaseId } = purchaseData
        
        const downloadRecord = {
          purchaseId,
          downloadedAt: new Date(),
          downloadedBy: user.id,
          ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown'
        }

        return NextResponse.json({
          success: true,
          download: downloadRecord,
          downloadUrl: `/api/downloads/${purchaseId}/file`,
          message: 'Download initiated successfully'
        })

      case 'request_payout':
        // Feature 8: Seller payout requests
        const payoutRequest = {
          id: `payout_${Date.now()}`,
          sellerId: user.id,
          amount: sellerData.amount,
          method: sellerData.method,
          status: 'pending',
          requestedAt: new Date(),
          processingFee: sellerData.amount * 0.03, // 3% fee
          netAmount: sellerData.amount * 0.97
        }

        return NextResponse.json({
          success: true,
          payoutRequest,
          message: 'Payout request submitted successfully'
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Marketplace action error:', error)
    return NextResponse.json({ error: 'Failed to process marketplace action' }, { status: 500 })
  }
}