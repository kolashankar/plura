'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lock, Crown, Zap, ArrowRight } from 'lucide-react'
import { usePlanRestrictions } from '@/hooks/use-plan-restrictions'
import { getUpgradeMessage } from '@/lib/plan-restrictions'
import PlanUpgradeDialog from '@/components/billing/plan-upgrade-dialog'

interface FeatureGateProps {
  feature: string
  children: React.ReactNode
  fallback?: React.ReactNode
  showUpgradePrompt?: boolean
}

const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  children,
  fallback,
  showUpgradePrompt = true
}) => {
  const { checkFeatureAccess, subscription } = usePlanRestrictions()
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  
  const hasAccess = checkFeatureAccess(feature)

  const handleUpgrade = (planId: string) => {
    // Redirect to billing page or handle upgrade
    window.location.href = `/billing?upgrade=${planId}`
  }

  if (hasAccess) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  if (!showUpgradePrompt) {
    return null
  }

  return (
    <>
      <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-gray-500" />
          </div>
          <CardTitle className="text-lg text-gray-700">
            Feature Locked
          </CardTitle>
          <CardDescription>
            {getUpgradeMessage(feature)}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex justify-center gap-2">
            <Badge variant="outline" className="text-xs">
              Current: {subscription.plan}
            </Badge>
            <Badge variant="default" className="text-xs bg-gradient-to-r from-blue-500 to-purple-600">
              <Crown className="w-3 h-3 mr-1" />
              Upgrade Available
            </Badge>
          </div>
          
          <Button 
            onClick={() => setShowUpgradeDialog(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Zap className="w-4 h-4 mr-2" />
            View Plans
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      <PlanUpgradeDialog
        isOpen={showUpgradeDialog}
        onClose={() => setShowUpgradeDialog(false)}
        currentPlan={subscription.plan}
        requiredFeature={feature}
        onUpgrade={handleUpgrade}
      />
    </>
  )
}

export default FeatureGate