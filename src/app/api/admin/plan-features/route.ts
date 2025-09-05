import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { getAdminUser, createAuditLog } from '@/lib/queries'

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

    const { planId, feature, isEnabled, limit } = await req.json()

    // Store the feature flag in the database
    const featureFlagKey = `plan_${planId}_${feature}`
    
    // Create or update system config for this plan feature
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/system-config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: featureFlagKey,
        value: JSON.stringify({ isEnabled, limit }),
        type: 'json',
        description: `Feature control for ${feature} in ${planId} plan`,
        isPublic: false
      })
    })

    if (!response.ok) {
      throw new Error('Failed to update feature configuration')
    }

    await createAuditLog(
      adminUser.id,
      'UPDATE_PLAN_FEATURE',
      'PlanFeature',
      featureFlagKey,
      undefined,
      { planId, feature, isEnabled, limit },
      req.headers.get('x-forwarded-for') || 'unknown',
      req.headers.get('user-agent') || 'unknown'
    )

    return NextResponse.json({ 
      success: true,
      message: `Feature ${feature} ${isEnabled ? 'enabled' : 'disabled'} for ${planId} plan`
    })
  } catch (error) {
    console.error('Plan feature update error:', error)
    return NextResponse.json(
      { error: 'Failed to update plan feature' },
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
    const planId = searchParams.get('planId')
    const feature = searchParams.get('feature')

    if (planId && feature) {
      // Get specific plan feature
      const featureFlagKey = `plan_${planId}_${feature}`
      const configResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/system-config?key=${featureFlagKey}`)
      
      if (configResponse.ok) {
        const data = await configResponse.json()
        const featureConfig = data.config ? JSON.parse(data.config.value) : { isEnabled: false }
        return NextResponse.json({ featureConfig })
      }
    }

    // Return default empty response
    return NextResponse.json({ featureConfig: { isEnabled: false } })
  } catch (error) {
    console.error('Plan feature fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch plan feature' },
      { status: 500 }
    )
  }
}