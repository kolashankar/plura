'use client'

import { useState } from 'react'
import { ExternalLink, Send, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

interface AutomationForm {
  id: string
  name: string
  description?: string
  automationType: string
  category?: string
  icon?: string
  workflowUrl?: string
  webhookUrl?: string
  emailSubject?: string
  emailBody?: string
  successUrl?: string
  errorUrl?: string
  _count: {
    submissions: number
  }
}

interface FormField {
  id: string
  name: string
  label: string
  type: string
  required: boolean
  placeholder?: string
  defaultValue?: string
  options?: string
  validation?: string
}

interface AutomationFormDialogProps {
  form: AutomationForm
  open: boolean
  onClose: () => void
  individualId: string
}

export function AutomationFormDialog({ form, open, onClose, individualId }: AutomationFormDialogProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [formFields, setFormFields] = useState<FormField[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchFormFields = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/automation-forms/${form.id}/fields`)
      if (response.ok) {
        const data = await response.json()
        setFormFields(data.fields || [])
        
        // Initialize form data with default values
        const initialData: Record<string, string> = {}
        data.fields.forEach((field: FormField) => {
          if (field.defaultValue) {
            initialData[field.name] = field.defaultValue
          }
        })
        setFormData(initialData)
      }
    } catch (error) {
      console.error('Error fetching form fields:', error)
      toast({
        title: 'Error',
        description: 'Failed to load form fields',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    const requiredFields = formFields.filter(field => field.required)
    const missingFields = requiredFields.filter(field => !formData[field.name]?.trim())
    
    if (missingFields.length > 0) {
      toast({
        title: 'Validation Error',
        description: `Please fill in all required fields: ${missingFields.map(f => f.label).join(', ')}`,
        variant: 'destructive'
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Submit to webhook URL
      if (form.webhookUrl) {
        const response = await fetch(form.webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            formId: form.id,
            individualId,
            timestamp: new Date().toISOString(),
            data: formData
          })
        })

        if (response.ok) {
          toast({
            title: 'Success',
            description: 'Form submitted successfully! Automation workflow has been triggered.',
          })
          
          // Trigger external workflow if configured
          if (form.workflowUrl) {
            await fetch(form.workflowUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                formId: form.id,
                formName: form.name,
                automationType: form.automationType,
                individualId,
                timestamp: new Date().toISOString(),
                data: formData
              })
            })
          }

          // Redirect to success URL if configured
          if (form.successUrl) {
            window.open(form.successUrl, '_blank')
          }
          
          onClose()
        } else {
          throw new Error('Failed to submit form')
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit form. Please try again.',
        variant: 'destructive'
      })
      
      // Redirect to error URL if configured
      if (form.errorUrl) {
        window.open(form.errorUrl, '_blank')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderFormField = (field: FormField) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      value: formData[field.name] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        handleInputChange(field.name, e.target.value),
      placeholder: field.placeholder,
      required: field.required,
      'data-testid': `input-${field.name}`
    }

    switch (field.type) {
      case 'textarea':
        return <Textarea {...commonProps} rows={4} />
      case 'select':
        const options = field.options ? JSON.parse(field.options) : []
        return (
          <select {...commonProps} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
            <option value="">Select an option</option>
            {options.map((option: string, index: number) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        )
      case 'email':
        return <Input {...commonProps} type="email" />
      case 'tel':
        return <Input {...commonProps} type="tel" />
      case 'number':
        return <Input {...commonProps} type="number" />
      case 'url':
        return <Input {...commonProps} type="url" />
      default:
        return <Input {...commonProps} type="text" />
    }
  }

  const handleOpen = () => {
    if (open) {
      fetchFormFields()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" onInteractOutside={handleOpen}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {form.icon && <span className="text-2xl">{form.icon}</span>}
            <div>
              <div>{form.name}</div>
              <div className="text-sm font-normal text-gray-600">
                {form.automationType.replace('_', ' ').toLowerCase().replace(/^\\w/, c => c.toUpperCase())}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {form.description && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {form.description}
              </AlertDescription>
            </Alert>
          )}

          {/* Form Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <CheckCircle2 size={14} />
              <span>{form._count.submissions} submissions</span>
            </div>
            {form.workflowUrl && (
              <Badge variant="outline" className="text-xs">
                <ExternalLink size={12} className="mr-1" />
                External Workflow
              </Badge>
            )}
          </div>

          {/* Form Fields */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {formFields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.name} className="flex items-center gap-2">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </Label>
                  {renderFormField(field)}
                </div>
              ))}

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || formFields.length === 0} data-testid="button-submit-form">
                  {isSubmitting ? (
                    <>
                      <Clock className="animate-spin h-4 w-4 mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit & Trigger Automation
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}