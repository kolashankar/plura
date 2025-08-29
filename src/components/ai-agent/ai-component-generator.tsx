
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus, Trash2, Download } from 'lucide-react'
import { toast } from 'sonner'
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
}

const generateComponent = async (prompt: string): Promise<GeneratedComponent> => {
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
        innerText: data.code || 'Generated component content',
      },
    }],
  }

  return {
    id: v4(),
    name: data.name || 'Generated Component',
    description: data.description || 'AI Generated Component',
    code: data.code || '',
    preview: data.preview || data.code || '',
    element: componentElement,
  }
}

export default function AIComponentGenerator() {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [generatedComponents, setGeneratedComponents] = useState<GeneratedComponent[]>([])
  const { dispatch, state } = useEditor()

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a component description')
      return
    }

    setIsLoading(true)
    try {
      const component = await generateComponent(prompt)
      setGeneratedComponents(prev => [component, ...prev])
      toast.success('Component generated successfully!')
      setPrompt('')
    } catch (error) {
      console.error('Error generating component:', error)
      toast.error('Failed to generate component')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCanvas = (component: GeneratedComponent) => {
    // Find the body element or use the first available container
    const bodyElement = state.editor.elements.find(el => el.type === '__body')
    const containerId = bodyElement?.id || state.editor.elements[0]?.id

    if (!containerId) {
      toast.error('No container available to add component')
      return
    }

    dispatch({
      type: 'ADD_ELEMENT',
      payload: {
        containerId,
        elementDetails: component.element,
      },
    })

    toast.success(`${component.name} added to canvas!`)
  }

  const handleDeleteComponent = (componentId: string) => {
    setGeneratedComponents(prev => prev.filter(comp => comp.id !== componentId))
    toast.success('Component deleted')
  }

  const handleDownloadComponent = (component: GeneratedComponent) => {
    const blob = new Blob([component.code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${component.name.toLowerCase().replace(/\s+/g, '-')}.tsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Component downloaded!')
  }

  // Make components draggable
  const handleDragStart = (e: React.DragEvent, component: GeneratedComponent) => {
    e.dataTransfer.setData('componentType', 'generatedComponent')
    e.dataTransfer.setData('componentData', JSON.stringify(component.element))
  }

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">AI Component Generator</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Describe the component you want to create..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleGenerate()}
            className="flex-1"
          />
          <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Generate
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Generated Components</h4>
          <Badge variant="secondary">{generatedComponents.length}</Badge>
        </div>

        {generatedComponents.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No components generated yet. Describe a component above to get started!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {generatedComponents.map((component) => (
              <Card
                key={component.id}
                className="cursor-grab hover:shadow-md transition-shadow"
                draggable
                onDragStart={(e) => handleDragStart(e, component)}
              >
                <CardHeader className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-medium">
                        {component.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {component.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      AI Generated
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleAddToCanvas(component)}
                      className="flex-1"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add to Canvas
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadComponent(component)}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteComponent(component.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
