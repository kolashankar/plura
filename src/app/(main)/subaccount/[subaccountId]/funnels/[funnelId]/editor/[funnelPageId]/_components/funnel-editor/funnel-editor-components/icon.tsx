import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import { Badge } from '@/components/ui/badge'
import { Trash, Star, Heart, Home, User, Settings, Mail, Phone, MapPin, Clock, Download, Upload, Search, ChevronRight, ChevronLeft, ChevronUp, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import React from 'react'

type Props = {
  element: EditorElement
}

// Icon library mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  star: Star,
  heart: Heart,
  home: Home,
  user: User,
  settings: Settings,
  mail: Mail,
  phone: Phone,
  mapPin: MapPin,
  clock: Clock,
  download: Download,
  upload: Upload,
  search: Search,
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  chevronUp: ChevronUp,
  chevronDown: ChevronDown,
}

const IconComponent = (props: Props) => {
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
  const iconName = content?.iconName || 'star'
  const IconComponent = iconMap[iconName] || Star
  const size = content?.size || 24

  return (
    <div
      className={clsx(
        'p-[2px] w-full m-[5px] relative transition-all inline-block',
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
      
      <IconComponent
        size={size}
        style={styles}
        className="transition-all hover:scale-110"
      />

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

export default IconComponent