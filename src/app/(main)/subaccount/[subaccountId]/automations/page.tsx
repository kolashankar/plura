'use client'

import React, { useState, useCallback, useRef } from 'react'
import { Plus, Play, Pause, Settings, BarChart3, Clock, Zap, Database, Mail, MessageSquare, Calendar, Code, Globe, Download, Upload, Search, Filter, X } from 'lucide-react'
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

const AutomationsPage = () => {
  const [activeTab, setActiveTab] = useState('workflows')
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)
  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [showNodePalette, setShowNodePalette] = useState(true)

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

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
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Connected Integrations</h2>
                <p className="text-muted-foreground">Manage your app connections</p>
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