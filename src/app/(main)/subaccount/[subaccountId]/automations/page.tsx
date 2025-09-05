'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Plus, Play, Pause, Settings, BarChart3, Clock, Zap, Database, Mail, MessageSquare, Calendar, Code, Globe, Download, Upload, Search, Filter, X, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ConnectionMode
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

// Node Types
const nodeTypes = {
  trigger: 'trigger',
  action: 'action',
  condition: 'condition',
  delay: 'delay',
  webhook: 'webhook',
  email: 'email',
  social: 'social',
  database: 'database',
  api: 'api',
  transform: 'transform'
}

// Pre-built workflow templates
const workflowTemplates = [
  {
    id: 'social-media-scheduler',
    name: 'Social Media Scheduler',
    description: 'Automatically post to multiple social media platforms',
    category: 'Social Media',
    nodes: [
      { id: '1', type: 'trigger', position: { x: 100, y: 100 }, data: { label: 'Schedule Trigger', type: 'cron' } },
      { id: '2', type: 'social', position: { x: 300, y: 100 }, data: { label: 'Post to Facebook', platform: 'facebook' } },
      { id: '3', type: 'social', position: { x: 300, y: 200 }, data: { label: 'Post to Twitter', platform: 'twitter' } },
      { id: '4', type: 'social', position: { x: 300, y: 300 }, data: { label: 'Post to LinkedIn', platform: 'linkedin' } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e1-3', source: '1', target: '3' },
      { id: 'e1-4', source: '1', target: '4' }
    ]
  },
  {
    id: 'lead-nurturing',
    name: 'Lead Nurturing Campaign',
    description: 'Automated email sequences for new leads',
    category: 'Marketing',
    nodes: [
      { id: '1', type: 'trigger', position: { x: 100, y: 100 }, data: { label: 'New Lead', type: 'webhook' } },
      { id: '2', type: 'delay', position: { x: 300, y: 100 }, data: { label: 'Wait 1 Hour' } },
      { id: '3', type: 'email', position: { x: 500, y: 100 }, data: { label: 'Welcome Email' } },
      { id: '4', type: 'delay', position: { x: 700, y: 100 }, data: { label: 'Wait 3 Days' } },
      { id: '5', type: 'email', position: { x: 900, y: 100 }, data: { label: 'Follow-up Email' } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5' }
    ]
  },
  {
    id: 'order-processing',
    name: 'E-commerce Order Processing',
    description: 'Automate order fulfillment and customer notifications',
    category: 'E-commerce',
    nodes: [
      { id: '1', type: 'trigger', position: { x: 100, y: 100 }, data: { label: 'New Order', type: 'webhook' } },
      { id: '2', type: 'database', position: { x: 300, y: 100 }, data: { label: 'Update Inventory' } },
      { id: '3', type: 'email', position: { x: 500, y: 100 }, data: { label: 'Order Confirmation' } },
      { id: '4', type: 'api', position: { x: 700, y: 100 }, data: { label: 'Shipping API' } },
      { id: '5', type: 'email', position: { x: 900, y: 100 }, data: { label: 'Shipping Notification' } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5' }
    ]
  }
]

// Available integrations
const integrations = [
  { id: 'gmail', name: 'Gmail', icon: Mail, category: 'Email', connected: true },
  { id: 'outlook', name: 'Outlook', icon: Mail, category: 'Email', connected: false },
  { id: 'facebook', name: 'Facebook', icon: Globe, category: 'Social', connected: true },
  { id: 'twitter', name: 'Twitter', icon: MessageSquare, category: 'Social', connected: false },
  { id: 'linkedin', name: 'LinkedIn', icon: Globe, category: 'Social', connected: true },
  { id: 'slack', name: 'Slack', icon: MessageSquare, category: 'Communication', connected: true },
  { id: 'shopify', name: 'Shopify', icon: Globe, category: 'E-commerce', connected: false },
  { id: 'stripe', name: 'Stripe', icon: Database, category: 'Payment', connected: true },
  { id: 'notion', name: 'Notion', icon: Database, category: 'Productivity', connected: false },
  { id: 'airtable', name: 'Airtable', icon: Database, category: 'Database', connected: true }
]

const AutomationsPage = ({ params }: { params: { subaccountId: string } }) => {
  const [activeTab, setActiveTab] = useState('workflows')
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)
  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [showNodePalette, setShowNodePalette] = useState(true)
  
  // n8n Integration State
  const [n8nIntegrations, setN8nIntegrations] = useState<any[]>([])
  const [showN8nDialog, setShowN8nDialog] = useState(false)
  const [n8nForm, setN8nForm] = useState({
    name: '',
    webhookUrl: '',
    workflowType: 'email'
  })
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  // Load n8n integrations on component mount
  useEffect(() => {
    fetchN8nIntegrations()
  }, [params?.subaccountId])

  const fetchN8nIntegrations = async () => {
    try {
      const response = await fetch(`/api/integrations/n8n?subAccountId=${params?.subaccountId}`)
      const data = await response.json()
      
      if (data.success) {
        setN8nIntegrations(data.integrations)
      }
    } catch (error) {
      console.error('Failed to fetch n8n integrations:', error)
    }
  }

  const handleAddN8nIntegration = async () => {
    if (!n8nForm.name || !n8nForm.webhookUrl) {
      setTestResult({ success: false, message: 'Please fill in all required fields' })
      return
    }

    try {
      const response = await fetch('/api/integrations/n8n', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...n8nForm,
          subAccountId: params?.subaccountId
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setTestResult({ success: true, message: 'n8n workflow connected successfully!' })
        setN8nForm({ name: '', webhookUrl: '', workflowType: 'email' })
        setShowN8nDialog(false)
        fetchN8nIntegrations()
      } else {
        setTestResult({ success: false, message: data.error || 'Failed to connect n8n workflow' })
      }
    } catch (error) {
      console.error('Failed to add n8n integration:', error)
      setTestResult({ success: false, message: 'Failed to connect n8n workflow' })
    }
  }

  const testN8nConnection = async () => {
    if (!n8nForm.webhookUrl) {
      setTestResult({ success: false, message: 'Please enter a webhook URL first' })
      return
    }

    setIsTestingConnection(true)
    setTestResult(null)

    try {
      const response = await fetch(n8nForm.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test: true,
          source: 'website-builder-test',
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        setTestResult({ success: true, message: 'Connection successful! Webhook is reachable.' })
      } else {
        setTestResult({ success: false, message: `Connection failed: ${response.status} ${response.statusText}` })
      }
    } catch (error) {
      setTestResult({ success: false, message: 'Connection failed: Unable to reach webhook URL' })
    } finally {
      setIsTestingConnection(false)
    }
  }

  // Node palette items
  const nodePaletteItems = [
    { type: 'trigger', label: 'Webhook Trigger', icon: Zap, color: 'bg-green-500' },
    { type: 'trigger', label: 'Schedule Trigger', icon: Clock, color: 'bg-blue-500' },
    { type: 'email', label: 'Send Email', icon: Mail, color: 'bg-purple-500' },
    { type: 'social', label: 'Social Post', icon: Globe, color: 'bg-pink-500' },
    { type: 'database', label: 'Database Action', icon: Database, color: 'bg-orange-500' },
    { type: 'api', label: 'API Call', icon: Code, color: 'bg-indigo-500' },
    { type: 'condition', label: 'If/Else', icon: Settings, color: 'bg-yellow-500' },
    { type: 'delay', label: 'Delay/Wait', icon: Clock, color: 'bg-gray-500' }
  ]

  // Custom node component
  const CustomNode = ({ data, type }: { data: any, type: string }) => {
    const getNodeColor = (nodeType: string) => {
      const colors: { [key: string]: string } = {
        trigger: 'border-green-500 bg-green-50',
        action: 'border-blue-500 bg-blue-50',
        condition: 'border-yellow-500 bg-yellow-50',
        delay: 'border-gray-500 bg-gray-50',
        email: 'border-purple-500 bg-purple-50',
        social: 'border-pink-500 bg-pink-50',
        database: 'border-orange-500 bg-orange-50',
        api: 'border-indigo-500 bg-indigo-50'
      }
      return colors[nodeType] || 'border-gray-300 bg-white'
    }

    return (
      <div className={`px-4 py-2 shadow-md rounded-md border-2 ${getNodeColor(type)} min-w-[150px]`}>
        <div className="text-sm font-medium">{data.label}</div>
        {data.description && <div className="text-xs text-gray-600">{data.description}</div>}
      </div>
    )
  }

  const addNodeToCanvas = (nodeType: string, label: string) => {
    const newNode: Node = {
      id: `${Date.now()}`,
      type: 'default',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { 
        label: label,
        type: nodeType,
        render: (data: any) => <CustomNode data={data} type={nodeType} />
      }
    }
    setNodes((nds) => nds.concat(newNode))
  }

  const loadTemplate = (template: any) => {
    setNodes(template.nodes)
    setEdges(template.edges)
    setShowTemplateDialog(false)
  }

  const filteredTemplates = workflowTemplates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || template.category.toLowerCase() === selectedCategory.toLowerCase())
  )

  const categories = ['all', ...Array.from(new Set(workflowTemplates.map(t => t.category)))]

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Automation Workflows</h1>
            <p className="text-muted-foreground">Create and manage automated workflows</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Templates
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Workflow Templates</DialogTitle>
                  <DialogDescription>Choose from pre-built automation templates</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Input 
                      placeholder="Search templates..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <ScrollArea className="h-96">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredTemplates.map(template => (
                        <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{template.name}</CardTitle>
                                <Badge variant="secondary" className="mt-1">{template.category}</Badge>
                              </div>
                              <Button size="sm" onClick={() => loadTemplate(template)}>
                                Use Template
                              </Button>
                            </div>
                            <CardDescription>{template.description}</CardDescription>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Workflow
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="builder">Builder</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowTemplates.map(workflow => (
              <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{workflow.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">{workflow.category}</Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">
                        {isWorkflowRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{workflow.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <Badge variant={isWorkflowRunning ? "default" : "secondary"}>
                        {isWorkflowRunning ? "Running" : "Stopped"}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Run:</span>
                      <span className="text-muted-foreground">2 hours ago</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Success Rate:</span>
                      <span className="text-green-600">98.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="builder" className="flex-1 flex">
          {/* Node Palette */}
          {showNodePalette && (
            <div className="w-64 border-r bg-muted/30 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Node Palette</h3>
                <Button size="sm" variant="ghost" onClick={() => setShowNodePalette(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <ScrollArea className="h-full">
                <div className="space-y-2">
                  {nodePaletteItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => addNodeToCanvas(item.type, item.label)}
                    >
                      <div className={`p-2 rounded ${item.color} text-white`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Workflow Canvas */}
          <div className="flex-1 relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              connectionMode={ConnectionMode.Loose}
              fitView
            >
              <Controls />
              <MiniMap />
              <Background variant="dots" gap={12} size={1} />
            </ReactFlow>

            {!showNodePalette && (
              <Button
                className="absolute top-4 left-4 z-10"
                variant="outline"
                size="sm"
                onClick={() => setShowNodePalette(true)}
              >
                Show Palette
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="flex-1 p-6">
          <div className="space-y-6">
            {/* n8n Integration Section */}
            <div className="border rounded-lg p-6 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    n8n Workflow Integration
                  </h3>
                  <p className="text-sm text-muted-foreground">Connect your deployed n8n workflows to power your automations</p>
                </div>
                <Dialog open={showN8nDialog} onOpenChange={setShowN8nDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Connect n8n Workflow
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Connect n8n Workflow</DialogTitle>
                      <DialogDescription>
                        Add your deployed n8n workflow webhook URL to integrate with your automations
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="n8n-name">Workflow Name</Label>
                        <Input
                          id="n8n-name"
                          placeholder="e.g., Email Marketing Workflow"
                          value={n8nForm.name}
                          onChange={(e) => setN8nForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="n8n-type">Automation Type</Label>
                        <Select value={n8nForm.workflowType} onValueChange={(value) => setN8nForm(prev => ({ ...prev, workflowType: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email Marketing</SelectItem>
                            <SelectItem value="social">Social Media</SelectItem>
                            <SelectItem value="crm">CRM Integration</SelectItem>
                            <SelectItem value="analytics">Analytics</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="n8n-webhook">Webhook URL</Label>
                        <Input
                          id="n8n-webhook"
                          placeholder="https://your-n8n-instance.onrender.com/webhook/..."
                          value={n8nForm.webhookUrl}
                          onChange={(e) => setN8nForm(prev => ({ ...prev, webhookUrl: e.target.value }))}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Get this URL from your n8n workflow webhook trigger
                        </p>
                      </div>

                      {testResult && (
                        <div className={`flex items-center gap-2 p-3 rounded-lg ${testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {testResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                          <span className="text-sm">{testResult.message}</span>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={testN8nConnection}
                          disabled={isTestingConnection || !n8nForm.webhookUrl}
                          className="flex-1"
                        >
                          {isTestingConnection ? (
                            <>
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                              Testing...
                            </>
                          ) : (
                            <>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Test Connection
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={handleAddN8nIntegration}
                          disabled={!n8nForm.name || !n8nForm.webhookUrl}
                          className="flex-1"
                        >
                          Connect Workflow
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* n8n Integrations List */}
              {n8nIntegrations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {n8nIntegrations.map(integration => (
                    <Card key={integration.id} className="border-blue-200">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-blue-600" />
                            <div>
                              <CardTitle className="text-sm">{integration.name}</CardTitle>
                              <Badge variant="outline" className="text-xs">n8n workflow</Badge>
                            </div>
                          </div>
                          <Switch checked={integration.isActive} />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Status:</span>
                          <Badge variant={integration.isActive ? "default" : "secondary"}>
                            {integration.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Type:</span>
                          <span className="text-muted-foreground capitalize">{integration.name.includes('email') ? 'Email' : integration.name.includes('social') ? 'Social' : 'Other'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Added:</span>
                          <span className="text-muted-foreground">{new Date(integration.createdAt).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Zap className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No n8n workflows connected yet</p>
                  <p className="text-sm">Connect your deployed n8n workflows to get started</p>
                </div>
              )}
            </div>

            {/* Standard Integrations Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Standard Integrations</h2>
                  <p className="text-muted-foreground">Built-in platform connections</p>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Integration
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {integrations.map(integration => (
                  <Card key={integration.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <integration.icon className="w-8 h-8" />
                          <div>
                            <CardTitle className="text-base">{integration.name}</CardTitle>
                            <Badge variant="outline" className="text-xs">{integration.category}</Badge>
                          </div>
                        </div>
                        <Switch checked={integration.connected} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          {integration.connected ? 'Connected' : 'Not Connected'}
                        </span>
                        <Button size="sm" variant="outline">
                          {integration.connected ? 'Configure' : 'Connect'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.5%</div>
                <p className="text-xs text-muted-foreground">+0.2% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,345</div>
                <p className="text-xs text-muted-foreground">+180 from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156h</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Workflow Performance</CardTitle>
              <CardDescription>Performance metrics for your automated workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflowTemplates.slice(0, 5).map((workflow, index) => (
                  <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{workflow.name}</h4>
                      <p className="text-sm text-muted-foreground">{workflow.category}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">156 runs</div>
                        <div className="text-xs text-muted-foreground">Last 30 days</div>
                      </div>
                      <Badge variant={index % 2 === 0 ? "default" : "secondary"}>
                        {index % 2 === 0 ? "Active" : "Paused"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AutomationsPage