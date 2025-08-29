
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'
import { headers } from 'next/headers'

export async function POST(
  request: NextRequest,
  { params }: { params: { themeId: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { sessionId } = await request.json()

    // Verify the purchase through Stripe session
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not confirmed' },
        { status: 400 }
      )
    }

    // Get theme details
    const theme = await db.marketplaceItem.findUnique({
      where: {
        id: params.themeId,
        type: 'theme'
      }
    })

    if (!theme) {
      return NextResponse.json(
        { error: 'Theme not found' },
        { status: 404 }
      )
    }

    // Update download count
    await db.marketplaceItem.update({
      where: { id: params.themeId },
      data: {
        downloads: {
          increment: 1
        }
      }
    })

    // In a real implementation, you would:
    // 1. Fetch the theme files from cloud storage (UploadThing)
    // 2. Create a ZIP file with all theme assets
    // 3. Return the file as a download

    // For now, return a mock response
    return new NextResponse("Theme download would be provided here", {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${theme.name}.zip"`
      }
    })

  } catch (error) {
    console.error('Error downloading theme:', error)
    return NextResponse.json(
      { error: 'Failed to download theme' },
      { status: 500 }
    )
  }
}
