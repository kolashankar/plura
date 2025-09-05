import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { setupMarketplaceSidebar, setupMarketplaceSidebarForSubaccount } from '@/lib/marketplace-setup'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { agencyId, subAccountId } = await req.json()

    if (agencyId) {
      const result = await setupMarketplaceSidebar(agencyId)
      if (result.success) {
        return NextResponse.json({ message: 'Agency marketplace sidebar setup completed' })
      } else {
        return NextResponse.json({ error: 'Failed to setup agency marketplace sidebar' }, { status: 500 })
      }
    }

    if (subAccountId) {
      const result = await setupMarketplaceSidebarForSubaccount(subAccountId)
      if (result.success) {
        return NextResponse.json({ message: 'Subaccount marketplace sidebar setup completed' })
      } else {
        return NextResponse.json({ error: 'Failed to setup subaccount marketplace sidebar' }, { status: 500 })
      }
    }

    return NextResponse.json({ error: 'Agency ID or SubAccount ID is required' }, { status: 400 })
  } catch (error) {
    console.error('Failed to setup marketplace sidebar:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}