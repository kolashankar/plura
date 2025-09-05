'use client'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import React, { useCallback, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Edit, 
  Trash2, 
  Move, 
  Copy,
  Bot,
  Code,
  Eye,
  EyeOff,
  Download,
  Sparkles
} from 'lucide-react'
import { toast } from 'sonner'
import Recursive from './recursive'
import { v4 } from 'uuid'

type Props = {
  element: EditorElement
}

const AIGeneratedComponent = (props: Props) => {
  const { dispatch, state } = useEditor()
  const [isEditing, setIsEditing] = useState(false)
  const [showCode, setShowCode] = useState(false)

  const handleOnClickBody = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      dispatch({
        type: 'CHANGE_CLICKED_ELEMENT',
        payload: {
          elementDetails: props.element,
        },
      })
    },
    [dispatch, props.element]
  )

  const handleDeleteElement = useCallback(() => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: {
        elementDetails: props.element,
      },
    })
    toast.success('AI component removed')
  }, [dispatch, props.element])

  const handleDuplicateElement = useCallback(() => {
    const duplicatedElement: EditorElement = {
      ...props.element,
      id: v4(),
      content: Array.isArray(props.element.content) 
        ? props.element.content.map(child => ({
            ...child,
            id: v4(),
          }))
        : props.element.content,
    }

    // Find the parent container
    const findParent = (elements: EditorElement[], targetId: string): string | null => {
      for (const element of elements) {
        if (Array.isArray(element.content)) {
          const childIds = element.content.map(child => child.id)
          if (childIds.includes(targetId)) {
            return element.id
          }
          const deepParent = findParent(element.content, targetId)
          if (deepParent) return deepParent
        }
      }
      return null
    }

    const parentId = findParent(state.editor.elements, props.element.id)
    
    if (parentId) {
      dispatch({
        type: 'ADD_ELEMENT',
        payload: {
          containerId: parentId,
          elementDetails: duplicatedElement,
        },
      })
      toast.success('AI component duplicated')
    }
  }, [dispatch, props.element, state.editor.elements])

  const styles = props.element.styles

  return (
    <div
      style={styles}
      className={clsx(
        'relative group transition-all duration-300',
        'border-2 border-dashed border-transparent hover:border-blue-300',
        'bg-gradient-to-br from-blue-50/30 to-purple-50/30',
        'rounded-lg min-h-[60px]',
        {
          '!border-blue-500 bg-blue-50/50': 
            state.editor.selectedElement.id === props.element.id,
          'ring-2 ring-blue-200': isEditing,
        }
      )}
      onClick={handleOnClickBody}
    >
      {/* AI Component Badge */}
      <div className="absolute -top-3 -left-3 z-10">
        <Badge 
          variant="default" 
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
        >
          <Bot size={12} className="mr-1" />
          AI Generated
        </Badge>
      </div>

      {/* Component Controls */}
      <div className="absolute -top-3 -right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            className="h-6 w-6 p-0 bg-white shadow-sm"
            onClick={(e) => {
              e.stopPropagation()
              setIsEditing(!isEditing)
            }}
          >
            <Edit size={12} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-6 w-6 p-0 bg-white shadow-sm"
            onClick={(e) => {
              e.stopPropagation()
              setShowCode(!showCode)
            }}
          >
            {showCode ? <EyeOff size={12} /> : <Code size={12} />}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-6 w-6 p-0 bg-white shadow-sm"
            onClick={(e) => {
              e.stopPropagation()
              handleDuplicateElement()
            }}
          >
            <Copy size={12} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-6 w-6 p-0 bg-white shadow-sm hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteElement()
            }}
          >
            <Trash2 size={12} />
          </Button>
        </div>
      </div>

      {/* Component Name */}
      <div className="absolute top-1 left-1 z-10">
        <Badge variant="outline" className="text-xs bg-white/80 backdrop-blur-sm">
          {props.element.name}
        </Badge>
      </div>

      {/* Drag Handle */}
      <div 
        className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move z-10"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('componentType', props.element.type)
          e.dataTransfer.setData('componentData', JSON.stringify(props.element))
        }}
      >
        <div className="bg-blue-500 text-white p-1 rounded-full shadow-lg">
          <Move size={12} />
        </div>
      </div>

      {/* Content Area */}
      <div className={clsx('w-full h-full', isEditing && 'border-2 border-dashed border-blue-300 p-2')}>
        {/* Show code if requested */}
        {/* Always render the component content, not the code */}
        {props.element.content && Array.isArray(props.element.content) ? (
          props.element.content.map((childElement) => (
            <Recursive key={childElement.id} element={childElement} />
          ))
        ) : (
          <div className="relative overflow-hidden">
            {/* Show code only when explicitly requested via toggle */}
            {showCode && props.element.content && typeof props.element.content === 'object' && 'code' in props.element.content ? (
              <Card className="p-4 bg-gray-50 border">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="text-xs">
                    <Code size={12} className="mr-1" />
                    React Component Code
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(props.element.content.code)
                      toast.success('Code copied to clipboard!')
                    }}
                  >
                    <Copy size={12} />
                  </Button>
                </div>
                <pre className="text-xs overflow-auto max-h-60 bg-white p-3 rounded border font-mono">
                  <code>{props.element.content.code}</code>
                </pre>
              </Card>
            ) : (
              /* Always render the visual component, not code */
              <>
                {/* AI component preview frame */}
                <div className="absolute top-2 right-2 z-10">
                  <Badge variant="secondary" className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 border">
                    <Bot size={10} className="mr-1" />
                    Preview
                  </Badge>
                </div>
                
                {/* Render the AI-generated component visually */}
                <div 
                  className="ai-component-content transition-all duration-300 hover:shadow-inner rounded-lg overflow-hidden"
                  style={{
                    ...props.element.styles,
                    minHeight: '80px',
                  }}
                >
                  {/* If there's HTML content, render it safely */}
                  {props.element.content && typeof props.element.content === 'object' && 'renderedComponent' in props.element.content ? (
                    <div dangerouslySetInnerHTML={{ __html: props.element.content.renderedComponent }} />
                  ) : props.element.content && typeof props.element.content === 'object' && 'innerText' in props.element.content ? (
                    <div className="p-4">
                      <div className="text-sm">{props.element.content.innerText}</div>
                    </div>
                  ) : (
                    /* Default AI component placeholder */
                    <div className="p-6 bg-white rounded-lg border-2 border-dashed border-gray-200 text-center">
                      <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">{props.element.name}</h3>
                      <p className="text-xs text-gray-500">AI Generated Component</p>
                      <p className="text-xs text-blue-500 mt-2">Click to configure</p>
                    </div>
                  )}
                </div>

                {/* Interactive overlay for editing */}
                {state.editor.selectedElement.id === props.element.id && !state.editor.liveMode && (
                  <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 rounded-lg pointer-events-none">
                    <div className="absolute top-1 left-1">
                      <Badge className="text-xs bg-blue-500">
                        Selected AI Component
                      </Badge>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Edit Mode Overlay */}
      {isEditing && (
        <div className="absolute inset-0 bg-blue-100/20 border-2 border-blue-300 rounded-lg flex items-center justify-center z-20">
          <div className="bg-white p-3 rounded-lg shadow-lg">
            <div className="flex items-center gap-2 text-sm">
              <Edit size={16} className="text-blue-500" />
              <span>Edit mode active</span>
              <Button size="sm" onClick={() => setIsEditing(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIGeneratedComponent