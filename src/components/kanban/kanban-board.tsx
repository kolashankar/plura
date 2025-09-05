'use client'

import React, { useState, useCallback } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Plus, MoreHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/hooks/use-toast'

interface KanbanCard {
  id: string
  title: string
  description?: string
  labels?: string[]
  assignee?: string
  priority?: 'low' | 'medium' | 'high'
  dueDate?: string
}

interface KanbanColumn {
  id: string
  title: string
  cards: KanbanCard[]
  color?: string
  type?: string
}

interface KanbanBoardProps {
  columns?: KanbanColumn[]
  onColumnAdd?: (column: KanbanColumn) => void
  onColumnUpdate?: (columnId: string, column: KanbanColumn) => void
  onColumnDelete?: (columnId: string) => void
  onCardAdd?: (columnId: string, card: KanbanCard) => void
  onCardUpdate?: (cardId: string, card: KanbanCard) => void
  onCardDelete?: (cardId: string) => void
  onDragEnd?: (result: any) => void
  onComponentDrop?: (componentType: string, columnId: string) => void
}

const defaultColumns: KanbanColumn[] = [
  {
    id: 'todo',
    title: 'To Do',
    color: '#ef4444',
    cards: [
      {
        id: '1',
        title: 'Design homepage header',
        description: 'Create responsive header with navigation',
        labels: ['design', 'frontend'],
        priority: 'high'
      }
    ]
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: '#f59e0b',
    cards: [
      {
        id: '2',
        title: 'Implement user authentication',
        description: 'Set up login/signup functionality',
        labels: ['backend', 'auth'],
        priority: 'medium'
      }
    ]
  },
  {
    id: 'done',
    title: 'Done',
    color: '#10b981',
    cards: [
      {
        id: '3',
        title: 'Setup project structure',
        description: 'Initialize Next.js project with TypeScript',
        labels: ['setup'],
        priority: 'low'
      }
    ]
  }
]

