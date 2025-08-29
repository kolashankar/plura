import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { getPurchasedPluginsByUser } from '@/lib/queries-marketplace'

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const agencyId = searchParams.get('agencyId')
    const subAccountId = searchParams.get('subAccountId')

    const purchasedPlugins = await getPurchasedPluginsByUser(
      user.id,
      agencyId || undefined,
      subAccountId || undefined
    )

    return NextResponse.json(purchasedPlugins)
  } catch (error) {
    console.error('Failed to fetch purchased plugins:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}