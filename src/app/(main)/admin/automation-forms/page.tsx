'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Mail, Settings, Users, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AutomationFormTable } from './_components/automation-form-table'
import { CreateFormDialog } from './_components/create-form-dialog'
import { FormAnalytics } from './_components/form-analytics'

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

interface FormFilters {
  search: string
  status: string
  accountType: string
}

export default function AutomationFormsPage() {
  const [forms, setForms] = useState<AutomationForm[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FormFilters>({
    search: '',
    status: 'all',
    accountType: 'all'
  })
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
    hasMore: false
  })
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedTab, setSelectedTab] = useState('forms')

  const fetchForms = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        search: filters.search,
        status: filters.status,
        limit: pagination.limit.toString(),
        offset: pagination.offset.toString()
      })

      const response = await fetch(`/api/admin/automation-forms?${params}`)
      if (response.ok) {
        const data = await response.json()
        setForms(data.forms || [])
        setPagination(data.pagination || pagination)
      }
    } catch (error) {
      console.error('Error fetching automation forms:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchForms()
  }, [filters, pagination.offset])

  const handleFilterChange = (key: keyof FormFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, offset: 0 }))
  }

  const handleFormCreated = () => {
    setShowCreateDialog(false)
    fetchForms()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800'
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800'
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const totalSubmissions = forms.reduce((sum, form) => sum + form._count.submissions, 0)
  const totalForms = forms.length
  const publishedForms = forms.filter(form => form.status === 'PUBLISHED').length
  const averageSubmissions = totalForms > 0 ? Math.round(totalSubmissions / totalForms) : 0

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Automation Forms</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage and monitor custom automation forms across all accounts
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus size={16} />
          Create Form
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalForms}</div>
            <p className="text-xs text-muted-foreground">
              {publishedForms} published
            </p>
          </CardContent>
        </Card>

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
            <CardTitle className="text-sm font-medium">Active Automations</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {forms.reduce((sum, form) => sum + form._count.automations, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Connected workflows
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accounts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set([
                ...forms.filter(f => f.subAccountId).map(f => f.subAccountId),
                ...forms.filter(f => f.individualId).map(f => f.individualId)
              ]).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Using automation forms
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="forms">Forms Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder="Search forms..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.accountType} onValueChange={(value) => handleFilterChange('accountType', value)}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Account Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Accounts</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="subaccount">Sub Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Forms Table */}
          <Card>
            <CardHeader>
              <CardTitle>Automation Forms</CardTitle>
              <CardDescription>
                Manage automation forms and their configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AutomationFormTable
                forms={forms}
                loading={loading}
                pagination={pagination}
                onRefresh={fetchForms}
                onPageChange={(offset) => setPagination(prev => ({ ...prev, offset }))}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <FormAnalytics forms={forms} />
        </TabsContent>
      </Tabs>

      {/* Create Form Dialog */}
      <CreateFormDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onFormCreated={handleFormCreated}
      />
    </div>
  )
}