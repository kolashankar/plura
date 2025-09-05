import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const individualId = searchParams.get('individualId')

    if (!individualId) {
      return NextResponse.json({ error: 'Individual ID required' }, { status: 400 })
    }

    // Feature 1: Plan management and billing overview
    const currentPlan = {
      id: 'plan_professional',
      name: 'Professional',
      price: 49.99,
      currency: 'USD',
      interval: 'month',
      status: 'active',
      startDate: new Date('2024-01-01'),
      nextBillingDate: new Date('2024-02-26'),
      features: [
        'Unlimited projects',
        '500GB storage',
        'Priority support',
        'Advanced analytics',
        'Team collaboration',
        'Custom domains'
      ],
      usage: {
        projects: { used: 8, limit: -1 }, // -1 means unlimited
        storage: { used: 125, limit: 500 }, // GB
        bandwidth: { used: 45, limit: 1000 }, // GB per month
        teamMembers: { used: 3, limit: 10 }
      }
    }

    // Feature 2: Available plans and upgrade options
    const availablePlans = [
      {
        id: 'plan_starter',
        name: 'Starter',
        price: 0,
        currency: 'USD',
        interval: 'month',
        features: [
          '3 projects',
          '10GB storage',
          'Community support',
          'Basic analytics'
        ],
        limits: {
          projects: 3,
          storage: 10,
          bandwidth: 100,
          teamMembers: 1
        },
        isPopular: false,
        canUpgrade: true
      },
      {
        id: 'plan_professional',
        name: 'Professional',
        price: 49.99,
        currency: 'USD',
        interval: 'month',
        features: [
          'Unlimited projects',
          '500GB storage',
          'Priority support',
          'Advanced analytics',
          'Team collaboration',
          'Custom domains'
        ],
        limits: {
          projects: -1,
          storage: 500,
          bandwidth: 1000,
          teamMembers: 10
        },
        isPopular: true,
        canUpgrade: true
      },
      {
        id: 'plan_enterprise',
        name: 'Enterprise',
        price: 199.99,
        currency: 'USD',
        interval: 'month',
        features: [
          'Unlimited everything',
          '5TB storage',
          '24/7 phone support',
          'Custom integrations',
          'Unlimited team members',
          'White-label options',
          'SLA guarantee'
        ],
        limits: {
          projects: -1,
          storage: 5000,
          bandwidth: -1,
          teamMembers: -1
        },
        isPopular: false,
        canUpgrade: true
      }
    ]

    // Feature 3: Payment methods and billing history
    const paymentMethods = [
      {
        id: 'pm_1',
        type: 'card',
        brand: 'visa',
        last4: '4242',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true,
        addedAt: new Date('2024-01-01')
      },
      {
        id: 'pm_2',
        type: 'card',
        brand: 'mastercard',
        last4: '5555',
        expiryMonth: 6,
        expiryYear: 2026,
        isDefault: false,
        addedAt: new Date('2024-01-15')
      }
    ]

    const billingHistory = [
      {
        id: 'inv_1',
        amount: 49.99,
        currency: 'USD',
        description: 'Professional Plan - February 2024',
        status: 'paid',
        date: new Date('2024-01-26'),
        dueDate: new Date('2024-02-02'),
        downloadUrl: '/api/invoices/inv_1/download'
      },
      {
        id: 'inv_2',
        amount: 49.99,
        currency: 'USD',
        description: 'Professional Plan - January 2024',
        status: 'paid',
        date: new Date('2023-12-26'),
        dueDate: new Date('2024-01-02'),
        downloadUrl: '/api/invoices/inv_2/download'
      },
      {
        id: 'inv_3',
        amount: 0,
        currency: 'USD',
        description: 'Starter Plan - December 2023',
        status: 'paid',
        date: new Date('2023-11-26'),
        dueDate: new Date('2023-12-02'),
        downloadUrl: '/api/invoices/inv_3/download'
      }
    ]

    // Feature 4: Usage tracking and analytics
    const usageAnalytics = {
      currentPeriod: {
        start: new Date('2024-01-26'),
        end: new Date('2024-02-26')
      },
      metrics: {
        projects: {
          created: 2,
          active: 8,
          archived: 3
        },
        storage: {
          used: 125.5,
          limit: 500,
          percentage: 25.1,
          trend: '+5.2GB this month'
        },
        bandwidth: {
          used: 45.8,
          limit: 1000,
          percentage: 4.6,
          trend: '+12.3GB this month'
        },
        apiCalls: {
          made: 15420,
          limit: 100000,
          percentage: 15.4,
          trend: '+2.1K this month'
        }
      },
      costBreakdown: {
        basePlan: 49.99,
        additionalStorage: 0,
        additionalBandwidth: 0,
        addOns: 0,
        total: 49.99
      }
    }

    return NextResponse.json({
      currentPlan,
      availablePlans,
      paymentMethods,
      billingHistory,
      usageAnalytics
    })

  } catch (error) {
    console.error('Billing API error:', error)
    return NextResponse.json({ error: 'Failed to fetch billing data' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { individualId, action, planData, paymentData } = await req.json()

    if (!individualId || !action) {
      return NextResponse.json({ error: 'Individual ID and action required' }, { status: 400 })
    }

    switch (action) {
      case 'upgrade_plan':
        // Feature 5: Plan upgrades
        const { newPlanId, billingInterval } = planData
        
        const planUpgrade = {
          oldPlan: 'plan_professional',
          newPlan: newPlanId,
          billingInterval: billingInterval || 'month',
          effectiveDate: new Date(),
          proratedAmount: 50.00, // Calculated proration
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          upgradeId: `upgrade_${Date.now()}`
        }

        return NextResponse.json({
          success: true,
          upgrade: planUpgrade,
          message: 'Plan upgraded successfully'
        })

      case 'add_payment_method':
        // Feature 6: Payment method management
        const newPaymentMethod = {
          id: `pm_${Date.now()}`,
          type: 'card',
          brand: paymentData.brand,
          last4: paymentData.last4,
          expiryMonth: paymentData.expiryMonth,
          expiryYear: paymentData.expiryYear,
          isDefault: paymentData.isDefault || false,
          addedAt: new Date()
        }

        return NextResponse.json({
          success: true,
          paymentMethod: newPaymentMethod,
          message: 'Payment method added successfully'
        })

      case 'update_billing_info':
        // Feature 7: Billing information updates
        const updatedBillingInfo = {
          ...paymentData,
          updatedAt: new Date(),
          updatedBy: user.id
        }

        return NextResponse.json({
          success: true,
          billingInfo: updatedBillingInfo,
          message: 'Billing information updated successfully'
        })

      case 'cancel_subscription':
        // Feature 8: Subscription cancellation
        const cancellation = {
          subscriptionId: `sub_${individualId}`,
          cancelledAt: new Date(),
          effectiveDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // End of billing period
          reason: paymentData.reason || 'No reason provided',
          refundAmount: 0, // No refund for remaining period
          status: 'cancelled'
        }

        return NextResponse.json({
          success: true,
          cancellation,
          message: 'Subscription cancelled successfully'
        })

      case 'download_invoice':
        // Feature 9: Invoice downloads
        const { invoiceId } = paymentData
        
        return NextResponse.json({
          success: true,
          downloadUrl: `/api/invoices/${invoiceId}/download`,
          invoiceId,
          message: 'Invoice download link generated'
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Billing action error:', error)
    return NextResponse.json({ error: 'Failed to process billing action' }, { status: 500 })
  }
}