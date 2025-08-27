
import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { 
  getSystemConfig, 
  updateSystemConfig,
  getAdminUser,
  createAuditLog 
} from '@/lib/queries'

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
    const key = searchParams.get('key')

    const config = await getSystemConfig(key || undefined)

    await createAuditLog(
      adminUser.id,
      'VIEW_SYSTEM_CONFIG',
      'SystemConfig',
      undefined,
      undefined,
      undefined,
      req.headers.get('x-forwarded-for') || 'unknown',
      req.headers.get('user-agent') || 'unknown'
    )

    return NextResponse.json({ config })
  } catch (error) {
    console.error('System config fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch system config' },
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

    const adminUser = await getAdminUser(user.id)
    if (!adminUser || !adminUser.isSuperAdmin) {
      return NextResponse.json({ error: 'Super admin access required' }, { status: 403 })
    }

    const { key, value, type, description, isPublic } = await req.json()

    const config = await updateSystemConfig(
      key,
      value,
      adminUser.id,
      type,
      description,
      isPublic
    )

    await createAuditLog(
      adminUser.id,
      'UPDATE_SYSTEM_CONFIG',
      'SystemConfig',
      config.id,
      undefined,
      { key, value, type, description, isPublic },
      req.headers.get('x-forwarded-for') || 'unknown',
      req.headers.get('user-agent') || 'unknown'
    )

    return NextResponse.json({ config })
  } catch (error) {
    console.error('System config update error:', error)
    return NextResponse.json(
      { error: 'Failed to update system config' },
      { status: 500 }
    )
  }
}
