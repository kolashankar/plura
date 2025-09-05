import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { seedMarketplaceData } from '@/lib/queries-marketplace'

export async function POST() {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await seedMarketplaceData()

    if (result.success) {
      return NextResponse.json({ message: 'Marketplace data seeded successfully' })
    } else {
      return NextResponse.json(
        { error: 'Failed to seed marketplace data' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Failed to seed marketplace data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}