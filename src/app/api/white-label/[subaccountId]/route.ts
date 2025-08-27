
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'

export async function GET(
  req: NextRequest,
  { params }: { params: { subaccountId: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const whiteLabelSettings = await db.subAccount.findUnique({
      where: { id: params.subaccountId },
      select: {
        name: true,
        subAccountLogo: true,
        companyEmail: true,
        address: true,
        city: true,
        state: true,
        country: true
      }
    })

    return NextResponse.json({
      branding: whiteLabelSettings,
      customDomain: `${params.subaccountId}.yourplatform.com`,
      features: {
        customLogo: true,
        customColors: true,
        customDomain: true,
        hideWatermark: true
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch white-label settings' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { subaccountId: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      logo,
      primaryColor,
      secondaryColor,
      customDomain,
      companyName,
      hideWatermark
    } = await req.json()

    const updated = await db.subAccount.update({
      where: { id: params.subaccountId },
      data: {
        subAccountLogo: logo || '',
        name: companyName || ''
      }
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update white-label settings' }, { status: 500 })
  }
}
