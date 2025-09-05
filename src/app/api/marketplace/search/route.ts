
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    const priceRange = searchParams.get('price')
    const sortBy = searchParams.get('sort') || 'downloads'

    let whereClause: any = { isApproved: true }

    if (query) {
      whereClause.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { contains: query, mode: 'insensitive' } }
      ]
    }

    if (category) {
      whereClause.category = category
    }

    if (type) {
      whereClause.type = type
    }

    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number)
      whereClause.price = {
        gte: min,
        lte: max || undefined
      }
    }

    let orderBy = {}
    switch (sortBy) {
      case 'price_low':
        orderBy = { price: 'asc' }
        break
      case 'price_high':
        orderBy = { price: 'desc' }
        break
      case 'rating':
        orderBy = { rating: 'desc' }
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      default:
        orderBy = { downloads: 'desc' }
    }

    const items = await db.marketplaceItem.findMany({
      where: whereClause,
      orderBy,
      take: 50
    })

    const categories = await db.marketplaceItem.groupBy({
      by: ['category'],
      _count: true,
      where: { isApproved: true }
    })

    return NextResponse.json({
      items,
      categories: categories.map(c => ({
        name: c.category,
        count: c._count
      })),
      total: items.length
    })
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
