'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { 
  Users, 
  Building2, 
  DollarSign, 
  Activity, 
  Database,
  TrendingUp,
  TrendingDown,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { useToast } from '@/hooks/use-toast'

type AnalyticsData = {
  totalUsers: number
  totalAgencies: number
  totalSubAccounts: number
  activeUsers: number
  totalRevenue: number
  apiCalls: number
  storageUsed: string
  bandwidth: string
}

const AdminAnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const { toast } = useToast()

  useEffect(() => {
    fetchAnalytics()
  }, [dateFrom, dateTo])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (dateFrom) params.append('dateFrom', dateFrom.toISOString())
      if (dateTo) params.append('dateTo', dateTo.toISOString())
      
      const response = await fetch(`/api/admin/analytics?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setAnalytics(data.realtimeStats)
      } else {
        throw new Error(data.error)
      }
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

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const statCards = [
    {
      title: 'Total Users',
      value: analytics?.totalUsers?.toLocaleString() || '0',
      icon: Users,
      change: '+12%',
      trend: 'up' as const,
      description: 'Total registered users'
    },
    {
      title: 'Total Agencies',
      value: analytics?.totalAgencies?.toLocaleString() || '0',
      icon: Building2,
      change: '+8%',
      trend: 'up' as const,
      description: 'Active agency accounts'
    },
    {
      title: 'Sub Accounts',
      value: analytics?.totalSubAccounts?.toLocaleString() || '0',
      icon: Database,
      change: '+15%',
      trend: 'up' as const,
      description: 'Total sub accounts created'
    },
    {
      title: 'Active Users (30d)',
      value: analytics?.activeUsers?.toLocaleString() || '0',
      icon: Activity,
      change: '+5%',
      trend: 'up' as const,
      description: 'Users active in last 30 days'
    },
    {
      title: 'Monthly Revenue',
      value: `$${analytics?.totalRevenue?.toLocaleString() || '0'}`,
      icon: DollarSign,
      change: '+22%',
      trend: 'up' as const,
      description: 'Total monthly revenue'
    },
    {
      title: 'API Calls',
      value: analytics?.apiCalls?.toLocaleString() || '0',
      icon: Eye,
      change: '+18%',
      trend: 'up' as const,
      description: 'Total API requests this month'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Date Range Picker */}
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !dateFrom && "text-muted-foreground"
              )}
              data-testid="button-date-from"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFrom ? format(dateFrom, "PPP") : <span>Pick start date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateFrom}
              onSelect={setDateFrom}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !dateTo && "text-muted-foreground"
              )}
              data-testid="button-date-to"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateTo ? format(dateTo, "PPP") : <span>Pick end date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateTo}
              onSelect={setDateTo}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button 
          variant="default" 
          onClick={fetchAnalytics}
          data-testid="button-refresh-analytics"
        >
          Refresh Data
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted animate-pulse rounded mb-2" />
                <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown
            
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid={`text-stat-${index}`}>
                    {stat.value}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendIcon className={cn(
                      "h-3 w-3 mr-1",
                      stat.trend === 'up' ? "text-green-500" : "text-red-500"
                    )} />
                    <span className={cn(
                      stat.trend === 'up' ? "text-green-500" : "text-red-500"
                    )}>
                      {stat.change}
                    </span>
                    <span className="ml-1">{stat.description}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Growth Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">User Growth Rate</span>
                <span className="text-sm font-medium text-green-600">+12.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Agency Growth Rate</span>
                <span className="text-sm font-medium text-green-600">+8.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Revenue Growth Rate</span>
                <span className="text-sm font-medium text-green-600">+22.1%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Churn Rate</span>
                <span className="text-sm font-medium text-red-600">-2.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Response Time</span>
                <span className="text-sm font-medium text-green-600">145ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">System Uptime</span>
                <span className="text-sm font-medium text-green-600">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Error Rate</span>
                <span className="text-sm font-medium text-green-600">0.1%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database Connections</span>
                <span className="text-sm font-medium">234/1000</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminAnalyticsDashboard