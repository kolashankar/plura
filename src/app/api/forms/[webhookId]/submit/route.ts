import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { webhookId: string } }
) {
  try {
    const { webhookId } = params
    const body = await request.json()
    
    // Find the form by webhook URL
    const form = await db.automationForm.findFirst({
      where: {
        webhookUrl: {
          endsWith: webhookId + '/submit'
        },
        status: 'PUBLISHED'
      },
      include: {
        fields: {
          orderBy: { order: 'asc' }
        },
        automations: {
          where: { isActive: true },
          include: {
            automation: {
              include: {
                Action: {
                  orderBy: { order: 'asc' }
                }
              }
            }
          }
        }
      }
    })

    if (!form) {
      return NextResponse.json(
        { error: 'Form not found or not published' },
        { status: 404 }
      )
    }

    // Validate required fields
    const requiredFields = form.fields.filter(field => field.required)
    for (const field of requiredFields) {
      if (!body[field.name] || body[field.name].toString().trim() === '') {
        return NextResponse.json(
          { 
            error: 'Validation failed',
            message: `Field '${field.label || field.name}' is required`
          },
          { status: 400 }
        )
      }
    }

    // Get request metadata
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    request.ip || 
                    'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Create form submission
    const submission = await db.formSubmission.create({
      data: {
        formId: form.id,
        data: JSON.stringify(body),
        ipAddress: clientIP,
        userAgent: userAgent,
        source: 'web'
      }
    })

    // Trigger automations
    const executionResults = []
    for (const formAutomation of form.automations) {
      try {
        const automation = formAutomation.automation

        // Execute automation actions
        for (const action of automation.Action) {
          try {
            let actionResult
            
            switch (action.type) {
              case 'SEND_EMAIL':
                actionResult = await executeEmailAction(action, body, form)
                break
              case 'CREATE_CONTACT':
                actionResult = await executeContactAction(action, body, form)
                break
              case 'CALL_WEBHOOK':
                actionResult = await executeWebhookAction(action, body)
                break
              default:
                actionResult = { skipped: true, reason: `Unknown action type: ${action.type}` }
            }

            // Log execution result
            await db.formExecution.create({
              data: {
                submissionId: submission.id,
                automationId: automation.id,
                status: actionResult.success ? 'success' : 'failed',
                result: JSON.stringify(actionResult),
                errorMessage: actionResult.error || null,
                executedAt: new Date()
              }
            })

            executionResults.push({
              automationId: automation.id,
              actionType: action.type,
              result: actionResult
            })

          } catch (actionError) {
            console.error(`Error executing action ${action.type}:`, actionError)
            
            await db.formExecution.create({
              data: {
                submissionId: submission.id,
                automationId: automation.id,
                status: 'failed',
                errorMessage: actionError instanceof Error ? actionError.message : 'Unknown error',
                executedAt: new Date()
              }
            })
          }
        }
      } catch (automationError) {
        console.error(`Error in automation ${formAutomation.automationId}:`, automationError)
      }
    }

    // Mark submission as processed
    await db.formSubmission.update({
      where: { id: submission.id },
      data: { processed: true }
    })

    // Return success response
    const response = {
      success: true,
      submissionId: submission.id,
      message: 'Form submitted successfully',
      automations: executionResults
    }

    // Handle redirects
    if (form.successUrl) {
      return NextResponse.redirect(form.successUrl)
    }

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    console.error('Form submission error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to process form submission'
      },
      { status: 500 }
    )
  }
}

async function executeEmailAction(action: any, formData: any, form: any) {
  try {
    const config = action.config ? JSON.parse(action.config) : {}
    
    // Use form email settings as fallback
    const emailSubject = config.subject || form.emailSubject || 'Form Submission'
    const emailBody = config.body || form.emailBody || 'Thank you for your submission!'
    
    // Replace template variables
    let processedSubject = emailSubject
    let processedBody = emailBody
    
    Object.keys(formData).forEach(key => {
      const placeholder = `{{${key}}}`
      processedSubject = processedSubject.replace(new RegExp(placeholder, 'g'), formData[key])
      processedBody = processedBody.replace(new RegExp(placeholder, 'g'), formData[key])
    })

    // In a real implementation, you would send the email here
    // For now, we'll just log it
    console.log('Email would be sent:', {
      to: formData.email || config.to,
      subject: processedSubject,
      body: processedBody
    })

    return {
      success: true,
      emailSent: true,
      recipient: formData.email || config.to,
      subject: processedSubject
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function executeContactAction(action: any, formData: any, form: any) {
  try {
    const config = action.config ? JSON.parse(action.config) : {}
    
    // Create contact
    const contact = await db.contact.create({
      data: {
        name: formData.name || formData.fullName || 'Unknown',
        email: formData.email || '',
        subAccountId: form.subAccountId,
        individualId: form.individualId
      }
    })

    return {
      success: true,
      contactCreated: true,
      contactId: contact.id,
      contactEmail: contact.email
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function executeWebhookAction(action: any, formData: any) {
  try {
    const config = action.config ? JSON.parse(action.config) : {}
    
    if (!config.url) {
      return {
        success: false,
        error: 'Webhook URL not configured'
      }
    }

    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.headers || {})
      },
      body: JSON.stringify({
        formData,
        timestamp: new Date().toISOString(),
        source: 'automation-form'
      })
    })

    return {
      success: response.ok,
      status: response.status,
      webhookUrl: config.url
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}