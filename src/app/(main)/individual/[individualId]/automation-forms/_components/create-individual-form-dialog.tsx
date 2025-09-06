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
import { Plus, Trash2, Mail, User } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const createFormSchema = z.object({
  name: z.string().min(1, 'Form name is required'),
  description: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  emailSubject: z.string().optional(),
  emailBody: z.string().optional(),
  successUrl: z.string().url().optional().or(z.literal('')),
  errorUrl: z.string().url().optional().or(z.literal('')),
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
}

interface CreateIndividualFormDialogProps {
  open: boolean
  onClose: () => void
  onFormCreated: () => void
  individualId: string
}

export function CreateIndividualFormDialog({ 
  open, 
  onClose, 
  onFormCreated, 
  individualId 
}: CreateIndividualFormDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [fields, setFields] = useState<FormField[]>([
    {
      id: crypto.randomUUID(),
      name: 'name',
      label: 'Full Name',
      type: 'TEXT',
      required: true,
      placeholder: 'Enter your full name'
    },
    {
      id: crypto.randomUUID(),
      name: 'email',
      label: 'Email Address',
      type: 'EMAIL',
      required: true,
      placeholder: 'Enter your email'
    },
    {
      id: crypto.randomUUID(),
      name: 'message',
      label: 'Message',
      type: 'TEXTAREA',
      required: false,
      placeholder: 'Enter your message...'
    }
  ])

  const form = useForm<CreateFormData>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'DRAFT',
      emailSubject: 'Thank you for contacting us!',
      emailBody: 'Hi {{name}},\\n\\nThank you for reaching out to us. We have received your message and will get back to you within 24 hours.\\n\\nYour message:\\n{{message}}\\n\\nBest regards,\\nYour Team',
      successUrl: '',
      errorUrl: '',
    },
  })

  const handleSubmit = async (data: CreateFormData) => {
    try {
      setLoading(true)

      const requestData = {
        ...data,
        individualId: individualId,
        fields: fields.map((field, index) => ({
          ...field,
          order: index
        }))
      }

      const response = await fetch('/api/automation-forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (response.ok) {
        const createdForm = await response.json()
        
        toast({
          title: 'Form Created Successfully!',
          description: `\"${data.name}\" is ready to collect submissions.`,
        })
        
        onFormCreated()
        form.reset()
        setActiveTab('basic')
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create form')
      }
    } catch (error) {
      toast({
        title: 'Error Creating Form',
        description: error instanceof Error ? error.message : 'Failed to create form',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const addField = () => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      name: `custom_field_${fields.length + 1}`,
      label: `Custom Field ${fields.length + 1}`,
      type: 'TEXT',
      required: false,
      placeholder: '',
      defaultValue: '',
      options: []
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

  const fieldTypeOptions = [
    { value: 'TEXT', label: 'Text Input' },
    { value: 'EMAIL', label: 'Email' },
    { value: 'NUMBER', label: 'Number' },
    { value: 'PHONE', label: 'Phone' },
    { value: 'TEXTAREA', label: 'Text Area' },
    { value: 'SELECT', label: 'Dropdown' },
    { value: 'RADIO', label: 'Radio Buttons' },
    { value: 'CHECKBOX', label: 'Checkboxes' },
    { value: 'DATE', label: 'Date Picker' },
    { value: 'FILE', label: 'File Upload' }
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className=\"max-w-4xl max-h-[90vh] overflow-y-auto\">
        <DialogHeader>
          <DialogTitle className=\"flex items-center gap-2\">
            <User size={20} />
            Create Automation Form
          </DialogTitle>
          <DialogDescription>
            Create a custom form that automatically sends personalized email responses when submitted.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className=\"space-y-6\">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className=\"grid w-full grid-cols-3\">
                <TabsTrigger value=\"basic\">Basic Info</TabsTrigger>
                <TabsTrigger value=\"fields\">Form Fields ({fields.length})</TabsTrigger>
                <TabsTrigger value=\"automation\">Email Automation</TabsTrigger>
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
                          Give your form a descriptive name
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
                              <Badge className=\"bg-yellow-100 text-yellow-800\">Draft</Badge>
                            </SelectItem>
                            <SelectItem value=\"PUBLISHED\">
                              <Badge className=\"bg-green-100 text-green-800\">Published</Badge>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Only published forms can receive submissions
                        </FormDescription>
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
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder=\"Describe what this form is used for...\"
                          {...field}
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        Help you remember what this form is for
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
                  <FormField
                    control={form.control}
                    name=\"successUrl\"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Success Page URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder=\"https://yoursite.com/thank-you\" {...field} />
                        </FormControl>
                        <FormDescription>
                          Redirect users here after successful submission
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
                        <FormLabel>Error Page URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder=\"https://yoursite.com/error\" {...field} />
                        </FormControl>
                        <FormDescription>
                          Redirect users here if submission fails
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value=\"fields\" className=\"space-y-6\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <h3 className=\"text-lg font-medium\">Form Fields</h3>
                    <p className=\"text-sm text-gray-600 dark:text-gray-300\">
                      Customize what information you want to collect
                    </p>
                  </div>
                  <Button type=\"button\" onClick={addField} className=\"gap-2\">
                    <Plus size={16} />
                    Add Field
                  </Button>
                </div>

                <div className=\"space-y-4\">
                  {fields.map((field, index) => (
                    <Card key={field.id} className=\"border-l-4 border-l-purple-500\">
                      <CardHeader className=\"pb-3\">
                        <div className=\"flex items-center justify-between\">
                          <CardTitle className=\"text-sm font-medium\">
                            {index + 1}. {field.label}
                          </CardTitle>
                          <Button
                            type=\"button\"
                            variant=\"ghost\"
                            size=\"sm\"
                            onClick={() => removeField(field.id)}
                            className=\"text-red-600 hover:text-red-700\"
                            disabled={fields.length <= 1}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className=\"space-y-4\">
                        <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4\">
                          <div>
                            <label className=\"text-sm font-medium mb-2 block\">Field Name</label>
                            <Input
                              value={field.name}
                              onChange={(e) => updateField(field.id, { name: e.target.value })}
                              placeholder=\"field_name\"
                            />
                          </div>
                          <div>
                            <label className=\"text-sm font-medium mb-2 block\">Display Label</label>
                            <Input
                              value={field.label}
                              onChange={(e) => updateField(field.id, { label: e.target.value })}
                              placeholder=\"Display Label\"
                            />
                          </div>
                          <div>
                            <label className=\"text-sm font-medium mb-2 block\">Field Type</label>
                            <Select 
                              value={field.type} 
                              onValueChange={(value) => updateField(field.id, { type: value as any })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {fieldTypeOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
                          <div>
                            <label className=\"text-sm font-medium mb-2 block\">Placeholder</label>
                            <Input
                              value={field.placeholder || ''}
                              onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                              placeholder=\"Enter placeholder text...\"
                            />
                          </div>
                          <div className=\"flex items-center space-x-2 pt-6\">
                            <input
                              type=\"checkbox\"
                              id={`required-${field.id}`}
                              checked={field.required}
                              onChange={(e) => updateField(field.id, { required: e.target.checked })}
                              className=\"h-4 w-4\"
                            />
                            <label htmlFor={`required-${field.id}`} className=\"text-sm font-medium\">
                              Required Field
                            </label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value=\"automation\" className=\"space-y-6\">
                <Card>
                  <CardHeader>
                    <CardTitle className=\"text-lg flex items-center gap-2\">
                      <Mail size={20} />
                      Automatic Email Response
                    </CardTitle>
                    <CardDescription>
                      Set up an automated email that gets sent to users when they submit your form
                    </CardDescription>
                  </CardHeader>
                  <CardContent className=\"space-y-4\">
                    <FormField
                      control={form.control}
                      name=\"emailSubject\"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Subject Line</FormLabel>
                          <FormControl>
                            <Input placeholder=\"Thank you for your submission\" {...field} />
                          </FormControl>
                          <FormDescription>
                            This will be the subject of the email sent to users. You can use {'{{'}}name{'}}'} to include their name.
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
                          <FormLabel>Email Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder=\"Hi {{''}}{name},{'\n\n'}Thank you for submitting the form...\"
                              {...field}
                              rows={8}
                            />
                          </FormControl>
                          <FormDescription>
                            The email message that will be sent. Use {'{{'}}fieldName{'}}'} to include form data. For example: {'{{'}}name{'}}'}, {'{{'}}email{'}}'}, {'{{'}}message{'}}'}.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className=\"bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg\">
                      <h4 className=\"font-medium text-blue-900 dark:text-blue-100 mb-2\">
                        💡 Tips for Email Templates
                      </h4>
                      <ul className=\"text-sm text-blue-800 dark:text-blue-200 space-y-1\">
                        <li>• Use {'{{'}}name{'}}'} to personalize the greeting</li>
                        <li>• Include {'{{'}}email{'}}'} to confirm their contact info</li>
                        <li>• Reference their {'{{'}}message{'}}'} to show you received it</li>
                        <li>• Keep it friendly and professional</li>
                      </ul>
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
                {loading ? 'Creating Form...' : 'Create Form'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}