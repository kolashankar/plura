'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Scaling,
  TrendingUp,
  TrendingDown,
  Cpu,
  Database,
  Globe,
  Zap,
  Settings,
  Activity,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Server,
  HardDrive
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type AutoScalingConfig = {
  id: string
  name: string
  service: string
  enabled: boolean
  minInstances: number
  maxInstances: number
  currentInstances: number
  targetCpuUtilization: number
  targetMemoryUtilization: number
  scaleUpCooldown: number
  scaleDownCooldown: number
  lastScalingEvent?: {
    type: 'scale_up' | 'scale_down'
    timestamp: string
    reason: string
    fromInstances: number
    toInstances: number
  }
}

type PerformanceMetrics = {
  responseTime: {
    current: number
    average: number
    trend: 'up' | 'down' | 'stable'
  }
  throughput: {
    current: number
    average: number
    trend: 'up' | 'down' | 'stable'
  }
  errorRate: {
    current: number
    average: number
    trend: 'up' | 'down' | 'stable'
  }
  activeUsers: {
    current: number
    peak24h: number
    trend: 'up' | 'down' | 'stable'
  }
}

type ResourceUsage = {
  cpu: {
    current: number
    average: number
    peak: number
  }
  memory: {
    current: number
    average: number
    peak: number
  }
  disk: {
    current: number
    average: number
    peak: number
  }
  network: {
    inbound: number
    outbound: number
    bandwidth: number
  }
}

type LoadBalancer = {
  id: string
  name: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  algorithm: string
  backends: {
    id: string
    name: string
    status: 'healthy' | 'unhealthy'
    responseTime: number
    requestsPerSecond: number
  }[]
  requestsPerSecond: number
  healthyBackends: number
  totalBackends: number
}

const ScalabilityManagement = () => {
  const [autoScalingConfigs, setAutoScalingConfigs] = useState<AutoScalingConfig[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null)
  const [resourceUsage, setResourceUsage] = useState<ResourceUsage | null>(null)
  const [loadBalancers, setLoadBalancers] = useState<LoadBalancer[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedConfig, setSelectedConfig] = useState<AutoScalingConfig | null>(null)
  const [showConfigDialog, setShowConfigDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchScalabilityData()
    const interval = setInterval(fetchScalabilityData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchScalabilityData = async () => {
    try {
      setLoading(true)
      
      const [configsResponse, metricsResponse, resourcesResponse, loadBalancersResponse] = await Promise.all([
        fetch('/api/admin/scalability/configs'),
        fetch('/api/admin/scalability/metrics'),
        fetch('/api/admin/scalability/resources'),
        fetch('/api/admin/scalability/load-balancers')
      ])
      
      const [configsData, metricsData, resourcesData, loadBalancersData] = await Promise.all([
        configsResponse.json(),
        metricsResponse.json(),
        resourcesResponse.json(),
        loadBalancersResponse.json()
      ])
      
      if (configsResponse.ok) {
        setAutoScalingConfigs(configsData.configs)
      }
      if (metricsResponse.ok) {
        setPerformanceMetrics(metricsData.metrics)
      }
      if (resourcesResponse.ok) {
        setResourceUsage(resourcesData.resources)
      }
      if (loadBalancersResponse.ok) {
        setLoadBalancers(loadBalancersData.loadBalancers)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch scalability data',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateAutoScalingConfig = async (configId: string, updates: Partial<AutoScalingConfig>) => {
    try {
      const response = await fetch('/api/admin/scalability/configs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configId, ...updates })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Auto-scaling configuration updated successfully'
        })
        fetchScalabilityData()
      } else {
        throw new Error('Failed to update auto-scaling configuration')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update auto-scaling configuration',
        variant: 'destructive'
      })
    }
  }

  const triggerManualScaling = async (configId: string, action: 'scale_up' | 'scale_down') => {
    try {
      const response = await fetch('/api/admin/scalability/manual-scale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configId, action })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Manual ${action.replace('_', ' ')} initiated successfully`
        })
        fetchScalabilityData()
      } else {
        throw new Error(`Failed to ${action.replace('_', ' ')}`)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action.replace('_', ' ')}`,
        variant: 'destructive'
      })
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />
      default: return <Activity className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'default'
      case 'degraded': return 'secondary'
      case 'unhealthy': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      {performanceMetrics && (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Response Time</p>
                    <p className="text-2xl font-bold">{performanceMetrics.responseTime.current}ms</p>
                  </div>
                </div>
                {getTrendIcon(performanceMetrics.responseTime.trend)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Throughput</p>
                    <p className="text-2xl font-bold">{performanceMetrics.throughput.current}/s</p>
                  </div>
                </div>
                {getTrendIcon(performanceMetrics.throughput.trend)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">Error Rate</p>
                    <p className="text-2xl font-bold">{performanceMetrics.errorRate.current}%</p>
                  </div>
                </div>
                {getTrendIcon(performanceMetrics.errorRate.trend)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">Active Users</p>
                    <p className="text-2xl font-bold">{performanceMetrics.activeUsers.current}</p>
                  </div>
                </div>
                {getTrendIcon(performanceMetrics.activeUsers.trend)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Scalability Management Tabs */}
      <Tabs defaultValue="auto-scaling" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-[600px] grid-cols-4">
            <TabsTrigger value="auto-scaling">Auto-Scaling</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="load-balancing">Load Balancing</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>
          
          <Button onClick={fetchScalabilityData} variant="outline" data-testid="button-refresh-scalability">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        <TabsContent value="auto-scaling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Auto-Scaling Configurations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {autoScalingConfigs.map((config) => (
                  <div key={config.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Scaling className="h-6 w-6 text-primary" />
                        <div>
                          <h4 className="font-medium" data-testid={`text-config-name-${config.id}`}>
                            {config.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">{config.service}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-muted-foreground">
                              Instances: {config.currentInstances} / {config.maxInstances}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              CPU Target: {config.targetCpuUtilization}%
                            </span>
                            <Badge variant={config.enabled ? 'default' : 'secondary'}>
                              {config.enabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="text-right mr-4">
                        <div className="text-lg font-bold">{config.currentInstances}</div>
                        <div className="text-xs text-muted-foreground">instances</div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => triggerManualScaling(config.id, 'scale_up')}
                        disabled={config.currentInstances >= config.maxInstances}
                        data-testid={`button-scale-up-${config.id}`}
                      >
                        <TrendingUp className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => triggerManualScaling(config.id, 'scale_down')}
                        disabled={config.currentInstances <= config.minInstances}
                        data-testid={`button-scale-down-${config.id}`}
                      >
                        <TrendingDown className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedConfig(config)}
                        data-testid={`button-configure-${config.id}`}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-4">
          {resourceUsage && (
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">CPU Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Current</span>
                      <span>{resourceUsage.cpu.current}%</span>
                    </div>
                    <Progress value={resourceUsage.cpu.current} className="h-3" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Average:</span>
                      <span className="ml-2 font-medium">{resourceUsage.cpu.average}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Peak:</span>
                      <span className="ml-2 font-medium">{resourceUsage.cpu.peak}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Memory Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Current</span>
                      <span>{resourceUsage.memory.current}%</span>
                    </div>
                    <Progress value={resourceUsage.memory.current} className="h-3" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Average:</span>
                      <span className="ml-2 font-medium">{resourceUsage.memory.average}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Peak:</span>
                      <span className="ml-2 font-medium">{resourceUsage.memory.peak}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Disk Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Current</span>
                      <span>{resourceUsage.disk.current}%</span>
                    </div>
                    <Progress value={resourceUsage.disk.current} className="h-3" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Average:</span>
                      <span className="ml-2 font-medium">{resourceUsage.disk.average}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Peak:</span>
                      <span className="ml-2 font-medium">{resourceUsage.disk.peak}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Network Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Inbound:</span>
                      <span className="font-medium">{resourceUsage.network.inbound} MB/s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Outbound:</span>
                      <span className="font-medium">{resourceUsage.network.outbound} MB/s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Bandwidth:</span>
                      <span className="font-medium">{resourceUsage.network.bandwidth} MB/s</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="load-balancing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Load Balancers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {loadBalancers.map((lb) => (
                  <div key={lb.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Globe className="h-6 w-6 text-primary" />
                        <div>
                          <h4 className="font-medium" data-testid={`text-lb-name-${lb.id}`}>
                            {lb.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Algorithm: {lb.algorithm}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Badge variant={getStatusColor(lb.status)}>
                          {lb.status}
                        </Badge>
                        <div className="text-right">
                          <div className="font-medium">{lb.requestsPerSecond} req/s</div>
                          <div className="text-sm text-muted-foreground">
                            {lb.healthyBackends}/{lb.totalBackends} healthy
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {lb.backends.map((backend) => (
                        <div key={backend.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-2">
                            <Server className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium text-sm">{backend.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {backend.responseTime}ms • {backend.requestsPerSecond} req/s
                              </div>
                            </div>
                          </div>
                          <Badge variant={backend.status === 'healthy' ? 'default' : 'destructive'} className="text-xs">
                            {backend.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="optimization" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 border-l-4 border-blue-500 bg-blue-50">
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Optimize Database Queries</p>
                      <p className="text-xs text-muted-foreground">
                        Consider adding indexes for frequently queried columns
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border-l-4 border-green-500 bg-green-50">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Enable Caching</p>
                      <p className="text-xs text-muted-foreground">
                        Redis caching can reduce response times by 60%
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border-l-4 border-orange-500 bg-orange-50">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Scale Up Web Servers</p>
                      <p className="text-xs text-muted-foreground">
                        CPU usage consistently above 80% during peak hours
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Cost Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 border-l-4 border-purple-500 bg-purple-50">
                    <Zap className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Right-size Instances</p>
                      <p className="text-xs text-muted-foreground">
                        Some instances are under-utilized, consider downsizing
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border-l-4 border-green-500 bg-green-50">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Use Spot Instances</p>
                      <p className="text-xs text-muted-foreground">
                        Save up to 70% on compute costs for non-critical workloads
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border-l-4 border-blue-500 bg-blue-50">
                    <HardDrive className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Optimize Storage</p>
                      <p className="text-xs text-muted-foreground">
                        Archive old data to reduce storage costs
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ScalabilityManagement