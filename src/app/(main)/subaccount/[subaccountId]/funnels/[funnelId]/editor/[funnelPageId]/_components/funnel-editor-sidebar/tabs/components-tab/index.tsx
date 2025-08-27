'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertTriangle,
  ArrowUp,
  BarChartHorizontal,
  Bell,
  Calendar,
  ChevronDown,
  Clock,
  CreditCard,
  Database,
  DollarSign,
  FileText,
  Gift,
  GitCompareArrows,
  Heart,
  HelpCircle,
  Image,
  Link2,
  List,
  Loader2,
  MailIcon,
  MailPlus,
  Map,
  Megaphone,
  Menu,
  MessageCircle,
  Package,
  Plus,
  Search,
  SettingsIcon,
  Share2,
  ShoppingCart,
  SlidersHorizontal,
  Square,
  SquareCode,
  SquareStack,
  ToggleLeft,
  Type,
  Upload,
  Users,
  Youtube,
  Minus,
  Star,
  Grid3x3,
  Container,
  Layout,
  Layers,
  ChevronRight,
  Code
} from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { EditorBtns } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { useEditor } from '@/providers/editor/editor-provider'
import CodeGenerator from '@/app/(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/code-generator'
import ComponentRequestForm from '@/components/forms/component-request-form'
import CustomModal from '@/components/global/custom-modal'
import { toast } from '@/components/ui/use-toast'

type Props = {}

