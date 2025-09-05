import { db } from './db'

interface FeatureOverride {
  isEnabled: boolean
  limit?: number
}

/**
 * Check if a feature is enabled for a specific plan via admin controls
 * This function checks admin-controlled feature flags that override the default plan settings
 */
export async function checkAdminFeatureOverride(planId: string, feature: string): Promise<FeatureOverride | null> {
  try {
    const featureFlagKey = `plan_${planId}_${feature}`
    
    const systemConfig = await db.systemConfig.findUnique({
      where: { key: featureFlagKey }
    })
    
    if (systemConfig) {
      return JSON.parse(systemConfig.value) as FeatureOverride
    }
    
    return null
  } catch (error) {
    console.error('Error checking admin feature override:', error)
    return null
  }
}

/**
 * Enhanced feature access check that considers admin overrides
 */
export async function canAccessFeatureWithOverrides(userPlan: string, feature: string): Promise<boolean> {
  try {
    // First check admin overrides
    const override = await checkAdminFeatureOverride(userPlan, feature)
    if (override !== null) {
      return override.isEnabled
    }
    
    // Fall back to default plan restrictions
    const { canAccessFeature } = await import('./plan-restrictions')
    return canAccessFeature(userPlan, feature)
  } catch (error) {
    console.error('Error checking feature access with overrides:', error)
    // Fall back to default plan restrictions on error
    const { canAccessFeature } = await import('./plan-restrictions')
    return canAccessFeature(userPlan, feature)
  }
}

/**
 * Enhanced AI access check with admin overrides
 */
export async function canUseAIWithOverrides(userPlan: string, currentAICredits: number): Promise<boolean> {
  try {
    // Check admin override for AI components
    const override = await checkAdminFeatureOverride(userPlan, 'ai-components')
    if (override !== null) {
      if (!override.isEnabled) return false
      
      const aiLimit = override.limit || -1
      return aiLimit === -1 || currentAICredits < aiLimit
    }
    
    // Fall back to default plan restrictions
    const { canUseAI } = await import('./plan-restrictions')
    return canUseAI(userPlan, currentAICredits)
  } catch (error) {
    console.error('Error checking AI access with overrides:', error)
    const { canUseAI } = await import('./plan-restrictions')
    return canUseAI(userPlan, currentAICredits)
  }
}

/**
 * Enhanced automation access check with admin overrides
 */
export async function canCreateAutomationWithOverrides(userPlan: string, currentAutomationCount: number): Promise<boolean> {
  try {
    // Check admin override for automations
    const override = await checkAdminFeatureOverride(userPlan, 'automations')
    if (override !== null) {
      if (!override.isEnabled) return false
      
      const automationLimit = override.limit || -1
      return automationLimit === -1 || currentAutomationCount < automationLimit
    }
    
    // Fall back to default plan restrictions
    const { canCreateAutomation } = await import('./plan-restrictions')
    return canCreateAutomation(userPlan, currentAutomationCount)
  } catch (error) {
    console.error('Error checking automation access with overrides:', error)
    const { canCreateAutomation } = await import('./plan-restrictions')
    return canCreateAutomation(userPlan, currentAutomationCount)
  }
}

/**
 * Get effective feature limits considering admin overrides
 */
export async function getEffectiveFeatureLimits(userPlan: string): Promise<{
  aiCredits: number
  automations: number
  customDomains: number
  analytics: boolean
  whiteLabel: boolean
  themeSelling: boolean
}> {
  try {
    const { getPlanByName } = await import('./plan-restrictions')
    const basePlan = getPlanByName(userPlan)
    if (!basePlan) {
      throw new Error('Plan not found')
    }

    // Start with base plan limits
    let limits = { ...basePlan.limits }

    // Check admin overrides for each feature
    const features = ['ai-components', 'automations', 'custom-domains', 'analytics', 'white-label', 'theme-selling']
    
    for (const feature of features) {
      const override = await checkAdminFeatureOverride(userPlan, feature)
      if (override !== null) {
        switch (feature) {
          case 'ai-components':
            limits.aiCredits = override.isEnabled ? (override.limit || limits.aiCredits) : 0
            break
          case 'automations':
            limits.automations = override.isEnabled ? (override.limit || limits.automations) : 0
            break
          case 'custom-domains':
            limits.customDomains = override.isEnabled ? (override.limit || limits.customDomains) : 0
            break
          case 'analytics':
            limits.analytics = override.isEnabled
            break
          case 'white-label':
            limits.whiteLabel = override.isEnabled
            break
          case 'theme-selling':
            limits.themeSelling = override.isEnabled
            break
        }
      }
    }

    return limits
  } catch (error) {
    console.error('Error getting effective feature limits:', error)
    // Return default plan limits on error
    const { getPlanByName } = await import('./plan-restrictions')
    const basePlan = getPlanByName(userPlan)
    return basePlan?.limits || {
      aiCredits: 0,
      automations: 0,
      customDomains: 0,
      analytics: false,
      whiteLabel: false,
      themeSelling: false
    }
  }
}