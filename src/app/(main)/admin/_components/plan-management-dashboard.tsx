'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Settings, 
  CreditCard, 
  Users, 
  Zap, 
  Bot,
  Palette,
  BarChart3,
  Globe,
  Crown,
  Edit,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2
} from 'lucide-react'
import { toast } from 'sonner'
import { PRICING_PLANS, PricingPlan } from '@/app/api/billing/plans/route'

interface PlanFeatureControl {
  id: string
  planId: string
  feature: string
  isEnabled: boolean
  limit?: number
  description: string
  category: 'core' | 'ai' | 'automation' | 'marketplace' | 'analytics' | 'branding'
}

const FEATURE_DEFINITIONS = [
  {
    id: 'ai-components',
    name: 'AI Component Generation',
    description: 'Generate custom components using AI',
    category: 'ai' as const,
    icon: Bot,
    requiresLimit: true,
    limitField: 'aiCredits'
  },
  {
    id: 'automations',
    name: 'Automation Workflows',
    description: 'Create and manage automation workflows',
    category: 'automation' as const,
    icon: Zap,
    requiresLimit: true,
    limitField: 'automations'
  },
  {
    id: 'theme-selling',
    name: 'Theme Marketplace Selling',
    description: 'Sell custom themes in the marketplace',
    category: 'marketplace' as const,
    icon: Palette,
    requiresLimit: false
  },
  {
    id: 'white-label',
    name: 'White-label Branding',
    description: 'Remove platform branding and use custom branding',
    category: 'branding' as const,
    icon: Crown,
    requiresLimit: false
  },
  {
    id: 'analytics',
    name: 'Advanced Analytics',
    description: 'Access detailed analytics and reporting',
    category: 'analytics' as const,
    icon: BarChart3,
    requiresLimit: false
  },
  {
    id: 'custom-domains',
    name: 'Custom Domains',
    description: 'Use custom domains for websites',
    category: 'core' as const,
    icon: Globe,
    requiresLimit: true,
    limitField: 'customDomains'
  }
]

