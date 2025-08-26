
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { integrationId, credentials } = await req.json()

    // Validate credentials based on integration type
    let isValid = false
    
    switch (integrationId) {
      case 'stripe':
        // Validate Stripe credentials
        try {
          const Stripe = require('stripe')
          const stripe = new Stripe(credentials.secretKey)
          await stripe.accounts.retrieve()
          isValid = true
        } catch (error) {
          return NextResponse.json(
            { error: 'Invalid Stripe credentials' },
            { status: 400 }
          )
        }
        break
        
      case 'mailchimp':
        // Validate Mailchimp credentials
        try {
          const response = await fetch(`https://anystring.api.mailchimp.com/3.0/ping`, {
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`
            }
          })
          isValid = response.ok
        } catch (error) {
          return NextResponse.json(
            { error: 'Invalid Mailchimp credentials' },
            { status: 400 }
          )
        }
        break
        
      case 'google-analytics':
        // Validate Google Analytics tracking ID format
        isValid = /^UA-\d+-\d+$|^G-[A-Z0-9]+$/.test(credentials.trackingId)
        break
        
      case 'shopify':
        // Validate Shopify store URL and access token
        try {
          const response = await fetch(`${credentials.storeUrl}/admin/api/2023-10/shop.json`, {
            headers: {
              'X-Shopify-Access-Token': credentials.accessToken
            }
          })
          isValid = response.ok
        } catch (error) {
          return NextResponse.json(
            { error: 'Invalid Shopify credentials' },
            { status: 400 }
          )
        }
        break
        
      default:
        isValid = true // For demo purposes
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 400 }
      )
    }

    // Store encrypted credentials in database
    // For demo purposes, we'll just return success
    
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Integration connection error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      subaccountId,
      name,
      provider,
      apiKey,
      apiSecret,
      webhookUrl,
      config,
    } = body

    if (!subaccountId || !name || !provider) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Test integration connection (simplified)
    let isActive = false
    try {
      // In a real implementation, you would test the actual API connection here
      if (apiKey) {
        isActive = true
      }
    } catch (error) {
      console.error('Integration test failed:', error)
    }

    const integration = await db.integration.create({
      data: {
        name,
        provider,
        apiKey,
        apiSecret,
        webhookUrl,
        config: config ? JSON.stringify(config) : null,
        isActive,
        subaccountId,
      },
    })

    return NextResponse.json(integration, { status: 201 })
  } catch (error) {
    console.error('Error creating integration:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const subaccountId = searchParams.get('subaccountId')

    if (!subaccountId) {
      return NextResponse.json(
        { error: 'Subaccount ID required' },
        { status: 400 }
      )
    }

    const integrations = await db.integration.findMany({
      where: { subaccountId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(integrations)
  } catch (error) {
    console.error('Error fetching integrations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, isActive, config } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Integration ID required' },
        { status: 400 }
      )
    }

    const integration = await db.integration.update({
      where: { id },
      data: {
        ...(isActive !== undefined && { isActive }),
        ...(config && { config: JSON.stringify(config) }),
      },
    })

    return NextResponse.json(integration)
  } catch (error) {
    console.error('Error updating integration:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
