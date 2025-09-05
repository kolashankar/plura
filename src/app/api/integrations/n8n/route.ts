import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { N8nIntegration } from '@/lib/n8n-integration'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subAccountId, name, webhookUrl, workflowType, config } = await req.json()

    if (!subAccountId || !name || !webhookUrl || !workflowType) {
      return NextResponse.json({ 
        error: 'Missing required fields: subAccountId, name, webhookUrl, workflowType' 
      }, { status: 400 })
    }

    // Validate webhook URL format
    if (!N8nIntegration.validateWebhookUrl(webhookUrl)) {
      return NextResponse.json({ 
        error: 'Invalid webhook URL format' 
      }, { status: 400 })
    }

    // Verify user has access to subaccount
    const subAccount = await db.subAccount.findFirst({
      where: {
        id: subAccountId,
        Agency: {
          users: {
            some: { id: user.id }
          }
        }
      }
    })

    if (!subAccount) {
      return NextResponse.json({ error: 'Unauthorized access to subaccount' }, { status: 403 })
    }

    // Test webhook connectivity
    const isConnected = await N8nIntegration.testWebhookConnection(webhookUrl)
    if (!isConnected) {
      return NextResponse.json({ 
        error: 'Unable to connect to webhook URL. Please verify the URL is correct and n8n workflow is running.' 
      }, { status: 400 })
    }

    // Check if integration already exists
    const existingIntegration = await db.integration.findFirst({
      where: {
        subaccountId: subAccountId,
        provider: 'n8n',
        name: name
      }
    })

    let integration
    if (existingIntegration) {
      // Update existing integration
      integration = await db.integration.update({
        where: { id: existingIntegration.id },
        data: {
          webhookUrl,
          isActive: true,
          config: config ? JSON.stringify(config) : null,
        }
      })
    } else {
      // Create new integration
      integration = await db.integration.create({
        data: {
          name,
          provider: 'n8n',
          webhookUrl,
          isActive: true,
          config: config ? JSON.stringify(config) : null,
          subaccountId: subAccountId,
        }
      })
    }

    return NextResponse.json({
      success: true,
      integration: {
        id: integration.id,
        name: integration.name,
        provider: integration.provider,
        isActive: integration.isActive,
        workflowType,
        createdAt: integration.createdAt
      }
    })

  } catch (error) {
    console.error('Error configuring n8n integration:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const subAccountId = searchParams.get('subAccountId')

    if (!subAccountId) {
      return NextResponse.json({ error: 'subAccountId is required' }, { status: 400 })
    }

    // Verify user has access to subaccount
    const subAccount = await db.subAccount.findFirst({
      where: {
        id: subAccountId,
        Agency: {
          users: {
            some: { id: user.id }
          }
        }
      }
    })

    if (!subAccount) {
      return NextResponse.json({ error: 'Unauthorized access to subaccount' }, { status: 403 })
    }

    // Get all n8n integrations for this subaccount
    const integrations = await db.integration.findMany({
      where: {
        subaccountId: subAccountId,
        provider: 'n8n'
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      integrations: integrations.map(integration => ({
        id: integration.id,
        name: integration.name,
        provider: integration.provider,
        isActive: integration.isActive,
        createdAt: integration.createdAt,
        updatedAt: integration.updatedAt,
        config: integration.config ? JSON.parse(integration.config) : null
      }))
    })

  } catch (error) {
    console.error('Error fetching n8n integrations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const integrationId = searchParams.get('integrationId')
    const subAccountId = searchParams.get('subAccountId')

    if (!integrationId || !subAccountId) {
      return NextResponse.json({ error: 'integrationId and subAccountId are required' }, { status: 400 })
    }

    // Verify user has access to subaccount
    const subAccount = await db.subAccount.findFirst({
      where: {
        id: subAccountId,
        Agency: {
          users: {
            some: { id: user.id }
          }
        }
      }
    })

    if (!subAccount) {
      return NextResponse.json({ error: 'Unauthorized access to subaccount' }, { status: 403 })
    }

    // Delete the integration
    await db.integration.delete({
      where: {
        id: integrationId,
        subaccountId: subAccountId
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting n8n integration:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}