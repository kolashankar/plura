'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Crown, 
  Zap, 
  Rocket, 
  Building2,
  Check,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { PRICING_PLANS } from '@/app/api/billing/plans/route'
import { getPlanLimitsText } from '@/lib/plan-restrictions'

interface PlanUpgradeDialogProps {
  isOpen: boolean
  onClose: () => void
  currentPlan: string
  requiredFeature: string
  onUpgrade: (planId: string) => void
}

const PlanUpgradeDialog: React.FC<PlanUpgradeDialogProps> = ({
  isOpen,
  onClose,
  currentPlan,
  requiredFeature,
  onUpgrade
}) => {
  const availablePlans = PRICING_PLANS.filter(plan => plan.id !== 'free')

  const getFeatureMessage = (feature: string) => {
    switch (feature) {
      case 'ai-components':
        return 'AI component generation requires a paid plan with AI credits'
      case 'automations':
        return 'Automation workflows are available on Unlimited and Agency Pro plans'
      case 'theme-selling':
        return 'Theme marketplace selling is exclusive to Agency Pro plan'
      case 'white-label':
        return 'White-label branding is available on Unlimited and Agency Pro plans'
      case 'analytics':
        return 'Advanced analytics are available on all paid plans'
      default:
        return 'This feature requires a paid plan'
    }
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic':
        return <Zap className="w-5 h-5" />
      case 'unlimited':
        return <Rocket className="w-5 h-5" />
      case 'agency':
        return <Building2 className="w-5 h-5" />
      default:
        return <Crown className="w-5 h-5" />
    }
  }

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'basic':
        return 'from-blue-500 to-blue-600'
      case 'unlimited':
        return 'from-purple-500 to-purple-600'
      case 'agency':
        return 'from-green-500 to-green-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            Upgrade Required
          </DialogTitle>
          <DialogDescription className="text-base">
            {getFeatureMessage(requiredFeature)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {availablePlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg ${
                plan.popular ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-1 text-xs font-medium">
                    MOST POPULAR
                  </div>
                </div>
              )}
              
              <CardHeader className={`text-center ${plan.popular ? 'pt-8' : 'pt-6'}`}>
                <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-r ${getPlanColor(plan.id)} rounded-xl flex items-center justify-center text-white`}>
                  {getPlanIcon(plan.id)}
                </div>
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <div className="text-3xl font-bold">
                  ${plan.price}
                  <span className="text-sm font-normal text-gray-500">/{plan.interval}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t">
                  <div className="text-xs text-gray-500 space-y-1">
                    {getPlanLimitsText(plan).map((limit, index) => (
                      <div key={index}>• {limit}</div>
                    ))}
                  </div>
                </div>

                <Button 
                  className={`w-full bg-gradient-to-r ${getPlanColor(plan.id)} hover:opacity-90 transition-opacity`}
                  onClick={() => onUpgrade(plan.id)}
                >
                  Upgrade to {plan.name}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-blue-800 text-sm">
            <Crown className="w-4 h-4" />
            <span className="font-medium">All plans include:</span>
          </div>
          <div className="mt-2 text-xs text-blue-700 grid grid-cols-2 gap-1">
            <div>• SSL certificates</div>
            <div>• Mobile responsive</div>
            <div>• 99.9% uptime</div>
            <div>• Regular backups</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PlanUpgradeDialog