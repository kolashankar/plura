'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash2, Mail, Settings, Users } from 'lucide-react'
import { FormFieldBuilder } from './form-field-builder'

const createFormSchema = z.object({
  name: z.string().min(1, 'Form name is required'),
  description: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  automationType: z.enum(['EMAIL_MARKETING', 'LEAD_GENERATION', 'SOCIAL_MEDIA', 'ANALYTICS', 'CUSTOM_WORKFLOW', 'CUSTOMER_SUPPORT', 'ECOMMERCE', 'DATA_SYNC']).default('CUSTOM_WORKFLOW'),
  category: z.string().optional(),
  icon: z.string().optional(),
  workflowUrl: z.string().url().optional().or(z.literal('')),
  keywords: z.string().optional(),
  emailSubject: z.string().optional(),
  emailBody: z.string().optional(),
  successUrl: z.string().url().optional().or(z.literal('')),
  errorUrl: z.string().url().optional().or(z.literal('')),
  accountType: z.enum(['individual', 'subaccount', 'system']).default('system'),
  accountId: z.string().optional(),
  isPublic: z.boolean().default(false),
  restrictToAgency: z.boolean().default(false),
  restrictToIndividual: z.boolean().default(false),
  allowedPlans: z.array(z.string()).optional(),
})

type CreateFormData = z.infer<typeof createFormSchema>

interface FormField {
  id: string
  name: string
  label: string
  type: 'TEXT' | 'EMAIL' | 'NUMBER' | 'TEXTAREA' | 'SELECT' | 'RADIO' | 'CHECKBOX' | 'FILE' | 'DATE' | 'PHONE'
  required: boolean
  placeholder?: string
  defaultValue?: string
  options?: string[]
  validation?: Record<string, any>
}

interface CreateFormDialogProps {
  open: boolean
  onClose: () => void
  onFormCreated: () => void
}

