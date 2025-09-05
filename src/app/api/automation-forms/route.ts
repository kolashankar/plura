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
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const subaccountId = searchParams.get('subaccountId')
    const individualId = searchParams.get('individualId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: any = {}
    
    if (subaccountId) {
      where.subAccountId = subaccountId
    }
    
    if (individualId) {
      where.individualId = individualId
    }
    
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

    const body = await request.json()
    const {
      name,
      description,
      status = 'DRAFT',
      emailSubject,
      emailBody,
      successUrl,
      errorUrl,
      fields = [],
      subAccountId,
      individualId,
      config
    } = body

    // Generate unique webhook URL
    const webhookId = crypto.randomUUID()
    const webhookUrl = `${process.env.NEXT_PUBLIC_URL}/api/forms/${webhookId}/submit`

    const form = await db.automationForm.create({
      data: {
        name,
        description,
        status,
        emailSubject,
        emailBody,
        successUrl,
        errorUrl,
        webhookUrl,
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