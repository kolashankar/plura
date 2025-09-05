
'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import Loading from '@/components/global/loading'

const ComponentRequestSchema = z.object({
  name: z.string().min(1, 'Component name is required'),
  description: z.string().min(10, 'Please provide a detailed description'),
  category: z.string().min(1, 'Please select a category'),
  features: z.array(z.string()).min(1, 'Please add at least one feature'),
})

type ComponentRequestFormData = z.infer<typeof ComponentRequestSchema>

interface ComponentRequestFormProps {
  subaccountId: string
  onComponentGenerated?: (component: any) => void
  onClose?: () => void
}

export default function ComponentRequestForm({ 
  subaccountId, 
  onComponentGenerated,
  onClose 
}: ComponentRequestFormProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentFeature, setCurrentFeature] = useState('')
  const [features, setFeatures] = useState<string[]>([])

  const form = useForm<ComponentRequestFormData>({
    resolver: zodResolver(ComponentRequestSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      features: [],
    },
  })

  const addFeature = () => {
    if (currentFeature.trim() && !features.includes(currentFeature.trim())) {
      const newFeatures = [...features, currentFeature.trim()]
      setFeatures(newFeatures)
      form.setValue('features', newFeatures)
      setCurrentFeature('')
    }
  }

  const removeFeature = (featureToRemove: string) => {
    const newFeatures = features.filter(feature => feature !== featureToRemove)
    setFeatures(newFeatures)
    form.setValue('features', newFeatures)
  }

  const onSubmit = async (values: ComponentRequestFormData) => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/ai/generate-component', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          componentName: values.name,
          description: values.description,
          category: values.category,
          features: values.features,
          subaccountId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate component')
      }

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: 'Component Generated Successfully!',
          description: `${values.name} has been created and added to your components library.`,
        })
        
        onComponentGenerated?.(data.component)
        form.reset()
        setFeatures([])
        onClose?.()
      } else {
        throw new Error(data.error || 'Failed to generate component')
      }
    } catch (error) {
      console.error('Error generating component:', error)
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate the component. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Request Custom Component</CardTitle>
        <CardDescription>
          Describe the component you need and our AI will generate it for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Component Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Video Filter Panel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="forms">Forms</SelectItem>
                      <SelectItem value="charts">Charts</SelectItem>
                      <SelectItem value="filters">Filters</SelectItem>
                      <SelectItem value="navigation">Navigation</SelectItem>
                      <SelectItem value="layout">Layout</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what this component should do, how it should look, and any specific functionality you need..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>Features</FormLabel>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a feature..."
                  value={currentFeature}
                  onChange={(e) => setCurrentFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button
                  type="button"
                  onClick={addFeature}
                  variant="outline"
                  size="icon"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {features.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {features.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {feature}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeFeature(feature)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              {onClose && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isGenerating}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loading />
                    Generating...
                  </>
                ) : (
                  'Generate Component'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
