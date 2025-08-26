
import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { prisma } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { subaccountId: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const customComponents = await prisma.customComponent.findMany({
      where: {
        subAccountId: params.subaccountId,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Transform database records to component format
    const components = customComponents.map(comp => ({
      id: comp.id,
      name: comp.name,
      type: comp.type,
      content: comp.content,
      styles: comp.styles,
      category: comp.category,
      isCustom: true,
    }))

    return NextResponse.json({ components })

  } catch (error) {
    console.error('Error fetching custom components:', error)
    return NextResponse.json(
      { error: 'Failed to fetch components' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { subaccountId: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { componentId } = await req.json()

    await prisma.customComponent.update({
      where: {
        id: componentId,
        subAccountId: params.subaccountId,
      },
      data: {
        isActive: false,
      },
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting component:', error)
    return NextResponse.json(
      { error: 'Failed to delete component' },
      { status: 500 }
    )
  }
}
