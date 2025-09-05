
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Plug, Check, AlertCircle, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

interface Integration {
  id: string
  name: string
  description: string
  category: 'social' | 'ecommerce' | 'analytics' | 'email' | 'payment' | 'cms'
  icon: string
  isConnected: boolean
  requiredFields: Array<{
    name: string
    label: string
    type: 'text' | 'password' | 'url'
    required: boolean
  }>
}

export default function IntegrationsPanel() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Accept payments and manage subscriptions',
      category: 'payment',
      icon: '💳',
      isConnected: false,
      requiredFields: [
        { name: 'publishableKey', label: 'Publishable Key', type: 'text', required: true },
        { name: 'secretKey', label: 'Secret Key', type: 'password', required: true },
        { name: 'webhookSecret', label: 'Webhook Secret', type: 'password', required: false }
      ]
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Email marketing and automation',
      category: 'email',
      icon: '📧',
      isConnected: false,
      requiredFields: [
        { name: 'apiKey', label: 'API Key', type: 'password', required: true },
        { name: 'audience', label: 'Audience ID', type: 'text', required: true }
      ]
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Track website traffic and user behavior',
      category: 'analytics',
      icon: '📊',
      isConnected: false,
      requiredFields: [
        { name: 'trackingId', label: 'Tracking ID', type: 'text', required: true }
      ]
    },
    {
      id: 'shopify',
      name: 'Shopify',
      description: 'E-commerce platform integration',
      category: 'ecommerce',
      icon: '🛍️',
      isConnected: false,
      requiredFields: [
        { name: 'storeUrl', label: 'Store URL', type: 'url', required: true },
        { name: 'accessToken', label: 'Access Token', type: 'password', required: true }
      ]
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Social media integration and pixel tracking',
      category: 'social',
      icon: '📘',
      isConnected: false,
      requiredFields: [
        { name: 'appId', label: 'App ID', type: 'text', required: true },
        { name: 'pixelId', label: 'Pixel ID', type: 'text', required: false }
      ]
    },
    {
      id: 'contentful',
      name: 'Contentful',
      description: 'Headless CMS for content management',
      category: 'cms',
      icon: '📝',
      isConnected: false,
      requiredFields: [
        { name: 'spaceId', label: 'Space ID', type: 'text', required: true },
        { name: 'accessToken', label: 'Access Token', type: 'password', required: true }
      ]
    }
  ])

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async (integration: Integration) => {
    setIsConnecting(true)
    
    try {
      const response = await fetch('/api/integrations/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          integrationId: integration.id,
          credentials: formData
        })
      })

      if (response.ok) {
        setIntegrations(prev => 
          prev.map(int => 
            int.id === integration.id 
              ? { ...int, isConnected: true }
              : int
          )
        )
        toast.success(`${integration.name} connected successfully!`)
        setSelectedIntegration(null)
        setFormData({})
      } else {
        toast.error('Failed to connect integration')
      }
    } catch (error) {
      toast.error('Connection failed')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async (integrationId: string) => {
    try {
      await fetch(`/api/integrations/${integrationId}/disconnect`, {
        method: 'DELETE'
      })
      
      setIntegrations(prev => 
        prev.map(int => 
          int.id === integrationId 
            ? { ...int, isConnected: false }
            : int
        )
      )
      toast.success('Integration disconnected')
    } catch (error) {
      toast.error('Failed to disconnect')
    }
  }

  const categoryIcons = {
    social: '👥',
    ecommerce: '🛒',
    analytics: '📈',
    email: '✉️',
    payment: '💰',
    cms: '📚'
  }

  const categories = Array.from(new Set(integrations.map(int => int.category)))

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plug className="w-4 h-4" />
          Integrations
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>API Integrations</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="all" className="h-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {categoryIcons[category]} {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full overflow-y-auto">
              {integrations.map(integration => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                  onConnect={() => setSelectedIntegration(integration)}
                  onDisconnect={() => handleDisconnect(integration.id)}
                />
              ))}
            </div>
          </TabsContent>

          {categories.map(category => (
            <TabsContent key={category} value={category} className="h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full overflow-y-auto">
                {integrations
                  .filter(int => int.category === category)
                  .map(integration => (
                    <IntegrationCard
                      key={integration.id}
                      integration={integration}
                      onConnect={() => setSelectedIntegration(integration)}
                      onDisconnect={() => handleDisconnect(integration.id)}
                    />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Connection Modal */}
        {selectedIntegration && (
          <Dialog open={!!selectedIntegration} onOpenChange={() => setSelectedIntegration(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-2xl">{selectedIntegration.icon}</span>
                  Connect {selectedIntegration.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {selectedIntegration.requiredFields.map(field => (
                  <div key={field.name}>
                    <Label htmlFor={field.name}>
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <Input
                      id={field.name}
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        [field.name]: e.target.value
                      }))}
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                      required={field.required}
                    />
                  </div>
                ))}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Secure Connection</p>
                      <p>Your credentials are encrypted and stored securely. We never share your data with third parties.</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleConnect(selectedIntegration)}
                    disabled={isConnecting}
                    className="flex-1"
                  >
                    {isConnecting ? 'Connecting...' : 'Connect'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedIntegration(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  )
}

function IntegrationCard({ 
  integration, 
  onConnect, 
  onDisconnect 
}: {
  integration: Integration
  onConnect: () => void
  onDisconnect: () => void
}) {
  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{integration.icon}</span>
            <div>
              <CardTitle className="text-base">{integration.name}</CardTitle>
              <Badge variant="secondary" className="text-xs capitalize">
                {integration.category}
              </Badge>
            </div>
          </div>
          {integration.isConnected && (
            <Check className="w-5 h-5 text-green-500" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {integration.description}
        </p>
        
        <div className="flex gap-2">
          {integration.isConnected ? (
            <>
              <Button size="sm" variant="outline" className="flex-1">
                <ExternalLink className="w-3 h-3 mr-1" />
                Configure
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={onDisconnect}
              >
                Disconnect
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={onConnect} className="w-full">
              Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
