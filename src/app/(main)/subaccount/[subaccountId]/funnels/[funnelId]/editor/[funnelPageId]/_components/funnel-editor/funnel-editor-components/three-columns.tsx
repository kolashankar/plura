import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import { Badge } from '@/components/ui/badge'
import { Trash } from 'lucide-react'
import clsx from 'clsx'
import React from 'react'
import Recursive from './recursive'
import { v4 } from 'uuid'
import { defaultStyles } from '@/lib/constants'

type Props = {
  element: EditorElement
}

const ThreeColumnsComponent = (props: Props) => {
  const { id, content, name, styles, type } = props.element
  const { dispatch, state } = useEditor()

  const handleOnDrop = (e: React.DragEvent, columnIndex: number) => {
    e.preventDefault()
    e.stopPropagation()
    const componentType = e.dataTransfer.getData('componentType')
    
    if (!componentType) return

    // Create the element for the specific column
    dispatch({
      type: 'ADD_ELEMENT',
      payload: {
        containerId: Array.isArray(content) && content[columnIndex] ? content[columnIndex].id : id,
        elementDetails: {
          content: { innerText: 'New Element' },
          id: v4(),
          name: componentType,
          styles: defaultStyles,
          type: componentType,
        },
      },
    })
  }

  const handleDeleteElement = () => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: { elementDetails: props.element },
    })
  }

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({
      type: 'CHANGE_CLICKED_ELEMENT',
      payload: {
        elementDetails: props.element,
      },
    })
  }

  return (
    <div
      style={styles}
      className={clsx('relative p-4 transition-all group', {
        'max-w-full w-full': true,
        '!border-blue-500': state.editor.selectedElement.id === props.element.id,
        '!border-solid': state.editor.selectedElement.id === props.element.id,
        'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
      })}
      onClick={handleOnClickBody}
    >
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">
            {state.editor.selectedElement.name}
          </Badge>
        )}

      <div 
        className="grid grid-cols-3 gap-4 w-full"
        style={{ gridTemplateColumns: '1fr 1fr 1fr' }}
      >
        {Array.isArray(content) &&
          content.map((childElement, index) => (
            <div
              key={childElement.id}
              className="min-h-[100px] border border-dashed border-muted-foreground/50 rounded p-2"
              onDrop={(e) => handleOnDrop(e, index)}
              onDragOver={(e) => e.preventDefault()}
            >
              <Recursive element={childElement} />
            </div>
          ))}
        
        {(!Array.isArray(content) || content.length === 0) && (
          <>
            <div
              className="min-h-[100px] border border-dashed border-muted-foreground/50 rounded p-2 flex items-center justify-center text-muted-foreground"
              onDrop={(e) => handleOnDrop(e, 0)}
              onDragOver={(e) => e.preventDefault()}
            >
              Drop components here
            </div>
            <div
              className="min-h-[100px] border border-dashed border-muted-foreground/50 rounded p-2 flex items-center justify-center text-muted-foreground"
              onDrop={(e) => handleOnDrop(e, 1)}
              onDragOver={(e) => e.preventDefault()}
            >
              Drop components here
            </div>
            <div
              className="min-h-[100px] border border-dashed border-muted-foreground/50 rounded p-2 flex items-center justify-center text-muted-foreground"
              onDrop={(e) => handleOnDrop(e, 2)}
              onDragOver={(e) => e.preventDefault()}
            >
              Drop components here
            </div>
          </>
        )}
      </div>

      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
            <Trash
              className="cursor-pointer"
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  )
}

export default ThreeColumnsComponent