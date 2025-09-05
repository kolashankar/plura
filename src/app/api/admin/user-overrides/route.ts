import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { getAdminUser, createAuditLog } from '@/lib/queries'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminUser = await getAdminUser(user.id)
    if (!adminUser) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { userId, feature, isEnabled, limit, expiresAt } = await req.json()

    // Create a system config entry for this user-specific override
    const overrideKey = `user_override_${userId}_${feature}`
    
    const overrideData = {
      isEnabled,
      limit: limit || undefined,
      expiresAt: expiresAt || undefined,
      createdBy: adminUser.id,
      createdAt: new Date().toISOString()
    }

    await db.systemConfig.upsert({
      where: { key: overrideKey },
      update: {
        value: JSON.stringify(overrideData),
        lastModifiedBy: adminUser.id,
        updatedAt: new Date()
      },
      create: {
        key: overrideKey,
        value: JSON.stringify(overrideData),
        type: 'json',
        description: `Feature override for user ${userId} - ${feature}`,
        isPublic: false,
        lastModifiedBy: adminUser.id
      }
    })

    await createAuditLog(
      adminUser.id,
      'CREATE_USER_OVERRIDE',
      'UserOverride',
      overrideKey,
      undefined,
      { userId, feature, isEnabled, limit, expiresAt },
      req.headers.get('x-forwarded-for') || 'unknown',
      req.headers.get('user-agent') || 'unknown'
    )

    return NextResponse.json({ 
      success: true,
      message: `Feature override created for user`
    })
  } catch (error) {
    console.error('User override creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create user override' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminUser = await getAdminUser(user.id)
    if (!adminUser) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (userId) {
      // Get all overrides for a specific user
      const overrides = await db.systemConfig.findMany({
        where: {
          key: {
            startsWith: `user_override_${userId}_`
          }
        }
      })

      const parsedOverrides = overrides.map(override => {
        const feature = override.key.replace(`user_override_${userId}_`, '')
        const data = JSON.parse(override.value)
        
        return {
          id: override.id,
          userId,
          feature,
          ...data,
          updatedAt: override.updatedAt
        }
      })

      return NextResponse.json({ overrides: parsedOverrides })
    }

    // Get all user overrides
    const allOverrides = await db.systemConfig.findMany({
      where: {
        key: {
          startsWith: 'user_override_'
        }
      }
    })

    const parsedOverrides = allOverrides.map(override => {
      const keyParts = override.key.split('_')
      const userId = keyParts[2]
      const feature = keyParts.slice(3).join('_')
      const data = JSON.parse(override.value)
      
      return {
        id: override.id,
        userId,
        feature,
        ...data,
        updatedAt: override.updatedAt
      }
    })

    return NextResponse.json({ overrides: parsedOverrides })
  } catch (error) {
    console.error('User overrides fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user overrides' },
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

    const adminUser = await getAdminUser(user.id)
    if (!adminUser) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { overrideId } = await req.json()

    await db.systemConfig.delete({
      where: { id: overrideId }
    })

    await createAuditLog(
      adminUser.id,
      'DELETE_USER_OVERRIDE',
      'UserOverride',
      overrideId,
      undefined,
      undefined,
      req.headers.get('x-forwarded-for') || 'unknown',
      req.headers.get('user-agent') || 'unknown'
    )

    return NextResponse.json({ 
      success: true,
      message: 'User override deleted successfully'
    })
  } catch (error) {
    console.error('User override deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete user override' },
      { status: 500 }
    )
  }
}