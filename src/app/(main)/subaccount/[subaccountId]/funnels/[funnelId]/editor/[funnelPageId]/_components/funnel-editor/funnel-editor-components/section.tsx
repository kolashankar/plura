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

const SectionComponent = (props: Props) => {
  const { id, content, name, styles, type } = props.element
  const { dispatch, state } = useEditor()

  const handleOnDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const componentType = e.dataTransfer.getData('componentType')
    
    if (!componentType) return

    dispatch({
      type: 'ADD_ELEMENT',
      payload: {
        containerId: id,
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
    <section
      style={styles}
      className={clsx('relative p-4 transition-all group', {
        'max-w-full w-full': true,
        '!border-blue-500': state.editor.selectedElement.id === props.element.id,
        '!border-solid': state.editor.selectedElement.id === props.element.id,
        'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
      })}
      onDrop={handleOnDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={handleOnClickBody}
    >
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">
            {state.editor.selectedElement.name}
          </Badge>
        )}

      <div className="min-h-[100px] w-full">
        {Array.isArray(content) &&
          content.map((childElement, index) => (
            <Recursive key={childElement.id} element={childElement} />
          ))}
        
        {(!Array.isArray(content) || content.length === 0) && !state.editor.liveMode && (
          <div className="flex items-center justify-center min-h-[100px] text-muted-foreground">
            Drop components here
          </div>
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
    </section>
  )
}

export default SectionComponent