'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Settings, ExternalLink, AlertCircle, CheckCircle2, Zap, Mail, Users, Globe, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AutomationFormDialog } from './_components/automation-form-dialog'

interface AutomationForm {
  id: string
  name: string
  description?: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  automationType: string
  category?: string
  icon?: string
  workflowUrl?: string
  webhookUrl?: string
  isPublic: boolean
  restrictToAgency: boolean
  restrictToIndividual: boolean
  createdAt: string
  _count: {
    submissions: number
  }
}

export default function IndividualAutomationSettingsPage() {
  const params = useParams()
  const individualId = params.IndividualId as string
  
  const [forms, setForms] = useState<AutomationForm[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedForm, setSelectedForm] = useState<AutomationForm | null>(null)
  const [showFormDialog, setShowFormDialog] = useState(false)
  const [restrictionMessage, setRestrictionMessage] = useState<string | null>(null)

  const fetchAvailableForms = async () => {
    try {
      setLoading(true)
      setRestrictionMessage(null)
      
      const response = await fetch(`/api/automation-settings/available?individualId=${individualId}&userType=individual`)
      
      if (response.ok) {
        const data = await response.json()
        setForms(data.forms || [])
      } else if (response.status === 403) {
        const data = await response.json()
        setRestrictionMessage(data.message)
      }
    } catch (error) {
      console.error('Error fetching available automation forms:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAvailableForms()
  }, [individualId])

  const getAutomationTypeIcon = (type: string) => {
    switch (type) {
      case 'EMAIL_MARKETING':
        return <Mail className="h-5 w-5 text-blue-600" />
      case 'LEAD_GENERATION':
        return <Users className="h-5 w-5 text-green-600" />
      case 'SOCIAL_MEDIA':
        return <Globe className="h-5 w-5 text-purple-600" />
      case 'ANALYTICS':
        return <CheckCircle2 className="h-5 w-5 text-orange-600" />
      case 'CUSTOM_WORKFLOW':
        return <Zap className="h-5 w-5 text-yellow-600" />
      default:
        return <Settings className="h-5 w-5 text-gray-600" />
    }
  }

  const getAccessBadge = (form: AutomationForm) => {
    if (form.isPublic) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Public</Badge>
    }
    if (form.restrictToIndividual) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Individual</Badge>
    }
    return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Private</Badge>
  }

  const handleFormAccess = (form: AutomationForm) => {
    setSelectedForm(form)
    setShowFormDialog(true)
  }

  const categorizedForms = forms.reduce((acc, form) => {
    const category = form.category || 'General'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(form)
    return acc
  }, {} as Record<string, AutomationForm[]>)

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (restrictionMessage) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Automation Settings</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Access automation forms and workflows
          </p>
        </div>
        
        <Alert variant="destructive">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            {restrictionMessage}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Automation Settings</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Access automation forms and workflows available for individual accounts
          </p>
        </div>
      </div>

      {forms.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No automation forms are currently available for individual accounts. Contact your administrator to access automation workflows.
          </AlertDescription>
        </Alert>
      )}

      {/* Automation Forms by Category */}
      {Object.keys(categorizedForms).length > 0 && (
        <Tabs defaultValue={Object.keys(categorizedForms)[0]} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            {Object.keys(categorizedForms).map((category) => (
              <TabsTrigger key={category} value={category}>
                {category} ({categorizedForms[category].length})
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(categorizedForms).map(([category, categoryForms]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryForms.map((form) => (
                  <Card key={form.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleFormAccess(form)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {form.icon ? (
                            <span className="text-2xl">{form.icon}</span>
                          ) : (
                            getAutomationTypeIcon(form.automationType)
                          )}
                          <div>
                            <CardTitle className="text-lg">{form.name}</CardTitle>
                            <CardDescription className="text-sm">
                              {form.automationType.replace('_', ' ').toLowerCase().replace(/^\\w/, c => c.toUpperCase())}
                            </CardDescription>
                          </div>
                        </div>
                        {getAccessBadge(form)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {form.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                          {form.description.length > 80
                            ? `${form.description.substring(0, 80)}...`
                            : form.description
                          }
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <CheckCircle2 size={14} />
                          <span>{form._count.submissions} submissions</span>
                        </div>
                        
                        <Button size="sm" variant="outline" data-testid={`button-access-${form.id}`}>
                          <ExternalLink size={14} className="mr-2" />
                          Access Form
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Automation Form Dialog */}
      {selectedForm && (
        <AutomationFormDialog
          form={selectedForm}
          open={showFormDialog}
          onClose={() => setShowFormDialog(false)}
          individualId={individualId}
        />
      )}
    </div>
  )
}