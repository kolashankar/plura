import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import { Badge } from '@/components/ui/badge'
import { Trash, ShoppingCart, Heart } from 'lucide-react'
import clsx from 'clsx'
import React from 'react'
import Image from 'next/image'

type Props = {
  element: EditorElement
}

const ProductCardComponent = (props: Props) => {
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
      
      <div style={styles} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {/* Product Image */}
        <div className="relative aspect-square">
          {content?.image ? (
            <Image
              src={content.image}
              alt={content.title || 'Product'}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No image</span>
            </div>
          )}
          <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
            <Heart className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Product Details */}
        <div className="p-4">
          <h3 
            className="text-lg font-semibold text-gray-900 mb-2"
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
            {content?.title || 'Product Name'}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3">
            {content?.description || 'Product description goes here'}
          </p>
          
          <div className="flex items-center justify-between">
            <span 
              className="text-2xl font-bold text-gray-900"
              contentEditable={!state.editor.liveMode}
              onBlur={(e) => {
                const priceElement = e.target as HTMLSpanElement
                dispatch({
                  type: 'UPDATE_ELEMENT',
                  payload: {
                    elementDetails: {
                      ...props.element,
                      content: {
                        ...content,
                        price: priceElement.innerText,
                      },
                    },
                  },
                })
              }}
            >
              {content?.price || '$99'}
            </span>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
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

export default ProductCardComponent