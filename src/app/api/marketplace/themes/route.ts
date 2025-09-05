import { NextRequest, NextResponse } from 'next/server'
import { getMarketplaceThemes } from '@/lib/queries-marketplace'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    const themes = await getMarketplaceThemes(
      category || undefined,
      featured ? featured === 'true' : undefined
    )

    return NextResponse.json(themes)
  } catch (error) {
    console.error('Failed to fetch marketplace themes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}