'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Settings, 
  Plus, 
  Search, 
  Filter, 
  Copy, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Globe,
  Code,
  Webhook,
  Key,
  ShoppingCart,
  Zap,
  Mail,
  MessageSquare,
  BarChart3,
  Users,
  Star,
  Download,
  Upload,
  Refresh,
  Play,
  Pause,
  Activity
} from 'lucide-react'
import BlurPage from '@/components/global/blur-page'
import { useToast } from '@/hooks/use-toast'

// API Management Component
const APIManagement = () => {
  const { toast } = useToast()
  const [showApiKey, setShowApiKey] = useState(false)
  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: 'Production API Key',
      key: 'sk_live_4eC39HqLyjWDarjtT1zdp7dc',
      status: 'active',
      lastUsed: '2 hours ago',
      requests: 12450,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Development API Key',
      key: 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
      status: 'active',
      lastUsed: '1 day ago',
      requests: 3200,
      createdAt: '2024-01-10'
    },
    {
      id: 3,
      name: 'Staging API Key',
      key: 'sk_stage_4eC39HqLyjWDarjtT1zdp7dc',
      status: 'inactive',
      lastUsed: '1 week ago',
      requests: 890,
      createdAt: '2024-01-05'
    }
  ])

  const handleCopyApiKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast({
      title: 'API Key Copied',
      description: 'API key has been copied to clipboard'
    })
  }

  const handleRevokeKey = (id: number) => {
    setApiKeys(apiKeys.filter(key => key.id !== id))
    toast({
      title: 'API Key Revoked',
      description: 'API key has been successfully revoked'
    })
  }

  const maskApiKey = (key: string) => {
    return showApiKey ? key : `${key.substring(0, 12)}${'*'.repeat(20)}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">API Management</h2>
          <p className="text-muted-foreground">Manage your API keys and endpoints</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Generate API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate New API Key</DialogTitle>
              <DialogDescription>Create a new API key for your application</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="keyName">Key Name</Label>
                <Input id="keyName" placeholder="Enter a descriptive name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="environment">Environment</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="permissions">Permissions</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="read" />
                    <Label htmlFor="read">Read access</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="write" />
                    <Label htmlFor="write">Write access</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="delete" />
                    <Label htmlFor="delete">Delete access</Label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Generate Key</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total API Keys</p>
                <p className="text-2xl font-bold">{apiKeys.length}</p>
              </div>
              <Key className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Keys</p>
                <p className="text-2xl font-bold">{apiKeys.filter(k => k.status === 'active').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">{apiKeys.reduce((acc, key) => acc + key.requests, 0).toLocaleString()}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rate Limit</p>
                <p className="text-2xl font-bold">1000/hr</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>API Keys</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showApiKey ? 'Hide' : 'Show'} Keys
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requests</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {maskApiKey(apiKey.key)}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyApiKey(apiKey.key)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={apiKey.status === 'active' ? 'default' : 'secondary'}>
                      {apiKey.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{apiKey.requests.toLocaleString()}</TableCell>
                  <TableCell>{apiKey.lastUsed}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRevokeKey(apiKey.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// Webhooks Component
const Webhooks = () => {
  const { toast } = useToast()
  const [webhooks, setWebhooks] = useState([
    {
      id: 1,
      name: 'Order Notifications',
      url: 'https://api.example.com/webhooks/orders',
      events: ['order.created', 'order.updated', 'payment.completed'],
      status: 'active',
      lastTriggered: '5 minutes ago',
      successRate: 98.5,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'User Registration',
      url: 'https://api.example.com/webhooks/users',
      events: ['user.created', 'user.updated'],
      status: 'active',
      lastTriggered: '1 hour ago',
      successRate: 99.2,
      createdAt: '2024-01-10'
    },
    {
      id: 3,
      name: 'Analytics Events',
      url: 'https://api.example.com/webhooks/analytics',
      events: ['page.view', 'event.tracked'],
      status: 'paused',
      lastTriggered: '2 days ago',
      successRate: 85.3,
      createdAt: '2024-01-05'
    }
  ])

  const handleTestWebhook = (id: number) => {
    toast({
      title: 'Webhook Test Sent',
      description: 'Test payload has been sent to the webhook URL'
    })
  }

  const handleToggleWebhook = (id: number) => {
    setWebhooks(webhooks.map(webhook => 
      webhook.id === id 
        ? { ...webhook, status: webhook.status === 'active' ? 'paused' : 'active' }
        : webhook
    ))
    toast({
      title: 'Webhook Updated',
      description: 'Webhook status has been changed'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Webhooks</h2>
          <p className="text-muted-foreground">Configure webhooks for real-time event notifications</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Webhook</DialogTitle>
              <DialogDescription>Set up a webhook endpoint for event notifications</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="webhookName">Webhook Name</Label>
                  <Input id="webhookName" placeholder="Enter webhook name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Endpoint URL</Label>
                  <Input id="webhookUrl" placeholder="https://your-domain.com/webhook" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Events to Subscribe</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'order.created', 'order.updated', 'payment.completed',
                    'user.created', 'user.updated', 'page.view'
                  ].map((event) => (
                    <div key={event} className="flex items-center space-x-2">
                      <Switch id={event} />
                      <Label htmlFor={event} className="text-sm">{event}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secret">Webhook Secret (Optional)</Label>
                <Input id="secret" placeholder="Enter webhook secret for verification" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Create Webhook</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Webhooks</p>
                <p className="text-2xl font-bold">{webhooks.length}</p>
              </div>
              <Webhook className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{webhooks.filter(w => w.status === 'active').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Success Rate</p>
                <p className="text-2xl font-bold">{Math.round(webhooks.reduce((acc, w) => acc + w.successRate, 0) / webhooks.length)}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Events Today</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Webhook Endpoints</CardTitle>
          <CardDescription>Manage your webhook configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{webhook.name}</h4>
                      <Badge variant={webhook.status === 'active' ? 'default' : 'secondary'}>
                        {webhook.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{webhook.url}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Events: {webhook.events.length}</span>
                      <span>Success Rate: {webhook.successRate}%</span>
                      <span>Last triggered: {webhook.lastTriggered}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleTestWebhook(webhook.id)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleToggleWebhook(webhook.id)}
                    >
                      {webhook.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Third-party Connections Component
const ThirdPartyConnections = () => {
  const { toast } = useToast()
  const [connections, setConnections] = useState([
    {
      id: 1,
      name: 'Stripe',
      description: 'Payment processing and subscription management',
      category: 'Payments',
      status: 'connected',
      icon: '💳',
      features: ['Payment Processing', 'Subscriptions', 'Invoicing'],
      lastSync: '5 minutes ago'
    },
    {
      id: 2,
      name: 'Mailchimp',
      description: 'Email marketing and automation',
      category: 'Marketing',
      status: 'connected',
      icon: '✉️',
      features: ['Email Campaigns', 'Automation', 'Analytics'],
      lastSync: '1 hour ago'
    },
    {
      id: 3,
      name: 'Google Analytics',
      description: 'Website analytics and insights',
      category: 'Analytics',
      status: 'connected',
      icon: '📊',
      features: ['Traffic Analytics', 'Conversion Tracking', 'Reports'],
      lastSync: '2 hours ago'
    },
    {
      id: 4,
      name: 'Slack',
      description: 'Team communication and notifications',
      category: 'Communication',
      status: 'available',
      icon: '💬',
      features: ['Notifications', 'Team Chat', 'Integrations'],
      lastSync: null
    },
    {
      id: 5,
      name: 'Zapier',
      description: 'Workflow automation and app connections',
      category: 'Automation',
      status: 'available',
      icon: '⚡',
      features: ['Workflow Automation', 'App Connections', 'Triggers'],
      lastSync: null
    },
    {
      id: 6,
      name: 'HubSpot',
      description: 'CRM and marketing automation',
      category: 'CRM',
      status: 'available',
      icon: '🏢',
      features: ['Contact Management', 'Lead Tracking', 'Sales Pipeline'],
      lastSync: null
    }
  ])

  const handleConnect = (id: number) => {
    setConnections(connections.map(conn => 
      conn.id === id 
        ? { ...conn, status: 'connected', lastSync: 'Just now' }
        : conn
    ))
    toast({
      title: 'Integration Connected',
      description: 'Third-party service has been successfully connected'
    })
  }

  const handleDisconnect = (id: number) => {
    setConnections(connections.map(conn => 
      conn.id === id 
        ? { ...conn, status: 'available', lastSync: null }
        : conn
    ))
    toast({
      title: 'Integration Disconnected',
      description: 'Third-party service has been disconnected'
    })
  }

  const connectedIntegrations = connections.filter(c => c.status === 'connected')
  const availableIntegrations = connections.filter(c => c.status === 'available')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Third-party Connections</h2>
          <p className="text-muted-foreground">Connect and manage external services</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Browse More
          </Button>
          <Button variant="outline">
            <Refresh className="h-4 w-4 mr-2" />
            Sync All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Connected</p>
                <p className="text-2xl font-bold">{connectedIntegrations.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold">{availableIntegrations.length}</p>
              </div>
              <Globe className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{new Set(connections.map(c => c.category)).size}</p>
              </div>
              <Settings className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Connected Integrations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectedIntegrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{integration.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {integration.category}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-500">
                      Connected
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{integration.description}</p>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Last sync: {integration.lastSync}</p>
                    <div className="flex flex-wrap gap-1">
                      {integration.features.slice(0, 2).map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {integration.features.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{integration.features.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDisconnect(integration.id)}
                    >
                      Disconnect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Available Integrations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableIntegrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{integration.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {integration.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{integration.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {integration.features.map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleConnect(integration.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Marketplace Component
const Marketplace = () => {
  const { toast } = useToast()
  const [marketplace] = useState([
    {
      id: 1,
      name: 'Advanced Analytics Dashboard',
      description: 'Comprehensive analytics with real-time data visualization',
      category: 'Analytics',
      price: 29.99,
      rating: 4.8,
      downloads: 1250,
      developer: 'DataViz Pro',
      image: '/placeholder.jpg',
      features: ['Real-time Data', 'Custom Charts', 'Export Reports'],
      tags: ['analytics', 'dashboard', 'charts']
    },
    {
      id: 2,
      name: 'E-commerce Booster Pack',
      description: 'Essential tools for e-commerce optimization',
      category: 'E-commerce',
      price: 49.99,
      rating: 4.9,
      downloads: 890,
      developer: 'Commerce Tools',
      image: '/placeholder.jpg',
      features: ['SEO Tools', 'Conversion Optimization', 'A/B Testing'],
      tags: ['ecommerce', 'seo', 'optimization']
    },
    {
      id: 3,
      name: 'Social Media Automation',
      description: 'Automate your social media posting and engagement',
      category: 'Marketing',
      price: 19.99,
      rating: 4.6,
      downloads: 2100,
      developer: 'Social Boost',
      image: '/placeholder.jpg',
      features: ['Auto Posting', 'Engagement Tracking', 'Content Scheduling'],
      tags: ['social media', 'automation', 'marketing']
    },
    {
      id: 4,
      name: 'Customer Support Widget',
      description: 'Advanced customer support with live chat and ticketing',
      category: 'Support',
      price: 'Free',
      rating: 4.7,
      downloads: 5600,
      developer: 'Support Central',
      image: '/placeholder.jpg',
      features: ['Live Chat', 'Ticket System', 'Knowledge Base'],
      tags: ['support', 'chat', 'helpdesk']
    },
    {
      id: 5,
      name: 'Email Marketing Pro',
      description: 'Professional email marketing campaigns and automation',
      category: 'Marketing',
      price: 39.99,
      rating: 4.5,
      downloads: 1450,
      developer: 'Email Masters',
      image: '/placeholder.jpg',
      features: ['Campaign Builder', 'Automation', 'Analytics'],
      tags: ['email', 'marketing', 'automation']
    },
    {
      id: 6,
      name: 'Security Shield',
      description: 'Advanced security features and monitoring',
      category: 'Security',
      price: 59.99,
      rating: 4.9,
      downloads: 780,
      developer: 'SecureWeb',
      image: '/placeholder.jpg',
      features: ['Malware Protection', 'Security Monitoring', 'Backup'],
      tags: ['security', 'protection', 'monitoring']
    }
  ])

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['all', 'Analytics', 'E-commerce', 'Marketing', 'Support', 'Security']

  const filteredItems = marketplace.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const handleInstall = (id: number, name: string) => {
    toast({
      title: 'Integration Installed',
      description: `${name} has been successfully installed`
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Integration Marketplace</h2>
          <p className="text-muted-foreground">Discover and install powerful integrations</p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Submit Integration
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search integrations..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">by {item.developer}</p>
                </div>
                <Badge variant="outline">{item.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{item.description}</p>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{item.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <span>{item.downloads.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {item.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-lg font-bold">
                    {item.price === 'Free' ? 'Free' : `$${item.price}`}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                    >
                      Preview
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleInstall(item.id, item.name)}
                    >
                      Install
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

type Props = {
  params: { individualId: string }
}

const IntegrationsPage = ({ params }: Props) => {
  const [activeTab, setActiveTab] = useState('api')

  return (
    <BlurPage>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Integrations</h1>
            <p className="text-muted-foreground">Connect your platform with external services and APIs</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="api">API Management</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          </TabsList>

          <TabsContent value="api">
            <APIManagement />
          </TabsContent>

          <TabsContent value="webhooks">
            <Webhooks />
          </TabsContent>

          <TabsContent value="connections">
            <ThirdPartyConnections />
          </TabsContent>

          <TabsContent value="marketplace">
            <Marketplace />
          </TabsContent>
        </Tabs>
      </motion.div>
    </BlurPage>
  )
}

export default IntegrationsPage