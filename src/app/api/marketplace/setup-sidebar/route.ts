import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { setupMarketplaceSidebar } from '@/lib/marketplace-setup'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { agencyId } = await req.json()

    if (!agencyId) {
      return NextResponse.json(
        { error: 'Agency ID is required' },
        { status: 400 }
      )
    }

    const result = await setupMarketplaceSidebar(agencyId)

    if (result.success) {
      return NextResponse.json({ message: 'Marketplace sidebar setup completed' })
    } else {
      return NextResponse.json(
        { error: 'Failed to setup marketplace sidebar' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Failed to setup marketplace sidebar:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}