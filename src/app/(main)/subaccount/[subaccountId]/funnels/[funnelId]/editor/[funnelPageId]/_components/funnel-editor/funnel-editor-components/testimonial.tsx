import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import { Badge } from '@/components/ui/badge'
import { Trash, Quote, Star } from 'lucide-react'
import clsx from 'clsx'
import React from 'react'
import Image from 'next/image'

type Props = {
  element: EditorElement
}

const TestimonialComponent = (props: Props) => {
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
      
      <div style={styles} className="bg-white rounded-lg p-6 shadow-sm border">
        <Quote className="h-8 w-8 text-blue-600 mb-4" />
        
        <blockquote 
          className="text-lg text-gray-700 mb-6 italic"
          contentEditable={!state.editor.liveMode}
          onBlur={(e) => {
            const quoteElement = e.target as HTMLQuoteElement
            dispatch({
              type: 'UPDATE_ELEMENT',
              payload: {
                elementDetails: {
                  ...props.element,
                  content: {
                    ...content,
                    quote: quoteElement.innerText,
                  },
                },
              },
            })
          }}
        >
          "{content?.quote || 'Amazing service!'}"
        </blockquote>

        <div className="flex items-center gap-4">
          {content?.avatar && (
            <Image
              src={content.avatar}
              alt={content.author || 'Author'}
              width={48}
              height={48}
              className="rounded-full"
            />
          )}
          
          <div className="flex-1">
            <div 
              className="font-semibold text-gray-900"
              contentEditable={!state.editor.liveMode}
              onBlur={(e) => {
                const authorElement = e.target as HTMLDivElement
                dispatch({
                  type: 'UPDATE_ELEMENT',
                  payload: {
                    elementDetails: {
                      ...props.element,
                      content: {
                        ...content,
                        author: authorElement.innerText,
                      },
                    },
                  },
                })
              }}
            >
              {content?.author || 'John Doe'}
            </div>
            <div 
              className="text-sm text-gray-500"
              contentEditable={!state.editor.liveMode}
              onBlur={(e) => {
                const roleElement = e.target as HTMLDivElement
                dispatch({
                  type: 'UPDATE_ELEMENT',
                  payload: {
                    elementDetails: {
                      ...props.element,
                      content: {
                        ...content,
                        role: roleElement.innerText,
                      },
                    },
                  },
                })
              }}
            >
              {content?.role || 'CEO'}
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>
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

export default TestimonialComponent