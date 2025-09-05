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
    const type = searchParams.get('type')
    const category = searchParams.get('category')

    // Get marketplace themes and plugins
    const whereClause: any = {}
    
    if (status && status !== 'all') {
      whereClause.status = status
    }
    
    if (type && type !== 'all') {
      whereClause.type = type
    }

    if (category && category !== 'all') {
      whereClause.category = category
    }

    const themes = await db.marketplaceTheme.findMany({
      where: {
        ...whereClause,
        ...(type === 'all' || type === 'theme' ? {} : { id: 'never-match' }),
        ...(search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        } : {})
      },
      include: {
        User: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const plugins = await db.marketplacePlugin.findMany({
      where: {
        ...whereClause,
        ...(type === 'all' || type === 'plugin' ? {} : { id: 'never-match' }),
        ...(search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        } : {})
      },
      include: {
        User: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Combine and format items
    const items = [
      ...themes.map(theme => ({
        id: theme.id,
        name: theme.name,
        description: theme.description,
        type: 'theme' as const,
        version: theme.version,
        price: theme.price,
        status: theme.status,
        downloads: theme.downloads,
        rating: theme.rating,
        reviews: theme.reviews,
        createdBy: theme.User,
        createdAt: theme.createdAt,
        updatedAt: theme.updatedAt,
        previewImages: theme.previewImages ? JSON.parse(theme.previewImages) : [],
        tags: theme.tags ? JSON.parse(theme.tags) : [],
        category: theme.category,
        features: theme.features ? JSON.parse(theme.features) : [],
        compatibility: theme.compatibility ? JSON.parse(theme.compatibility) : []
      })),
      ...plugins.map(plugin => ({
        id: plugin.id,
        name: plugin.name,
        description: plugin.description,
        type: 'plugin' as const,
        version: plugin.version,
        price: plugin.price,
        status: plugin.status,
        downloads: plugin.downloads,
        rating: plugin.rating,
        reviews: plugin.reviews,
        createdBy: plugin.User,
        createdAt: plugin.createdAt,
        updatedAt: plugin.updatedAt,
        previewImages: plugin.previewImages ? JSON.parse(plugin.previewImages) : [],
        tags: plugin.tags ? JSON.parse(plugin.tags) : [],
        category: plugin.category,
        features: plugin.features ? JSON.parse(plugin.features) : [],
        compatibility: plugin.compatibility ? JSON.parse(plugin.compatibility) : []
      }))
    ]

    // Sort by creation date
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Log audit trail
    await db.auditLog.create({
      data: {
        action: 'VIEW_MARKETPLACE_ITEMS',
        entity: 'MarketplaceItem',
        adminUserId: adminUser.id,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Error fetching marketplace items:', error)
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

    const { itemId, status, feedback } = await request.json()

    // Determine if it's a theme or plugin by checking both tables
    let updatedItem = null
    let itemType = ''

    // Try to find in themes first
    const theme = await db.marketplaceTheme.findUnique({
      where: { id: itemId }
    })

    if (theme) {
      updatedItem = await db.marketplaceTheme.update({
        where: { id: itemId },
        data: { 
          status,
          ...(feedback && { reviewFeedback: feedback })
        }
      })
      itemType = 'theme'
    } else {
      // Try plugins
      updatedItem = await db.marketplacePlugin.update({
        where: { id: itemId },
        data: { 
          status,
          ...(feedback && { reviewFeedback: feedback })
        }
      })
      itemType = 'plugin'
    }

    if (!updatedItem) {
      return new NextResponse('Item not found', { status: 404 })
    }

    // Log audit trail
    await db.auditLog.create({
      data: {
        action: `REVIEW_${itemType.toUpperCase()}`,
        entity: itemType === 'theme' ? 'MarketplaceTheme' : 'MarketplacePlugin',
        entityId: itemId,
        adminUserId: adminUser.id,
        oldValues: JSON.stringify({ status: itemType === 'theme' ? theme?.status : null }),
        newValues: JSON.stringify({ status, feedback }),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({ success: true, item: updatedItem })
  } catch (error) {
    console.error('Error reviewing marketplace item:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
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

    const { itemId } = await request.json()

    // Determine if it's a theme or plugin and delete accordingly
    let deletedItem = null
    let itemType = ''

    // Try to find and delete from themes first
    try {
      deletedItem = await db.marketplaceTheme.delete({
        where: { id: itemId }
      })
      itemType = 'theme'
    } catch (error) {
      // Try plugins
      try {
        deletedItem = await db.marketplacePlugin.delete({
          where: { id: itemId }
        })
        itemType = 'plugin'
      } catch (pluginError) {
        return new NextResponse('Item not found', { status: 404 })
      }
    }

    // Log audit trail
    await db.auditLog.create({
      data: {
        action: `DELETE_${itemType.toUpperCase()}`,
        entity: itemType === 'theme' ? 'MarketplaceTheme' : 'MarketplacePlugin',
        entityId: itemId,
        adminUserId: adminUser.id,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting marketplace item:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}