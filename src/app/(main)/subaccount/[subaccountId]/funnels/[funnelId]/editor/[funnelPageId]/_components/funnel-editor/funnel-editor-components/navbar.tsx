import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import { Badge } from '@/components/ui/badge'
import { Trash, Menu, X } from 'lucide-react'
import clsx from 'clsx'
import React, { useState } from 'react'

type Props = {
  element: EditorElement
}

const NavbarComponent = (props: Props) => {
  const { dispatch, state } = useEditor()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
      
      <nav style={styles} className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span 
                className="text-xl font-bold text-gray-900"
                contentEditable={!state.editor.liveMode}
                onBlur={(e) => {
                  const logoElement = e.target as HTMLSpanElement
                  dispatch({
                    type: 'UPDATE_ELEMENT',
                    payload: {
                      elementDetails: {
                        ...props.element,
                        content: {
                          ...content,
                          logo: logoElement.innerText,
                        },
                      },
                    },
                  })
                }}
              >
                {content?.logo || 'Logo'}
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {content?.links?.map((link: string, index: number) => (
                  <a
                    key={index}
                    href="#"
                    className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {content?.links?.map((link: string, index: number) => (
                  <a
                    key={index}
                    href="#"
                    className="text-gray-500 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

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

export default NavbarComponent