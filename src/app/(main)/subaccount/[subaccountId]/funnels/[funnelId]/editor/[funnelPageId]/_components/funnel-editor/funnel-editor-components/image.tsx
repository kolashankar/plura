import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import { Badge } from '@/components/ui/badge'
import { Trash } from 'lucide-react'
import clsx from 'clsx'
import React from 'react'
import Image from 'next/image'

type Props = {
  element: EditorElement
}

const ImageComponent = (props: Props) => {
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
      
      {content?.src ? (
        <Image
          src={content.src}
          alt={content.alt || 'Image'}
          width={parseInt(styles?.width) || 400}
          height={parseInt(styles?.height) || 300}
          className="object-cover rounded"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
          <span className="text-gray-500">No image selected</span>
        </div>
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

export default ImageComponent