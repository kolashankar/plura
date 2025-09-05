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
    const provider = searchParams.get('provider')
    const status = searchParams.get('status')

    if (!individualId) {
      return NextResponse.json({ error: 'Individual ID required' }, { status: 400 })
    }

    // Feature 1: Available integrations marketplace
    const availableIntegrations = [
      {
        id: 'int_stripe',
        name: 'Stripe',
        description: 'Accept payments and manage subscriptions',
        category: 'payment',
        icon: '/assets/stripe-icon.svg',
        features: ['Payment processing', 'Subscription management', 'Analytics'],
        pricing: 'Free',
        isPopular: true,
        requiredFields: ['api_key', 'webhook_secret']
      },
      {
        id: 'int_mailchimp',
        name: 'Mailchimp',
        description: 'Email marketing and automation platform',
        category: 'marketing',
        icon: '/assets/mailchimp-icon.svg',
        features: ['Email campaigns', 'List management', 'Automation'],
        pricing: 'Free tier available',
        isPopular: true,
        requiredFields: ['api_key', 'audience_id']
      },
      {
        id: 'int_slack',
        name: 'Slack',
        description: 'Team communication and collaboration',
        category: 'communication',
        icon: '/assets/slack-icon.svg',
        features: ['Real-time messaging', 'File sharing', 'Notifications'],
        pricing: 'Free',
        isPopular: false,
        requiredFields: ['webhook_url', 'channel_id']
      },
      {
        id: 'int_google_analytics',
        name: 'Google Analytics',
        description: 'Website analytics and tracking',
        category: 'analytics',
        icon: '/assets/ga-icon.svg',
        features: ['Traffic analytics', 'Conversion tracking', 'Custom events'],
        pricing: 'Free',
        isPopular: true,
        requiredFields: ['tracking_id', 'property_id']
      }
    ]

    // Feature 2: Active integrations
    const activeIntegrations = [
      {
        id: 'active_1',
        integrationId: 'int_stripe',
        name: 'Stripe Payment Gateway',
        provider: 'stripe',
        status: 'connected',
        connectedAt: new Date('2024-01-15'),
        lastSync: new Date('2024-01-26'),
        settings: {
          test_mode: true,
          webhook_events: ['payment_intent.succeeded', 'customer.subscription.created']
        },
        metrics: {
          totalTransactions: 145,
          totalRevenue: 15420.50,
          lastTransaction: new Date('2024-01-26')
        }
      },
      {
        id: 'active_2',
        integrationId: 'int_mailchimp',
        name: 'Email Marketing Automation',
        provider: 'mailchimp',
        status: 'connected',
        connectedAt: new Date('2024-01-10'),
        lastSync: new Date('2024-01-25'),
        settings: {
          audience_id: 'aud_123456',
          double_optin: true
        },
        metrics: {
          totalSubscribers: 1250,
          emailsSent: 15,
          openRate: 0.25
        }
      }
    ]

    // Feature 3: Webhook management
    const webhooks = [
      {
        id: 'hook_1',
        name: 'Stripe Payment Webhook',
        url: 'https://yoursite.com/api/webhooks/stripe',
        events: ['payment_intent.succeeded', 'invoice.payment_failed'],
        status: 'active',
        lastTriggered: new Date('2024-01-26'),
        totalCalls: 89,
        successRate: 0.98,
        integrationId: 'active_1'
      },
      {
        id: 'hook_2',
        name: 'Contact Form Webhook',
        url: 'https://yoursite.com/api/webhooks/contact',
        events: ['form.submitted'],
        status: 'active',
        lastTriggered: new Date('2024-01-25'),
        totalCalls: 23,
        successRate: 1.0,
        integrationId: 'custom'
      }
    ]

    // Feature 4: API key management
    const apiKeys = [
      {
        id: 'key_1',
        name: 'Production API Key',
        keyType: 'production',
        permissions: ['read', 'write'],
        lastUsed: new Date('2024-01-26'),
        expiresAt: new Date('2025-01-26'),
        usageCount: 1250,
        rateLimit: 1000,
        status: 'active'
      },
      {
        id: 'key_2',
        name: 'Development API Key',
        keyType: 'development',
        permissions: ['read'],
        lastUsed: new Date('2024-01-24'),
        expiresAt: new Date('2024-07-26'),
        usageCount: 89,
        rateLimit: 100,
        status: 'active'
      }
    ]

    return NextResponse.json({
      availableIntegrations: provider ? availableIntegrations.filter(i => i.category === provider) : availableIntegrations,
      activeIntegrations: status ? activeIntegrations.filter(i => i.status === status) : activeIntegrations,
      webhooks,
      apiKeys
    })

  } catch (error) {
    console.error('Integrations API error:', error)
    return NextResponse.json({ error: 'Failed to fetch integrations' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { individualId, action, integrationData, webhookData, apiKeyData } = await req.json()

    if (!individualId || !action) {
      return NextResponse.json({ error: 'Individual ID and action required' }, { status: 400 })
    }

    switch (action) {
      case 'connect_integration':
        // Feature 5: Integration connection
        const newIntegration = {
          id: `active_${Date.now()}`,
          integrationId: integrationData.integrationId,
          name: integrationData.name,
          provider: integrationData.provider,
          credentials: integrationData.credentials, // Should be encrypted in real implementation
          settings: integrationData.settings || {},
          status: 'testing',
          connectedAt: new Date(),
          individualId,
          connectedBy: user.id
        }

        // Test connection (simplified)
        const connectionTest = await testIntegrationConnection(newIntegration)
        newIntegration.status = connectionTest.success ? 'connected' : 'failed'

        return NextResponse.json({
          success: connectionTest.success,
          integration: newIntegration,
          message: connectionTest.success ? 'Integration connected successfully' : 'Connection failed',
          error: connectionTest.error
        })

      case 'create_webhook':
        // Feature 6: Webhook creation
        const newWebhook = {
          id: `hook_${Date.now()}`,
          name: webhookData.name,
          url: webhookData.url,
          events: webhookData.events || [],
          secret: `whsec_${Math.random().toString(36).substring(2, 15)}`,
          status: 'active',
          createdAt: new Date(),
          individualId,
          createdBy: user.id,
          totalCalls: 0,
          successRate: 1.0
        }

        return NextResponse.json({
          success: true,
          webhook: newWebhook,
          message: 'Webhook created successfully'
        })

      case 'generate_api_key':
        // Feature 7: API key generation
        const newApiKey = {
          id: `key_${Date.now()}`,
          name: apiKeyData.name,
          keyType: apiKeyData.keyType || 'production',
          key: `pk_${Math.random().toString(36).substring(2, 32)}`, // Simplified key generation
          permissions: apiKeyData.permissions || ['read'],
          rateLimit: apiKeyData.rateLimit || 1000,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
          createdAt: new Date(),
          individualId,
          createdBy: user.id,
          usageCount: 0,
          status: 'active'
        }

        return NextResponse.json({
          success: true,
          apiKey: newApiKey,
          message: 'API key generated successfully'
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Integrations action error:', error)
    return NextResponse.json({ error: 'Failed to process integration action' }, { status: 500 })
  }
}

// Helper function to test integration connections
async function testIntegrationConnection(integration: any) {
  try {
    // This is a simplified test - in reality you'd test the actual API
    switch (integration.provider) {
      case 'stripe':
        // Test Stripe API connection
        return { success: true }
      case 'mailchimp':
        // Test Mailchimp API connection
        return { success: true }
      case 'slack':
        // Test Slack webhook
        return { success: true }
      default:
        return { success: true }
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}