import { PRICING_PLANS, PricingPlan } from '@/app/api/billing/plans/route'

export interface UserPlan {
  id: string
  name: string
  features: string[]
  limits: PricingPlan['limits']
}

export function getPlanByName(planName: string): PricingPlan | null {
  return PRICING_PLANS.find(plan => plan.id === planName || plan.name.toLowerCase() === planName.toLowerCase()) || null
}

export function canAccessFeature(userPlan: string, feature: string): boolean {
  const plan = getPlanByName(userPlan)
  if (!plan) return false

  switch (feature) {
    case 'ai-components':
      return plan.limits.aiCredits > 0
    case 'automations':
      return plan.limits.automations > 0
    case 'theme-selling':
      return plan.limits.themeSelling
    case 'white-label':
      return plan.limits.whiteLabel
    case 'analytics':
      return plan.limits.analytics
    case 'custom-domains':
      return plan.limits.customDomains > 0
    default:
      return true
  }
}

export function canCreateFunnel(userPlan: string, currentFunnelCount: number): boolean {
  const plan = getPlanByName(userPlan)
  if (!plan) return false
  
  return plan.limits.funnels === -1 || currentFunnelCount < plan.limits.funnels
}

export function canCreatePage(userPlan: string, currentPageCount: number): boolean {
  const plan = getPlanByName(userPlan)
  if (!plan) return false
  
  return plan.limits.pages === -1 || currentPageCount < plan.limits.pages
}

export function canUseAI(userPlan: string, currentAICredits: number): boolean {
  const plan = getPlanByName(userPlan)
  if (!plan) return false
  
  return plan.limits.aiCredits === -1 || currentAICredits < plan.limits.aiCredits
}

export function canCreateAutomation(userPlan: string, currentAutomationCount: number): boolean {
  const plan = getPlanByName(userPlan)
  if (!plan) return false
  
  return plan.limits.automations === -1 || currentAutomationCount < plan.limits.automations
}

export function getUpgradeMessage(feature: string): string {
  switch (feature) {
    case 'ai-components':
      return 'Upgrade to Basic plan ($49/month) to unlock AI component generation'
    case 'automations':
      return 'Upgrade to Unlimited plan ($199/month) to access automation workflows'
    case 'theme-selling':
      return 'Upgrade to Agency Pro plan ($450/month) to sell custom themes'
    case 'white-label':
      return 'Upgrade to Unlimited plan ($199/month) for white-label options'
    case 'analytics':
      return 'Upgrade to Basic plan ($49/month) to access advanced analytics'
    case 'custom-domains':
      return 'Upgrade to Basic plan ($49/month) to use custom domains'
    default:
      return 'Upgrade your plan to access this feature'
  }
}

export function getPlanLimitsText(plan: PricingPlan): string[] {
  const limits = []
  
  if (plan.limits.funnels === -1) {
    limits.push('Unlimited funnels')
  } else {
    limits.push(`${plan.limits.funnels} funnels`)
  }
  
  if (plan.limits.pages === -1) {
    limits.push('Unlimited pages')
  } else {
    limits.push(`${plan.limits.pages} pages`)
  }
  
  if (plan.limits.aiCredits === -1) {
    limits.push('Unlimited AI credits')
  } else if (plan.limits.aiCredits === 0) {
    limits.push('No AI features')
  } else {
    limits.push(`${plan.limits.aiCredits} AI credits`)
  }
  
  if (plan.limits.automations === -1) {
    limits.push('Unlimited automations')
  } else if (plan.limits.automations === 0) {
    limits.push('No automations')
  } else {
    limits.push(`${plan.limits.automations} automations`)
  }
  
  return limits
}