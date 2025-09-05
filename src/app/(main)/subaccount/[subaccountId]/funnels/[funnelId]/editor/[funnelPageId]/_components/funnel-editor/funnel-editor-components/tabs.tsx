import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import { Badge } from '@/components/ui/badge'
import { Trash } from 'lucide-react'
import clsx from 'clsx'
import React, { useState } from 'react'

type Props = {
  element: EditorElement
}

const TabsComponent = (props: Props) => {
  const { dispatch, state } = useEditor()
  const [activeTab, setActiveTab] = useState(0)

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

  const tabs = content?.tabs || ['Tab 1', 'Tab 2', 'Tab 3']

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
      
      <div style={styles} className="bg-white rounded-lg shadow-sm border">
        {/* Tab Headers */}
        <div className="flex border-b">
          {tabs.map((tab: string, index: number) => (
            <button
              key={index}
              className={clsx(
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                {
                  'border-blue-600 text-blue-600': activeTab === index,
                  'border-transparent text-gray-500 hover:text-gray-700': activeTab !== index,
                }
              )}
              onClick={() => setActiveTab(index)}
              disabled={!state.editor.liveMode}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <div className="text-gray-700">
            Content for {tabs[activeTab]} goes here. This is a dynamic content area.
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

export default TabsComponent