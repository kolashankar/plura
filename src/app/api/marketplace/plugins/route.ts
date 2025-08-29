import { NextRequest, NextResponse } from 'next/server'
import { getMarketplacePlugins } from '@/lib/queries-marketplace'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    const plugins = await getMarketplacePlugins(
      category || undefined,
      featured ? featured === 'true' : undefined
    )

    return NextResponse.json(plugins)
  } catch (error) {
    console.error('Failed to fetch marketplace plugins:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}