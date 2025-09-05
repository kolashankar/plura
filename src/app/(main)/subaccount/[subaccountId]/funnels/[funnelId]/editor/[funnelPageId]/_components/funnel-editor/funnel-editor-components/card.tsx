import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import { Badge } from '@/components/ui/badge'
import { Trash } from 'lucide-react'
import clsx from 'clsx'
import React from 'react'
import Recursive from './recursive'

type Props = {
  element: EditorElement
}

const CardComponent = (props: Props) => {
  const { dispatch, state } = useEditor()

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

  const styles = props.element.styles
  const content = !Array.isArray(props.element.content) ? props.element.content : props.element.content[0]

  return (
    <div
      style={styles}
      className={clsx(
        'p-[2px] w-full m-[5px] relative transition-all',
        {
          '!border-blue-500': state.editor.selectedElement.id === props.element.id,
          '!border-solid': state.editor.selectedElement.id === props.element.id,
          'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
        }
      )}
      onClick={handleOnClickBody}
    >
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">
            {state.editor.selectedElement.name}
          </Badge>
        )}
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {content?.title && (
          <h3 
            className="text-lg font-semibold mb-3"
            contentEditable={!state.editor.liveMode}
            onBlur={(e) => {
              const titleElement = e.target as HTMLHeadingElement
              dispatch({
                type: 'UPDATE_ELEMENT',
                payload: {
                  elementDetails: {
                    ...props.element,
                    content: {
                      ...content,
                      title: titleElement.innerText,
                    },
                  },
                },
              })
            }}
          >
            {content.title}
          </h3>
        )}
        
        {content?.content && (
          <p 
            className="text-gray-600 mb-4"
            contentEditable={!state.editor.liveMode}
            onBlur={(e) => {
              const contentElement = e.target as HTMLParagraphElement
              dispatch({
                type: 'UPDATE_ELEMENT',
                payload: {
                  elementDetails: {
                    ...props.element,
                    content: {
                      ...content,
                      content: contentElement.innerText,
                    },
                  },
                },
              })
            }}
          >
            {content.content}
          </p>
        )}

        {/* Render nested elements if present */}
        {Array.isArray(props.element.content) &&
          props.element.content.map((childElement, index) => (
            <Recursive key={childElement.id} element={childElement} />
          ))}
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

export default CardComponent