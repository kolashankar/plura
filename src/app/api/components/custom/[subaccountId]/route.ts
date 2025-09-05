import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'

export async function GET(
  request: NextRequest,
  { params }: { params: { subaccountId: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const components = await db.customComponent.findMany({
      where: {
        subAccountId: params.subaccountId,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(components)
  } catch (error) {
    console.error('Error fetching custom components:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { subaccountId: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, type, content, styles, category = 'custom', code } = body

    if (!name || !type || !code) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const component = await db.customComponent.create({
      data: {
        name,
        type,
        content: content || {},
        styles: styles || {},
        category,
        code,
        subAccountId: params.subaccountId,
        createdBy: user.id,
      },
    })

    return NextResponse.json(component, { status: 201 })
  } catch (error) {
    console.error('Error creating custom component:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { subaccountId: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, type, content, styles, category, code, isActive } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Component ID required' },
        { status: 400 }
      )
    }

    const component = await db.customComponent.update({
      where: {
        id,
        subAccountId: params.subaccountId,
      },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(content !== undefined && { content }),
        ...(styles !== undefined && { styles }),
        ...(category && { category }),
        ...(code && { code }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    return NextResponse.json(component)
  } catch (error) {
    console.error('Error updating custom component:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { subaccountId: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const componentId = searchParams.get('id')

    if (!componentId) {
      return NextResponse.json(
        { error: 'Component ID required' },
        { status: 400 }
      )
    }

    await db.customComponent.delete({
      where: {
        id: componentId,
        subAccountId: params.subaccountId,
      },
    })

    return NextResponse.json({ message: 'Component deleted successfully' })
  } catch (error) {
    console.error('Error deleting custom component:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}