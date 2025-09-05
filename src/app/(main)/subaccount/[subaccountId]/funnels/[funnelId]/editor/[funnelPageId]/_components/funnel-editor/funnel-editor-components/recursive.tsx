import { EditorElement } from '@/providers/editor/editor-provider'
import React from 'react'
import TextComponent from './text'
import Container from './container'
import VideoComponent from './video'
import LinkComponent from './link-component'
import ContactFormComponent from './contact-form-component'
import Checkout from './checkout'
import AIGeneratedComponent from './ai-generated-component'
import HeadingComponent from './heading'
import ButtonComponent from './button'
import ImageComponent from './image'
import DividerComponent from './divider'
import ParagraphComponent from './paragraph'
import ThreeColumnsComponent from './three-columns'
import InputComponent from './input'
import CardComponent from './card'
import SpacerComponent from './spacer'
import HeroComponent from './hero'
import IconComponent from './icon'
import SectionComponent from './section'
import TextareaComponent from './textarea'
import SelectComponent from './select'
import CheckboxComponent from './checkbox'
import NavbarComponent from './navbar'
import ProductCardComponent from './product-card'
import TestimonialComponent from './testimonial'
import LineChartComponent from './line-chart'
import KpiCardComponent from './kpi-card'
import DataTableComponent from './data-table'
import TabsComponent from './tabs'

type Props = {
  element: EditorElement
}

const Recursive = ({ element }: Props) => {
  switch (element.type) {
    case 'text':
      return <TextComponent element={element} />
    case 'container':
      return <Container element={element} />
    case 'video':
      return <VideoComponent element={element} />
    case 'contactForm':
      return <ContactFormComponent element={element} />
    case 'paymentForm':
      return <Checkout element={element} />
    case '2Col':
      return <Container element={element} />
    case '3Col':
      return <ThreeColumnsComponent element={element} />
    case '__body':
      return <Container element={element} />
    case 'link':
      return <LinkComponent element={element} />
    case 'heading':
      return <HeadingComponent element={element} />
    case 'button':
      return <ButtonComponent element={element} />
    case 'image':
      return <ImageComponent element={element} />
    case 'divider':
      return <DividerComponent element={element} />
    case 'paragraph':
      return <ParagraphComponent element={element} />
    case 'input':
      return <InputComponent element={element} />
    case 'card':
      return <CardComponent element={element} />
    case 'spacer':
      return <SpacerComponent element={element} />
    case 'hero':
      return <HeroComponent element={element} />
    case 'icon':
      return <IconComponent element={element} />
    case 'section':
      return <SectionComponent element={element} />
    case 'textarea':
      return <TextareaComponent element={element} />
    case 'select':
      return <SelectComponent element={element} />
    case 'checkbox':
      return <CheckboxComponent element={element} />
    case 'navbar':
      return <NavbarComponent element={element} />
    case 'productCard':
      return <ProductCardComponent element={element} />
    case 'testimonial':
      return <TestimonialComponent element={element} />
    case 'lineChart':
      return <LineChartComponent element={element} />
    case 'kpiCard':
      return <KpiCardComponent element={element} />
    case 'dataTable':
      return <DataTableComponent element={element} />
    case 'tabs':
      return <TabsComponent element={element} />
    case 'aiComponent':
    case 'generatedComponent':
      return <AIGeneratedComponent element={element} />
    default:
      // For unknown types, try to render as a container to prevent null rendering
      if (element.content && Array.isArray(element.content)) {
        return <Container element={element} />
      }
      return null
  }
}

export default Recursive
