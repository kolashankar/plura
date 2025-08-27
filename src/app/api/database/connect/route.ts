
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      subaccountId,
      name,
      provider,
      connectionString,
      host,
      port,
      database,
      username,
      password,
      isDefault = false,
    } = body

    if (!subaccountId || !name || !provider) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Test connection first (simplified test)
    let isActive = false
    try {
      // In a real implementation, you would test the actual database connection here
      isActive = true
    } catch (error) {
      console.error('Database connection test failed:', error)
    }

    // If setting as default, unset other defaults first
    if (isDefault) {
      await db.database.updateMany({
        where: { 
          subaccountId,
          isDefault: true 
        },
        data: { isDefault: false },
      })
    }

    const databaseConfig = await db.database.create({
      data: {
        name,
        provider,
        connectionString,
        host,
        port,
        database,
        username,
        password,
        isActive,
        isDefault,
        subaccountId,
      },
    })

    return NextResponse.json(databaseConfig, { status: 201 })
  } catch (error) {
    console.error('Error creating database connection:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const subaccountId = searchParams.get('subaccountId')

    if (!subaccountId) {
      return NextResponse.json(
        { error: 'Subaccount ID required' },
        { status: 400 }
      )
    }

    const databases = await db.database.findMany({
      where: { subaccountId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(databases)
  } catch (error) {
    console.error('Error fetching databases:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
