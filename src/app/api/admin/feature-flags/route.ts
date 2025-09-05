
import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { 
  getFeatureFlags, 
  updateFeatureFlag,
  createFeatureFlag,
  deleteFeatureFlag,
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

    const featureFlags = await getFeatureFlags()

    await createAuditLog(
      adminUser.id,
      'VIEW_FEATURE_FLAGS',
      'FeatureFlag',
      undefined,
      undefined,
      undefined,
      req.headers.get('x-forwarded-for') || 'unknown',
      req.headers.get('user-agent') || 'unknown'
    )

    return NextResponse.json({ featureFlags })
  } catch (error) {
    console.error('Feature flags fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feature flags' },
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

    const adminUser = await getAdminUser(user.id)
    if (!adminUser) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { name, key, description, isEnabled } = await req.json()

    const featureFlag = await createFeatureFlag(name, key, description, isEnabled)

    await createAuditLog(
      adminUser.id,
      'CREATE_FEATURE_FLAG',
      'FeatureFlag',
      featureFlag.id,
      undefined,
      featureFlag,
      req.headers.get('x-forwarded-for') || 'unknown',
      req.headers.get('user-agent') || 'unknown'
    )

    return NextResponse.json({ featureFlag })
  } catch (error) {
    console.error('Feature flag creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create feature flag' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminUser = await getAdminUser(user.id)
    if (!adminUser) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { flagId, isEnabled, rolloutType, rolloutData } = await req.json()

    const featureFlag = await updateFeatureFlag(flagId, {
      isEnabled,
      rolloutType,
      rolloutData
    })

    await createAuditLog(
      adminUser.id,
      'UPDATE_FEATURE_FLAG',
      'FeatureFlag',
      flagId,
      undefined,
      { isEnabled, rolloutType, rolloutData },
      req.headers.get('x-forwarded-for') || 'unknown',
      req.headers.get('user-agent') || 'unknown'
    )

    return NextResponse.json({ featureFlag })
  } catch (error) {
    console.error('Feature flag update error:', error)
    return NextResponse.json(
      { error: 'Failed to update feature flag' },
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

    const { flagId } = await req.json()

    await deleteFeatureFlag(flagId)

    await createAuditLog(
      adminUser.id,
      'DELETE_FEATURE_FLAG',
      'FeatureFlag',
      flagId,
      undefined,
      undefined,
      req.headers.get('x-forwarded-for') || 'unknown',
      req.headers.get('user-agent') || 'unknown'
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feature flag deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete feature flag' },
      { status: 500 }
    )
  }
}
