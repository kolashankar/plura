'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Mail,
  Calendar,
  Activity,
  Eye,
  Download
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'

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

interface FormSubmissionAnalyticsProps {
  forms: AutomationForm[]
  subaccountId: string
}

interface FormSubmission {
  id: string
  formId: string
  data: string
  ipAddress?: string
  source?: string
  createdAt: string
  form: {
    name: string
  }
}

export function FormSubmissionAnalytics({ forms, subaccountId }: FormSubmissionAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedForm, setSelectedForm] = useState('all')
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [submissionData, setSubmissionData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        subaccountId,
        timeRange,
        formId: selectedForm !== 'all' ? selectedForm : ''
      })

      const response = await fetch(`/api/form-submissions?${params}`)
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.submissions || [])
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmissions()
  }, [timeRange, selectedForm, subaccountId])

  // Generate chart data
  useEffect(() => {
    // Mock data for demonstration
    const mockData = [
      { date: '2024-01-01', submissions: 12, conversions: 8 },
      { date: '2024-01-02', submissions: 15, conversions: 12 },
      { date: '2024-01-03', submissions: 8, conversions: 6 },
      { date: '2024-01-04', submissions: 22, conversions: 18 },
      { date: '2024-01-05', submissions: 18, conversions: 14 },
      { date: '2024-01-06', submissions: 25, conversions: 20 },
      { date: '2024-01-07', submissions: 30, conversions: 25 },
    ]
    setSubmissionData(mockData)
  }, [submissions, timeRange])

  const totalSubmissions = forms.reduce((sum, form) => sum + form._count.submissions, 0)
  const averageConversion = 68.2 // Mock calculation
  const topForm = forms.sort((a, b) => b._count.submissions - a._count.submissions)[0]

  const exportSubmissions = () => {
    const csvData = submissions.map(submission => {
      const submissionData = JSON.parse(submission.data)
      return {
        'Form Name': submission.form.name,
        'Submission Date': format(new Date(submission.createdAt), 'yyyy-MM-dd HH:mm:ss'),
        'IP Address': submission.ipAddress || 'N/A',
        'Source': submission.source || 'N/A',
        ...submissionData
      }
    })

    const headers = Object.keys(csvData[0] || {})
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `\"${row[header] || ''}\"`).join(','))
    ].join('\\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `form-submissions-${format(new Date(), 'yyyy-MM-dd')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className=\"space-y-6\">
      {/* Analytics Header */}
      <div className=\"flex items-center justify-between\">
        <div>
          <h2 className=\"text-2xl font-bold text-gray-900 dark:text-white\">Form Analytics</h2>
          <p className=\"text-gray-600 dark:text-gray-300 mt-1\">
            Track submissions and performance for your automation forms
          </p>
        </div>
        <div className=\"flex gap-2\">
          <Select value={selectedForm} onValueChange={setSelectedForm}>
            <SelectTrigger className=\"w-48\">
              <SelectValue placeholder=\"Select form\" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=\"all\">All Forms</SelectItem>
              {forms.map(form => (
                <SelectItem key={form.id} value={form.id}>
                  {form.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className=\"w-32\">
              <SelectValue placeholder=\"Time range\" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=\"7d\">Last 7 days</SelectItem>
              <SelectItem value=\"30d\">Last 30 days</SelectItem>
              <SelectItem value=\"90d\">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
            <div className=\"text-2xl font-bold\">{averageConversion}%</div>
            <p className=\"text-xs text-muted-foreground\">
              <span className=\"text-green-600\">+2.3%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=\"flex flex-row items-center justify-between space-y-0 pb-2\">
            <CardTitle className=\"text-sm font-medium\">Top Performing Form</CardTitle>
            <Activity className=\"h-4 w-4 text-muted-foreground\" />
          </CardHeader>
          <CardContent>
            <div className=\"text-lg font-bold truncate\">{topForm?.name || 'N/A'}</div>
            <p className=\"text-xs text-muted-foreground\">
              {topForm?._count.submissions || 0} submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=\"flex flex-row items-center justify-between space-y-0 pb-2\">
            <CardTitle className=\"text-sm font-medium\">Active Forms</CardTitle>
            <Mail className=\"h-4 w-4 text-muted-foreground\" />
          </CardHeader>
          <CardContent>
            <div className=\"text-2xl font-bold\">
              {forms.filter(form => form.status === 'PUBLISHED').length}
            </div>
            <p className=\"text-xs text-muted-foreground\">
              {forms.length} total forms
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6\">
        {/* Submissions Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Submissions Over Time</CardTitle>
            <CardDescription>
              Track form submissions and conversions
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
                    dataKey=\"conversions\" 
                    stroke=\"#82ca9d\" 
                    strokeWidth={2}
                    name=\"Conversions\"
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
                <BarChart 
                  data={forms.map(form => ({
                    name: form.name.length > 15 ? form.name.substring(0, 15) + '...' : form.name,
                    submissions: form._count.submissions
                  }))}
                >
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

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <div className=\"flex items-center justify-between\">
            <div>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>
                Latest form submissions and their details
              </CardDescription>
            </div>
            <Button onClick={exportSubmissions} className=\"gap-2\" variant=\"outline\">
              <Download size={16} />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className=\"text-center py-8\">
              <Activity className=\"mx-auto h-8 w-8 animate-spin text-gray-400 mb-4\" />
              <p className=\"text-gray-600\">Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className=\"text-center py-8\">
              <Mail className=\"mx-auto h-12 w-12 text-gray-400 mb-4\" />
              <h3 className=\"text-lg font-medium text-gray-900 dark:text-white mb-2\">
                No submissions yet
              </h3>
              <p className=\"text-gray-600 dark:text-gray-300\">
                Submissions will appear here once users start filling out your forms.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Form</TableHead>
                  <TableHead>Data Preview</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className=\"text-right\">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.slice(0, 10).map((submission) => {
                  const submissionData = JSON.parse(submission.data)
                  const preview = Object.keys(submissionData).slice(0, 2)
                    .map(key => `${key}: ${submissionData[key]}`)
                    .join(', ')
                  
                  return (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <div className=\"font-medium\">{submission.form.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className=\"text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate\">
                          {preview || 'No data'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant=\"outline\">{submission.source || 'web'}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className=\"text-sm text-gray-600 dark:text-gray-300\">
                          {submission.ipAddress || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className=\"text-sm\">
                          {format(new Date(submission.createdAt), 'MMM dd, yyyy')}
                        </div>
                        <div className=\"text-xs text-gray-500\">
                          {format(new Date(submission.createdAt), 'h:mm a')}
                        </div>
                      </TableCell>
                      <TableCell className=\"text-right\">
                        <Button variant=\"ghost\" size=\"sm\">
                          <Eye size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}