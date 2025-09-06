'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, RefreshCw, Download, Filter, TrendingUp, TrendingDown, BarChart3, Users, Globe, Target, MousePointer, Eye, ShoppingCart, DollarSign, Clock, MapPin, Smartphone, Monitor, Activity, Zap } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import BlurPage from '@/components/global/blur-page'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

// Advanced Analytics Components
const TrafficAnalyticsCard = ({ data, timeRange }: any) => {
  const [selectedMetric, setSelectedMetric] = useState('visitors')
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Traffic Analysis
        </CardTitle>
        <CardDescription>Real-time traffic insights and patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button 
              variant={selectedMetric === 'visitors' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSelectedMetric('visitors')}
            >
              Visitors
            </Button>
            <Button 
              variant={selectedMetric === 'pageviews' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSelectedMetric('pageviews')}
            >
              Page Views
            </Button>
            <Button 
              variant={selectedMetric === 'sessions' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSelectedMetric('sessions')}
            >
              Sessions
            </Button>
          </div>
          <div className="h-64 w-full rounded-lg border bg-muted/30 flex items-center justify-center">
            <div className="text-center space-y-2">
              <Activity className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Interactive Traffic Chart</p>
              <p className="text-xs text-muted-foreground">Showing {selectedMetric} for {timeRange}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Unique Visitors</p>
              <p className="text-2xl font-bold">{data?.uniqueVisitors?.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Page Views</p>
              <p className="text-2xl font-bold">{data?.pageViews?.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Bounce Rate</p>
              <p className="text-2xl font-bold">{data?.bounceRate}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Avg. Session</p>
              <p className="text-2xl font-bold">{Math.floor(data?.avgSessionDuration / 60)}m</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const ConversionTrackingCard = ({ data }: any) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Conversion Tracking
        </CardTitle>
        <CardDescription>Funnel performance and conversion metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Conversion Rate</span>
            <span className="text-lg font-bold text-green-600">{data?.conversionRate}%</span>
          </div>
          <div className="space-y-2">
            {data?.conversionFunnel?.map((stage: any, index: number) => (
              <motion.div 
                key={stage.stage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
              >
                <span className="text-sm">{stage.stage}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{stage.count}</span>
                  <Badge variant="secondary">{stage.conversion}%</Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const GeographicDataCard = ({ data }: any) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Geographic Data
        </CardTitle>
        <CardDescription>Visitor distribution by location</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-48 w-full rounded-lg border bg-muted/30 flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapPin className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Interactive World Map</p>
            </div>
          </div>
          <div className="space-y-2">
            {data?.geographicData?.slice(0, 5).map((country: any, index: number) => (
              <div key={country.country} className="flex items-center justify-between">
                <span className="text-sm">{country.country}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{country.visitors}</span>
                  <span className="text-xs text-muted-foreground">${country.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const CustomEventsCard = ({ events, onCreateEvent }: any) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MousePointer className="h-5 w-5" />
          Custom Events
        </CardTitle>
        <CardDescription>Track custom user interactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={onCreateEvent} className="w-full" variant="outline">
            <Zap className="h-4 w-4 mr-2" />
            Create Custom Event
          </Button>
          <div className="space-y-2">
            {events?.map((event: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg border">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{event.name}</p>
                  <p className="text-xs text-muted-foreground">{event.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{event.count}</p>
                  <p className="text-xs text-muted-foreground">events</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const RealTimeMetricsCard = ({ data }: any) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-500" />
          Real-Time Metrics
        </CardTitle>
        <CardDescription>Live user activity and performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm">Active Users</span>
            </div>
            <p className="text-2xl font-bold">{data?.activeUsers || 0}</p>
          </div>
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Pages/Session</span>
            <p className="text-2xl font-bold">{data?.pagesPerSession || 0}</p>
          </div>
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Revenue Today</span>
            <p className="text-2xl font-bold text-green-600">${data?.revenueToday || 0}</p>
          </div>
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Load Time</span>
            <p className="text-2xl font-bold">{data?.avgLoadTime || 0}ms</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

type Props = {
  params: { individualId: string }
}

const AnalyticsPage = ({ params }: Props) => {
  const router = useRouter()
  const { toast } = useToast()
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [customEvents, setCustomEvents] = useState([
    { name: 'Button Click', description: 'CTA button interactions', count: 245 },
    { name: 'Form Submit', description: 'Contact form submissions', count: 89 },
    { name: 'Video Play', description: 'Video content engagement', count: 156 },
    { name: 'Download', description: 'File download tracking', count: 67 }
  ])

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/individual/analytics?timeRange=${timeRange}&individualId=${params.individualId}`)
      const data = await response.json()
      setAnalyticsData(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch analytics data',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = () => {
    toast({
      title: 'Custom Event',
      description: 'Custom event creation feature coming soon!'
    })
  }

  const handleExportData = () => {
    toast({
      title: 'Export Started',
      description: 'Your analytics data is being prepared for download'
    })
  }

  if (loading) {
    return (
      <BlurPage>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </BlurPage>
    )
  }

  return (
    <BlurPage>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Advanced Analytics</h1>
            <p className="text-muted-foreground">Deep insights into your funnel performance and user behavior</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last Day</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchAnalyticsData} variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={handleExportData} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">${analyticsData?.performanceMetrics?.revenue?.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+12.5%</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Conversions</p>
                    <p className="text-2xl font-bold">{analyticsData?.performanceMetrics?.conversionRate}%</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-500" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+8.2%</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Unique Visitors</p>
                    <p className="text-2xl font-bold">{analyticsData?.performanceMetrics?.uniqueVisitors?.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+15.3%</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Session</p>
                    <p className="text-2xl font-bold">{Math.floor(analyticsData?.performanceMetrics?.avgSessionDuration / 60)}m</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-500" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-500">-2.1%</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="conversions">Conversions</TabsTrigger>
            <TabsTrigger value="geographic">Geographic</TabsTrigger>
            <TabsTrigger value="events">Custom Events</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <TrafficAnalyticsCard data={analyticsData?.performanceMetrics} timeRange={timeRange} />
              </div>
              <div className="space-y-4">
                <RealTimeMetricsCard data={analyticsData?.realTimeMetrics} />
                <ConversionTrackingCard data={analyticsData} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="traffic" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TrafficAnalyticsCard data={analyticsData?.performanceMetrics} timeRange={timeRange} />
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                  <CardDescription>Where your visitors are coming from</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData?.trafficSources?.map((source: any, index: number) => (
                      <div key={source.source} className="flex items-center justify-between p-2 rounded-lg border">
                        <span className="text-sm">{source.source}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{source.visitors}</span>
                          <Badge variant="secondary">{source.percentage}%</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="conversions" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ConversionTrackingCard data={analyticsData} />
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Optimization</CardTitle>
                  <CardDescription>Recommendations to improve conversions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <p className="text-sm font-medium text-blue-900">Optimize Landing Page</p>
                      <p className="text-xs text-blue-700">Your bounce rate is 15% higher than average</p>
                    </div>
                    <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                      <p className="text-sm font-medium text-green-900">A/B Test CTA Buttons</p>
                      <p className="text-xs text-green-700">Could improve conversion by 8-12%</p>
                    </div>
                    <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                      <p className="text-sm font-medium text-yellow-900">Mobile Optimization</p>
                      <p className="text-xs text-yellow-700">Mobile users have 25% lower conversion rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="geographic" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <GeographicDataCard data={analyticsData} />
              <Card>
                <CardHeader>
                  <CardTitle>Device & Browser Analytics</CardTitle>
                  <CardDescription>User technology preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Device Types</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4" />
                            <span className="text-sm">Desktop</span>
                          </div>
                          <span className="text-sm">65%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4" />
                            <span className="text-sm">Mobile</span>
                          </div>
                          <span className="text-sm">35%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <CustomEventsCard events={customEvents} onCreateEvent={handleCreateEvent} />
              <Card>
                <CardHeader>
                  <CardTitle>Event Performance</CardTitle>
                  <CardDescription>Top performing custom events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full rounded-lg border bg-muted/30 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Event Performance Chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </BlurPage>
  )
}

export default AnalyticsPage