export default function KanbanBoard({
  columns = defaultColumns,
  onColumnAdd,
  onColumnUpdate,
  onColumnDelete,
  onCardAdd,
  onCardUpdate,
  onCardDelete,
  onDragEnd,
  onComponentDrop
}: KanbanBoardProps) {
  const [boardColumns, setBoardColumns] = useState<KanbanColumn[]>(columns)
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const [isAddingCard, setIsAddingCard] = useState<string | null>(null)
  const [newCardData, setNewCardData] = useState({ title: '', description: '' })

  const handleDragEnd = useCallback((result: any) => {
    const { destination, source, type, draggableId } = result

    if (!destination) return

    if (type === 'column') {
      const newColumns = Array.from(boardColumns)
      const [reorderedColumn] = newColumns.splice(source.index, 1)
      newColumns.splice(destination.index, 0, reorderedColumn)
      setBoardColumns(newColumns)
      return
    }

    if (type === 'card') {
      const sourceColumn = boardColumns.find(col => col.id === source.droppableId)
      const destColumn = boardColumns.find(col => col.id === destination.droppableId)

      if (!sourceColumn || !destColumn) return

      if (source.droppableId === destination.droppableId) {
        // Same column reorder
        const newCards = Array.from(sourceColumn.cards)
        const [reorderedCard] = newCards.splice(source.index, 1)
        newCards.splice(destination.index, 0, reorderedCard)

        const newColumns = boardColumns.map(col =>
          col.id === source.droppableId
            ? { ...col, cards: newCards }
            : col
        )
        setBoardColumns(newColumns)
      } else {
        // Different column move
        const sourceCards = Array.from(sourceColumn.cards)
        const destCards = Array.from(destColumn.cards)
        const [movedCard] = sourceCards.splice(source.index, 1)
        destCards.splice(destination.index, 0, movedCard)

        const newColumns = boardColumns.map(col => {
          if (col.id === source.droppableId) {
            return { ...col, cards: sourceCards }
          }
          if (col.id === destination.droppableId) {
            return { ...col, cards: destCards }
          }
          return col
        })
        setBoardColumns(newColumns)
      }
    }

    // Check if a component is being dropped from external source
    if (result.source.droppableId === 'components-sidebar' && onComponentDrop) {
      onComponentDrop(draggableId, destination.droppableId)
      generateCodeForComponent(draggableId)
    }

    onDragEnd?.(result)
  }, [boardColumns, onDragEnd, onComponentDrop])

  const generateCodeForComponent = async (componentType: string) => {
    try {
      // Generate code for all three platforms
      const codeGenerationPromise = Promise.all([
        generateReactCode(componentType),
        generateReactNativeCode(componentType),
        generatePythonCode(componentType)
      ])

      const [reactCode, reactNativeCode, pythonCode] = await codeGenerationPromise

      toast({
        title: "Multi-Platform Code Generated!",
        description: `Generated React, React Native, and Python code for ${componentType} component.`,
      })

      // Store generated code data
      const generatedCodeData = {
        componentType,
        platforms: {
          react: reactCode,
          reactNative: reactNativeCode,
          python: pythonCode
        },
        timestamp: new Date().toISOString()
      }

      console.log('Generated Code:', generatedCodeData)
      
      // Save to localStorage for immediate access
      localStorage.setItem(`generated-code-${componentType}`, JSON.stringify(generatedCodeData))

      // Automatically deploy the generated code
      await deployGeneratedCode(generatedCodeData, componentType)

    } catch (error) {
      console.error('Code generation failed:', error)
      toast({
        title: "Code Generation Failed",
        description: "Failed to generate multi-platform code. Please try again.",
        variant: "destructive"
      })
    }
  }

  const deployGeneratedCode = async (codeData: any, componentType: string) => {
    try {
      toast({
        title: "Deploying...",
        description: "Deploying your generated code to live servers.",
      })

      const deploymentResponse = await fetch('/api/deployments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${componentType} App - ${new Date().toLocaleDateString()}`,
          type: 'generated-component',
          platform: 'web',
          reactCode: codeData.platforms.react,
          reactNativeCode: codeData.platforms.reactNative,
          pythonCode: codeData.platforms.python
        })
      })

      if (!deploymentResponse.ok) {
        throw new Error('Failed to deploy code')
      }

      const deployment = await deploymentResponse.json()

      toast({
        title: "🚀 Deployment Successful!",
        description: (
          <div className="space-y-2">
            <p>Your app has been deployed successfully!</p>
            <div className="flex gap-2">
              <button
                onClick={() => window.open(deployment.deployment.url, '_blank')}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                View Live Site
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(deployment.deployment.url)}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                Copy URL
              </button>
            </div>
          </div>
        ) as any,
      })

      // Store deployment info
      localStorage.setItem(`deployment-${componentType}`, JSON.stringify(deployment.deployment))

      return deployment

    } catch (error) {
      console.error('Deployment failed:', error)
      toast({
        title: "Deployment Failed",
        description: "Failed to deploy the generated code. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleBulkDeploy = async () => {
    try {
      toast({
        title: "Bulk Deployment Started",
        description: "Deploying all components from the kanban board...",
      })

      const allComponents = Object.values(boardColumns).flat()
      const deploymentPromises = []

      for (const component of allComponents) {
        if (component.type) {
          // Check if code is already generated for this component
          const existingCode = localStorage.getItem(`generated-code-${component.type}`)
          
          if (existingCode) {
            try {
              const codeData = JSON.parse(existingCode)
              deploymentPromises.push(deployGeneratedCode(codeData, component.type))
            } catch (e) {
              // If parsing fails, generate new code
              deploymentPromises.push(generateCodeForComponent(component.type))
            }
          } else {
            // Generate new code for this component
            deploymentPromises.push(generateCodeForComponent(component.type))
          }
        }
      }

      await Promise.all(deploymentPromises)

      toast({
        title: "🎉 Bulk Deployment Complete!",
        description: `Successfully deployed ${allComponents.length} components. Check individual deployment notifications for live URLs.`,
      })

    } catch (error) {
      console.error('Bulk deployment failed:', error)
      toast({
        title: "Bulk Deployment Failed",
        description: "Some deployments may have failed. Please check individual components.",
        variant: "destructive"
      })
    }
  }

  const generateReactCode = async (componentType: string): Promise<string> => {
    const response = await fetch('/api/ai/auto-generate-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform: 'react',
        componentType,
        framework: 'nextjs',
        prompt: `Generate a React/Next.js component for ${componentType} with TypeScript and Tailwind CSS`
      })
    })
    
    if (!response.ok) throw new Error('Failed to generate React code')
    const data = await response.json()
    return data.code
  }

  const generateReactNativeCode = async (componentType: string): Promise<string> => {
    const response = await fetch('/api/ai/auto-generate-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform: 'react-native',
        componentType,
        framework: 'expo',
        prompt: `Generate a React Native component for ${componentType} with Expo and TypeScript`
      })
    })
    
    if (!response.ok) throw new Error('Failed to generate React Native code')
    const data = await response.json()
    return data.code
  }

  const generatePythonCode = async (componentType: string): Promise<string> => {
    const response = await fetch('/api/ai/auto-generate-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform: 'python',
        componentType,
        framework: 'flask',
        prompt: `Generate a Python Flask component/route for ${componentType} with HTML templates`
      })
    })
    
    if (!response.ok) throw new Error('Failed to generate Python code')
    const data = await response.json()
    return data.code
  }

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return

    const newColumn: KanbanColumn = {
      id: `col-${Date.now()}`,
      title: newColumnTitle,
      cards: [],
      color: '#6b7280'
    }

    setBoardColumns([...boardColumns, newColumn])
    setNewColumnTitle('')
    setIsAddingColumn(false)
    onColumnAdd?.(newColumn)
  }

  const handleAddCard = (columnId: string) => {
    if (!newCardData.title.trim()) return

    const newCard: KanbanCard = {
      id: `card-${Date.now()}`,
      title: newCardData.title,
      description: newCardData.description,
      labels: [],
      priority: 'medium'
    }

    const newColumns = boardColumns.map(col =>
      col.id === columnId
        ? { ...col, cards: [...col.cards, newCard] }
        : col
    )

    setBoardColumns(newColumns)
    setNewCardData({ title: '', description: '' })
    setIsAddingCard(null)
    onCardAdd?.(columnId, newCard)
  }

  const handleDeleteCard = (cardId: string, columnId: string) => {
    const newColumns = boardColumns.map(col =>
      col.id === columnId
        ? { ...col, cards: col.cards.filter(card => card.id !== cardId) }
        : col
    )
    setBoardColumns(newColumns)
    onCardDelete?.(cardId)
  }

  const handleDeleteColumn = (columnId: string) => {
    setBoardColumns(boardColumns.filter(col => col.id !== columnId))
    onColumnDelete?.(columnId)
  }

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    const componentType = e.dataTransfer.getData('componentType')
    
    if (componentType && onComponentDrop) {
      onComponentDrop(componentType, columnId)
      generateCodeForComponent(componentType)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Kanban Board</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Drag components to auto-generate and deploy in React, React Native & Python
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleBulkDeploy}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <i className="fas fa-rocket"></i>
            Deploy All
          </Button>
          <Button
            onClick={() => setIsAddingColumn(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Add Column
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="board" type="column" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex gap-4 overflow-x-auto pb-4 h-full"
            >
              {boardColumns.map((column, index) => (
                <Draggable key={column.id} draggableId={column.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex-shrink-0 w-80 ${
                        snapshot.isDragging ? 'rotate-3 shadow-xl' : ''
                      }`}
                    >
                      <Card className="h-full flex flex-col">
                        <CardHeader 
                          {...provided.dragHandleProps}
                          className="flex flex-row items-center justify-between space-y-0 pb-2"
                          style={{ borderTop: `4px solid ${column.color}` }}
                        >
                          <CardTitle className="text-sm font-medium">
                            {column.title}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {column.cards.length}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal size={14} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteColumn(column.id)}
                                  className="text-red-600"
                                >
                                  Delete Column
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>

                        <CardContent className="flex-1 overflow-hidden flex flex-col">
                          <Droppable droppableId={column.id} type="card">
                            {(provided, snapshot) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className={`flex-1 space-y-2 overflow-y-auto min-h-24 p-2 rounded-md transition-colors ${
                                  snapshot.isDraggingOver
                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 border-dashed'
                                    : 'bg-gray-50 dark:bg-gray-800/50'
                                }`}
                                onDrop={(e) => handleDrop(e, column.id)}
                                onDragOver={handleDragOver}
                              >
                                {column.cards.map((card, cardIndex) => (
                                  <Draggable
                                    key={card.id}
                                    draggableId={card.id}
                                    index={cardIndex}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`bg-white dark:bg-gray-800 p-3 rounded-lg border shadow-sm hover:shadow-md transition-shadow ${
                                          snapshot.isDragging ? 'shadow-lg rotate-2' : ''
                                        }`}
                                      >
                                        <div className="flex items-start justify-between mb-2">
                                          <h4 className="font-medium text-sm leading-tight">
                                            {card.title}
                                          </h4>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteCard(card.id, column.id)}
                                            className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                                          >
                                            <X size={12} />
                                          </Button>
                                        </div>

                                        {card.description && (
                                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                            {card.description}
                                          </p>
                                        )}

                                        {card.labels && card.labels.length > 0 && (
                                          <div className="flex flex-wrap gap-1 mb-2">
                                            {card.labels.map((label, labelIndex) => (
                                              <Badge
                                                key={labelIndex}
                                                variant="outline"
                                                className="text-xs"
                                              >
                                                {label}
                                              </Badge>
                                            ))}
                                          </div>
                                        )}

                                        {card.priority && (
                                          <Badge
                                            variant={
                                              card.priority === 'high'
                                                ? 'destructive'
                                                : card.priority === 'medium'
                                                ? 'default'
                                                : 'secondary'
                                            }
                                            className="text-xs"
                                          >
                                            {card.priority}
                                          </Badge>
                                        )}
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}

                                {isAddingCard === column.id ? (
                                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
                                    <Input
                                      placeholder="Card title"
                                      value={newCardData.title}
                                      onChange={(e) => setNewCardData({
                                        ...newCardData,
                                        title: e.target.value
                                      })}
                                      className="mb-2"
                                    />
                                    <Textarea
                                      placeholder="Description (optional)"
                                      value={newCardData.description}
                                      onChange={(e) => setNewCardData({
                                        ...newCardData,
                                        description: e.target.value
                                      })}
                                      className="mb-2"
                                      rows={2}
                                    />
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        onClick={() => handleAddCard(column.id)}
                                      >
                                        Add
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setIsAddingCard(null)}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsAddingCard(column.id)}
                                    className="w-full text-gray-500 hover:text-gray-700 border-dashed border-2 h-10"
                                  >
                                    <Plus size={16} className="mr-2" />
                                    Add a card
                                  </Button>
                                )}
                              </div>
                            )}
                          </Droppable>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              {isAddingColumn && (
                <div className="flex-shrink-0 w-80">
                  <Card>
                    <CardContent className="p-4">
                      <Input
                        placeholder="Column title"
                        value={newColumnTitle}
                        onChange={(e) => setNewColumnTitle(e.target.value)}
                        className="mb-2"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddColumn()}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleAddColumn}>
                          Add
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsAddingColumn(false)
                            setNewColumnTitle('')
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}