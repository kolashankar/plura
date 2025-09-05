'use client'
import React, { useState, useEffect } from 'react'
import { useEditor } from '@/providers/editor/editor-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Eye, 
  EyeOff, 
  Trash2, 
  ChevronDown, 
  ChevronRight, 
  Layers,
  Box,
  Type,
  Image as ImageIcon,
  Play,
  Layout,
  GripVertical
} from 'lucide-react'
import { EditorElement } from '@/providers/editor/editor-provider'
import { cn } from '@/lib/utils'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'

type Props = {}

const LayersTab = (props: Props) => {
  const { state, dispatch } = useEditor()
  const [mounted, setMounted] = useState(false)
  const [hiddenElements, setHiddenElements] = useState<Set<string>>(new Set())

  useEffect(() => {
    setMounted(true)
  }, [])

  const getElementIcon = (type: string) => {
    switch (type) {
      case '__body':
        return <Layout size={16} />
      case 'container':
        return <Box size={16} />
      case 'text':
        return <Type size={16} />
      case 'image':
        return <ImageIcon size={16} />
      case 'video':
        return <Play size={16} />
      case '2Col':
        return <Layout size={16} />
      case 'link':
        return <Type size={16} />
      default:
        return <Box size={16} />
    }
  }

  const handleElementClick = (element: EditorElement) => {
    dispatch({
      type: 'CHANGE_CLICKED_ELEMENT',
      payload: {
        elementDetails: element,
      },
    })
  }

  const handleDeleteElement = (element: EditorElement) => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: {
        elementDetails: element,
      },
    })
  }

  const toggleElementVisibility = (element: EditorElement) => {
    setHiddenElements(prev => {
      const newSet = new Set(prev)
      if (newSet.has(element.id)) {
        newSet.delete(element.id)
      } else {
        newSet.add(element.id)
      }
      return newSet
    })
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination } = result
    if (source.index === destination.index) return

    // For now, we'll just log the drag operation
    // In a full implementation, this would reorder elements in the editor state
    console.log('Reordering element from', source.index, 'to', destination.index)
  }

  const renderElementTree = (elements: EditorElement[], depth = 0) => {
    return elements.map((element, index) => (
      <Draggable key={element.id} draggableId={element.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={cn('border-l border-muted-foreground/20', depth > 0 && 'ml-4')}
          >
            <div 
              className={cn(
                'flex items-center gap-2 p-2 hover:bg-muted/50 cursor-pointer rounded-md transition-colors',
                state.editor.selectedElement.id === element.id && 'bg-muted border-l-4 border-primary',
                hiddenElements.has(element.id) && 'opacity-50',
                snapshot.isDragging && 'bg-primary/10 shadow-lg'
              )}
              onClick={() => handleElementClick(element)}
            >
              <div {...provided.dragHandleProps} className="cursor-grab hover:cursor-grabbing">
                <GripVertical size={12} className="text-muted-foreground" />
              </div>
              
              <div className="flex items-center gap-2 flex-1">
                {getElementIcon(element.type)}
                <span className="text-sm font-medium">{element.name || element.type}</span>
                {element.type === '__body' && (
                  <Badge variant="secondary" className="text-xs">Body</Badge>
                )}
                {hiddenElements.has(element.id) && (
                  <Badge variant="outline" className="text-xs">Hidden</Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleElementVisibility(element)
                  }}
                >
                  {hiddenElements.has(element.id) ? <EyeOff size={12} /> : <Eye size={12} />}
                </Button>
                
                {element.type !== '__body' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteElement(element)
                    }}
                  >
                    <Trash2 size={12} />
                  </Button>
                )}
              </div>
            </div>
            
            {Array.isArray(element.content) && element.content.length > 0 && (
              <div className="ml-2">
                {renderElementTree(element.content, depth + 1)}
              </div>
            )}
          </div>
        )}
      </Draggable>
    ))
  }

  if (!mounted) {
    return (
      <div className="flex flex-col h-full">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Layers size={20} />
              Layers
            </CardTitle>
            <CardDescription>
              Organize and manage all elements in your page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            <div className="text-center py-8 text-muted-foreground">
              <Layers size={48} className="mx-auto mb-4 opacity-50" />
              <p>Loading layers...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Layers size={20} />
            Layers
          </CardTitle>
          <CardDescription>
            Organize and manage all elements in your page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 max-h-96 overflow-y-auto">
          {state.editor.elements.length > 0 ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="layers">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {renderElementTree(state.editor.elements)}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Layers size={48} className="mx-auto mb-4 opacity-50" />
              <p>No elements in your page yet.</p>
              <p className="text-sm">Start by dragging components from the Components tab.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <h4 className="font-medium text-sm mb-2">Layer Controls</h4>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <GripVertical size={12} />
            <span>Drag to reorder elements</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye size={12} />
            <span>Toggle element visibility</span>
          </div>
          <div className="flex items-center gap-2">
            <Trash2 size={12} />
            <span>Delete element</span>
          </div>
          <div className="flex items-center gap-2">
            <Box size={12} />
            <span>Click to select element</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LayersTab