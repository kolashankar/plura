import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import { Badge } from '@/components/ui/badge'
import { Trash } from 'lucide-react'
import clsx from 'clsx'
import React from 'react'
import Recursive from './recursive'

type Props = {
  element: EditorElement
}

const HeroComponent = (props: Props) => {
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
      style={{
        ...styles,
        backgroundImage: content?.backgroundImage ? `url(${content.backgroundImage})` : undefined,
      }}
      className={clsx(
        'p-[2px] w-full m-[5px] relative transition-all',
        'min-h-[80vh] flex items-center justify-center text-center bg-cover bg-center',
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
      
      <div className="max-w-4xl mx-auto px-8 py-16 relative z-10">
        {content?.title && (
          <h1 
            className="text-5xl font-bold mb-6 text-white"
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
          </h1>
        )}
        
        {content?.subtitle && (
          <p 
            className="text-xl mb-8 text-white/90"
            contentEditable={!state.editor.liveMode}
            onBlur={(e) => {
              const subtitleElement = e.target as HTMLParagraphElement
              dispatch({
                type: 'UPDATE_ELEMENT',
                payload: {
                  elementDetails: {
                    ...props.element,
                    content: {
                      ...content,
                      subtitle: subtitleElement.innerText,
                    },
                  },
                },
              })
            }}
          >
            {content.subtitle}
          </p>
        )}

        {content?.ctaText && (
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            onClick={() => {
              if (state.editor.liveMode && content.ctaLink) {
                window.open(content.ctaLink, '_self')
              }
            }}
          >
            {content.ctaText}
          </button>
        )}

        {/* Render nested elements if present */}
        {Array.isArray(props.element.content) &&
          props.element.content.map((childElement, index) => (
            <Recursive key={childElement.id} element={childElement} />
          ))}
      </div>

      {/* Overlay for better text readability */}
      {content?.backgroundImage && (
        <div className="absolute inset-0 bg-black/40 z-0" />
      )}

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

export default HeroComponent