import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { currentUser } from '@clerk/nextjs'

export async function POST(req: NextRequest) {
  const requestData = await req.json()
  const user = await currentUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Handle subscription upgrades
  if (requestData.planId || requestData.priceId) {
    try {
      const session = await stripe.checkout.sessions.create({
        customer_email: user.emailAddresses[0]?.emailAddress,
        line_items: [
          {
            price: requestData.priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_URL}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/premium?canceled=true`,
        metadata: {
          type: 'subscription_upgrade',
          planId: requestData.planId || 'premium',
          userId: user.id
        },
        allow_promotion_codes: true,
        billing_address_collection: 'required',
      })

      return NextResponse.json({ url: session.url })
    } catch (error) {
      console.error('Stripe subscription session creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create subscription checkout session' },
        { status: 500 }
      )
    }
  }

  // Handle theme purchases
  if (requestData.themeId) {
    try {
      const session = await stripe.checkout.sessions.create({
        customer_email: user.emailAddresses[0]?.emailAddress,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: requestData.themeName,
                description: 'Premium theme download',
                metadata: {
                  type: 'theme',
                  themeId: requestData.themeId
                }
              },
              unit_amount: requestData.amount, // Amount in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: requestData.successUrl || `${process.env.NEXT_PUBLIC_URL}/marketplace/success`,
        cancel_url: requestData.cancelUrl || `${process.env.NEXT_PUBLIC_URL}/marketplace`,
        metadata: {
          type: 'theme_purchase',
          themeId: requestData.themeId,
          userId: user.id
        }
      })

      return NextResponse.json({ url: session.url })
    } catch (error) {
      console.error('Stripe session creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      )
    }
  }

  // If neither theme nor subscription data provided, return error
  return NextResponse.json(
    { error: 'Invalid request data. Please provide either theme or subscription information.' },
    { status: 400 }
  )
}

export async function OPTIONS(request: Request) {
  const allowedOrigin = request.headers.get('origin')
  const response = new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers':
        'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
      'Access-Control-Max-Age': '86400',
    },
  })

  return response
}