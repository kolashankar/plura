import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Check if user is admin
    const adminUser = await db.adminUser.findUnique({
      where: { userId },
      include: { User: true }
    })

    if (!adminUser) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    // Mock transaction data - replace with actual Stripe integration
    const mockTransactions = [
      {
        id: 'txn_1',
        type: 'payment',
        amount: 4900,
        currency: 'usd',
        status: 'succeeded',
        description: 'Pro Plan Subscription',
        customer: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        subscription: {
          id: 'sub_1',
          plan: 'pro'
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        stripePaymentIntentId: 'pi_1234567890'
      },
      {
        id: 'txn_2',
        type: 'payment',
        amount: 9900,
        currency: 'usd',
        status: 'succeeded',
        description: 'Unlimited Plan Subscription',
        customer: {
          name: 'Jane Smith',
          email: 'jane@example.com'
        },
        subscription: {
          id: 'sub_2',
          plan: 'unlimited'
        },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        stripePaymentIntentId: 'pi_0987654321'
      },
      {
        id: 'txn_3',
        type: 'refund',
        amount: -2450,
        currency: 'usd',
        status: 'succeeded',
        description: 'Partial refund for Pro Plan',
        customer: {
          name: 'Bob Johnson',
          email: 'bob@example.com'
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        stripePaymentIntentId: 'pi_refund_123'
      },
      {
        id: 'txn_4',
        type: 'payment',
        amount: 4900,
        currency: 'usd',
        status: 'failed',
        description: 'Pro Plan Subscription - Failed Payment',
        customer: {
          name: 'Alice Brown',
          email: 'alice@example.com'
        },
        subscription: {
          id: 'sub_4',
          plan: 'pro'
        },
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        stripePaymentIntentId: 'pi_failed_456'
      },
      {
        id: 'txn_5',
        type: 'chargeback',
        amount: -9900,
        currency: 'usd',
        status: 'succeeded',
        description: 'Chargeback for Unlimited Plan',
        customer: {
          name: 'Charlie Wilson',
          email: 'charlie@example.com'
        },
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        stripePaymentIntentId: 'pi_chargeback_789'
      }
    ]

    let filteredTransactions = mockTransactions

    if (search) {
      filteredTransactions = filteredTransactions.filter(txn =>
        txn.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        txn.customer.email.toLowerCase().includes(search.toLowerCase()) ||
        txn.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Log audit trail
    await db.auditLog.create({
      data: {
        action: 'VIEW_TRANSACTIONS',
        entity: 'Transaction',
        adminUserId: adminUser.id,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({ transactions: filteredTransactions })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const adminUser = await db.adminUser.findUnique({
      where: { userId },
      include: { User: true }
    })

    if (!adminUser) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const { transactionId, action, amount } = await request.json()

    if (action === 'refund') {
      // Mock refund processing - replace with actual Stripe refund API
      
      // Log audit trail
      await db.auditLog.create({
        data: {
          action: 'PROCESS_REFUND',
          entity: 'Transaction',
          entityId: transactionId,
          adminUserId: adminUser.id,
          newValues: JSON.stringify({ amount }),
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown'
        }
      })

      return NextResponse.json({ success: true })
    }

    return new NextResponse('Invalid action', { status: 400 })
  } catch (error) {
    console.error('Error processing transaction:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}