const ComponentsTab = ({ subaccountId }: { subaccountId: string }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [customComponents, setCustomComponents] = useState<any[]>([])
  const { state } = useEditor()

  useEffect(() => {
    const fetchCustomComponents = async () => {
      setLoading(true)
      const components = await fetch(`/api/components/${subaccountId}`)
      setCustomComponents(await components.json())
      setLoading(false)
    }
    fetchCustomComponents()
  }, [subaccountId]) // Refetch when subaccountId changes

  const elementCategories = {
    basic: [
      {
        id: 'text',
        name: 'Text',
        type: 'text',
        Component: <Type size={20} />,
        content: [],
        styles: {},
      },
      {
        id: 'heading',
        name: 'Heading',
        type: 'heading',
        Component: <FileText size={20} />,
        content: [{ innerText: 'Heading' }],
        styles: { fontSize: '2rem', fontWeight: 'bold' },
      },
      {
        id: 'paragraph',
        name: 'Paragraph',
        type: 'paragraph',
        Component: <Type size={20} />,
        content: [{ innerText: 'Lorem ipsum dolor sit amet...' }],
        styles: { lineHeight: '1.6' },
      },
      {
        id: 'button',
        name: 'Button',
        type: 'button',
        Component: <Square size={20} />,
        content: [{ innerText: 'Click Me' }],
        styles: { padding: '12px 24px', backgroundColor: '#007adf', color: 'white', borderRadius: '6px' },
      },
      {
        id: 'image',
        name: 'Image',
        type: 'image',
        Component: <Image size={20} />,
        content: [{ src: '/placeholder.jpg', alt: 'Image' }],
        styles: { maxWidth: '100%', height: 'auto' },
      },
      {
        id: 'video',
        name: 'Video',
        type: 'video',
        Component: <Youtube size={20} />,
        content: [],
        styles: {},
      },
      {
        id: 'link',
        name: 'Link',
        type: 'link',
        Component: <Link2 size={20} />,
        content: [{ href: '#', innerText: 'Click Me' }],
        styles: { color: 'black', backgroundColor: 'transparent' },
      },
      {
        id: 'divider',
        name: 'Divider',
        type: 'divider',
        Component: <Minus size={20} />,
        content: [],
        styles: { height: '1px', backgroundColor: '#e5e5e5', margin: '20px 0' },
      },
      {
        id: 'spacer',
        name: 'Spacer',
        type: 'spacer',
        Component: <Layers size={20} />,
        content: [],
        styles: { height: '40px' },
      },
      {
        id: 'icon',
        name: 'Icon',
        type: 'icon',
        Component: <Star size={20} />,
        content: [{ iconName: 'star', size: 24 }],
        styles: { color: '#007adf' },
      },
    ],
    layout: [
      {
        id: 'container',
        name: 'Container',
        type: 'container',
        Component: <Container size={20} />,
        content: [],
        styles: {},
      },
      {
        id: '2Col',
        name: '2 Columns',
        type: '2Col',
        Component: <Grid3x3 size={20} />,
        content: [],
        styles: {},
      },
      {
        id: '3Col',
        name: '3 Columns',
        type: '3Col',
        Component: <Grid3x3 size={20} />,
        content: [],
        styles: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' },
      },
      {
        id: '4Col',
        name: '4 Columns',
        type: '4Col',
        Component: <Grid3x3 size={20} />,
        content: [],
        styles: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' },
      },
      {
        id: 'section',
        name: 'Section',
        type: 'section',
        Component: <Layout size={20} />,
        content: [],
        styles: { padding: '60px 0' },
      },
      {
        id: 'hero',
        name: 'Hero Section',
        type: 'hero',
        Component: <Layout size={20} />,
        content: [],
        styles: { minHeight: '80vh', display: 'flex', alignItems: 'center' },
      },
      {
        id: 'grid',
        name: 'Grid Layout',
        type: 'grid',
        Component: <Grid3x3 size={20} />,
        content: [],
        styles: { display: 'grid', gap: '20px' },
      },
      {
        id: 'flexbox',
        name: 'Flex Container',
        type: 'flexbox',
        Component: <Layout size={20} />,
        content: [],
        styles: { display: 'flex', gap: '20px' },
      },
      {
        id: 'sidebar',
        name: 'Sidebar Layout',
        type: 'sidebar',
        Component: <Layout size={20} />,
        content: [],
        styles: { display: 'grid', gridTemplateColumns: '250px 1fr', gap: '20px' },
      },
      {
        id: 'card',
        name: 'Card',
        type: 'card',
        Component: <SquareStack size={20} />,
        content: [],
        styles: { padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
      },
    ],
    forms: [
      {
        id: 'contactForm',
        name: 'Contact Form',
        type: 'contactForm',
        Component: <MailIcon size={20} />,
        content: [],
        styles: {},
      },
      {
        id: 'input',
        name: 'Input Field',
        type: 'input',
        Component: <Square size={20} />,
        content: [{ placeholder: 'Enter text...', type: 'text' }],
        styles: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' },
      },
      {
        id: 'textarea',
        name: 'Textarea',
        type: 'textarea',
        Component: <Square size={20} />,
        content: [{ placeholder: 'Enter your message...', rows: 4 }],
        styles: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' },
      },
      {
        id: 'select',
        name: 'Select Dropdown',
        type: 'select',
        Component: <ChevronDown size={20} />,
        content: [{ options: ['Option 1', 'Option 2', 'Option 3'] }],
        styles: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' },
      },
      {
        id: 'checkbox',
        name: 'Checkbox',
        type: 'checkbox',
        Component: <Square size={20} />,
        content: [{ label: 'I agree to terms', checked: false }],
        styles: {},
      },
      {
        id: 'radio',
        name: 'Radio Button',
        type: 'radio',
        Component: <Square size={20} />,
        content: [{ name: 'choice', options: ['Option A', 'Option B'] }],
        styles: {},
      },
      {
        id: 'fileUpload',
        name: 'File Upload',
        type: 'fileUpload',
        Component: <Upload size={20} />,
        content: [{ accept: 'image/*', multiple: false }],
        styles: { width: '100%', padding: '12px', border: '2px dashed #ddd', borderRadius: '4px' },
      },
      {
        id: 'slider',
        name: 'Range Slider',
        type: 'slider',
        Component: <SlidersHorizontal size={20} />,
        content: [{ min: 0, max: 100, value: 50 }],
        styles: { width: '100%' },
      },
      {
        id: 'toggle',
        name: 'Toggle Switch',
        type: 'toggle',
        Component: <ToggleLeft size={20} />,
        content: [{ checked: false, label: 'Enable feature' }],
        styles: {},
      },
      {
        id: 'datePicker',
        name: 'Date Picker',
        type: 'datePicker',
        Component: <Calendar size={20} />,
        content: [{ type: 'date' }],
        styles: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' },
      },
    ],
    ecommerce: [
      {
        id: 'paymentForm',
        name: 'Payment Form',
        type: 'paymentForm',
        Component: <CreditCard size={20} />,
        content: [],
        styles: {},
      },
      {
        id: 'productCard',
        name: 'Product Card',
        type: 'productCard',
        Component: <SquareStack size={20} />,
        content: [{ title: 'Product Name', price: '$99', image: '/product.jpg' }],
        styles: { border: '1px solid #ddd', borderRadius: '8px', padding: '16px' },
      },
      {
        id: 'cart',
        name: 'Shopping Cart',
        type: 'cart',
        Component: <ShoppingCart size={20} />,
        content: [],
        styles: {},
      },
      {
        id: 'checkout',
        name: 'Checkout Form',
        type: 'checkout',
        Component: <DollarSign size={20} />,
        content: [],
        styles: {},
      },
      {
        id: 'pricingTable',
        name: 'Pricing Table',
        type: 'pricingTable',
        Component: <DollarSign size={20} />,
        content: [{ plans: [{ name: 'Basic', price: '$9/mo' }, { name: 'Pro', price: '$19/mo' }] }],
        styles: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
      },
      {
        id: 'productGallery',
        name: 'Product Gallery',
        type: 'productGallery',
        Component: <Image size={20} />,
        content: [],
        styles: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
      },
      {
        id: 'wishlist',
        name: 'Wishlist',
        type: 'wishlist',
        Component: <Heart size={20} />,
        content: [],
        styles: {},
      },
      {
        id: 'reviews',
        name: 'Product Reviews',
        type: 'reviews',
        Component: <MessageCircle size={20} />,
        content: [],
        styles: {},
      },
      {
        id: 'compare',
        name: 'Product Compare',
        type: 'compare',
        Component: <GitCompareArrows size={20} />,
        content: [],
        styles: {},
      },
      {
        id: 'inventory',
        name: 'Inventory Display',
        type: 'inventory',
        Component: <Package size={20} />,
        content: [{ stock: 10, message: 'Only 10 left in stock!' }],
        styles: { color: '#d63384', fontWeight: 'bold' },
      },
    ],
    navigation: [
      {
        id: 'navbar',
        name: 'Navigation Bar',
        type: 'navbar',
        Component: <Layout size={20} />,
        content: [{ logo: 'Logo', links: ['Home', 'About', 'Services', 'Contact'] }],
        styles: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' },
      },
      {
        id: 'breadcrumbs',
        name: 'Breadcrumbs',
        type: 'breadcrumbs',
        Component: <ChevronRight size={20} />,
        content: [{ path: ['Home', 'Products', 'Current Page'] }],
        styles: { fontSize: '14px', color: '#666' },
      },
      {
        id: 'sidebar',
        name: 'Side Navigation',
        type: 'sideNav',
        Component: <Layout size={20} />,
        content: [{ links: ['Dashboard', 'Profile', 'Settings', 'Help'] }],
        styles: { width: '250px', backgroundColor: '#f8f9fa', padding: '20px' },
      },
      {
        id: 'tabs',
        name: 'Tab Navigation',
        type: 'tabs',
        Component: <Layers size={20} />,
        content: [{ tabs: ['Tab 1', 'Tab 2', 'Tab 3'] }],
        styles: { borderBottom: '1px solid #ddd' },
      },
      {
        id: 'pagination',
        name: 'Pagination',
        type: 'pagination',
        Component: <List size={20} />,
        content: [{ currentPage: 1, totalPages: 10 }],
        styles: { display: 'flex', gap: '8px', justifyContent: 'center' },
      },
      {
        id: 'menu',
        name: 'Dropdown Menu',
        type: 'menu',
        Component: <Menu size={20} />,
        content: [{ items: ['Option 1', 'Option 2', 'Option 3'] }],
        styles: { position: 'relative' },
      },
      {
        id: 'footer',
        name: 'Footer',
        type: 'footer',
        Component: <Layout size={20} />,
        content: [{ copyright: '© 2024 Company Name', links: ['Privacy', 'Terms', 'Support'] }],
        styles: { backgroundColor: '#333', color: 'white', padding: '40px 0' },
      },
      {
        id: 'socialLinks',
        name: 'Social Media Links',
        type: 'socialLinks',
        Component: <Share2 size={20} />,
        content: [{ platforms: ['facebook', 'twitter', 'instagram', 'linkedin'] }],
        styles: { display: 'flex', gap: '16px' },
      },
      {
        id: 'backToTop',
        name: 'Back to Top',
        type: 'backToTop',
        Component: <ArrowUp size={20} />,
        content: [],
        styles: { position: 'fixed', bottom: '20px', right: '20px' },
      },
      {
        id: 'searchBar',
        name: 'Search Bar',
        type: 'searchBar',
        Component: <Search size={20} />,
        content: [{ placeholder: 'Search...' }],
        styles: { display: 'flex', alignItems: 'center', gap: '8px' },
      },
    ],
    content: [
      {
        id: 'testimonial',
        name: 'Testimonial',
        type: 'testimonial',
        Component: <MessageCircle size={20} />,
        content: [{ quote: 'Amazing service!', author: 'John Doe', role: 'CEO' }],
        styles: { fontStyle: 'italic', padding: '20px', backgroundColor: '#f8f9fa' },
      },
      {
        id: 'faq',
        name: 'FAQ Section',
        type: 'faq',
        Component: <HelpCircle size={20} />,
        content: [{ questions: [{ q: 'Question?', a: 'Answer here.' }] }],
        styles: {},
      },
      {
        id: 'timeline',
        name: 'Timeline',
        type: 'timeline',
        Component: <Clock size={20} />,
        content: [{ events: [{ date: '2024', title: 'Event', description: 'Description' }] }],
        styles: {},
      },
      {
        id: 'stats',
        name: 'Statistics',
        type: 'stats',
        Component: <BarChartHorizontal size={20} />,
        content: [{ stats: [{ value: '1000+', label: 'Customers' }] }],
        styles: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' },
      },
      {
        id: 'team',
        name: 'Team Section',
        type: 'team',
        Component: <Users size={20} />,
        content: [{ members: [{ name: 'John Doe', role: 'Developer', image: '/team1.jpg' }] }],
        styles: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },
      },
      {
        id: 'blog',
        name: 'Blog Posts',
        type: 'blog',
        Component: <FileText size={20} />,
        content: [{ posts: [{ title: 'Post Title', excerpt: 'Post excerpt...', date: '2024-01-01' }] }],
        styles: {},
      },
      {
        id: 'gallery',
        name: 'Image Gallery',
        type: 'gallery',
        Component: <Image size={20} />,
        content: [{ images: ['/img1.jpg', '/img2.jpg', '/img3.jpg'] }],
        styles: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' },
      },
      {
        id: 'counter',
        name: 'Animated Counter',
        type: 'counter',
        Component: <Plus size={20} />,
        content: [{ target: 1000, suffix: '+', label: 'Happy Customers' }],
        styles: { textAlign: 'center', fontSize: '2rem', fontWeight: 'bold' },
      },
      {
        id: 'newsletter',
        name: 'Newsletter Signup',
        type: 'newsletter',
        Component: <MailPlus size={20} />,
        content: [{ title: 'Subscribe to our newsletter', placeholder: 'Enter your email' }],
        styles: { backgroundColor: '#f8f9fa', padding: '40px', textAlign: 'center' },
      },
      {
        id: 'cta',
        name: 'Call to Action',
        type: 'cta',
        Component: <Megaphone size={20} />,
        content: [{ title: 'Ready to get started?', buttonText: 'Get Started' }],
        styles: { textAlign: 'center', padding: '60px', backgroundColor: '#007adf', color: 'white' },
      },
    ],
    advanced: [
      {
        id: 'modal',
        name: 'Modal/Popup',
        type: 'modal',
        Component: <Square size={20} />,
        content: [],
        styles: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
      },
      {
        id: 'tooltip',
        name: 'Tooltip',
        type: 'tooltip',
        Component: <Square size={20} />,
        content: [{ text: 'Hover me', tooltip: 'This is a tooltip' }],
        styles: { position: 'relative' },
      },
      {
        id: 'accordion',
        name: 'Accordion',
        type: 'accordion',
        Component: <Square size={20} />,
        content: [{ items: [{ title: 'Section 1', content: 'Content here' }] }],
        styles: {},
      },
      {
        id: 'carousel',
        name: 'Image Carousel',
        type: 'carousel',
        Component: <Image size={20} />,
        content: [{ images: ['/slide1.jpg', '/slide2.jpg', '/slide3.jpg'] }],
        styles: { position: 'relative', overflow: 'hidden' },
      },
      {
        id: 'progressBar',
        name: 'Progress Bar',
        type: 'progressBar',
        Component: <Square size={20} />,
        content: [{ progress: 75, label: 'Progress' }],
        styles: { width: '100%', height: '8px', backgroundColor: '#e5e5e5', borderRadius: '4px' },
      },
      {
        id: 'loadingSpinner',
        name: 'Loading Spinner',
        type: 'loadingSpinner',
        Component: <Loader2 size={20} />,
        content: [],
        styles: { width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #007adf', borderRadius: '50%' },
      },
      {
        id: 'notification',
        name: 'Notification',
        type: 'notification',
        Component: <Bell size={20} />,
        content: [{ message: 'This is a notification', type: 'info' }],
        styles: { padding: '16px', borderRadius: '4px', backgroundColor: '#d1ecf1', color: '#0c5460' },
      },
      {
        id: 'map',
        name: 'Map Embed',
        type: 'map',
        Component: <Map size={20} />,
        content: [{ location: 'New York, NY', zoom: 12 }],
        styles: { width: '100%', height: '400px' },
      },
      {
        id: 'chatWidget',
        name: 'Chat Widget',
        type: 'chatWidget',
        Component: <MessageCircle size={20} />,
        content: [],
        styles: { position: 'fixed', bottom: '20px', right: '20px', width: '300px', height: '400px' },
      },
      {
        id: 'codeBlock',
        name: 'Code Block',
        type: 'codeBlock',
        Component: <SquareCode size={20} />,
        content: [{ code: 'console.log("Hello World");', language: 'javascript' }],
        styles: { backgroundColor: '#f8f8f8', padding: '16px', borderRadius: '4px', fontFamily: 'monospace' },
      },
    ]
  }

  const ComponentRequestModal = ({ subaccountId }: { subaccountId: string }) => {
    return (
      <Button variant="ghost" className="w-full flex gap-2">
        <Plus size={15} />
        Create New Component
      </Button>
    )
  }

  return (
    <>
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={['Layout', 'Elements']}
      >
        <AccordionItem
          value="Layout"
          className="px-6 py-0 border-y-[1px]"
        >
          <AccordionTrigger className="!no-underline">Layout</AccordionTrigger>
          <AccordionContent className="flex flex-wrap gap-2 ">
            {elementCategories.layout.map((element) => (
              <div
                key={element.id}
                className="flex-col items-center justify-center flex"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('componentType', element.type)
                }}
              >
                {element.Component}
                <span className="text-muted-foreground">{element.name}</span>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="Elements"
          className="px-6 py-0 border-y-[1px]"
        >
          <AccordionTrigger className="!no-underline">Basic Elements</AccordionTrigger>
          <AccordionContent className="flex flex-wrap gap-2 ">
            {elementCategories.basic.map((element) => (
              <div
                key={element.id}
                className="flex-col items-center justify-center flex"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('componentType', element.type)
                }}
              >
                {element.Component}
                <span className="text-muted-foreground">{element.name}</span>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="Forms"
          className="px-6 py-0 border-y-[1px]"
        >
          <AccordionTrigger className="!no-underline">Forms</AccordionTrigger>
          <AccordionContent className="flex flex-wrap gap-2 ">
            {elementCategories.forms.map((element) => (
              <div
                key={element.id}
                className="flex-col items-center justify-center flex"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('componentType', element.type)
                }}
              >
                {element.Component}
                <span className="text-muted-foreground">{element.name}</span>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="Ecommerce"
          className="px-6 py-0 border-y-[1px]"
        >
          <AccordionTrigger className="!no-underline">Ecommerce</AccordionTrigger>
          <AccordionContent className="flex flex-wrap gap-2 ">
            {elementCategories.ecommerce.map((element) => (
              <div
                key={element.id}
                className="flex-col items-center justify-center flex"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('componentType', element.type)
                }}
              >
                {element.Component}
                <span className="text-muted-foreground">{element.name}</span>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="Navigation"
          className="px-6 py-0 border-y-[1px]"
        >
          <AccordionTrigger className="!no-underline">Navigation</AccordionTrigger>
          <AccordionContent className="flex flex-wrap gap-2 ">
            {elementCategories.navigation.map((element) => (
              <div
                key={element.id}
                className="flex-col items-center justify-center flex"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('componentType', element.type)
                }}
              >
                {element.Component}
                <span className="text-muted-foreground">{element.name}</span>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="Content"
          className="px-6 py-0 border-y-[1px]"
        >
          <AccordionTrigger className="!no-underline">Content</AccordionTrigger>
          <AccordionContent className="flex flex-wrap gap-2 ">
            {elementCategories.content.map((element) => (
              <div
                key={element.id}
                className="flex-col items-center justify-center flex"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('componentType', element.type)
                }}
              >
                {element.Component}
                <span className="text-muted-foreground">{element.name}</span>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="Advanced"
          className="px-6 py-0 border-y-[1px]"
        >
          <AccordionTrigger className="!no-underline">Advanced</AccordionTrigger>
          <AccordionContent className="flex flex-wrap gap-2 ">
            {elementCategories.advanced.map((element) => (
              <div
                key={element.id}
                className="flex-col items-center justify-center flex"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('componentType', element.type)
                }}
              >
                {element.Component}
                <span className="text-muted-foreground">{element.name}</span>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="custom" className="px-6 py-0 ">
          <AccordionTrigger className="!no-underline">
            Custom Components
          </AccordionTrigger>
          <AccordionContent className="flex flex-wrap gap-2">
            {loading ? (
              <div className="text-center py-4">Loading custom components...</div>
            ) : customComponents.length > 0 ? (
              customComponents.map((component) => (
                <div
                  key={component.id}
                  draggable
                  onDragStart={(e) => {
                    if (component.type === null) return
                    e.dataTransfer.setData('componentType', component.type)
                    e.dataTransfer.setData('customComponent', JSON.stringify(component))
                  }}
                  className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center cursor-grab border-2 border-dashed border-muted-foreground/50 hover:border-muted-foreground group"
                  title={component.name}
                >
                  <div className="flex flex-col items-center">
                    <SquareCode size={20} className="text-muted-foreground group-hover:text-foreground" />
                    <span className="text-xs text-muted-foreground group-hover:text-foreground truncate max-w-12">
                      {component.name}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No custom components yet. Create one using the button below.
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="p-4 border-t space-y-4">
        <ComponentRequestModal subaccountId={subaccountId} />
        <CodeGenerator 
          elements={state.editor.elements}
          styles={state.editor.selectedElement.styles}
          funnelPageId={state.editor.funnelPageId}
          subaccountId={subaccountId}
        />
      </div>
    </>
  )
}

export default ComponentsTab