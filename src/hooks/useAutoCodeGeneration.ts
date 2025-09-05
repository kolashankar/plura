import { useEffect } from 'react'
import { useEditor } from '@/providers/editor/editor-provider'

interface AutoGenerationOptions {
  funnelId: string
  funnelPageId: string
  subaccountId: string
  enabled?: boolean
}

export function useAutoCodeGeneration({
  funnelId,
  funnelPageId,
  subaccountId,
  enabled = true
}: AutoGenerationOptions) {
  const { state } = useEditor()

  const generateCode = async (elements: any[]) => {
    try {
      const response = await fetch('/api/code/auto-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          funnelId,
          funnelPageId,
          subaccountId,
          elements,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to auto-generate code')
      }

      const data = await response.json()
      console.log('✅ Auto-generated code for all platforms:', data.generatedCode)
      return data
    } catch (error: any) {
      console.error('❌ Auto-generation failed:', error.message)
      throw error
    }
  }

  useEffect(() => {
    if (!enabled || !state.editor.elements.length) return

    // Debounce auto-generation to avoid excessive API calls
    const timeoutId = setTimeout(() => {
      // Extract all non-container elements for code generation
      const elementsToGenerate = extractElements(state.editor.elements)
      
      if (elementsToGenerate.length > 0) {
        generateCode(elementsToGenerate).catch(console.error)
      }
    }, 2000) // Wait 2 seconds after last change

    return () => clearTimeout(timeoutId)
  }, [state.editor.elements, enabled, funnelId, funnelPageId, subaccountId])

  return {
    generateCode,
  }
}

function extractElements(elements: any[]): any[] {
  const extracted: any[] = []
  
  function processElement(element: any) {
    // Include non-container elements and elements with meaningful content
    if (element.type !== 'container' && element.type !== '__body') {
      extracted.push({
        type: element.type,
        content: element.content,
        styles: element.styles,
        name: element.name,
        id: element.id,
      })
    }
    
    // Recursively process nested elements
    if (Array.isArray(element.content)) {
      element.content.forEach(processElement)
    }
  }
  
  elements.forEach(processElement)
  return extracted
}