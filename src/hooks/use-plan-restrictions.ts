'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { canAccessFeature, canUseAI, canCreateAutomation } from '@/lib/plan-restrictions'

interface UserSubscription {
  plan: string
  aiCreditsUsed: number
  automationCount: number
  funnelCount: number
  pageCount: number
}

export function usePlanRestrictions() {
  const { user } = useUser()
  const [subscription, setSubscription] = useState<UserSubscription>({
    plan: 'free',
    aiCreditsUsed: 0,
    automationCount: 0,
    funnelCount: 0,
    pageCount: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchUserSubscription()
    }
  }, [user])

  const fetchUserSubscription = async () => {
    try {
      const response = await fetch('/api/user/subscription')
      if (response.ok) {
        const data = await response.json()
        setSubscription(data)
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkFeatureAccess = (feature: string): boolean => {
    return canAccessFeature(subscription.plan, feature)
  }

  const checkAIAccess = (): boolean => {
    return canUseAI(subscription.plan, subscription.aiCreditsUsed)
  }

  const checkAutomationAccess = (): boolean => {
    return canCreateAutomation(subscription.plan, subscription.automationCount)
  }

  const getRemainingCredits = (resource: 'ai' | 'funnels' | 'pages' | 'automations'): number | 'unlimited' => {
    const plan = subscription.plan
    
    switch (resource) {
      case 'ai':
        const aiLimit = subscription.plan === 'free' ? 0 : 
                      subscription.plan === 'basic' ? 1000 :
                      subscription.plan === 'unlimited' ? 10000 : -1
        return aiLimit === -1 ? 'unlimited' : Math.max(0, aiLimit - subscription.aiCreditsUsed)
      
      case 'funnels':
        const funnelLimit = subscription.plan === 'free' ? 3 : -1
        return funnelLimit === -1 ? 'unlimited' : Math.max(0, funnelLimit - subscription.funnelCount)
      
      case 'pages':
        const pageLimit = subscription.plan === 'free' ? 10 : -1
        return pageLimit === -1 ? 'unlimited' : Math.max(0, pageLimit - subscription.pageCount)
      
      case 'automations':
        const automationLimit = subscription.plan === 'free' || subscription.plan === 'basic' ? 0 : -1
        return automationLimit === -1 ? 'unlimited' : Math.max(0, automationLimit - subscription.automationCount)
      
      default:
        return 0
    }
  }

  return {
    subscription,
    isLoading,
    checkFeatureAccess,
    checkAIAccess,
    checkAutomationAccess,
    getRemainingCredits,
    refreshSubscription: fetchUserSubscription
  }
}