// n8n Integration Library for Website Builder
// This handles communication with deployed n8n workflows

export interface N8nWorkflowConfig {
  id: string
  name: string
  webhookUrl: string
  type: 'email' | 'social' | 'crm' | 'analytics'
  active: boolean
  subAccountId: string
}

export interface N8nExecutionResult {
  success: boolean
  executionId?: string
  data?: any
  error?: string
  timestamp: Date
}

export class N8nIntegration {
  
  /**
   * Execute n8n workflow via webhook
   */
  static async executeWorkflow(
    webhookUrl: string, 
    data: any,
    workflowType: string
  ): Promise<N8nExecutionResult> {
    try {
      console.log(`Triggering n8n workflow (${workflowType}):`, webhookUrl)
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'WebsiteBuilder-Automation/1.0',
        },
        body: JSON.stringify({
          ...data,
          source: 'website-builder',
          timestamp: new Date().toISOString(),
          workflowType
        }),
      })

      if (!response.ok) {
        throw new Error(`n8n webhook failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      
      return {
        success: true,
        executionId: result.executionId || `exec_${Date.now()}`,
        data: result,
        timestamp: new Date()
      }
      
    } catch (error) {
      console.error('n8n workflow execution failed:', error)
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      }
    }
  }

  /**
   * Get workflow configuration for a subaccount from database
   */
  static async getWorkflowConfig(
    subAccountId: string, 
    workflowType: string,
    db: any
  ): Promise<N8nWorkflowConfig | null> {
    try {
      const integration = await db.integration.findFirst({
        where: {
          subaccountId: subAccountId,
          provider: 'n8n',
          isActive: true,
          name: { contains: workflowType }
        }
      })
      
      if (!integration || !integration.webhookUrl) {
        return null
      }

      return {
        id: integration.id,
        name: integration.name,
        webhookUrl: integration.webhookUrl,
        type: workflowType as any,
        active: integration.isActive,
        subAccountId
      }
      
    } catch (error) {
      console.error('Failed to get n8n workflow config:', error)
      return null
    }
  }

  /**
   * Validate webhook URL format
   */
  static validateWebhookUrl(url: string): boolean {
    try {
      const urlObj = new URL(url)
      // Check if it's a valid HTTP/HTTPS URL
      return ['http:', 'https:'].includes(urlObj.protocol)
    } catch {
      return false
    }
  }

  /**
   * Test webhook connectivity
   */
  static async testWebhookConnection(webhookUrl: string): Promise<boolean> {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test: true,
          source: 'website-builder-test',
          timestamp: new Date().toISOString()
        }),
      })

      return response.ok
    } catch (error) {
      console.error('Webhook test failed:', error)
      return false
    }
  }
}

// Email-specific n8n integration
export class N8nEmailIntegration extends N8nIntegration {
  
  static async sendEmail(
    subAccountId: string,
    emailData: {
      to: string
      subject: string
      body: string
      template?: string
      variables?: Record<string, any>
    },
    db: any
  ): Promise<N8nExecutionResult> {
    const config = await this.getWorkflowConfig(subAccountId, 'email', db)
    
    if (!config || !config.webhookUrl) {
      throw new Error('No n8n email workflow configured for this subaccount')
    }

    return await this.executeWorkflow(config.webhookUrl, {
      action: 'send_email',
      email: emailData,
      subAccountId
    }, 'email')
  }
}

// Social media-specific n8n integration  
export class N8nSocialIntegration extends N8nIntegration {
  
  static async postToSocial(
    subAccountId: string,
    socialData: {
      platform: string
      content: string
      mediaUrls?: string[]
      scheduledTime?: Date
    },
    db: any
  ): Promise<N8nExecutionResult> {
    const config = await this.getWorkflowConfig(subAccountId, 'social', db)
    
    if (!config || !config.webhookUrl) {
      throw new Error('No n8n social workflow configured for this subaccount')
    }

    return await this.executeWorkflow(config.webhookUrl, {
      action: 'post_social',
      social: socialData,
      subAccountId
    }, 'social')
  }
}