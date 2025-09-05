import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { purchaseTheme } from '@/lib/queries-marketplace'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { themeId, price, agencyId, subAccountId, individualId } = await req.json()

    if (!themeId || !price) {
      return NextResponse.json(
        { error: 'Theme ID and price are required' },
        { status: 400 }
      )
    }

    const purchase = await purchaseTheme(
      user.id,
      themeId,
      price,
      agencyId,
      subAccountId,
      individualId
    )

    return NextResponse.json(purchase)
  } catch (error) {
    console.error('Failed to purchase theme:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Purchase failed' },
      { status: 500 }
    )
  }
}