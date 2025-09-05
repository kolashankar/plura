'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users, 
  Mail, 
  Settings,
  Calendar,
  Activity
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface AutomationForm {
  id: string
  name: string
  status: string
  _count: {
    submissions: number
    automations: number
  }
  createdAt: string
}

interface FormAnalyticsProps {
  forms: AutomationForm[]
}

export function FormAnalytics({ forms }: FormAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('7d')
  const [submissionData, setSubmissionData] = useState<any[]>([])
  const [formDistribution, setFormDistribution] = useState<any[]>([])

  // Mock data for demonstration - would be fetched from API
  useEffect(() => {
    // Generate mock submission data
    const mockSubmissionData = [
      { date: '2024-01-01', submissions: 12, automations: 8 },
      { date: '2024-01-02', submissions: 15, automations: 12 },
      { date: '2024-01-03', submissions: 8, automations: 6 },
      { date: '2024-01-04', submissions: 22, automations: 18 },
      { date: '2024-01-05', submissions: 18, automations: 14 },
      { date: '2024-01-06', submissions: 25, automations: 20 },
      { date: '2024-01-07', submissions: 30, automations: 25 },
    ]
    setSubmissionData(mockSubmissionData)

    // Generate form distribution data
    const distribution = forms.map(form => ({
      name: form.name,
      submissions: form._count.submissions,
      status: form.status
    }))
    setFormDistribution(distribution)
  }, [forms, timeRange])

  const totalSubmissions = forms.reduce((sum, form) => sum + form._count.submissions, 0)
  const totalForms = forms.length
  const publishedForms = forms.filter(form => form.status === 'PUBLISHED').length
  const avgSubmissionsPerForm = totalForms > 0 ? Math.round(totalSubmissions / totalForms) : 0

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

  return (
    <div className=\"space-y-6\">
      {/* Analytics Header */}
      <div className=\"flex items-center justify-between\">
        <div>
          <h2 className=\"text-2xl font-bold text-gray-900 dark:text-white\">Form Analytics</h2>
          <p className=\"text-gray-600 dark:text-gray-300 mt-1\">
            Track performance and engagement across all automation forms
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className=\"w-32\">
            <SelectValue placeholder=\"Time range\" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=\"7d\">Last 7 days</SelectItem>
            <SelectItem value=\"30d\">Last 30 days</SelectItem>
            <SelectItem value=\"90d\">Last 90 days</SelectItem>
            <SelectItem value=\"1y\">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6\">
        <Card>
          <CardHeader className=\"flex flex-row items-center justify-between space-y-0 pb-2\">
            <CardTitle className=\"text-sm font-medium\">Total Submissions</CardTitle>
            <BarChart3 className=\"h-4 w-4 text-muted-foreground\" />
          </CardHeader>
          <CardContent>
            <div className=\"text-2xl font-bold\">{totalSubmissions}</div>
            <p className=\"text-xs text-muted-foreground\">
              <span className=\"text-green-600\">+12%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=\"flex flex-row items-center justify-between space-y-0 pb-2\">
            <CardTitle className=\"text-sm font-medium\">Conversion Rate</CardTitle>
            <TrendingUp className=\"h-4 w-4 text-muted-foreground\" />
          </CardHeader>
          <CardContent>
            <div className=\"text-2xl font-bold\">68.2%</div>
            <p className=\"text-xs text-muted-foreground\">
              <span className=\"text-green-600\">+2.3%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=\"flex flex-row items-center justify-between space-y-0 pb-2\">
            <CardTitle className=\"text-sm font-medium\">Avg. Completion Time</CardTitle>
            <Clock className=\"h-4 w-4 text-muted-foreground\" />
          </CardHeader>
          <CardContent>
            <div className=\"text-2xl font-bold\">2m 34s</div>
            <p className=\"text-xs text-muted-foreground\">
              <span className=\"text-red-600\">+0.2s</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=\"flex flex-row items-center justify-between space-y-0 pb-2\">
            <CardTitle className=\"text-sm font-medium\">Active Forms</CardTitle>
            <Activity className=\"h-4 w-4 text-muted-foreground\" />
          </CardHeader>
          <CardContent>
            <div className=\"text-2xl font-bold\">{publishedForms}</div>
            <p className=\"text-xs text-muted-foreground\">
              {totalForms} total forms
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6\">
        {/* Submissions Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Submissions Over Time</CardTitle>
            <CardDescription>
              Track form submissions and automation triggers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className=\"h-[300px]\">
              <ResponsiveContainer width=\"100%\" height=\"100%\">
                <LineChart data={submissionData}>
                  <CartesianGrid strokeDasharray=\"3 3\" />
                  <XAxis 
                    dataKey=\"date\" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Line 
                    type=\"monotone\" 
                    dataKey=\"submissions\" 
                    stroke=\"#8884d8\" 
                    strokeWidth={2}
                    name=\"Submissions\"
                  />
                  <Line 
                    type=\"monotone\" 
                    dataKey=\"automations\" 
                    stroke=\"#82ca9d\" 
                    strokeWidth={2}
                    name=\"Automations Triggered\"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Form Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Form Performance</CardTitle>
            <CardDescription>
              Submissions by form
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className=\"h-[300px]\">
              <ResponsiveContainer width=\"100%\" height=\"100%\">
                <BarChart data={formDistribution}>
                  <CartesianGrid strokeDasharray=\"3 3\" />
                  <XAxis 
                    dataKey=\"name\" 
                    angle={-45}
                    textAnchor=\"end\"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey=\"submissions\" fill=\"#8884d8\" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics */}
      <div className=\"grid grid-cols-1 lg:grid-cols-3 gap-6\">
        {/* Form Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Form Status</CardTitle>
            <CardDescription>
              Distribution of form statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className=\"space-y-4\">
              <div className=\"flex items-center justify-between\">
                <div className=\"flex items-center gap-2\">
                  <div className=\"w-3 h-3 bg-green-500 rounded-full\"></div>
                  <span className=\"text-sm\">Published</span>
                </div>
                <Badge className=\"bg-green-100 text-green-800\">
                  {forms.filter(f => f.status === 'PUBLISHED').length}
                </Badge>
              </div>
              <div className=\"flex items-center justify-between\">
                <div className=\"flex items-center gap-2\">
                  <div className=\"w-3 h-3 bg-yellow-500 rounded-full\"></div>
                  <span className=\"text-sm\">Draft</span>
                </div>
                <Badge className=\"bg-yellow-100 text-yellow-800\">
                  {forms.filter(f => f.status === 'DRAFT').length}
                </Badge>
              </div>
              <div className=\"flex items-center justify-between\">
                <div className=\"flex items-center gap-2\">
                  <div className=\"w-3 h-3 bg-gray-500 rounded-full\"></div>
                  <span className=\"text-sm\">Archived</span>
                </div>
                <Badge className=\"bg-gray-100 text-gray-800\">
                  {forms.filter(f => f.status === 'ARCHIVED').length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Forms */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Forms</CardTitle>
            <CardDescription>
              Forms with most submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className=\"space-y-4\">
              {forms
                .sort((a, b) => b._count.submissions - a._count.submissions)
                .slice(0, 5)
                .map((form, index) => (
                  <div key={form.id} className=\"flex items-center justify-between\">
                    <div className=\"flex items-center gap-3\">
                      <div className=\"flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium\">
                        {index + 1}
                      </div>
                      <div>
                        <div className=\"text-sm font-medium\">{form.name}</div>
                        <div className=\"text-xs text-gray-500\">
                          {form._count.automations} automations
                        </div>
                      </div>
                    </div>
                    <Badge variant=\"outline\">
                      {form._count.submissions}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest form submissions and events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className=\"space-y-4\">
              {[
                { type: 'submission', form: 'Contact Form', time: '2 minutes ago' },
                { type: 'automation', form: 'Newsletter Signup', time: '5 minutes ago' },
                { type: 'submission', form: 'Support Request', time: '12 minutes ago' },
                { type: 'form_created', form: 'Product Feedback', time: '1 hour ago' },
                { type: 'submission', form: 'Contact Form', time: '2 hours ago' },
              ].map((activity, index) => (
                <div key={index} className=\"flex items-center gap-3\">
                  <div className=\"flex-shrink-0\">
                    {activity.type === 'submission' && (
                      <div className=\"w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center\">
                        <Mail size={14} />
                      </div>
                    )}
                    {activity.type === 'automation' && (
                      <div className=\"w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center\">
                        <Settings size={14} />
                      </div>
                    )}
                    {activity.type === 'form_created' && (
                      <div className=\"w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center\">
                        <BarChart3 size={14} />
                      </div>
                    )}
                  </div>
                  <div className=\"flex-1\">
                    <div className=\"text-sm font-medium\">{activity.form}</div>
                    <div className=\"text-xs text-gray-500\">{activity.time}</div>
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
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Mail,
  Calendar,
  Activity
} from 'lucide-react'

interface AutomationForm {
  id: string
  name: string
  description?: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  webhookUrl?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  subAccountId?: string
  individualId?: string
  _count: {
    submissions: number
    automations: number
  }
  SubAccount?: {
    id: string
    name: string
  }
  Individual?: {
    id: string
    name: string
    email: string
  }
}

interface FormAnalyticsProps {
  forms: AutomationForm[]
}

export function FormAnalytics({ forms }: FormAnalyticsProps) {
  const totalSubmissions = forms.reduce((sum, form) => sum + form._count.submissions, 0)
  const totalAutomations = forms.reduce((sum, form) => sum + form._count.automations, 0)
  const publishedForms = forms.filter(form => form.status === 'PUBLISHED').length
  const averageSubmissions = forms.length > 0 ? Math.round(totalSubmissions / forms.length) : 0

  const topPerformingForms = forms
    .sort((a, b) => b._count.submissions - a._count.submissions)
    .slice(0, 5)

  const formsByStatus = forms.reduce((acc, form) => {
    acc[form.status] = (acc[form.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const recentForms = forms
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Form Analytics</h2>
          <p className="text-muted-foreground">
            Insights and performance metrics for all automation forms
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">
              {averageSubmissions} avg per form
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Forms</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedForms}</div>
            <p className="text-xs text-muted-foreground">
              {forms.length} total forms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Automations</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAutomations}</div>
            <p className="text-xs text-muted-foreground">
              Connected workflows
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {forms.length > 0 ? Math.round((publishedForms / forms.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Published forms rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Forms */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformingForms.map((form, index) => (
                <div key={form.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      #{index + 1}
                    </span>
                    <div>
                      <div className="font-medium">{form.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {form.SubAccount?.name || form.Individual?.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{form._count.submissions}</div>
                    <div className="text-xs text-muted-foreground">submissions</div>
                  </div>
                </div>
              ))}
              {topPerformingForms.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  No form data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Forms */}
        <Card>
          <CardHeader>
            <CardTitle>Recently Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentForms.map((form) => (
                <div key={form.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{form.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(form.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant="outline">
                    {form.status}
                  </Badge>
                </div>
              ))}
              {recentForms.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  No recent forms
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Form Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(formsByStatus).map(([status, count]) => (
              <div key={status} className="text-center">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {status.toLowerCase()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
