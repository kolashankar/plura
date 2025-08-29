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
        success_url: requestData.successUrl,
        cancel_url: requestData.cancelUrl,
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

  // Handle subscription purchases
  const { priceId } = requestData
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