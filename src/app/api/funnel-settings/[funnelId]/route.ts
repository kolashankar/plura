import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'

export async function GET(
  req: NextRequest,
  { params }: { params: { funnelId: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For now, we'll use a simple JSON storage approach
    // In production, you'd want to use the database schema created
    const settings = {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      ogImage: '',
      customFavicon: '',
      googleAnalyticsId: '',
      facebookPixelId: '',
      customAnalyticsCode: '',
      enableCaching: true,
      enableCompression: true,
      enableLazyLoading: true,
      enableSSL: true,
      enableCsrfProtection: true,
      allowedOrigins: '',
      customCss: '',
      customJs: '',
      customHeadCode: '',
      customBodyCode: '',
      customDomain: '',
      subDomain: '',
      enableWwwRedirect: false,
      autoBackupEnabled: true,
      backupFrequency: 'daily',
      exportFormat: 'react',
      emailNotifications: true,
      slackWebhookUrl: '',
      discordWebhookUrl: ''
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching funnel settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { funnelId: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settingsData = await req.json()
    
    // Validate the funnel exists and user has access
    const funnel = await db.funnel.findFirst({
      where: {
        id: params.funnelId,
        OR: [
          { subAccountId: settingsData.subaccountId },
          { SubAccount: { Agency: { users: { some: { id: user.id } } } } }
        ]
      }
    })

    if (!funnel) {
      return NextResponse.json({ error: 'Funnel not found' }, { status: 404 })
    }

    // Store settings in funnel description as JSON for now
    // In production, use the funnelSettings table from schema
    await db.funnel.update({
      where: { id: params.funnelId },
      data: {
        description: JSON.stringify(settingsData)
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving funnel settings:', error)
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    )
  }
}