export function CreateFormDialog({ open, onClose, onFormCreated }: CreateFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [fields, setFields] = useState<FormField[]>([])
  const [accounts, setAccounts] = useState<any[]>([]) // Would be populated from API

  const form = useForm<CreateFormData>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'DRAFT',
      automationType: 'CUSTOM_WORKFLOW',
      category: '',
      icon: '',
      workflowUrl: '',
      keywords: '',
      emailSubject: '',
      emailBody: '',
      successUrl: '',
      errorUrl: '',
      accountType: 'system',
      accountId: '',
      isPublic: false,
      restrictToAgency: false,
      restrictToIndividual: false,
      allowedPlans: []
    },
  })

  const handleSubmit = async (data: CreateFormData) => {
    try {
      setLoading(true)

      const requestData = {
        ...data,
        fields: fields.map((field, index) => ({
          ...field,
          order: index
        })),
        ...(data.accountType === 'individual' && data.accountId && { individualId: data.accountId }),
        ...(data.accountType === 'subaccount' && data.accountId && { subAccountId: data.accountId }),
      }

      const response = await fetch('/api/admin/automation-forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (response.ok) {
        onFormCreated()
        form.reset()
        setFields([])
        setActiveTab('basic')
      } else {
        const error = await response.json()
        console.error('Error creating form:', error)
      }
    } catch (error) {
      console.error('Error creating form:', error)
    } finally {
      setLoading(false)
    }
  }

  const addField = () => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      name: `field_${fields.length + 1}`,
      label: `Field ${fields.length + 1}`,
      type: 'TEXT',
      required: false,
      placeholder: '',
      defaultValue: '',
      options: [],
      validation: {}
    }
    setFields([...fields, newField])
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ))
  }

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className=\"max-w-4xl max-h-[90vh] overflow-y-auto\">
        <DialogHeader>
          <DialogTitle>Create Automation Form</DialogTitle>
          <DialogDescription>
            Create a custom form that can trigger email automations and workflows.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className=\"space-y-6\">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className=\"grid w-full grid-cols-3\">
                <TabsTrigger value=\"basic\">Basic Info</TabsTrigger>
                <TabsTrigger value=\"fields\">Form Fields</TabsTrigger>
                <TabsTrigger value=\"automation\">Automation</TabsTrigger>
              </TabsList>

              <TabsContent value=\"basic\" className=\"space-y-6\">
                <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
                  <FormField
                    control={form.control}
                    name=\"name\"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Form Name</FormLabel>
                        <FormControl>
                          <Input placeholder=\"Contact Form\" {...field} />
                        </FormControl>
                        <FormDescription>
                          A descriptive name for your automation form
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name=\"status\"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder=\"Select status\" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value=\"DRAFT\">
                              <div className=\"flex items-center gap-2\">
                                <Badge className=\"bg-yellow-100 text-yellow-800\">Draft</Badge>
                              </div>
                            </SelectItem>
                            <SelectItem value=\"PUBLISHED\">
                              <div className=\"flex items-center gap-2\">
                                <Badge className=\"bg-green-100 text-green-800\">Published</Badge>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name=\"description\"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder=\"Describe what this form is used for...\"
                          {...field}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">
                  <FormField
                    control={form.control}
                    name=\"automationType\"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Automation Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder=\"Select automation type\" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value=\"EMAIL_MARKETING\">📧 Email Marketing</SelectItem>
                            <SelectItem value=\"LEAD_GENERATION\">🎯 Lead Generation</SelectItem>
                            <SelectItem value=\"SOCIAL_MEDIA\">📱 Social Media</SelectItem>
                            <SelectItem value=\"ANALYTICS\">📊 Analytics</SelectItem>
                            <SelectItem value=\"CUSTOM_WORKFLOW\">⚡ Custom Workflow</SelectItem>
                            <SelectItem value=\"CUSTOMER_SUPPORT\">🎧 Customer Support</SelectItem>
                            <SelectItem value=\"ECOMMERCE\">🛒 E-commerce</SelectItem>
                            <SelectItem value=\"DATA_SYNC\">🔄 Data Sync</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name=\"category\"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder=\"e.g., Lead Gen, Support\" {...field} />
                        </FormControl>
                        <FormDescription>
                          Group similar forms together
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name=\"icon\"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon</FormLabel>
                        <FormControl>
                          <Input placeholder=\"📧\" {...field} />
                        </FormControl>
                        <FormDescription>
                          Emoji or icon for the form
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
                  <FormField
                    control={form.control}
                    name=\"successUrl\"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Success Redirect URL</FormLabel>
                        <FormControl>
                          <Input placeholder=\"https://example.com/thank-you\" {...field} />
                        </FormControl>
                        <FormDescription>
                          Where to redirect after successful submission
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name=\"errorUrl\"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Error Redirect URL</FormLabel>
                        <FormControl>
                          <Input placeholder=\"https://example.com/error\" {...field} />
                        </FormControl>
                        <FormDescription>
                          Where to redirect if submission fails
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className=\"text-lg flex items-center gap-2\">
                      <Users size={20} />
                      Account Assignment
                    </CardTitle>
                    <CardDescription>
                      Assign this form to a specific account or keep it system-wide
                    </CardDescription>
                  </CardHeader>
                  <CardContent className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
                    <FormField
                      control={form.control}
                      name=\"accountType\"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder=\"Select account type\" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value=\"system\">
                                <div className=\"flex items-center gap-2\">
                                  <Settings size={16} />
                                  System (Global)
                                </div>
                              </SelectItem>
                              <SelectItem value=\"individual\">
                                <div className=\"flex items-center gap-2\">
                                  <Mail size={16} />
                                  Individual Account
                                </div>
                              </SelectItem>
                              <SelectItem value=\"subaccount\">
                                <div className=\"flex items-center gap-2\">
                                  <Users size={16} />
                                  Sub Account
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch('accountType') !== 'system' && (
                      <FormField
                        control={form.control}
                        name=\"accountId\"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {form.watch('accountType') === 'individual' ? 'Individual' : 'Sub Account'}
                            </FormLabel>
                            <FormControl>
                              <Input placeholder=\"Account ID or search...\" {...field} />
                            </FormControl>
                            <FormDescription>
                              Enter the {form.watch('accountType')} ID
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value=\"fields\" className=\"space-y-6\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <h3 className=\"text-lg font-medium\">Form Fields</h3>
                    <p className=\"text-sm text-gray-600 dark:text-gray-300\">
                      Define the fields that users will fill out
                    </p>
                  </div>
                  <Button type=\"button\" onClick={addField} className=\"gap-2\">
                    <Plus size={16} />
                    Add Field
                  </Button>
                </div>

                {fields.length === 0 ? (
                  <Card>
                    <CardContent className=\"p-8 text-center\">
                      <Mail className=\"mx-auto h-12 w-12 text-gray-400 mb-4\" />
                      <h3 className=\"text-lg font-medium text-gray-900 dark:text-white mb-2\">
                        No fields added yet
                      </h3>
                      <p className=\"text-gray-600 dark:text-gray-300 mb-4\">
                        Add form fields to collect data from users.
                      </p>
                      <Button onClick={addField}>Add Your First Field</Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className=\"space-y-4\">
                    {fields.map((field, index) => (
                      <FormFieldBuilder
                        key={field.id}
                        field={field}
                        index={index}
                        onUpdate={updateField}
                        onRemove={removeField}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value=\"automation\" className=\"space-y-6\">
                <Card>
                  <CardHeader>
                    <CardTitle className=\"text-lg flex items-center gap-2\">
                      <Settings size={20} />
                      Workflow Integration
                    </CardTitle>
                    <CardDescription>
                      Connect this form to external workflows and automation platforms
                    </CardDescription>
                  </CardHeader>
                  <CardContent className=\"space-y-4\">
                    <FormField
                      control={form.control}
                      name=\"workflowUrl\"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Workflow URL</FormLabel>
                          <FormControl>
                            <Input placeholder=\"https://hooks.zapier.com/hooks/catch/...\" {...field} />
                          </FormControl>
                          <FormDescription>
                            External workflow URL (n8n, Zapier, Make.com, etc.) to trigger when form is submitted
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name=\"keywords\"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Keywords to Search</FormLabel>
                          <FormControl>
                            <Input placeholder=\"email, contact, lead, urgent\" {...field} />
                          </FormControl>
                          <FormDescription>
                            Comma-separated keywords to search for in form submissions for conditional automation
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className=\"text-lg flex items-center gap-2\">
                      <Mail size={20} />
                      Email Automation
                    </CardTitle>
                    <CardDescription>
                      Configure automatic email responses for form submissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className=\"space-y-4\">
                    <FormField
                      control={form.control}
                      name=\"emailSubject\"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Subject</FormLabel>
                          <FormControl>
                            <Input placeholder=\"Thank you for your submission\" {...field} />
                          </FormControl>
                          <FormDescription>
                            Subject line for automated emails. Use {'{{'}}name{'}}'} for dynamic fields.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name=\"emailBody\"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Body</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder=\"Hi {{''}}{name},{'\n\n'}Thank you for submitting the form...\"
                              {...field}
                              rows={6}
                            />
                          </FormControl>
                          <FormDescription>
                            Email body template. Use {'{{'}}fieldName{'}}'} to insert form data.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className=\"text-lg flex items-center gap-2\">
                      <Users size={20} />
                      Access Control
                    </CardTitle>
                    <CardDescription>
                      Control who can access and use this automation form
                    </CardDescription>
                  </CardHeader>
                  <CardContent className=\"space-y-4\">
                    <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4\">
                      <FormField
                        control={form.control}
                        name=\"isPublic\"
                        render={({ field }) => (
                          <FormItem className=\"flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm\">
                            <div className=\"space-y-0.5\">
                              <FormLabel>Public Access</FormLabel>
                              <FormDescription className=\"text-xs\">
                                Anyone can use this form
                              </FormDescription>
                            </div>
                            <FormControl>
                              <input
                                type=\"checkbox\"
                                checked={field.value}
                                onChange={field.onChange}
                                className=\"rounded border-gray-300\"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name=\"restrictToAgency\"
                        render={({ field }) => (
                          <FormItem className=\"flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm\">
                            <div className=\"space-y-0.5\">
                              <FormLabel>Agency Only</FormLabel>
                              <FormDescription className=\"text-xs\">
                                Only agency/subaccount users
                              </FormDescription>
                            </div>
                            <FormControl>
                              <input
                                type=\"checkbox\"
                                checked={field.value}
                                onChange={field.onChange}
                                className=\"rounded border-gray-300\"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name=\"restrictToIndividual\"
                        render={({ field }) => (
                          <FormItem className=\"flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm\">
                            <div className=\"space-y-0.5\">
                              <FormLabel>Individual Only</FormLabel>
                              <FormDescription className=\"text-xs\">
                                Only individual account users
                              </FormDescription>
                            </div>
                            <FormControl>
                              <input
                                type=\"checkbox\"
                                checked={field.value}
                                onChange={field.onChange}
                                className=\"rounded border-gray-300\"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className=\"flex justify-end gap-4 pt-6 border-t\">
              <Button type=\"button\" variant=\"outline\" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type=\"submit\" disabled={loading}>
                {loading ? 'Creating...' : 'Create Form'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

interface CreateFormDialogProps {
  open: boolean
  onClose: () => void
  onFormCreated: () => void
}

export function CreateFormDialog({
  open,
  onClose,
  onFormCreated
}: CreateFormDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    accountType: '',
    accountId: ''
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Form name is required',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/automation-forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Automation form created successfully'
        })
        onFormCreated()
        setFormData({ name: '', description: '', accountType: '', accountId: '' })
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.message || 'Failed to create form',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Automation Form</DialogTitle>
          <DialogDescription>
            Create a new automation form for agencies or individuals
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Form Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter form name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountType">Account Type</Label>
              <Select 
                value={formData.accountType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, accountType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="subaccount">Sub Account</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter form description (optional)"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Form'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
