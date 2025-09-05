import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { CodeGenerationService } from '@/lib/code-generators'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { funnelId, funnelPageId, elements, subaccountId } = await req.json()

    if (!funnelId || !elements) {
      return NextResponse.json(
        { error: 'Funnel ID and elements are required' },
        { status: 400 }
      )
    }

    // Get funnel data
    const funnel = await db.funnel.findUnique({
      where: { id: funnelId },
      include: {
        FunnelPages: {
          orderBy: { order: 'asc' }
        },
        SubAccount: {
          select: {
            agencyId: true,
            name: true,
          },
        },
      },
    })

    if (!funnel) {
      return NextResponse.json({ error: 'Funnel not found' }, { status: 404 })
    }

    // Check premium status for auto-generation
    const subscription = await db.subscription.findFirst({
      where: {
        agencyId: funnel.SubAccount?.agencyId,
        active: true,
      },
      include: {
        addOns: true,
      },
    })

    const hasAutoGeneration = subscription && (
      ['unlimited'].includes(subscription.plan) ||
      subscription.addOns?.some(addon => addon.name === 'Add-on' && addon.priceId === 'price_1QIBe8SCZtpG0Bi9mKxbP3oO')
    )

    if (!hasAutoGeneration) {
      return NextResponse.json({ 
        error: 'Premium subscription with AI features required for auto-generation',
        requiresPremium: true 
      }, { status: 403 })
    }

    // Generate code for all three platforms automatically
    const generatedCode = await CodeGenerationService.generateCodeFromElements(
      elements,
      funnel,
      funnel.FunnelPages
    )

    // Store generated code in database for later retrieval
    try {
      await db.generatedCode.upsert({
        where: {
          funnelPageId: funnelPageId,
        },
        update: {
          reactCode: JSON.stringify(generatedCode.react),
          reactNativeCode: JSON.stringify(generatedCode.reactNative),
          pythonCode: JSON.stringify(generatedCode.python),
          updatedAt: new Date(),
        },
        create: {
          funnelPageId: funnelPageId,
          reactCode: JSON.stringify(generatedCode.react),
          reactNativeCode: JSON.stringify(generatedCode.reactNative),
          pythonCode: JSON.stringify(generatedCode.python),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      })
    } catch (dbError) {
      console.error('Database error storing generated code:', dbError)
      // Continue execution even if DB storage fails
    }

    return NextResponse.json({
      success: true,
      message: 'Code generated automatically for React, React Native, and Python',
      generatedCode: {
        react: {
          fileCount: Object.keys(generatedCode.react.files).length,
          framework: generatedCode.react.metadata.framework,
        },
        reactNative: {
          fileCount: Object.keys(generatedCode.reactNative.files).length,
          framework: generatedCode.reactNative.metadata.framework,
        },
        python: {
          fileCount: Object.keys(generatedCode.python.files).length,
          framework: generatedCode.python.metadata.framework,
        }
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Auto-generation error:', error)
    return NextResponse.json(
      { error: 'Failed to auto-generate code' },
      { status: 500 }
    )
  }
}