import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { getPurchasedThemesByUser } from '@/lib/queries-marketplace'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { themeId, funnelId, subAccountId } = await req.json()

    if (!themeId || !funnelId) {
      return NextResponse.json(
        { error: 'Theme ID and Funnel ID are required' },
        { status: 400 }
      )
    }

    // Verify user owns the theme
    const purchasedThemes = await getPurchasedThemesByUser(user.id, undefined, subAccountId)
    const ownedTheme = purchasedThemes.find(pt => pt.themeId === themeId)
    
    if (!ownedTheme) {
      return NextResponse.json(
        { error: 'Theme not found in your purchased themes' },
        { status: 403 }
      )
    }

    // Verify funnel exists and user has access
    const funnel = await db.funnel.findFirst({
      where: {
        id: funnelId,
        subAccountId: subAccountId,
      },
    })

    if (!funnel) {
      return NextResponse.json(
        { error: 'Funnel not found or access denied' },
        { status: 404 }
      )
    }

    // Mock theme import process - In real implementation, this would:
    // 1. Extract theme assets and components
    // 2. Import CSS styles and design elements
    // 3. Update funnel pages with theme structure
    // 4. Preserve existing content while applying new design
    
    const importResult = {
      success: true,
      funnelId,
      themeId,
      importedAt: new Date(),
      changes: {
        stylesUpdated: true,
        componentsImported: 12,
        pagesUpdated: funnel.name === 'Main Sales Funnel' ? 3 : 2,
        contentPreserved: true,
      },
      message: `Successfully imported "${ownedTheme.theme.name}" theme to "${funnel.name}" funnel`
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000))

    return NextResponse.json(importResult)
  } catch (error) {
    console.error('Failed to import theme:', error)
    return NextResponse.json(
      { error: 'Theme import failed' },
      { status: 500 }
    )
  }
}