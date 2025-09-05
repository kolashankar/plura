'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  Zap,
  Play,
  Pause,
  Settings,
  Eye,
  Calendar,
  Activity,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

type AutomationWorkflow = {
  id: string
  name: string
  description: string
  type: string
  status: 'active' | 'inactive' | 'error'
  triggerType: string
  lastRun?: string
  nextRun?: string
  executionCount: number
  successRate: number
  createdBy: {
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
  configuration: string
  metrics: {
    totalRuns: number
    successfulRuns: number
    failedRuns: number
    avgExecutionTime: number
  }
}

const AutomationManager = () => {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selectedWorkflow, setSelectedWorkflow] = useState<AutomationWorkflow | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchWorkflows()
  }, [searchTerm, statusFilter, typeFilter])

  const fetchWorkflows = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (typeFilter !== 'all') params.append('type', typeFilter)
      
      const response = await fetch(`/api/admin/automation?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setWorkflows(data.workflows || [])
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch automation workflows',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleWorkflowStatus = async (workflowId: string, action: 'activate' | 'deactivate') => {
    try {
      const response = await fetch('/api/admin/automation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId, action })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Workflow ${action}d successfully`
        })
        fetchWorkflows()
      } else {
        throw new Error(`Failed to ${action} workflow`)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} workflow`,
        variant: 'destructive'
      })
    }
  }

  const executeWorkflow = async (workflowId: string) => {
    try {
      const response = await fetch('/api/admin/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId, action: 'execute' })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Workflow execution triggered'
        })
        fetchWorkflows()
      } else {
        throw new Error('Failed to execute workflow')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to execute workflow',
        variant: 'destructive'
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'inactive': return 'secondary'
      case 'error': return 'destructive'
      default: return 'outline'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'webhook': return 'default'
      case 'scheduled': return 'secondary'
      case 'trigger': return 'outline'
      case 'email': return 'default'
      default: return 'outline'
    }
  }

  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Workflows</p>
                <p className="text-2xl font-bold">{workflows.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-2xl font-bold">
                  {workflows.filter(w => w.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Errors</p>
                <p className="text-2xl font-bold">
                  {workflows.filter(w => w.status === 'error').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Avg Success Rate</p>
                <p className="text-2xl font-bold">
                  {Math.round(workflows.reduce((acc, w) => acc + w.successRate, 0) / workflows.length || 0)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workflows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-workflows"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-type-filter">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="webhook">Webhook</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="trigger">Trigger</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Workflows Table */}
      <Card>
        <CardHeader>
          <CardTitle>Automation Workflows ({filteredWorkflows.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workflow</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Executions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading workflows...
                  </TableCell>
                </TableRow>
              ) : filteredWorkflows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No workflows found
                  </TableCell>
                </TableRow>
              ) : (
                filteredWorkflows.map((workflow) => (
                  <TableRow key={workflow.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Zap className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium" data-testid={`text-workflow-name-${workflow.id}`}>
                            {workflow.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {workflow.description}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            By: {workflow.createdBy.name}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeColor(workflow.type)}>
                        {workflow.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(workflow.status)}>
                          {workflow.status}
                        </Badge>
                        {workflow.status === 'active' && (
                          <Activity className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{workflow.successRate}%</span>
                        </div>
                        <Progress value={workflow.successRate} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          {workflow.lastRun 
                            ? new Date(workflow.lastRun).toLocaleString()
                            : 'Never'
                          }
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{workflow.executionCount}</div>
                        <div className="text-xs text-muted-foreground">executions</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedWorkflow(workflow)}
                              data-testid={`button-view-workflow-${workflow.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Workflow Details: {selectedWorkflow?.name}</DialogTitle>
                              <DialogDescription>
                                Comprehensive workflow information and execution history
                              </DialogDescription>
                            </DialogHeader>
                            {selectedWorkflow && (
                              <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                  <TabsTrigger value="overview">Overview</TabsTrigger>
                                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                                  <TabsTrigger value="configuration">Configuration</TabsTrigger>
                                  <TabsTrigger value="history">History</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="overview" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <Card>
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-sm">Workflow Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2">
                                        <div>
                                          <span className="text-sm font-medium">Name:</span>
                                          <p className="text-sm text-muted-foreground">{selectedWorkflow.name}</p>
                                        </div>
                                        <div>
                                          <span className="text-sm font-medium">Description:</span>
                                          <p className="text-sm text-muted-foreground">{selectedWorkflow.description}</p>
                                        </div>
                                        <div>
                                          <span className="text-sm font-medium">Type:</span>
                                          <Badge variant={getTypeColor(selectedWorkflow.type)} className="ml-2">
                                            {selectedWorkflow.type}
                                          </Badge>
                                        </div>
                                        <div>
                                          <span className="text-sm font-medium">Status:</span>
                                          <Badge variant={getStatusColor(selectedWorkflow.status)} className="ml-2">
                                            {selectedWorkflow.status}
                                          </Badge>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card>
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-sm">Execution Details</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2">
                                        <div className="flex justify-between">
                                          <span className="text-sm">Last Run:</span>
                                          <span className="text-sm font-medium">
                                            {selectedWorkflow.lastRun ? 
                                              new Date(selectedWorkflow.lastRun).toLocaleString() : 
                                              'Never'
                                            }
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm">Next Run:</span>
                                          <span className="text-sm font-medium">
                                            {selectedWorkflow.nextRun ? 
                                              new Date(selectedWorkflow.nextRun).toLocaleString() : 
                                              'Not scheduled'
                                            }
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm">Total Executions:</span>
                                          <span className="text-sm font-medium">{selectedWorkflow.executionCount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm">Success Rate:</span>
                                          <span className="text-sm font-medium">{selectedWorkflow.successRate}%</span>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="metrics" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <Card>
                                      <CardContent className="p-6">
                                        <div className="flex items-center gap-2">
                                          <CheckCircle className="h-5 w-5 text-green-500" />
                                          <div>
                                            <p className="text-sm font-medium">Successful Runs</p>
                                            <p className="text-2xl font-bold">
                                              {selectedWorkflow.metrics.successfulRuns}
                                            </p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card>
                                      <CardContent className="p-6">
                                        <div className="flex items-center gap-2">
                                          <AlertTriangle className="h-5 w-5 text-red-500" />
                                          <div>
                                            <p className="text-sm font-medium">Failed Runs</p>
                                            <p className="text-2xl font-bold">
                                              {selectedWorkflow.metrics.failedRuns}
                                            </p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card>
                                      <CardContent className="p-6">
                                        <div className="flex items-center gap-2">
                                          <Clock className="h-5 w-5 text-blue-500" />
                                          <div>
                                            <p className="text-sm font-medium">Avg Execution Time</p>
                                            <p className="text-2xl font-bold">
                                              {selectedWorkflow.metrics.avgExecutionTime}ms
                                            </p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card>
                                      <CardContent className="p-6">
                                        <div className="flex items-center gap-2">
                                          <BarChart3 className="h-5 w-5 text-purple-500" />
                                          <div>
                                            <p className="text-sm font-medium">Total Runs</p>
                                            <p className="text-2xl font-bold">
                                              {selectedWorkflow.metrics.totalRuns}
                                            </p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="configuration" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-sm">Workflow Configuration</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <pre className="bg-muted p-4 rounded text-xs overflow-auto">
                                        {JSON.stringify(JSON.parse(selectedWorkflow.configuration || '{}'), null, 2)}
                                      </pre>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="history" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-sm">Execution History</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <p className="text-muted-foreground">
                                        Execution history would be displayed here with detailed logs and timestamps.
                                      </p>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                              </Tabs>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => executeWorkflow(workflow.id)}
                          data-testid={`button-execute-workflow-${workflow.id}`}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        
                        {workflow.status === 'active' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleWorkflowStatus(workflow.id, 'deactivate')}
                            data-testid={`button-pause-workflow-${workflow.id}`}
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleWorkflowStatus(workflow.id, 'activate')}
                            data-testid={`button-activate-workflow-${workflow.id}`}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          data-testid={`button-configure-workflow-${workflow.id}`}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default AutomationManager