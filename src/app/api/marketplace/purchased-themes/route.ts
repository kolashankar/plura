import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { getPurchasedThemesByUser } from '@/lib/queries-marketplace'

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const agencyId = searchParams.get('agencyId')
    const subAccountId = searchParams.get('subAccountId')

    const purchasedThemes = await getPurchasedThemesByUser(
      user.id,
      agencyId || undefined,
      subAccountId || undefined
    )

    return NextResponse.json(purchasedThemes)
  } catch (error) {
    console.error('Failed to fetch purchased themes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}