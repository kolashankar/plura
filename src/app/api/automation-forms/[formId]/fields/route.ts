import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const formId = params.formId

    // Get the automation form and its fields
    const form = await db.automationForm.findUnique({
      where: { 
        id: formId,
        status: 'PUBLISHED' // Only allow access to published forms
      },
      include: {
        fields: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!form) {
      return new NextResponse('Form not found', { status: 404 })
    }

    // Check if user has access to this form
    // For now, we'll allow access to public forms or forms the user's subaccount can access
    // You might want to add more specific access control here

    return NextResponse.json({
      form: {
        id: form.id,
        name: form.name,
        description: form.description,
        automationType: form.automationType
      },
      fields: form.fields
    })

  } catch (error) {
    console.error('Error fetching form fields:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}