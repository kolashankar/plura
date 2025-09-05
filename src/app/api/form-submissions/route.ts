import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const subaccountId = searchParams.get('subaccountId')
    const individualId = searchParams.get('individualId')
    const formId = searchParams.get('formId')
    const timeRange = searchParams.get('timeRange') || '7d'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }

    // Build where clause for forms
    const formWhere: any = {}
    if (subaccountId) {
      formWhere.subAccountId = subaccountId
    }
    if (individualId) {
      formWhere.individualId = individualId
    }
    if (formId && formId !== 'all') {
      formWhere.id = formId
    }

    // Get form IDs that belong to the user
    const userForms = await db.automationForm.findMany({
      where: formWhere,
      select: { id: true }
    })

    const formIds = userForms.map(form => form.id)

    if (formIds.length === 0) {
      return NextResponse.json({
        submissions: [],
        pagination: {
          total: 0,
          limit,
          offset,
          hasMore: false
        }
      })
    }

    // Build where clause for submissions
    const submissionWhere: any = {
      formId: { in: formIds },
      createdAt: {
        gte: startDate,
        lte: now
      }
    }

    const [submissions, total] = await Promise.all([
      db.formSubmission.findMany({
        where: submissionWhere,
        include: {
          form: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      db.formSubmission.count({ where: submissionWhere })
    ])

    return NextResponse.json({
      submissions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error('Error fetching form submissions:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}