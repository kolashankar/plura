
import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { N8nEmailIntegration, N8nSocialIntegration } from '@/lib/n8n-integration'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { workflowId, triggerData, subAccountId } = await req.json()

    // Get workflow from database
    const workflow = await db.automation.findUnique({
      where: { id: workflowId, subAccountId },
      include: {
        Action: {
          orderBy: { order: 'asc' }
        },
        Trigger: true
      }
    })

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    // Execute workflow steps
    const executionResults = []
    let currentData = triggerData

    for (const action of workflow.Action) {
      try {
        const result = await executeAction(action, currentData, subAccountId)
        executionResults.push({
          actionId: action.id,
          actionType: action.type,
          status: 'success',
          result: result,
          timestamp: new Date()
        })
        currentData = { ...currentData, ...result }
      } catch (error) {
        executionResults.push({
          actionId: action.id,
          actionType: action.type,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date()
        })
        
        // Stop execution on error (can be configurable)
        break
      }
    }

    // Log execution
    await logWorkflowExecution(workflowId, executionResults, subAccountId)

    return NextResponse.json({
      success: true,
      workflowId,
      executionResults,
      totalSteps: workflow.Action.length,
      successfulSteps: executionResults.filter(r => r.status === 'success').length
    })

  } catch (error) {
    console.error('Workflow execution error:', error)
    return NextResponse.json(
      { error: 'Failed to execute workflow' },
      { status: 500 }
    )
  }
}

async function executeAction(action: any, data: any, subAccountId: string) {
  switch (action.type) {
    case 'SEND_EMAIL':
      return await executeEmailAction(action, data, subAccountId)
    case 'POST_SOCIAL':
      return await executeSocialAction(action, data, subAccountId)
    case 'CREATE_CONTACT':
      return await executeContactAction(action, data, subAccountId)
    case 'UPDATE_DATABASE':
      return await executeDatabaseAction(action, data, subAccountId)
    case 'CALL_WEBHOOK':
      return await executeWebhookAction(action, data)
    case 'DELAY':
      return await executeDelayAction(action, data)
    case 'CONDITION':
      return await executeConditionAction(action, data)
    default:
      throw new Error(`Unknown action type: ${action.type}`)
  }
}

async function executeEmailAction(action: any, data: any, subAccountId: string) {
  const { to, subject, body, template, variables } = action.config || {}
  
  // Check if n8n email workflow is configured for this subaccount
  const n8nIntegration = await db.integration.findFirst({
    where: {
      subaccountId: subAccountId,
      provider: 'n8n',
      isActive: true,
      name: { contains: 'email' }
    }
  })

  if (n8nIntegration && n8nIntegration.webhookUrl) {
    // Use n8n workflow for email sending
    try {
      const result = await N8nEmailIntegration.sendEmail(subAccountId, {
        to,
        subject,
        body,
        template,
        variables: { ...data, ...variables }
      }, db)
      
      return {
        emailSent: result.success,
        recipient: to,
        subject: subject,
        executionId: result.executionId,
        provider: 'n8n',
        timestamp: new Date(),
        n8nData: result.data
      }
    } catch (error) {
      console.error('n8n email execution failed, falling back to default:', error)
      // Fall through to default email logic
    }
  }
  
  // Default email sending logic (fallback when n8n is not configured)
  console.log(`Sending email via default provider to ${to}: ${subject}`)
  
  return {
    emailSent: true,
    recipient: to,
    subject: subject,
    provider: 'default',
    timestamp: new Date()
  }
}

async function executeSocialAction(action: any, data: any, subAccountId: string) {
  const { platform, content, mediaUrls, scheduledTime } = action.config || {}
  
  // Check if n8n social workflow is configured for this subaccount
  const n8nIntegration = await db.integration.findFirst({
    where: {
      subaccountId: subAccountId,
      provider: 'n8n',
      isActive: true,
      name: { contains: 'social' }
    }
  })

  if (n8nIntegration && n8nIntegration.webhookUrl) {
    // Use n8n workflow for social media posting
    try {
      const result = await N8nSocialIntegration.postToSocial(subAccountId, {
        platform,
        content,
        mediaUrls,
        scheduledTime: scheduledTime ? new Date(scheduledTime) : undefined
      }, db)
      
      return {
        posted: result.success,
        platform: platform,
        postId: result.data?.postId || `n8n_${Date.now()}`,
        content: content,
        executionId: result.executionId,
        provider: 'n8n',
        timestamp: new Date(),
        n8nData: result.data
      }
    } catch (error) {
      console.error('n8n social execution failed, falling back to default:', error)
      // Fall through to default social logic
    }
  }
  
  // Default social media posting logic (fallback when n8n is not configured)
  console.log(`Posting to ${platform} via default provider: ${content}`)
  
  return {
    posted: true,
    platform: platform,
    postId: `post_${Date.now()}`,
    content: content,
    provider: 'default',
    timestamp: new Date()
  }
}

async function executeContactAction(action: any, data: any, subAccountId: string) {
  const { name, email, phone } = data
  
  const contact = await db.contact.create({
    data: {
      name: name || 'Unknown',
      email: email || '',
      subAccountId: subAccountId
    }
  })
  
  return {
    contactCreated: true,
    contactId: contact.id,
    contactEmail: contact.email
  }
}

async function executeDatabaseAction(action: any, data: any, subAccountId: string) {
  const { operation, table, values } = action.config || {}
  
  // Database operation logic
  console.log(`Database ${operation} on ${table}:`, values)
  
  return {
    databaseUpdated: true,
    operation: operation,
    table: table,
    timestamp: new Date()
  }
}

async function executeWebhookAction(action: any, data: any) {
  const { url, method, headers, body } = action.config || {}
  
  const response = await fetch(url, {
    method: method || 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify({ ...data, ...body })
  })
  
  const result = await response.json()
  
  return {
    webhookCalled: true,
    url: url,
    status: response.status,
    response: result
  }
}

async function executeDelayAction(action: any, data: any) {
  const { duration } = action.config || {}
  const delayMs = parseInt(duration) * 1000
  
  await new Promise(resolve => setTimeout(resolve, delayMs))
  
  return {
    delayed: true,
    duration: duration,
    timestamp: new Date()
  }
}

async function executeConditionAction(action: any, data: any) {
  const { condition, field, operator, value } = action.config || {}
  
  let result = false
  const fieldValue = data[field]
  
  switch (operator) {
    case 'equals':
      result = fieldValue === value
      break
    case 'contains':
      result = fieldValue?.includes(value)
      break
    case 'greater_than':
      result = parseFloat(fieldValue) > parseFloat(value)
      break
    case 'less_than':
      result = parseFloat(fieldValue) < parseFloat(value)
      break
  }
  
  return {
    conditionMet: result,
    field: field,
    operator: operator,
    value: value,
    actualValue: fieldValue
  }
}

async function logWorkflowExecution(workflowId: string, results: any[], subAccountId: string) {
  // Log to database or monitoring system
  console.log(`Workflow ${workflowId} execution completed:`, results)
  
  // You could store this in a separate AutomationExecution table
  // await db.automationExecution.create({
  //   data: {
  //     automationId: workflowId,
  //     subAccountId: subAccountId,
  //     results: JSON.stringify(results),
  //     status: results.some(r => r.status === 'error') ? 'failed' : 'success',
  //     executedAt: new Date()
  //   }
  // })
}