const PlanManagementDashboard = () => {
  const [plans, setPlans] = useState<PricingPlan[]>(PRICING_PLANS)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingPlan, setEditingPlan] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null)

  const updatePlanFeature = async (planId: string, feature: string, isEnabled: boolean, limit?: number) => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/plan-features', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, feature, isEnabled, limit })
      })

      if (response.ok) {
        // Update local state
        setPlans(prev => prev.map(plan => {
          if (plan.id === planId) {
            const updatedLimits = { ...plan.limits }
            
            switch (feature) {
              case 'ai-components':
                updatedLimits.aiCredits = isEnabled ? (limit || 1000) : 0
                break
              case 'automations':
                updatedLimits.automations = isEnabled ? (limit || -1) : 0
                break
              case 'theme-selling':
                updatedLimits.themeSelling = isEnabled
                break
              case 'white-label':
                updatedLimits.whiteLabel = isEnabled
                break
              case 'analytics':
                updatedLimits.analytics = isEnabled
                break
              case 'custom-domains':
                updatedLimits.customDomains = isEnabled ? (limit || 1) : 0
                break
            }
            
            return { ...plan, limits: updatedLimits }
          }
          return plan
        }))
        
        toast.success(`Feature ${isEnabled ? 'enabled' : 'disabled'} for ${planId} plan`)
      } else {
        toast.error('Failed to update plan feature')
      }
    } catch (error) {
      toast.error('Failed to update plan feature')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const updatePlanDetails = async (planId: string, updates: Partial<PricingPlan>) => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/plans', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, ...updates })
      })

      if (response.ok) {
        setPlans(prev => prev.map(plan => 
          plan.id === planId ? { ...plan, ...updates } : plan
        ))
        toast.success('Plan updated successfully')
        setEditingPlan(null)
      } else {
        toast.error('Failed to update plan')
      }
    } catch (error) {
      toast.error('Failed to update plan')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const getFeatureStatus = (plan: PricingPlan, featureId: string) => {
    switch (featureId) {
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
        return false
    }
  }

  const getFeatureLimit = (plan: PricingPlan, featureId: string) => {
    switch (featureId) {
      case 'ai-components':
        return plan.limits.aiCredits === -1 ? 'unlimited' : plan.limits.aiCredits
      case 'automations':
        return plan.limits.automations === -1 ? 'unlimited' : plan.limits.automations
      case 'custom-domains':
        return plan.limits.customDomains === -1 ? 'unlimited' : plan.limits.customDomains
      default:
        return 'N/A'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ai': return Bot
      case 'automation': return Zap
      case 'marketplace': return Palette
      case 'analytics': return BarChart3
      case 'branding': return Crown
      default: return Globe
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ai': return 'bg-purple-100 text-purple-800'
      case 'automation': return 'bg-blue-100 text-blue-800'
      case 'marketplace': return 'bg-green-100 text-green-800'
      case 'analytics': return 'bg-orange-100 text-orange-800'
      case 'branding': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {plans.map((plan) => (
          <Card key={plan.id} className="relative">
            {plan.popular && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <div className="text-2xl font-bold">
                ${plan.price}
                <span className="text-sm font-normal text-muted-foreground">/{plan.interval}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Funnels:</span>
                  <span className="font-medium">
                    {plan.limits.funnels === -1 ? '∞' : plan.limits.funnels}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>AI Credits:</span>
                  <span className="font-medium">
                    {plan.limits.aiCredits === -1 ? '∞' : plan.limits.aiCredits}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Automations:</span>
                  <span className="font-medium">
                    {plan.limits.automations === -1 ? '∞' : plan.limits.automations}
                  </span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setSelectedPlan(plan)}
                data-testid={`button-edit-${plan.id}`}
              >
                <Edit className="h-3 w-3 mr-2" />
                Edit Plan
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Plan Details Editor */}
      {selectedPlan && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Edit {selectedPlan.name} Plan</CardTitle>
                <p className="text-muted-foreground">
                  Modify plan features, limits, and pricing
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSelectedPlan(null)}
                data-testid="button-close-editor"
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="limits">Limits</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
              </TabsList>

              {/* Features Tab */}
              <TabsContent value="features" className="space-y-4">
                <div className="grid gap-4">
                  {FEATURE_DEFINITIONS.map((feature) => {
                    const CategoryIcon = getCategoryIcon(feature.category)
                    const isEnabled = getFeatureStatus(selectedPlan, feature.id)
                    const limit = getFeatureLimit(selectedPlan, feature.id)
                    
                    return (
                      <Card key={feature.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`p-2 rounded-lg ${getCategoryColor(feature.category)}`}>
                              <CategoryIcon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{feature.name}</h4>
                                <Badge variant="outline" className={getCategoryColor(feature.category)}>
                                  {feature.category}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {feature.description}
                              </p>
                              {feature.requiresLimit && (
                                <p className="text-xs text-muted-foreground">
                                  Current limit: {limit}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {feature.requiresLimit && isEnabled && (
                              <Input
                                type="number"
                                value={limit === 'unlimited' ? -1 : limit}
                                onChange={(e) => {
                                  const newLimit = parseInt(e.target.value)
                                  updatePlanFeature(selectedPlan.id, feature.id, true, newLimit)
                                }}
                                className="w-20"
                                placeholder="Limit"
                                data-testid={`input-limit-${feature.id}`}
                              />
                            )}
                            <Switch
                              checked={isEnabled}
                              onCheckedChange={(checked) => 
                                updatePlanFeature(selectedPlan.id, feature.id, checked)
                              }
                              disabled={saving}
                              data-testid={`switch-${feature.id}-${selectedPlan.id}`}
                            />
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              {/* Limits Tab */}
              <TabsContent value="limits" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="funnels">Funnels Limit</Label>
                    <Input
                      id="funnels"
                      type="number"
                      value={selectedPlan.limits.funnels === -1 ? '' : selectedPlan.limits.funnels}
                      placeholder="Unlimited (-1)"
                      onChange={(e) => {
                        const value = e.target.value === '' ? -1 : parseInt(e.target.value)
                        setSelectedPlan(prev => prev ? {
                          ...prev,
                          limits: { ...prev.limits, funnels: value }
                        } : null)
                      }}
                      data-testid="input-funnels-limit"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pages">Pages Limit</Label>
                    <Input
                      id="pages"
                      type="number"
                      value={selectedPlan.limits.pages === -1 ? '' : selectedPlan.limits.pages}
                      placeholder="Unlimited (-1)"
                      onChange={(e) => {
                        const value = e.target.value === '' ? -1 : parseInt(e.target.value)
                        setSelectedPlan(prev => prev ? {
                          ...prev,
                          limits: { ...prev.limits, pages: value }
                        } : null)
                      }}
                      data-testid="input-pages-limit"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="users">Users Limit</Label>
                    <Input
                      id="users"
                      type="number"
                      value={selectedPlan.limits.users === -1 ? '' : selectedPlan.limits.users}
                      placeholder="Unlimited (-1)"
                      onChange={(e) => {
                        const value = e.target.value === '' ? -1 : parseInt(e.target.value)
                        setSelectedPlan(prev => prev ? {
                          ...prev,
                          limits: { ...prev.limits, users: value }
                        } : null)
                      }}
                      data-testid="input-users-limit"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storage">Storage</Label>
                    <Input
                      id="storage"
                      value={selectedPlan.limits.storage}
                      placeholder="e.g., 10GB, unlimited"
                      onChange={(e) => {
                        setSelectedPlan(prev => prev ? {
                          ...prev,
                          limits: { ...prev.limits, storage: e.target.value }
                        } : null)
                      }}
                      data-testid="input-storage-limit"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bandwidth">Bandwidth</Label>
                    <Input
                      id="bandwidth"
                      value={selectedPlan.limits.bandwidth}
                      placeholder="e.g., 50GB, unlimited"
                      onChange={(e) => {
                        setSelectedPlan(prev => prev ? {
                          ...prev,
                          limits: { ...prev.limits, bandwidth: e.target.value }
                        } : null)
                      }}
                      data-testid="input-bandwidth-limit"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Support Priority</Label>
                    <Select 
                      value={selectedPlan.limits.priority} 
                      onValueChange={(value: 'low' | 'medium' | 'high') => {
                        setSelectedPlan(prev => prev ? {
                          ...prev,
                          limits: { ...prev.limits, priority: value }
                        } : null)
                      }}
                    >
                      <SelectTrigger data-testid="select-priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={() => updatePlanDetails(selectedPlan.id, selectedPlan)}
                  disabled={saving}
                  className="w-full"
                  data-testid="button-save-limits"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Limits'}
                </Button>
              </TabsContent>

              {/* Pricing Tab */}
              <TabsContent value="pricing" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (USD)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={selectedPlan.price}
                      onChange={(e) => {
                        setSelectedPlan(prev => prev ? {
                          ...prev,
                          price: parseFloat(e.target.value) || 0
                        } : null)
                      }}
                      data-testid="input-plan-price"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interval">Billing Interval</Label>
                    <Select 
                      value={selectedPlan.interval} 
                      onValueChange={(value: 'monthly' | 'yearly') => {
                        setSelectedPlan(prev => prev ? {
                          ...prev,
                          interval: value
                        } : null)
                      }}
                    >
                      <SelectTrigger data-testid="select-interval">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stripe-price-id">Stripe Price ID</Label>
                  <Input
                    id="stripe-price-id"
                    value={selectedPlan.stripePriceId || ''}
                    placeholder="price_xxxxxxxxxxxxx"
                    onChange={(e) => {
                      setSelectedPlan(prev => prev ? {
                        ...prev,
                        stripePriceId: e.target.value
                      } : null)
                    }}
                    data-testid="input-stripe-price-id"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="features">Plan Features</Label>
                  <Textarea
                    id="features"
                    value={selectedPlan.features.join('\n')}
                    placeholder="Enter features, one per line"
                    rows={6}
                    onChange={(e) => {
                      setSelectedPlan(prev => prev ? {
                        ...prev,
                        features: e.target.value.split('\n').filter(f => f.trim())
                      } : null)
                    }}
                    data-testid="textarea-plan-features"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="popular"
                    checked={selectedPlan.popular || false}
                    onCheckedChange={(checked) => {
                      setSelectedPlan(prev => prev ? {
                        ...prev,
                        popular: checked
                      } : null)
                    }}
                    data-testid="switch-plan-popular"
                  />
                  <Label htmlFor="popular">Mark as Popular Plan</Label>
                </div>

                <Button 
                  onClick={() => updatePlanDetails(selectedPlan.id, selectedPlan)}
                  disabled={saving}
                  className="w-full"
                  data-testid="button-save-pricing"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Pricing'}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Quick Feature Toggle Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Feature Matrix - Quick Toggle
          </CardTitle>
          <p className="text-muted-foreground">
            Quickly toggle features across all plans. Changes take effect immediately.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 border-b">Feature</th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="text-center p-2 border-b min-w-[120px]">
                      {plan.name}
                      <div className="text-xs text-muted-foreground font-normal">
                        ${plan.price}/{plan.interval}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURE_DEFINITIONS.map((feature) => {
                  const CategoryIcon = feature.icon
                  return (
                    <tr key={feature.id} className="border-b">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{feature.name}</div>
                            <div className="text-xs text-muted-foreground">{feature.description}</div>
                          </div>
                        </div>
                      </td>
                      {plans.map((plan) => {
                        const isEnabled = getFeatureStatus(plan, feature.id)
                        const limit = getFeatureLimit(plan, feature.id)
                        
                        return (
                          <td key={`${plan.id}-${feature.id}`} className="p-2 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <Switch
                                checked={isEnabled}
                                onCheckedChange={(checked) => 
                                  updatePlanFeature(plan.id, feature.id, checked)
                                }
                                disabled={saving}
                                data-testid={`matrix-switch-${feature.id}-${plan.id}`}
                              />
                              {feature.requiresLimit && isEnabled && (
                                <div className="text-xs text-muted-foreground">
                                  {limit}
                                </div>
                              )}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* User Impact Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Impact Preview
          </CardTitle>
          <p className="text-muted-foreground">
            Preview what users will see and access with each plan
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <Card key={`preview-${plan.id}`} className="border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{plan.name} User View</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1 text-sm">
                    <div className={`flex items-center gap-2 ${getFeatureStatus(plan, 'ai-components') ? 'text-green-600' : 'text-gray-400'}`}>
                      <Bot className="h-3 w-3" />
                      <span>AI Agent {getFeatureStatus(plan, 'ai-components') ? '✓' : '✗'}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${getFeatureStatus(plan, 'automations') ? 'text-green-600' : 'text-gray-400'}`}>
                      <Zap className="h-3 w-3" />
                      <span>Automations {getFeatureStatus(plan, 'automations') ? '✓' : '✗'}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${getFeatureStatus(plan, 'analytics') ? 'text-green-600' : 'text-gray-400'}`}>
                      <BarChart3 className="h-3 w-3" />
                      <span>Analytics {getFeatureStatus(plan, 'analytics') ? '✓' : '✗'}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${getFeatureStatus(plan, 'theme-selling') ? 'text-green-600' : 'text-gray-400'}`}>
                      <Palette className="h-3 w-3" />
                      <span>Theme Selling {getFeatureStatus(plan, 'theme-selling') ? '✓' : '✗'}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${getFeatureStatus(plan, 'white-label') ? 'text-green-600' : 'text-gray-400'}`}>
                      <Crown className="h-3 w-3" />
                      <span>White Label {getFeatureStatus(plan, 'white-label') ? '✓' : '✗'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PlanManagementDashboard