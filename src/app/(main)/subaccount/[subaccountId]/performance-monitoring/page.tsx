'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Activity, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Globe,
  Server,
  Database,
  Wifi,
  Monitor,
  Smartphone,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Eye,
  Settings,
  Bell,
  Download,
  Upload,
  Cpu,
  HardDrive,
  MemoryStick,
  Shield,
  AlertCircle,
  Target,
  Timer
} from 'lucide-react'
import BlurPage from '@/components/global/blur-page'
import { useToast } from '@/hooks/use-toast'

// Real-time Monitoring Component
const RealTimeMonitoring = () => {
  const [metrics, setMetrics] = useState({
    uptime: 99.97,
    responseTime: 142,
    throughput: 1847,
    errorRate: 0.03,
    cpuUsage: 72,
    memoryUsage: 68,
    diskUsage: 45,
    networkIn: 125.7,
    networkOut: 89.3
  })

  const [services] = useState([
    {
      name: 'Web Application',
      status: 'healthy',
      responseTime: 145,
      uptime: 99.98,
      location: 'US East',
      lastCheck: '30 seconds ago'
    },
    {
      name: 'API Gateway',
      status: 'healthy',
      responseTime: 89,
      uptime: 99.99,
      location: 'US West',
      lastCheck: '45 seconds ago'
    },
    {
      name: 'Database',
      status: 'warning',
      responseTime: 234,
      uptime: 99.95,
      location: 'EU Central',
      lastCheck: '1 minute ago'
    },
    {
      name: 'CDN',
      status: 'healthy',
      responseTime: 67,
      uptime: 100.0,
      location: 'Global',
      lastCheck: '15 seconds ago'
    }
  ])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'healthy': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'critical': return 'bg-red-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'critical': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'offline': return <AlertCircle className="h-4 w-4 text-gray-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        responseTime: Math.floor(Math.random() * 50) + 120,
        throughput: Math.floor(Math.random() * 500) + 1500,
        cpuUsage: Math.floor(Math.random() * 20) + 60,
        memoryUsage: Math.floor(Math.random() * 15) + 60,
        networkIn: Math.random() * 50 + 100,
        networkOut: Math.random() * 30 + 70
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Real-time Monitoring</h2>
          <p className="text-muted-foreground">Live system performance and health metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Alerts
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="text-2xl font-bold">{metrics.uptime}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+0.01%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Time</p>
                <p className="text-2xl font-bold">{metrics.responseTime}ms</p>
              </div>
              <Timer className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">-12ms</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Throughput</p>
                <p className="text-2xl font-bold">{metrics.throughput}/min</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+5.2%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Error Rate</p>
                <p className="text-2xl font-bold">{metrics.errorRate}%</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">-0.01%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CPU Usage</p>
                <p className="text-2xl font-bold">{metrics.cpuUsage}%</p>
              </div>
              <Cpu className="h-8 w-8 text-red-500" />
            </div>
            <div className="w-full h-2 bg-muted rounded mt-2">
              <div 
                className="h-full bg-red-500 rounded transition-all duration-300"
                style={{ width: `${metrics.cpuUsage}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Resources</CardTitle>
            <CardDescription>Real-time resource utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">CPU Usage</span>
                  </div>
                  <span className="text-sm font-bold">{metrics.cpuUsage}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded">
                  <div 
                    className="h-full bg-blue-500 rounded transition-all duration-300"
                    style={{ width: `${metrics.cpuUsage}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MemoryStick className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Memory Usage</span>
                  </div>
                  <span className="text-sm font-bold">{metrics.memoryUsage}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded">
                  <div 
                    className="h-full bg-green-500 rounded transition-all duration-300"
                    style={{ width: `${metrics.memoryUsage}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Disk Usage</span>
                  </div>
                  <span className="text-sm font-bold">{metrics.diskUsage}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded">
                  <div 
                    className="h-full bg-purple-500 rounded transition-all duration-300"
                    style={{ width: `${metrics.diskUsage}%` }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Download className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Network In</span>
                  </div>
                  <p className="text-lg font-bold">{metrics.networkIn.toFixed(1)} MB/s</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Upload className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Network Out</span>
                  </div>
                  <p className="text-lg font-bold">{metrics.networkOut.toFixed(1)} MB/s</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Health</CardTitle>
            <CardDescription>Status of all monitored services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`} />
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">{service.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(service.status)}
                      <span className="text-sm font-medium">{service.responseTime}ms</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{service.uptime}% uptime</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Performance Analytics Component
const PerformanceAnalytics = () => {
  const [timeRange, setTimeRange] = useState('24h')
  const [performanceData] = useState({
    pageLoadTimes: {
      avg: 1.8,
      p50: 1.2,
      p75: 2.1,
      p95: 4.3,
      p99: 8.7
    },
    coreWebVitals: {
      lcp: { score: 1.2, rating: 'good', threshold: 2.5 },
      fid: { score: 0.08, rating: 'good', threshold: 0.1 },
      cls: { score: 0.05, rating: 'good', threshold: 0.1 }
    },
    devicePerformance: [
      { device: 'Desktop', avgLoadTime: 1.2, score: 95 },
      { device: 'Mobile', avgLoadTime: 2.8, score: 78 },
      { device: 'Tablet', avgLoadTime: 1.9, score: 87 }
    ],
    geographicPerformance: [
      { region: 'North America', avgLoadTime: 1.4, score: 92 },
      { region: 'Europe', avgLoadTime: 1.8, score: 88 },
      { region: 'Asia Pacific', avgLoadTime: 2.3, score: 81 },
      { region: 'South America', avgLoadTime: 2.7, score: 76 }
    ]
  })

  const getVitalRating = (rating: string) => {
    switch(rating) {
      case 'good': return 'text-green-500'
      case 'needs-improvement': return 'text-yellow-500'
      case 'poor': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getPerformanceScore = (score: number) => {
    if (score >= 90) return { color: 'text-green-500', bg: 'bg-green-500' }
    if (score >= 75) return { color: 'text-yellow-500', bg: 'bg-yellow-500' }
    return { color: 'text-red-500', bg: 'bg-red-500' }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Analytics</h2>
          <p className="text-muted-foreground">Detailed performance metrics and analysis</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last Hour</SelectItem>
            <SelectItem value="24h">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Load Time</p>
                <p className="text-2xl font-bold">{performanceData.pageLoadTimes.avg}s</p>
              </div>
              <Timer className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">95th Percentile</p>
                <p className="text-2xl font-bold">{performanceData.pageLoadTimes.p95}s</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">LCP Score</p>
                <p className={`text-2xl font-bold ${getVitalRating(performanceData.coreWebVitals.lcp.rating)}`}>
                  {performanceData.coreWebVitals.lcp.score}s
                </p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">FID Score</p>
                <p className={`text-2xl font-bold ${getVitalRating(performanceData.coreWebVitals.fid.rating)}`}>
                  {performanceData.coreWebVitals.fid.score}ms
                </p>
              </div>
              <Zap className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CLS Score</p>
                <p className={`text-2xl font-bold ${getVitalRating(performanceData.coreWebVitals.cls.rating)}`}>
                  {performanceData.coreWebVitals.cls.score}
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Load Time Distribution</CardTitle>
            <CardDescription>Performance percentiles breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(performanceData.pageLoadTimes).slice(1).map(([percentile, time]) => (
                <div key={percentile} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{percentile.toUpperCase()}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded">
                      <div 
                        className="h-full bg-blue-500 rounded transition-all duration-300"
                        style={{ width: `${Math.min((time / 10) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold w-12">{time}s</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Core Web Vitals</CardTitle>
            <CardDescription>Essential user experience metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">Largest Contentful Paint (LCP)</p>
                    <p className="text-sm text-muted-foreground">Loading performance</p>
                  </div>
                  <Badge className={getVitalRating(performanceData.coreWebVitals.lcp.rating)}>
                    {performanceData.coreWebVitals.lcp.rating}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{performanceData.coreWebVitals.lcp.score}s</span>
                  <span className="text-sm text-muted-foreground">
                    (target: &lt;{performanceData.coreWebVitals.lcp.threshold}s)
                  </span>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">First Input Delay (FID)</p>
                    <p className="text-sm text-muted-foreground">Interactivity</p>
                  </div>
                  <Badge className={getVitalRating(performanceData.coreWebVitals.fid.rating)}>
                    {performanceData.coreWebVitals.fid.rating}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{performanceData.coreWebVitals.fid.score}ms</span>
                  <span className="text-sm text-muted-foreground">
                    (target: &lt;{performanceData.coreWebVitals.fid.threshold}ms)
                  </span>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">Cumulative Layout Shift (CLS)</p>
                    <p className="text-sm text-muted-foreground">Visual stability</p>
                  </div>
                  <Badge className={getVitalRating(performanceData.coreWebVitals.cls.rating)}>
                    {performanceData.coreWebVitals.cls.rating}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{performanceData.coreWebVitals.cls.score}</span>
                  <span className="text-sm text-muted-foreground">
                    (target: &lt;{performanceData.coreWebVitals.cls.threshold})
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Device Performance</CardTitle>
            <CardDescription>Performance breakdown by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performanceData.devicePerformance.map((device, index) => {
                const scoreData = getPerformanceScore(device.score)
                return (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {device.device === 'Desktop' && <Monitor className="h-5 w-5" />}
                      {device.device === 'Mobile' && <Smartphone className="h-5 w-5" />}
                      {device.device === 'Tablet' && <Monitor className="h-5 w-5" />}
                      <div>
                        <p className="font-medium">{device.device}</p>
                        <p className="text-sm text-muted-foreground">{device.avgLoadTime}s avg load</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${scoreData.color}`}>{device.score}</div>
                      <div className="w-16 h-2 bg-muted rounded">
                        <div 
                          className={`h-full ${scoreData.bg} rounded transition-all duration-300`}
                          style={{ width: `${device.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geographic Performance</CardTitle>
            <CardDescription>Performance by geographic region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performanceData.geographicPerformance.map((region, index) => {
                const scoreData = getPerformanceScore(region.score)
                return (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5" />
                      <div>
                        <p className="font-medium">{region.region}</p>
                        <p className="text-sm text-muted-foreground">{region.avgLoadTime}s avg load</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${scoreData.color}`}>{region.score}</div>
                      <div className="w-16 h-2 bg-muted rounded">
                        <div 
                          className={`h-full ${scoreData.bg} rounded transition-all duration-300`}
                          style={{ width: `${region.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Error Tracking Component
const ErrorTracking = () => {
  const { toast } = useToast()
  const [errors, setErrors] = useState([
    {
      id: 1,
      message: 'TypeError: Cannot read property of undefined',
      type: 'JavaScript',
      frequency: 156,
      affectedUsers: 89,
      firstSeen: '2024-01-20',
      lastSeen: '2024-01-22',
      status: 'unresolved',
      severity: 'high',
      stackTrace: 'at handleClick (components/Button.tsx:45)\nat onClick (components/Form.tsx:123)',
      url: '/dashboard'
    },
    {
      id: 2,
      message: 'Network Error: Failed to fetch',
      type: 'Network',
      frequency: 89,
      affectedUsers: 67,
      firstSeen: '2024-01-21',
      lastSeen: '2024-01-22',
      status: 'investigating',
      severity: 'medium',
      stackTrace: 'at fetch (utils/api.ts:12)\nat getUser (services/user.ts:34)',
      url: '/api/users'
    },
    {
      id: 3,
      message: 'ReferenceError: gtag is not defined',
      type: 'JavaScript',
      frequency: 45,
      affectedUsers: 23,
      firstSeen: '2024-01-19',
      lastSeen: '2024-01-21',
      status: 'resolved',
      severity: 'low',
      stackTrace: 'at trackEvent (utils/analytics.ts:8)\nat onButtonClick (components/CTA.tsx:15)',
      url: '/landing'
    }
  ])

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'unresolved': return 'destructive'
      case 'investigating': return 'default'
      case 'resolved': return 'secondary'
      default: return 'secondary'
    }
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'JavaScript': return '🔧'
      case 'Network': return '🌐'
      case 'Database': return '🗄️'
      case 'Security': return '🔒'
      default: return '⚠️'
    }
  }

  const handleStatusChange = (errorId: number, newStatus: string) => {
    setErrors(errors.map(error => 
      error.id === errorId ? { ...error, status: newStatus } : error
    ))
    toast({
      title: 'Error Status Updated',
      description: `Error status changed to ${newStatus}`
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Error Tracking</h2>
          <p className="text-muted-foreground">Monitor and resolve application errors</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Errors</p>
                <p className="text-2xl font-bold">{errors.reduce((acc, e) => acc + e.frequency, 0)}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unresolved</p>
                <p className="text-2xl font-bold">{errors.filter(e => e.status === 'unresolved').length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Affected Users</p>
                <p className="text-2xl font-bold">{errors.reduce((acc, e) => acc + e.affectedUsers, 0)}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Error Rate</p>
                <p className="text-2xl font-bold">0.4%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Error Log</CardTitle>
          <CardDescription>Recent application errors and their details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {errors.map((error) => (
              <div key={error.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-2xl">{getTypeIcon(error.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{error.message}</p>
                        <Badge variant={getSeverityColor(error.severity)}>
                          {error.severity}
                        </Badge>
                        <Badge variant={getStatusColor(error.status)}>
                          {error.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{error.url}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{error.frequency} occurrences</span>
                        <span>{error.affectedUsers} users affected</span>
                        <span>First seen: {error.firstSeen}</span>
                        <span>Last seen: {error.lastSeen}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select 
                      value={error.status} 
                      onValueChange={(value) => handleStatusChange(error.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unresolved">Unresolved</SelectItem>
                        <SelectItem value="investigating">Investigating</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-muted/30 p-3 rounded text-sm font-mono">
                  <p className="text-muted-foreground mb-1">Stack Trace:</p>
                  <p>{error.stackTrace}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Security Monitoring Component
const SecurityMonitoring = () => {
  const [securityEvents] = useState([
    {
      id: 1,
      type: 'Failed Login Attempt',
      severity: 'medium',
      source: '192.168.1.100',
      target: 'admin@example.com',
      timestamp: '2024-01-22 14:30:25',
      status: 'blocked',
      location: 'New York, US'
    },
    {
      id: 2,
      type: 'Suspicious API Access',
      severity: 'high',
      source: '10.0.0.50',
      target: '/api/users/sensitive',
      timestamp: '2024-01-22 13:45:12',
      status: 'investigating',
      location: 'Unknown'
    },
    {
      id: 3,
      type: 'Rate Limit Exceeded',
      severity: 'low',
      source: '203.0.113.0',
      target: '/api/search',
      timestamp: '2024-01-22 12:15:45',
      status: 'resolved',
      location: 'London, UK'
    }
  ])

  const [securityMetrics] = useState({
    blockedRequests: 1247,
    flaggedIPs: 23,
    securityScore: 94,
    vulnerabilities: 2,
    lastScan: '2024-01-22 10:00:00',
    threatLevel: 'low'
  })

  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getThreatLevelColor = (level: string) => {
    switch(level) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Security Monitoring</h2>
          <p className="text-muted-foreground">Monitor security events and threats</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Shield className="h-4 w-4 mr-2" />
            Run Scan
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Security Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Security Score</p>
                <p className="text-2xl font-bold text-green-500">{securityMetrics.securityScore}</p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
            <div className="w-full h-2 bg-muted rounded mt-2">
              <div 
                className="h-full bg-green-500 rounded transition-all duration-300"
                style={{ width: `${securityMetrics.securityScore}%` }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blocked Requests</p>
                <p className="text-2xl font-bold">{securityMetrics.blockedRequests.toLocaleString()}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Flagged IPs</p>
                <p className="text-2xl font-bold">{securityMetrics.flaggedIPs}</p>
              </div>
              <Eye className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Threat Level</p>
                <p className={`text-2xl font-bold ${getThreatLevelColor(securityMetrics.threatLevel)}`}>
                  {securityMetrics.threatLevel.toUpperCase()}
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Security Events</CardTitle>
            <CardDescription>Recent security incidents and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securityEvents.map((event) => (
                <div key={event.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(event.severity)}
                      <span className="font-medium">{event.type}</span>
                      <Badge variant={event.status === 'blocked' ? 'destructive' : 
                                   event.status === 'investigating' ? 'default' : 'secondary'}>
                        {event.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{event.timestamp}</span>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Source: {event.source} ({event.location})</p>
                    <p>Target: {event.target}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Overview</CardTitle>
            <CardDescription>System security status and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Firewall Status</span>
                  <Badge variant="default" className="bg-green-500">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground">All ports protected and monitored</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">SSL Certificate</span>
                  <Badge variant="default" className="bg-green-500">Valid</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Expires: December 15, 2024</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Vulnerability Scan</span>
                  <Badge variant="secondary">{securityMetrics.vulnerabilities} Issues</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Last scan: {securityMetrics.lastScan}</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">DDoS Protection</span>
                  <Badge variant="default" className="bg-green-500">Enabled</Badge>
                </div>
                <p className="text-sm text-muted-foreground">CloudFlare protection active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

type Props = {
  params: { subaccountId: string }
}

const PerformanceMonitoringPage = ({ params }: Props) => {
  const [activeTab, setActiveTab] = useState('monitoring')

  return (
    <BlurPage>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Performance Monitoring</h1>
            <p className="text-muted-foreground">Comprehensive system monitoring and performance analysis</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
            <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
            <TabsTrigger value="errors">Error Tracking</TabsTrigger>
            <TabsTrigger value="security">Security Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="monitoring">
            <RealTimeMonitoring />
          </TabsContent>

          <TabsContent value="analytics">
            <PerformanceAnalytics />
          </TabsContent>

          <TabsContent value="errors">
            <ErrorTracking />
          </TabsContent>

          <TabsContent value="security">
            <SecurityMonitoring />
          </TabsContent>
        </Tabs>
      </motion.div>
    </BlurPage>
  )
}

export default PerformanceMonitoringPage