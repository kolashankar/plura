import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const subAccountId = searchParams.get('subAccountId')
    const individualId = searchParams.get('individualId')

    if (!subAccountId && !individualId) {
      return NextResponse.json(
        { error: 'SubAccount ID or Individual ID is required' },
        { status: 400 }
      )
    }

    const databases = await db.database.findMany({
      where: {
        OR: [
          { subaccountId: subAccountId },
          { individualId: individualId }
        ]
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ databases })
  } catch (error) {
    console.error('Error fetching databases:', error)
    return NextResponse.json(
      { error: 'Failed to fetch databases' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      name,
      provider,
      connectionString,
      host,
      port,
      database,
      username,
      password,
      subAccountId,
      individualId,
      isDefault = false
    } = await req.json()

    if (!name || !provider) {
      return NextResponse.json(
        { error: 'Name and provider are required' },
        { status: 400 }
      )
    }

    if (!subAccountId && !individualId) {
      return NextResponse.json(
        { error: 'SubAccount ID or Individual ID is required' },
        { status: 400 }
      )
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await db.database.updateMany({
        where: {
          OR: [
            { subaccountId: subAccountId },
            { individualId: individualId }
          ]
        },
        data: { isDefault: false }
      })
    }

    const newDatabase = await db.database.create({
      data: {
        name,
        provider,
        connectionString,
        host,
        port: port ? parseInt(port) : null,
        database,
        username,
        password,
        subaccountId: subAccountId,
        individualId: individualId,
        isDefault,
        isActive: false // Start inactive until tested
      }
    })

    return NextResponse.json({ database: newDatabase })
  } catch (error) {
    console.error('Error creating database:', error)
    return NextResponse.json(
      { error: 'Failed to create database connection' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      id,
      name,
      provider,
      connectionString,
      host,
      port,
      database,
      username,
      password,
      isActive,
      isDefault
    } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Database ID is required' },
        { status: 400 }
      )
    }

    // Get existing database to check ownership
    const existingDb = await db.database.findUnique({
      where: { id }
    })

    if (!existingDb) {
      return NextResponse.json(
        { error: 'Database not found' },
        { status: 404 }
      )
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await db.database.updateMany({
        where: {
          OR: [
            { subaccountId: existingDb.subaccountId },
            { individualId: existingDb.individualId }
          ]
        },
        data: { isDefault: false }
      })
    }

    const updatedDatabase = await db.database.update({
      where: { id },
      data: {
        name,
        provider,
        connectionString,
        host,
        port: port ? parseInt(port) : null,
        database,
        username,
        password,
        isActive,
        isDefault
      }
    })

    return NextResponse.json({ database: updatedDatabase })
  } catch (error) {
    console.error('Error updating database:', error)
    return NextResponse.json(
      { error: 'Failed to update database connection' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Database ID is required' },
        { status: 400 }
      )
    }

    await db.database.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting database:', error)
    return NextResponse.json(
      { error: 'Failed to delete database connection' },
      { status: 500 }
    )
  }
}