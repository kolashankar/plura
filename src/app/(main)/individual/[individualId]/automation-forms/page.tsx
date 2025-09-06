'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Plus, Search, Filter, Copy, ExternalLink, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Reuse components from subaccount (they're generic enough)
import { UserFormTable } from '../../subaccount/[subaccountId]/automation-forms/_components/user-form-table'
import { CreateIndividualFormDialog } from './_components/create-individual-form-dialog'
import { FormSubmissionAnalytics } from '../../subaccount/[subaccountId]/automation-forms/_components/form-submission-analytics'

interface AutomationForm {
  id: string
  name: string
  description?: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  webhookUrl?: string
  createdAt: string
  updatedAt: string
  _count: {
    submissions: number
    automations: number
  }
}

export default function IndividualAutomationFormsPage() {
  const params = useParams()
  const individualId = params.individualId as string
  
  const [forms, setForms] = useState<AutomationForm[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all'
  })
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedTab, setSelectedTab] = useState('forms')

  const fetchForms = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        individualId,
        search: filters.search,
        status: filters.status
      })

      const response = await fetch(`/api/automation-forms?${params}`)
      if (response.ok) {
        const data = await response.json()
        setForms(data.forms || [])
      }
    } catch (error) {
      console.error('Error fetching automation forms:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchForms()
  }, [filters, individualId])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleFormCreated = () => {
    setShowCreateDialog(false)
    fetchForms()
  }

  const totalSubmissions = forms.reduce((sum, form) => sum + form._count.submissions, 0)
  const publishedForms = forms.filter(form => form.status === 'PUBLISHED').length

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className=\"text-3xl font-bold text-gray-900 dark:text-white\">Automation Forms</h1>
          <p className=\"text-gray-600 dark:text-gray-300 mt-2\">
            Create and manage custom forms with automated email workflows
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className=\"gap-2\">
          <Plus size={16} />
          Create Form
        </Button>
      </div>

      {/* Quick Stats */}
      <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">
        <Card>
          <CardHeader className=\"flex flex-row items-center justify-between space-y-0 pb-2\">
            <CardTitle className=\"text-sm font-medium\">Active Forms</CardTitle>
            <Settings className=\"h-4 w-4 text-muted-foreground\" />
          </CardHeader>
          <CardContent>
            <div className=\"text-2xl font-bold\">{publishedForms}</div>
            <p className=\"text-xs text-muted-foreground\">
              {forms.length} total forms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=\"flex flex-row items-center justify-between space-y-0 pb-2\">
            <CardTitle className=\"text-sm font-medium\">Total Submissions</CardTitle>
            <Filter className=\"h-4 w-4 text-muted-foreground\" />
          </CardHeader>
          <CardContent>
            <div className=\"text-2xl font-bold\">{totalSubmissions}</div>
            <p className=\"text-xs text-muted-foreground\">
              Across all forms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=\"flex flex-row items-center justify-between space-y-0 pb-2\">
            <CardTitle className=\"text-sm font-medium\">Email Automations</CardTitle>
            <ExternalLink className=\"h-4 w-4 text-muted-foreground\" />
          </CardHeader>
          <CardContent>
            <div className=\"text-2xl font-bold\">
              {forms.reduce((sum, form) => sum + form._count.automations, 0)}
            </div>
            <p className=\"text-xs text-muted-foreground\">
              Automated responses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className=\"space-y-6\">
        <TabsList className=\"grid w-full grid-cols-2\">
          <TabsTrigger value=\"forms\">Forms Management</TabsTrigger>
          <TabsTrigger value=\"analytics\">Analytics & Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value=\"forms\" className=\"space-y-6\">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className=\"text-lg\">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className=\"flex flex-col sm:flex-row gap-4\">
                <div className=\"relative flex-1\">
                  <Search className=\"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400\" size={16} />
                  <Input
                    placeholder=\"Search forms...\"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className=\"pl-10\"
                  />
                </div>

                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger className=\"w-full sm:w-32\">
                    <SelectValue placeholder=\"Status\" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=\"all\">All Status</SelectItem>
                    <SelectItem value=\"draft\">Draft</SelectItem>
                    <SelectItem value=\"published\">Published</SelectItem>
                    <SelectItem value=\"archived\">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Forms Table */}
          <Card>
            <CardHeader>
              <CardTitle>Your Automation Forms</CardTitle>
              <CardDescription>
                Manage your custom forms and their email automation workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserFormTable
                forms={forms}
                loading={loading}
                onRefresh={fetchForms}
                subaccountId={individualId} // Reusing the prop name but passing individualId
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value=\"analytics\" className=\"space-y-6\">
          <FormSubmissionAnalytics forms={forms} subaccountId={individualId} />
        </TabsContent>
      </Tabs>

      {/* Create Form Dialog */}
      <CreateIndividualFormDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onFormCreated={handleFormCreated}
        individualId={individualId}
      />
    </div>
  )
}