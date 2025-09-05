import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { getAdminUser, createAuditLog } from '@/lib/queries'
import { PRICING_PLANS, PricingPlan } from '@/app/api/billing/plans/route'

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

    await createAuditLog(
      adminUser.id,
      'VIEW_PLANS',
      'Plan',
      undefined,
      undefined,
      undefined,
      req.headers.get('x-forwarded-for') || 'unknown',
      req.headers.get('user-agent') || 'unknown'
    )

    return NextResponse.json({ plans: PRICING_PLANS })
  } catch (error) {
    console.error('Plans fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
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
    if (!adminUser || !adminUser.isSuperAdmin) {
      return NextResponse.json({ error: 'Super admin access required' }, { status: 403 })
    }

    const { planId, ...updates } = await req.json()

    // Store the plan configuration in system config
    const planConfigKey = `plan_config_${planId}`
    
    const configResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/system-config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: planConfigKey,
        value: JSON.stringify(updates),
        type: 'json',
        description: `Configuration for ${planId} plan`,
        isPublic: false
      })
    })

    if (!configResponse.ok) {
      throw new Error('Failed to update plan configuration')
    }

    await createAuditLog(
      adminUser.id,
      'UPDATE_PLAN',
      'Plan',
      planId,
      undefined,
      updates,
      req.headers.get('x-forwarded-for') || 'unknown',
      req.headers.get('user-agent') || 'unknown'
    )

    return NextResponse.json({ 
      success: true,
      message: `Plan ${planId} updated successfully`
    })
  } catch (error) {
    console.error('Plan update error:', error)
    return NextResponse.json(
      { error: 'Failed to update plan' },
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
    if (!adminUser || !adminUser.isSuperAdmin) {
      return NextResponse.json({ error: 'Super admin access required' }, { status: 403 })
    }

    const planData = await req.json()

    // Validate required fields
    if (!planData.id || !planData.name || planData.price === undefined) {
      return NextResponse.json(
        { error: 'Plan ID, name, and price are required' },
        { status: 400 }
      )
    }

    // Store the new plan in system config
    const planConfigKey = `plan_config_${planData.id}`
    
    const configResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/system-config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: planConfigKey,
        value: JSON.stringify(planData),
        type: 'json',
        description: `Configuration for ${planData.name} plan`,
        isPublic: false
      })
    })

    if (!configResponse.ok) {
      throw new Error('Failed to create plan configuration')
    }

    await createAuditLog(
      adminUser.id,
      'CREATE_PLAN',
      'Plan',
      planData.id,
      undefined,
      planData,
      req.headers.get('x-forwarded-for') || 'unknown',
      req.headers.get('user-agent') || 'unknown'
    )

    return NextResponse.json({ 
      success: true,
      message: `Plan ${planData.name} created successfully`,
      plan: planData
    })
  } catch (error) {
    console.error('Plan creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create plan' },
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
    if (!adminUser || !adminUser.isSuperAdmin) {
      return NextResponse.json({ error: 'Super admin access required' }, { status: 403 })
    }

    const { planId } = await req.json()

    // Don't allow deletion of core plans
    if (['free', 'basic', 'unlimited', 'agency'].includes(planId)) {
      return NextResponse.json(
        { error: 'Cannot delete core subscription plans' },
        { status: 400 }
      )
    }

    await createAuditLog(
      adminUser.id,
      'DELETE_PLAN',
      'Plan',
      planId,
      undefined,
      undefined,
      req.headers.get('x-forwarded-for') || 'unknown',
      req.headers.get('user-agent') || 'unknown'
    )

    return NextResponse.json({ 
      success: true,
      message: `Plan ${planId} deleted successfully`
    })
  } catch (error) {
    console.error('Plan deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete plan' },
      { status: 500 }
    )
  }
}