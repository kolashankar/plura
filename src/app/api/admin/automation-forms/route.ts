import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { db } from '@/lib/db'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }

    const [forms, total] = await Promise.all([
      db.automationForm.findMany({
        where,
        include: {
          fields: {
            orderBy: { order: 'asc' }
          },
          automations: {
            include: {
              automation: {
                select: { id: true, name: true, published: true }
              }
            }
          },
          SubAccount: {
            select: { id: true, name: true }
          },
          Individual: {
            select: { id: true, name: true, email: true }
          },
          _count: {
            select: {
              submissions: true,
              automations: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      db.automationForm.count({ where })
    ])

    return NextResponse.json({
      forms,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error('Error fetching automation forms:', error)
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

    const body = await request.json()
    const {
      name,
      description,
      status = 'DRAFT',
      automationType = 'CUSTOM_WORKFLOW',
      category,
      icon,
      workflowUrl,
      keywords,
      emailSubject,
      emailBody,
      successUrl,
      errorUrl,
      fields = [],
      subAccountId,
      individualId,
      isPublic = false,
      restrictToAgency = false,
      restrictToIndividual = false,
      allowedPlans = [],
      config
    } = body

    // Generate unique webhook URL
    const webhookUrl = `${process.env.NEXT_PUBLIC_URL}/api/forms/${crypto.randomUUID()}/submit`

    const form = await db.automationForm.create({
      data: {
        name,
        description,
        status,
        automationType,
        category,
        icon,
        workflowUrl,
        keywords,
        emailSubject,
        emailBody,
        successUrl,
        errorUrl,
        webhookUrl,
        isPublic,
        restrictToAgency,
        restrictToIndividual,
        allowedPlans: allowedPlans.length > 0 ? JSON.stringify(allowedPlans) : null,
        config: config ? JSON.stringify(config) : null,
        createdBy: userId,
        subAccountId,
        individualId,
        fields: {
          create: fields.map((field: any, index: number) => ({
            name: field.name,
            label: field.label,
            type: field.type,
            required: field.required || false,
            placeholder: field.placeholder,
            defaultValue: field.defaultValue,
            options: field.options ? JSON.stringify(field.options) : null,
            validation: field.validation ? JSON.stringify(field.validation) : null,
            order: index
          }))
        }
      },
      include: {
        fields: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(form, { status: 201 })

  } catch (error) {
    console.error('Error creating automation form:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}