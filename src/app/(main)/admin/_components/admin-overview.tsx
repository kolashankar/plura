
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Building2, Activity, HeadphonesIcon, TrendingUp, Database } from 'lucide-react'

type Props = {
  analytics: any[]
  stats: {
    totalUsers: number
    totalAgencies: number
    totalSubAccounts: number
    activeUsers: number
    recentSignups: number
    pendingTickets: number
  }
}

const AdminOverview = ({ analytics, stats }: Props) => {
  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      description: `${stats.recentSignups} new this week`
    },
    {
      title: 'Total Agencies',
      value: stats.totalAgencies.toLocaleString(),
      icon: Building2,
      description: 'Active organizations'
    },
    {
      title: 'Sub Accounts',
      value: stats.totalSubAccounts.toLocaleString(),
      icon: Database,
      description: 'Managed accounts'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      icon: Activity,
      description: 'Last 30 days'
    },
    {
      title: 'Pending Tickets',
      value: stats.pendingTickets.toLocaleString(),
      icon: HeadphonesIcon,
      description: 'Awaiting response'
    },
    {
      title: 'Growth Rate',
      value: '12.5%',
      icon: TrendingUp,
      description: 'Month over month'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">System maintenance completed</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">New agency registered</p>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Feature flag updated</p>
                <p className="text-xs text-muted-foreground">6 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminOverview
