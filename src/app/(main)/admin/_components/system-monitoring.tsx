'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Zap,
  Database,
  Globe,
  Server,
  BarChart3,
  Clock
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

type SystemMetrics = {
  cpu: {
    usage: number
    cores: number
    load: number[]
  }
  memory: {
    used: number
    total: number
    percentage: number
  }
  disk: {
    used: number
    total: number
    percentage: number
  }
  network: {
    inbound: number
    outbound: number
    connections: number
  }
  uptime: number
  timestamp: string
}

type ServiceStatus = {
  name: string
  status: 'healthy' | 'warning' | 'critical' | 'unknown'
  responseTime: number
  uptime: number
  lastCheck: string
  endpoint: string
  dependencies: string[]
}

type PerformanceMetrics = {
  responseTime: {
    average: number
    p95: number
    p99: number
  }
  throughput: {
    requests: number
    errors: number
    errorRate: number
  }
  database: {
    connections: number
    queries: number
    slowQueries: number
  }
  cache: {
    hitRate: number
    missRate: number
    evictions: number
  }
}

const SystemMonitoring = () => {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null)
  const [services, setServices] = useState<ServiceStatus[]>([])
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const { toast } = useToast()

  useEffect(() => {
    fetchSystemData()
    const interval = setInterval(fetchSystemData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchSystemData = async () => {
    try {
      setLoading(true)
      
      const [metricsResponse, servicesResponse, performanceResponse] = await Promise.all([
        fetch('/api/admin/system/metrics'),
        fetch('/api/admin/system/services'),
        fetch('/api/admin/system/performance')
      ])
      
      const [metricsData, servicesData, performanceData] = await Promise.all([
        metricsResponse.json(),
        servicesResponse.json(),
        performanceResponse.json()
      ])
      
      if (metricsResponse.ok) {
        setSystemMetrics(metricsData.metrics)
      }
      if (servicesResponse.ok) {
        setServices(servicesData.services)
      }
      if (performanceResponse.ok) {
        setPerformance(performanceData.performance)
      }
      
      setLastUpdate(new Date())
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch system data',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const restartService = async (serviceName: string) => {
    try {
      const response = await fetch('/api/admin/system/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceName, action: 'restart' })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `${serviceName} restart initiated`
        })
        fetchSystemData()
      } else {
        throw new Error('Failed to restart service')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to restart service',
        variant: 'destructive'
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'default'
      case 'warning': return 'secondary'
      case 'critical': return 'destructive'
      default: return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Monitor className="h-4 w-4 text-gray-500" />
    }
  }

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${minutes}m`
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Monitoring</h2>
          <p className="text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        
        <Button onClick={fetchSystemData} variant="outline" data-testid="button-refresh-metrics">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* System Health Overview */}
      {systemMetrics && (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">CPU Usage</p>
                  <p className="text-2xl font-bold">{systemMetrics.cpu.usage}%</p>
                  <Progress value={systemMetrics.cpu.usage} className="h-2 mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Memory Usage</p>
                  <p className="text-2xl font-bold">{systemMetrics.memory.percentage}%</p>
                  <Progress value={systemMetrics.memory.percentage} className="h-2 mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatBytes(systemMetrics.memory.used)} / {formatBytes(systemMetrics.memory.total)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Disk Usage</p>
                  <p className="text-2xl font-bold">{systemMetrics.disk.percentage}%</p>
                  <Progress value={systemMetrics.disk.percentage} className="h-2 mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatBytes(systemMetrics.disk.used)} / {formatBytes(systemMetrics.disk.total)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-orange-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Network</p>
                  <p className="text-2xl font-bold">{systemMetrics.network.connections}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ↑ {formatBytes(systemMetrics.network.outbound)}/s
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ↓ {formatBytes(systemMetrics.network.inbound)}/s
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Monitoring Tabs */}
      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Health Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {services.map((service) => (
                  <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <h4 className="font-medium" data-testid={`text-service-name-${service.name}`}>
                          {service.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">{service.endpoint}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-muted-foreground">
                            Response: {service.responseTime}ms
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Uptime: {service.uptime}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                      {service.status !== 'healthy' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => restartService(service.name)}
                          data-testid={`button-restart-service-${service.name}`}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          {performance && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Response Times</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Average:</span>
                      <span className="font-medium">{performance.responseTime.average}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">95th Percentile:</span>
                      <span className="font-medium">{performance.responseTime.p95}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">99th Percentile:</span>
                      <span className="font-medium">{performance.responseTime.p99}ms</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Throughput</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Requests/min:</span>
                      <span className="font-medium">{performance.throughput.requests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Errors/min:</span>
                      <span className="font-medium">{performance.throughput.errors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Error Rate:</span>
                      <span className="font-medium">{performance.throughput.errorRate}%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Database Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Active Connections:</span>
                      <span className="font-medium">{performance.database.connections}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Queries/min:</span>
                      <span className="font-medium">{performance.database.queries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Slow Queries:</span>
                      <span className="font-medium">{performance.database.slowQueries}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cache Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Hit Rate:</span>
                      <span className="font-medium">{performance.cache.hitRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Miss Rate:</span>
                      <span className="font-medium">{performance.cache.missRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Evictions/hour:</span>
                      <span className="font-medium">{performance.cache.evictions}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent System Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {/* Mock log entries */}
                <div className="flex items-center gap-3 p-2 text-sm border-l-4 border-green-500 bg-green-50">
                  <Clock className="h-4 w-4" />
                  <span className="text-muted-foreground">2024-03-15 14:30:25</span>
                  <span>System startup completed successfully</span>
                </div>
                <div className="flex items-center gap-3 p-2 text-sm border-l-4 border-blue-500 bg-blue-50">
                  <Clock className="h-4 w-4" />
                  <span className="text-muted-foreground">2024-03-15 14:28:12</span>
                  <span>Database connection pool refreshed</span>
                </div>
                <div className="flex items-center gap-3 p-2 text-sm border-l-4 border-yellow-500 bg-yellow-50">
                  <Clock className="h-4 w-4" />
                  <span className="text-muted-foreground">2024-03-15 14:25:08</span>
                  <span>High memory usage detected: 87%</span>
                </div>
                <div className="flex items-center gap-3 p-2 text-sm border-l-4 border-red-500 bg-red-50">
                  <Clock className="h-4 w-4" />
                  <span className="text-muted-foreground">2024-03-15 14:20:45</span>
                  <span>Failed authentication attempt from IP 192.168.1.100</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SystemMonitoring