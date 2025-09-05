import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import { Badge } from '@/components/ui/badge'
import { Trash, TrendingUp, TrendingDown } from 'lucide-react'
import clsx from 'clsx'
import React from 'react'

type Props = {
  element: EditorElement
}

const KpiCardComponent = (props: Props) => {
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

  const isPositiveTrend = content?.trend === 'up' || content?.change?.startsWith('+')

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
        <div className="flex items-center justify-between mb-2">
          <h3 
            className="text-sm font-medium text-gray-600"
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
            {content?.title || 'Total Revenue'}
          </h3>
          {isPositiveTrend ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </div>
        
        <div className="flex items-baseline gap-2">
          <span 
            className="text-3xl font-bold text-gray-900"
            contentEditable={!state.editor.liveMode}
            onBlur={(e) => {
              const valueElement = e.target as HTMLSpanElement
              dispatch({
                type: 'UPDATE_ELEMENT',
                payload: {
                  elementDetails: {
                    ...props.element,
                    content: {
                      ...content,
                      value: valueElement.innerText,
                    },
                  },
                },
              })
            }}
          >
            {content?.value || '$125,000'}
          </span>
          <span 
            className={clsx('text-sm font-medium', {
              'text-green-600': isPositiveTrend,
              'text-red-600': !isPositiveTrend,
            })}
          >
            {content?.change || '+12.5%'}
          </span>
        </div>
        
        <p className="text-xs text-gray-500 mt-1">
          {content?.period || 'vs last month'}
        </p>
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

export default KpiCardComponent