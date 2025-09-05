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
import { Plus, Trash2, Mail, Settings } from 'lucide-react'
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

interface CreateUserFormDialogProps {
  open: boolean
  onClose: () => void
  onFormCreated: () => void
  subaccountId: string
}

export function CreateUserFormDialog({ 
  open, 
  onClose, 
  onFormCreated, 
  subaccountId 
}: CreateUserFormDialogProps) {
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
    }
  ])

  const form = useForm<CreateFormData>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'DRAFT',
      emailSubject: 'Thank you for your submission',
      emailBody: 'Hi {{name}},\\n\\nThank you for submitting the form. We have received your information and will get back to you soon.\\n\\nBest regards,\\nYour Team',
      successUrl: '',
      errorUrl: '',
    },
  })

  const handleSubmit = async (data: CreateFormData) => {
    try {
      setLoading(true)

      const requestData = {
        ...data,
        subAccountId: subaccountId,
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
          title: 'Form Created',
          description: `\"${data.name}\" has been created successfully`,
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
        title: 'Error',
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
      name: `field_${fields.length + 1}`,
      label: `Field ${fields.length + 1}`,
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
          <DialogTitle>Create Automation Form</DialogTitle>
          <DialogDescription>
            Create a custom form that automatically triggers workflows when submitted.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className=\"space-y-6\">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className=\"grid w-full grid-cols-3\">
                <TabsTrigger value=\"basic\">Basic Info</TabsTrigger>
                <TabsTrigger value=\"fields\">Form Fields</TabsTrigger>
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
                          A descriptive name for your form
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

                <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
                  <FormField
                    control={form.control}
                    name=\"successUrl\"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Success Redirect URL (Optional)</FormLabel>
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
                        <FormLabel>Error Redirect URL (Optional)</FormLabel>
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
              </TabsContent>

              <TabsContent value=\"fields\" className=\"space-y-6\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <h3 className=\"text-lg font-medium\">Form Fields</h3>
                    <p className=\"text-sm text-gray-600 dark:text-gray-300\">
                      Customize the fields users will fill out ({fields.length} fields)
                    </p>
                  </div>
                  <Button type=\"button\" onClick={addField} className=\"gap-2\">
                    <Plus size={16} />
                    Add Field
                  </Button>
                </div>

                <div className=\"space-y-4\">
                  {fields.map((field, index) => (
                    <Card key={field.id} className=\"border-l-4 border-l-blue-500\">
                      <CardHeader className=\"pb-3\">
                        <div className=\"flex items-center justify-between\">
                          <CardTitle className=\"text-sm font-medium\">
                            Field {index + 1}: {field.label}
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