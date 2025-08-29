'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Sparkles, Plus, Trash2, Download, Wand2 } from 'lucide-react'
import { useEditor } from '@/providers/editor/editor-provider'
import { EditorElement } from '@/providers/editor/editor-provider'
import { v4 } from 'uuid'

interface GeneratedComponent {
  id: string
  name: string
  description: string
  code: string
  preview: string
  element: EditorElement
  createdAt: Date
}

const AgentTab = ({ subaccountId }: { subaccountId: string }) => {
  const [prompt, setPrompt] = useState('')
  const [pagePrompt, setPagePrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingPage, setIsGeneratingPage] = useState(false)
  const [generatedComponents, setGeneratedComponents] = useState<GeneratedComponent[]>([])
  const { state, dispatch } = useEditor()

  // Load saved components from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`generated-components-${subaccountId}`)
    if (saved) {
      try {
        const components = JSON.parse(saved).map((comp: any) => ({
          ...comp,
          createdAt: new Date(comp.createdAt)
        }))
        setGeneratedComponents(components)
      } catch (error) {
        console.error('Failed to load saved components:', error)
      }
    }
  }, [subaccountId])

  // Save components to localStorage
  const saveComponents = (components: GeneratedComponent[]) => {
    localStorage.setItem(`generated-components-${subaccountId}`, JSON.stringify(components))
  }

  const generateComponent = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt for component generation')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-component-gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate component')
      }

      const data = await response.json()
      
      // Create a proper EditorElement for the component
      const componentElement: EditorElement = {
        id: v4(),
        type: 'container',
        name: data.name || 'Generated Component',
        styles: {
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          minHeight: '100px',
          width: '100%',
        },
        content: [{
          id: v4(),
          type: 'text',
          name: 'Component Content',
          styles: {
            color: '#000000',
            fontSize: '14px',
            lineHeight: '1.5',
          },
          content: {
            innerText: data.preview || data.code || 'Generated component content',
          },
        }],
      }

      const newComponent: GeneratedComponent = {
        id: v4(),
        name: data.name || 'Generated Component',
        description: data.description || 'AI Generated Component',
        code: data.code || '',
        preview: data.preview || data.code || '',
        element: componentElement,
        createdAt: new Date(),
      }

      const updatedComponents = [newComponent, ...generatedComponents]
      setGeneratedComponents(updatedComponents)
      saveComponents(updatedComponents)
      setPrompt('')
      toast.success('Component generated successfully!')
    } catch (error) {
      console.error('Error generating component:', error)
      toast.error('Failed to generate component')
    } finally {
      setIsGenerating(false)
    }
  }

  const generatePage = async () => {
    if (!pagePrompt.trim()) {
      toast.error('Please enter a prompt for page generation')
      return
    }

    setIsGeneratingPage(true)
    try {
      const response = await fetch('/api/ai/generate-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: pagePrompt,
          subaccountId,
          currentPage: state.editor.elements
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate page')
      }

      const data = await response.json()
      
      // Apply the generated page elements to the editor
      if (data.elements && Array.isArray(data.elements)) {
        dispatch({
          type: 'LOAD_DATA',
          payload: {
            elements: data.elements,
            withLive: false,
          },
        })
        toast.success('Page generated and applied successfully!')
      } else {
        throw new Error('Invalid page data received')
      }
      
      setPagePrompt('')
    } catch (error) {
      console.error('Error generating page:', error)
      toast.error('Failed to generate page')
    } finally {
      setIsGeneratingPage(false)
    }
  }

  const handleDragStart = (e: React.DragEvent, component: GeneratedComponent) => {
    e.dataTransfer.setData('componentType', 'generatedComponent')
    e.dataTransfer.setData('componentData', JSON.stringify(component.element))
  }

  const deleteComponent = (componentId: string) => {
    const updatedComponents = generatedComponents.filter(comp => comp.id !== componentId)
    setGeneratedComponents(updatedComponents)
    saveComponents(updatedComponents)
    toast.success('Component deleted')
  }

  const downloadComponent = (component: GeneratedComponent) => {
    const blob = new Blob([component.code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${component.name.replace(/\s+/g, '-').toLowerCase()}.tsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Component code downloaded!')
  }

  return (
    <div className="space-y-6">
      {/* Component Generation Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Generate Component
        </h3>
        <div className="space-y-3">
          <Textarea
            placeholder="Describe the component you want to generate (e.g., 'Create a pricing card with 3 tiers')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[80px]"
          />
          <Button 
            onClick={generateComponent}
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
            size="sm"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Component
              </>
            )}
          </Button>
        </div>
      </div>

      <Separator />

      {/* Page Generation Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          Generate Entire Page
        </h3>
        <div className="space-y-3">
          <Textarea
            placeholder="Describe the complete page you want to generate (e.g., 'Create a landing page for a fitness app with hero section, features, and testimonials')"
            value={pagePrompt}
            onChange={(e) => setPagePrompt(e.target.value)}
            className="min-h-[80px]"
          />
          <Button 
            onClick={generatePage}
            disabled={isGeneratingPage || !pagePrompt.trim()}
            className="w-full"
            size="sm"
            variant="secondary"
          >
            {isGeneratingPage ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Generating Page...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate & Apply Page
              </>
            )}
          </Button>
        </div>
      </div>

      <Separator />

      {/* Generated Components Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Generated Components</h3>
        {generatedComponents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No components generated yet</p>
            <p className="text-sm">Use the generator above to create your first component</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {generatedComponents.map((component) => (
                <Card 
                  key={component.id} 
                  className="cursor-grab hover:shadow-md transition-shadow"
                  draggable
                  onDragStart={(e) => handleDragStart(e, component)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{component.name}</CardTitle>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => downloadComponent(component)}
                          className="h-7 w-7 p-0"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteComponent(component.id)}
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="text-xs line-clamp-2">
                      {component.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        Drag to canvas
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {component.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  )
}

export default AgentTab