'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus, GripVertical, Type, Mail, Hash, FileText, List, Calendar, Phone, Upload } from 'lucide-react'

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

interface FormFieldBuilderProps {
  field: FormField
  index: number
  onUpdate: (id: string, updates: Partial<FormField>) => void
  onRemove: (id: string) => void
}

const fieldTypeIcons = {
  TEXT: Type,
  EMAIL: Mail,
  NUMBER: Hash,
  TEXTAREA: FileText,
  SELECT: List,
  RADIO: List,
  CHECKBOX: List,
  FILE: Upload,
  DATE: Calendar,
  PHONE: Phone
}

export function FormFieldBuilder({ field, index, onUpdate, onRemove }: FormFieldBuilderProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [newOption, setNewOption] = useState('')

  const Icon = fieldTypeIcons[field.type]

  const handleUpdate = (key: keyof FormField, value: any) => {
    onUpdate(field.id, { [key]: value })
  }

  const handleAddOption = () => {
    if (newOption.trim()) {
      const currentOptions = field.options || []
      onUpdate(field.id, { options: [...currentOptions, newOption.trim()] })
      setNewOption('')
    }
  }

  const handleRemoveOption = (optionIndex: number) => {
    const currentOptions = field.options || []
    onUpdate(field.id, { 
      options: currentOptions.filter((_, i) => i !== optionIndex) 
    })
  }

  const needsOptions = ['SELECT', 'RADIO', 'CHECKBOX'].includes(field.type)

  return (
    <Card className=\"border-l-4 border-l-blue-500\">
      <CardHeader className=\"pb-3\">
        <div className=\"flex items-center justify-between\">
          <div className=\"flex items-center gap-3\">
            <div className=\"flex items-center gap-2 text-blue-600\">
              <GripVertical size={16} className=\"text-gray-400 cursor-move\" />
              <Icon size={16} />
            </div>
            <div>
              <CardTitle className=\"text-sm font-medium\">
                Field {index + 1}: {field.label || field.name}
              </CardTitle>
              <Badge variant=\"outline\" className=\"mt-1\">
                {field.type}
              </Badge>
            </div>
          </div>
          <Button
            variant=\"ghost\"
            size=\"sm\"
            onClick={() => onRemove(field.id)}
            className=\"text-red-600 hover:text-red-700 hover:bg-red-50\"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className=\"space-y-4\">
        <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
          <div className=\"space-y-2\">
            <Label htmlFor={`field-name-${field.id}`}>Field Name</Label>
            <Input
              id={`field-name-${field.id}`}
              value={field.name}
              onChange={(e) => handleUpdate('name', e.target.value)}
              placeholder=\"field_name\"
            />
            <p className=\"text-xs text-gray-500\">
              Used as the key in form data (no spaces)
            </p>
          </div>

          <div className=\"space-y-2\">
            <Label htmlFor={`field-label-${field.id}`}>Display Label</Label>
            <Input
              id={`field-label-${field.id}`}
              value={field.label}
              onChange={(e) => handleUpdate('label', e.target.value)}
              placeholder=\"Display Label\"
            />
          </div>
        </div>

        <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
          <div className=\"space-y-2\">
            <Label htmlFor={`field-type-${field.id}`}>Field Type</Label>
            <Select value={field.type} onValueChange={(value) => handleUpdate('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder=\"Select field type\" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=\"TEXT\">
                  <div className=\"flex items-center gap-2\">
                    <Type size={14} />
                    Text Input
                  </div>
                </SelectItem>
                <SelectItem value=\"EMAIL\">
                  <div className=\"flex items-center gap-2\">
                    <Mail size={14} />
                    Email
                  </div>
                </SelectItem>
                <SelectItem value=\"NUMBER\">
                  <div className=\"flex items-center gap-2\">
                    <Hash size={14} />
                    Number
                  </div>
                </SelectItem>
                <SelectItem value=\"PHONE\">
                  <div className=\"flex items-center gap-2\">
                    <Phone size={14} />
                    Phone
                  </div>
                </SelectItem>
                <SelectItem value=\"TEXTAREA\">
                  <div className=\"flex items-center gap-2\">
                    <FileText size={14} />
                    Text Area
                  </div>
                </SelectItem>
                <SelectItem value=\"SELECT\">
                  <div className=\"flex items-center gap-2\">
                    <List size={14} />
                    Dropdown
                  </div>
                </SelectItem>
                <SelectItem value=\"RADIO\">
                  <div className=\"flex items-center gap-2\">
                    <List size={14} />
                    Radio Buttons
                  </div>
                </SelectItem>
                <SelectItem value=\"CHECKBOX\">
                  <div className=\"flex items-center gap-2\">
                    <List size={14} />
                    Checkboxes
                  </div>
                </SelectItem>
                <SelectItem value=\"DATE\">
                  <div className=\"flex items-center gap-2\">
                    <Calendar size={14} />
                    Date Picker
                  </div>
                </SelectItem>
                <SelectItem value=\"FILE\">
                  <div className=\"flex items-center gap-2\">
                    <Upload size={14} />
                    File Upload
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className=\"flex items-center space-x-2\">
            <Switch
              id={`field-required-${field.id}`}
              checked={field.required}
              onCheckedChange={(checked) => handleUpdate('required', checked)}
            />
            <Label htmlFor={`field-required-${field.id}`}>Required Field</Label>
          </div>
        </div>

        <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
          <div className=\"space-y-2\">
            <Label htmlFor={`field-placeholder-${field.id}`}>Placeholder Text</Label>
            <Input
              id={`field-placeholder-${field.id}`}
              value={field.placeholder || ''}
              onChange={(e) => handleUpdate('placeholder', e.target.value)}
              placeholder=\"Enter placeholder text...\"
            />
          </div>

          <div className=\"space-y-2\">
            <Label htmlFor={`field-default-${field.id}`}>Default Value</Label>
            <Input
              id={`field-default-${field.id}`}
              value={field.defaultValue || ''}
              onChange={(e) => handleUpdate('defaultValue', e.target.value)}
              placeholder=\"Default value...\"
            />
          </div>
        </div>

        {/* Options for SELECT, RADIO, CHECKBOX */}
        {needsOptions && (
          <div className=\"space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg\">
            <div className=\"flex items-center justify-between\">
              <Label>Options</Label>
              <Badge variant=\"outline\">{field.options?.length || 0} options</Badge>
            </div>
            
            <div className=\"flex gap-2\">
              <Input
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder=\"Add new option...\"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddOption()
                  }
                }}
              />
              <Button 
                type=\"button\" 
                onClick={handleAddOption}
                disabled={!newOption.trim()}
                size=\"sm\"
              >
                <Plus size={14} />
              </Button>
            </div>

            {field.options && field.options.length > 0 && (
              <div className=\"space-y-2\">
                {field.options.map((option, optionIndex) => (
                  <div key={optionIndex} className=\"flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded border\">
                    <span className=\"flex-1\">{option}</span>
                    <Button
                      type=\"button\"
                      variant=\"ghost\"
                      size=\"sm\"
                      onClick={() => handleRemoveOption(optionIndex)}
                      className=\"text-red-600 hover:text-red-700\"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Advanced Settings */}
        <div className=\"border-t pt-4\">
          <Button
            type=\"button\"
            variant=\"ghost\"
            size=\"sm\"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className=\"text-gray-600 hover:text-gray-700\"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
          </Button>

          {showAdvanced && (
            <div className=\"mt-4 space-y-4\">
              <div className=\"space-y-2\">
                <Label>Validation Rules (JSON)</Label>
                <Textarea
                  value={field.validation ? JSON.stringify(field.validation, null, 2) : ''}
                  onChange={(e) => {
                    try {
                      const validation = e.target.value ? JSON.parse(e.target.value) : {}
                      handleUpdate('validation', validation)
                    } catch {
                      // Invalid JSON, ignore for now
                    }
                  }}
                  placeholder={`{
  \"minLength\": 3,
  \"maxLength\": 100,
  \"pattern\": \"^[a-zA-Z ]*$\"
}`}
                  rows={4}
                />
                <p className=\"text-xs text-gray-500\">
                  Define custom validation rules in JSON format
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}