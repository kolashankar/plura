import { db } from './db'
import type { PurchaseStatus } from '@prisma/client'

/**
 * Marketplace database queries - Mock data for now
 */

export const getPurchasedThemesByUser = async (userId: string, agencyId?: string, subAccountId?: string) => {
  try {
    const where: any = {
      userId,
      status: 'ACTIVE'
    }

    if (agencyId) {
      where.agencyId = agencyId
    }
    if (subAccountId) {
      where.subAccountId = subAccountId
    }

    const purchasedThemes = await db.purchasedTheme.findMany({
      where,
      include: {
        theme: true
      },
      orderBy: { purchaseDate: 'desc' }
    })

    return purchasedThemes
  } catch (error) {
    console.error('Error fetching purchased themes:', error)
    // Return mock data as fallback
    const mockPurchasedThemes = [
      {
        id: '1',
        userId,
        themeId: 'theme-modern-agency-theme',
        purchaseDate: new Date('2024-01-15'),
        price: 79,
        theme: {
          id: 'theme-modern-agency-theme',
          name: 'Modern Agency Theme',
          description: 'Professional theme perfect for digital agencies',
          price: 79,
          category: 'business',
          image: '/assets/preview.png',
          rating: 4.8,
          downloads: 1250,
        }
      }
    ]
    return mockPurchasedThemes
  }
}

export const getPurchasedPluginsByUser = async (userId: string, agencyId?: string, subAccountId?: string) => {
  try {
    // Mock data for now
    const mockPurchasedPlugins = [
      {
        id: '1',
        userId,
        pluginId: 'plugin-advanced-contact-forms',
        purchaseDate: new Date('2024-01-12'),
        price: 39,
        plugin: {
          id: 'plugin-advanced-contact-forms',
          name: 'Advanced Contact Forms',
          description: 'Powerful form builder with conditional logic',
          price: 39,
          category: 'forms',
          rating: 4.8,
          downloads: 2100,
        }
      }
    ]
    return mockPurchasedPlugins
  } catch (error) {
    console.error('Error fetching purchased plugins:', error)
    return []
  }
}

export const getMarketplaceThemes = async (category?: string, featured?: boolean) => {
  try {
    const where: any = {
      isActive: true
    }

    if (category && category !== 'all') {
      where.category = category
    }

    if (featured !== undefined) {
      where.featured = featured
    }

    const themes = await db.marketplaceTheme.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { rating: 'desc' },
        { downloads: 'desc' }
      ]
    })

    return themes
  } catch (error) {
    console.error('Error fetching marketplace themes:', error)
    // Return mock data as fallback
    const mockThemes = [
      {
        id: 'theme-modern-agency-theme',
        name: 'Modern Agency Theme',
        description: 'Professional theme perfect for digital agencies and creative studios',
        price: 79,
        category: 'business',
        image: '/assets/preview.png',
        rating: 4.8,
        downloads: 1250,
        featured: true,
      }
    ]
    
    let filteredThemes = mockThemes
    if (category) {
      filteredThemes = filteredThemes.filter(theme => theme.category === category)
    }
    if (featured !== undefined) {
      filteredThemes = filteredThemes.filter(theme => theme.featured === featured)
    }
    
    return filteredThemes
  }
}

export const getMarketplacePlugins = async (category?: string, featured?: boolean) => {
  try {
    // Mock marketplace plugins data
    const mockPlugins = [
      {
        id: 'plugin-advanced-contact-forms',
        name: 'Advanced Contact Forms',
        description: 'Powerful form builder with conditional logic and integrations',
        price: 39,
        category: 'forms',
        rating: 4.8,
        downloads: 2100,
        featured: true,
      },
      {
        id: 'plugin-seo-optimizer-pro',
        name: 'SEO Optimizer Pro',
        description: 'Complete SEO toolkit for better search engine rankings',
        price: 89,
        category: 'seo',
        rating: 4.9,
        downloads: 1450,
        featured: true,
      },
      {
        id: 'plugin-social-media-feed',
        name: 'Social Media Feed',
        description: 'Display Instagram, Twitter, and Facebook feeds beautifully',
        price: 29,
        category: 'social',
        rating: 4.5,
        downloads: 1780,
        featured: false,
      },
    ]

    let filteredPlugins = mockPlugins
    if (category) {
      filteredPlugins = filteredPlugins.filter(plugin => plugin.category === category)
    }
    if (featured !== undefined) {
      filteredPlugins = filteredPlugins.filter(plugin => plugin.featured === featured)
    }

    return filteredPlugins
  } catch (error) {
    console.error('Error fetching marketplace plugins:', error)
    return []
  }
}

export const purchaseTheme = async (
  userId: string,
  themeId: string,
  price: number,
  agencyId?: string,
  subAccountId?: string,
  individualId?: string
) => {
  try {
    // Get user plan to determine commission rate
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { plan: true }
    })
    
    // Premium users get 95% revenue share (5% commission)
    // Other users get 70% revenue share (30% commission)
    const isPremium = user?.plan === 'PREMIUM'
    const commissionRate = isPremium ? 0.05 : 0.30
    const platformFee = price * commissionRate
    const creatorEarnings = price - platformFee

    const purchase = await db.purchasedTheme.create({
      data: {
        userId,
        themeId,
        price,
        commissionRate,
        platformFee,
        creatorEarnings,
        agencyId,
        subAccountId,
        individualId,
      },
      include: {
        theme: true
      }
    })

    // Update theme download count
    await db.marketplaceTheme.update({
      where: { id: themeId },
      data: {
        downloads: {
          increment: 1
        }
      }
    })

    return purchase
  } catch (error) {
    console.error('Error purchasing theme:', error)
    throw error
  }
}

export const purchasePlugin = async (
  userId: string,
  pluginId: string,
  price: number,
  agencyId?: string,
  subAccountId?: string,
  individualId?: string
) => {
  try {
    // Get user plan to determine commission rate
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { plan: true }
    })
    
    // Premium users get 95% revenue share (5% commission)
    // Other users get 70% revenue share (30% commission)
    const isPremium = user?.plan === 'PREMIUM'
    const commissionRate = isPremium ? 0.05 : 0.30
    const platformFee = price * commissionRate
    const creatorEarnings = price - platformFee

    const purchase = await db.purchasedPlugin.create({
      data: {
        userId,
        pluginId,
        price,
        commissionRate,
        platformFee,
        creatorEarnings,
        agencyId,
        subAccountId,
        individualId,
      },
      include: {
        plugin: true
      }
    })

    // Update plugin download count
    await db.marketplacePlugin.update({
      where: { id: pluginId },
      data: {
        downloads: {
          increment: 1
        }
      }
    })

    return purchase
  } catch (error) {
    console.error('Error purchasing plugin:', error)
    throw error
  }
}

export const seedMarketplaceData = async () => {
  try {
    console.log('✅ Mock marketplace data available (not persisted)')
    return { success: true }
  } catch (error) {
    console.error('❌ Error seeding marketplace data:', error)
    return { success: false, error }
  }
}