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
  Code,
  TrendingUp,
  PieChart,
  Activity,
  BarChart3,
  LineChart,
  Gauge,
  Target,
  Zap,
  MousePointer,
  Sparkles,
  Wand2,
  Play,
  Eye,
  Move,
  RotateCw,
  BookOpen,
  Edit,
  FileCode,
  Globe,
  AtSign,
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Hash,
  Users2,
  Repeat,
  Maximize,
  Split,
  ZoomIn,
  MoreHorizontal,
  Palette,
  Layers3,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { EditorBtns } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { useEditor } from '@/providers/editor/editor-provider'
import CodeGenerator from '@/app/(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/code-generator'
import ComponentRequestForm from '@/components/forms/component-request-form'
import CustomModal from '@/components/global/custom-modal'
import { toast } from '@/components/ui/use-toast'
import AIComponentGenerator from '@/components/ai-agent/ai-component-generator'

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
        content: [{ innerText: 'Sample text content' }],
        styles: { fontSize: '16px', lineHeight: '1.5', color: '#333' },
        functionality: {
          editable: true,
          contentEditable: true,
          styleEditable: ['fontSize', 'color', 'fontWeight', 'textAlign']
        }
      },
      {
        id: 'heading',
        name: 'Heading',
        type: 'heading',
        Component: <FileText size={20} />,
        content: [{ innerText: 'Your Heading Here', level: 'h1' }],
        styles: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' },
        functionality: {
          editable: true,
          headingLevels: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
          seoFriendly: true
        }
      },
      {
        id: 'paragraph',
        name: 'Paragraph',
        type: 'paragraph',
        Component: <Type size={20} />,
        content: [{ innerText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }],
        styles: { lineHeight: '1.6', marginBottom: '1rem', fontSize: '16px' },
        functionality: {
          richText: true,
          characterLimit: 500,
          autoResize: true
        }
      },
      {
        id: 'button',
        name: 'Button',
        type: 'button',
        Component: <Square size={20} />,
        content: [{ innerText: 'Click Me', href: '#', action: 'link' }],
        styles: { 
          padding: '12px 24px', 
          backgroundColor: '#007adf', 
          color: 'white', 
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        },
        functionality: {
          clickActions: ['link', 'submit', 'modal', 'scroll', 'download'],
          hoverEffects: true,
          loading: true,
          disabled: false
        }
      },
      {
        id: 'image',
        name: 'Image',
        type: 'image',
        Component: <Image size={20} />,
        content: [{ src: '/placeholder.jpg', alt: 'Descriptive image text', title: 'Image title' }],
        styles: { maxWidth: '100%', height: 'auto', borderRadius: '8px' },
        functionality: {
          lazyLoading: true,
          responsive: true,
          formats: ['jpg', 'png', 'webp', 'svg'],
          maxSize: '5MB',
          cropTool: true
        }
      },
      {
        id: 'video',
        name: 'Video',
        type: 'video',
        Component: <Youtube size={20} />,
        content: [{ 
          src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', 
          provider: 'youtube',
          autoplay: false,
          controls: true,
          muted: false
        }],
        styles: { width: '100%', aspectRatio: '16/9', borderRadius: '8px' },
        functionality: {
          providers: ['youtube', 'vimeo', 'mp4', 'webm'],
          responsive: true,
          posterImage: true,
          customControls: true
        }
      },
      {
        id: 'link',
        name: 'Link',
        type: 'link',
        Component: <Link2 size={20} />,
        content: [{ href: '#', innerText: 'Click Here', target: '_self', rel: 'noopener' }],
        styles: { 
          color: '#007adf', 
          textDecoration: 'underline',
          transition: 'color 0.3s ease'
        },
        functionality: {
          targetOptions: ['_self', '_blank', '_parent', '_top'],
          trackClicks: true,
          validationCheck: true
        }
      },
      {
        id: 'divider',
        name: 'Divider',
        type: 'divider',
        Component: <Minus size={20} />,
        content: [{ style: 'solid', width: '100%' }],
        styles: { 
          height: '1px', 
          backgroundColor: '#e5e5e5', 
          margin: '20px 0',
          border: 'none'
        },
        functionality: {
          styles: ['solid', 'dashed', 'dotted', 'gradient'],
          widthOptions: ['25%', '50%', '75%', '100%'],
          centerAlign: true
        }
      },
      {
        id: 'spacer',
        name: 'Spacer',
        type: 'spacer',
        Component: <Layers size={20} />,
        content: [{ height: '40px', adjustable: true }],
        styles: { 
          height: '40px',
          width: '100%',
          backgroundColor: 'transparent'
        },
        functionality: {
          heightRange: [10, 200],
          responsiveSpacing: true,
          visualIndicator: true
        }
      },
      {
        id: 'icon',
        name: 'Icon',
        type: 'icon',
        Component: <Star size={20} />,
        content: [{ iconName: 'star', size: 24, library: 'lucide' }],
        styles: { 
          color: '#007adf',
          fontSize: '24px',
          display: 'inline-block'
        },
        functionality: {
          libraries: ['lucide', 'heroicons', 'feather', 'fontawesome'],
          sizeRange: [12, 96],
          colorPicker: true,
          animation: ['none', 'spin', 'pulse', 'bounce']
        }
      },
    ],
    layout: [
      {
        id: 'container',
        name: 'Container',
        type: 'container',
        Component: <Container size={20} />,
        content: [],
        styles: { 
          padding: '20px',
          backgroundColor: 'transparent',
          border: '1px dashed #ddd',
          borderRadius: '8px'
        },
        functionality: {
          dropZone: true,
          resizable: true,
          stackable: true,
          maxWidth: true
        }
      },
      {
        id: '2Col',
        name: '2 Columns',
        type: '2Col',
        Component: <Grid3x3 size={20} />,
        content: [],
        styles: { 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px',
          padding: '20px'
        },
        functionality: {
          resizableColumns: true,
          responsiveBreakpoints: true,
          alignContent: ['start', 'center', 'end', 'stretch']
        }
      },
      {
        id: '3Col',
        name: '3 Columns',
        type: '3Col',
        Component: <Grid3x3 size={20} />,
        content: [],
        styles: { 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr', 
          gap: '20px',
          padding: '20px'
        },
        functionality: {
          customRatios: ['1fr 2fr 1fr', '2fr 1fr 1fr', '1fr 1fr 2fr'],
          responsiveStacking: true,
          verticalAlignment: true
        }
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
        content: [{ title: 'Card Title', content: 'Card content goes here' }],
        styles: { 
          padding: '24px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          backgroundColor: 'white',
          border: '1px solid #e5e5e5'
        },
        functionality: {
          hoverEffects: ['lift', 'glow', 'scale', 'rotate'],
          clickActions: true,
          cardTypes: ['basic', 'image', 'profile', 'product'],
          animation: 'fadeIn'
        }
      },
      {
        id: 'hero',
        name: 'Hero Section',
        type: 'hero',
        Component: <Layout size={20} />,
        content: [{ 
          title: 'Your Amazing Hero Title',
          subtitle: 'Compelling subtitle that converts',
          backgroundImage: '/hero-bg.jpg',
          ctaText: 'Get Started',
          ctaLink: '#'
        }],
        styles: { 
          minHeight: '80vh', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        },
        functionality: {
          parallaxScroll: true,
          overlayOpacity: true,
          animatedText: ['typewriter', 'fadeIn', 'slideUp'],
          videoBackground: true
        }
      },
      {
        id: 'section',
        name: 'Section',
        type: 'section',
        Component: <Layout size={20} />,
        content: [],
        styles: { 
          padding: '60px 0',
          backgroundColor: 'transparent',
          borderTop: '1px solid transparent'
        },
        functionality: {
          sectionTemplates: ['content', 'features', 'testimonials', 'pricing'],
          backgroundOptions: ['color', 'gradient', 'image', 'video'],
          anchor: true
        }
      },
      {
        id: 'grid',
        name: 'Grid Layout',
        type: 'grid',
        Component: <Grid3x3 size={20} />,
        content: [],
        styles: { 
          display: 'grid', 
          gap: '20px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
        },
        functionality: {
          gridSizes: [2, 3, 4, 5, 6],
          autoFit: true,
          masonry: true,
          isotope: true
        }
      },
    ],
    forms: [
      {
        id: 'contactForm',
        name: 'Contact Form',
        type: 'contactForm',
        Component: <MailIcon size={20} />,
        content: [{
          fields: [
            { name: 'name', type: 'text', label: 'Full Name', required: true },
            { name: 'email', type: 'email', label: 'Email Address', required: true },
            { name: 'subject', type: 'text', label: 'Subject', required: false },
            { name: 'message', type: 'textarea', label: 'Message', required: true }
          ],
          submitText: 'Send Message',
          thankYouMessage: 'Thank you for your message!'
        }],
        styles: { 
          padding: '30px',
          backgroundColor: '#f9f9f9',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        },
        functionality: {
          validation: true,
          spamProtection: 'recaptcha',
          emailIntegration: ['smtp', 'sendgrid', 'mailchimp'],
          autoResponder: true,
          conditionalFields: true
        }
      },
      {
        id: 'input',
        name: 'Input Field',
        type: 'input',
        Component: <Square size={20} />,
        content: [{ 
          placeholder: 'Enter text...', 
          type: 'text',
          label: 'Input Label',
          required: false,
          validation: null
        }],
        styles: { 
          width: '100%', 
          padding: '12px', 
          border: '1px solid #ddd', 
          borderRadius: '4px',
          fontSize: '16px',
          transition: 'border-color 0.3s ease'
        },
        functionality: {
          inputTypes: ['text', 'email', 'password', 'number', 'tel', 'url'],
          validation: ['required', 'email', 'phone', 'custom'],
          maskInput: true,
          autoComplete: true
        }
      },
      {
        id: 'textarea',
        name: 'Textarea',
        type: 'textarea',
        Component: <Square size={20} />,
        content: [{ 
          placeholder: 'Enter your message...', 
          rows: 4,
          maxLength: 500,
          required: false
        }],
        styles: { 
          width: '100%', 
          padding: '12px', 
          border: '1px solid #ddd', 
          borderRadius: '4px',
          resize: 'vertical',
          fontFamily: 'inherit'
        },
        functionality: {
          autoResize: true,
          characterCount: true,
          richText: false,
          wordLimit: true
        }
      },
      {
        id: 'select',
        name: 'Select Dropdown',
        type: 'select',
        Component: <ChevronDown size={20} />,
        content: [{ 
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' }
          ],
          placeholder: 'Choose an option...',
          multiple: false
        }],
        styles: { 
          width: '100%', 
          padding: '12px', 
          border: '1px solid #ddd', 
          borderRadius: '4px',
          backgroundColor: 'white',
          cursor: 'pointer'
        },
        functionality: {
          searchable: true,
          multiSelect: true,
          customOptions: true,
          loadFromAPI: true
        }
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
        content: [{ 
          type: 'date',
          format: 'YYYY-MM-DD',
          minDate: null,
          maxDate: null,
          defaultValue: null
        }],
        styles: { 
          width: '100%', 
          padding: '12px', 
          border: '1px solid #ddd', 
          borderRadius: '4px',
          backgroundColor: 'white'
        },
        functionality: {
          dateRanges: true,
          timePicker: true,
          localization: true,
          disabledDates: true
        }
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
    ],
    // NEW CATEGORY 1: Analytics & Data Visualization
    analytics: [
      {
        id: 'lineChart',
        name: 'Line Chart',
        type: 'lineChart',
        Component: <LineChart size={20} />,
        content: [{
          data: [{ x: 'Jan', y: 100 }, { x: 'Feb', y: 150 }, { x: 'Mar', y: 200 }],
          xKey: 'x',
          yKey: 'y',
          color: '#007adf'
        }],
        styles: { width: '100%', height: '300px', padding: '20px' },
        functionality: {
          interactive: true,
          zoom: true,
          tooltip: true,
          animation: ['fadeIn', 'slideUp', 'draw']
        }
      },
      {
        id: 'barChart',
        name: 'Bar Chart',
        type: 'barChart',
        Component: <BarChart3 size={20} />,
        content: [{
          data: [{ category: 'A', value: 100 }, { category: 'B', value: 150 }],
          orientation: 'vertical'
        }],
        styles: { width: '100%', height: '300px', padding: '20px' },
        functionality: {
          horizontal: true,
          stacked: true,
          grouped: true,
          realTimeUpdate: true
        }
      },
      {
        id: 'pieChart',
        name: 'Pie Chart',
        type: 'pieChart',
        Component: <PieChart size={20} />,
        content: [{
          data: [{ name: 'Category A', value: 40 }, { name: 'Category B', value: 60 }],
          showLabels: true
        }],
        styles: { width: '100%', height: '300px', padding: '20px' },
        functionality: {
          donut: true,
          explode: true,
          customColors: true,
          percentages: true
        }
      },
      {
        id: 'kpiCard',
        name: 'KPI Card',
        type: 'kpiCard',
        Component: <Target size={20} />,
        content: [{
          title: 'Revenue',
          value: '$125,000',
          change: '+12.5%',
          trend: 'up',
          period: 'vs last month'
        }],
        styles: { 
          padding: '20px', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        },
        functionality: {
          realTime: true,
          alerts: true,
          drillDown: true,
          export: true
        }
      },
      {
        id: 'dataTable',
        name: 'Data Table',
        type: 'dataTable',
        Component: <Database size={20} />,
        content: [{
          columns: ['Name', 'Email', 'Status', 'Date'],
          data: [
            ['John Doe', 'john@example.com', 'Active', '2024-01-15'],
            ['Jane Smith', 'jane@example.com', 'Pending', '2024-01-16']
          ],
          sortable: true,
          filterable: true
        }],
        styles: { width: '100%', backgroundColor: 'white' },
        functionality: {
          pagination: true,
          search: true,
          export: ['csv', 'pdf', 'excel'],
          columnResize: true
        }
      }
    ],
    // NEW CATEGORY 2: Interactive & Animation
    interactive: [
      {
        id: 'parallaxSection',
        name: 'Parallax Section',
        type: 'parallaxSection',
        Component: <Layers size={20} />,
        content: [{
          backgroundImage: '/parallax-bg.jpg',
          speed: 0.5,
          content: 'Parallax Content Here'
        }],
        styles: {
          height: '100vh',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        },
        functionality: {
          scrollSpeed: true,
          multiLayer: true,
          mobileOptimized: true,
          performance: 'optimized'
        }
      },
      {
        id: 'scrollAnimation',
        name: 'Scroll Animation',
        type: 'scrollAnimation',
        Component: <Zap size={20} />,
        content: [{
          trigger: 'onScroll',
          animation: 'fadeInUp',
          delay: 0,
          duration: 1000
        }],
        styles: {
          opacity: 0,
          transform: 'translateY(50px)',
          transition: 'all 0.6s ease'
        },
        functionality: {
          triggers: ['scroll', 'hover', 'click', 'load'],
          animations: ['fade', 'slide', 'zoom', 'rotate', 'bounce'],
          waypoints: true,
          stagger: true
        }
      },
      {
        id: 'countUpAnimation',
        name: 'Count Up Animation',
        type: 'countUpAnimation',
        Component: <TrendingUp size={20} />,
        content: [{
          start: 0,
          end: 1000,
          duration: 2000,
          prefix: '',
          suffix: '+'
        }],
        styles: {
          fontSize: '2rem',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        functionality: {
          triggerOnScroll: true,
          decimal: true,
          separator: true,
          easingFunction: true
        }
      },
      {
        id: 'typingEffect',
        name: 'Typing Effect',
        type: 'typingEffect',
        Component: <Type size={20} />,
        content: [{
          texts: ['Welcome to our site', 'We create amazing experiences', 'Get started today'],
          speed: 100,
          backSpeed: 50,
          loop: true
        }],
        styles: {
          fontSize: '1.5rem',
          fontWeight: 'bold',
          minHeight: '2em'
        },
        functionality: {
          cursor: true,
          shuffle: true,
          smartBackspace: true,
          fadeOut: true
        }
      },
      {
        id: 'hoverEffects',
        name: 'Hover Effects',
        type: 'hoverEffects',
        Component: <MousePointer size={20} />,
        content: [{
          effect: 'scale',
          intensity: 1.05,
          duration: 300
        }],
        styles: {
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        },
        functionality: {
          effects: ['scale', 'rotate', 'blur', 'brightness', 'shadow'],
          customCSS: true,
          mobileDisable: true,
          performance: true
        }
      }
    ],
    // NEW CATEGORY 3: Content Management
    contentManagement: [
      {
        id: 'richTextEditor',
        name: 'Rich Text Editor',
        type: 'richTextEditor',
        Component: <Edit size={20} />,
        content: [{
          value: '<p>Start typing here...</p>',
          toolbar: ['bold', 'italic', 'underline', 'link'],
          height: 300
        }],
        styles: {
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '10px'
        },
        functionality: {
          fullToolbar: true,
          mediaUpload: true,
          codeView: true,
          spellCheck: true
        }
      },
      {
        id: 'markdownRenderer',
        name: 'Markdown Renderer',
        type: 'markdownRenderer',
        Component: <FileCode size={20} />,
        content: [{
          markdown: '# Hello World\\n\\nThis is **markdown** content.',
          theme: 'github'
        }],
        styles: {
          fontFamily: 'system-ui',
          lineHeight: '1.6'
        },
        functionality: {
          syntax: true,
          toc: true,
          mathJax: true,
          mermaid: true
        }
      },
      {
        id: 'codeEditor',
        name: 'Code Editor',
        type: 'codeEditor',
        Component: <Code size={20} />,
        content: [{
          code: 'console.log(\"Hello World\");',
          language: 'javascript',
          theme: 'dark'
        }],
        styles: {
          fontFamily: 'monospace',
          fontSize: '14px',
          height: '200px'
        },
        functionality: {
          syntax: true,
          lineNumbers: true,
          folding: true,
          autocomplete: true
        }
      },
      {
        id: 'blogGrid',
        name: 'Blog Grid',
        type: 'blogGrid',
        Component: <Grid3x3 size={20} />,
        content: [{
          posts: [
            { title: 'Post 1', excerpt: 'Excerpt 1', image: '/blog1.jpg' },
            { title: 'Post 2', excerpt: 'Excerpt 2', image: '/blog2.jpg' }
          ],
          columns: 3
        }],
        styles: {
          display: 'grid',
          gap: '20px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
        },
        functionality: {
          pagination: true,
          filter: true,
          sort: true,
          search: true
        }
      },
      {
        id: 'eventCalendar',
        name: 'Event Calendar',
        type: 'eventCalendar',
        Component: <Calendar size={20} />,
        content: [{
          events: [
            { title: 'Meeting', date: '2024-01-15', time: '10:00' },
            { title: 'Webinar', date: '2024-01-16', time: '14:00' }
          ],
          view: 'month'
        }],
        styles: {
          width: '100%',
          height: '500px',
          backgroundColor: 'white'
        },
        functionality: {
          views: ['month', 'week', 'day', 'agenda'],
          recurring: true,
          timezone: true,
          export: true
        }
      }
    ],
    // NEW CATEGORY 4: Social & Communication
    social: [
      {
        id: 'socialFeed',
        name: 'Social Media Feed',
        type: 'socialFeed',
        Component: <Share2 size={20} />,
        content: [{
          platform: 'instagram',
          username: 'yourhandle',
          count: 6,
          layout: 'grid'
        }],
        styles: {
          width: '100%',
          padding: '20px'
        },
        functionality: {
          platforms: ['instagram', 'twitter', 'facebook', 'linkedin'],
          layouts: ['grid', 'carousel', 'list'],
          refresh: true,
          cache: true
        }
      },
      {
        id: 'liveChat',
        name: 'Live Chat',
        type: 'liveChat',
        Component: <MessageCircle size={20} />,
        content: [{
          position: 'bottom-right',
          greeting: 'Hello! How can we help?',
          color: '#007adf'
        }],
        styles: {
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000
        },
        functionality: {
          offline: true,
          typing: true,
          files: true,
          history: true
        }
      },
      {
        id: 'commentSystem',
        name: 'Comment System',
        type: 'commentSystem',
        Component: <MessageCircle size={20} />,
        content: [{
          threaded: true,
          moderation: true,
          anonymous: false
        }],
        styles: {
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px'
        },
        functionality: {
          reactions: true,
          reply: true,
          edit: true,
          notifications: true
        }
      },
      {
        id: 'shareButtons',
        name: 'Share Buttons',
        type: 'shareButtons',
        Component: <Share2 size={20} />,
        content: [{
          platforms: ['facebook', 'twitter', 'linkedin', 'email'],
          url: 'https://example.com',
          title: 'Check this out!'
        }],
        styles: {
          display: 'flex',
          gap: '10px',
          justifyContent: 'center'
        },
        functionality: {
          count: true,
          mobile: true,
          popup: true,
          track: true
        }
      },
      {
        id: 'socialLogin',
        name: 'Social Login',
        type: 'socialLogin',
        Component: <Users size={20} />,
        content: [{
          providers: ['google', 'facebook', 'twitter', 'github'],
          layout: 'buttons'
        }],
        styles: {
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '300px'
        },
        functionality: {
          oauth: true,
          registration: true,
          profile: true,
          secure: true
        }
      }
    ],
    // NEW CATEGORY 5: Advanced UI
    advancedUI: [
      {
        id: 'infiniteScroll',
        name: 'Infinite Scroll',
        type: 'infiniteScroll',
        Component: <Repeat size={20} />,
        content: [{
          threshold: 100,
          loading: 'Loading more...',
          hasMore: true
        }],
        styles: {
          width: '100%',
          minHeight: '400px'
        },
        functionality: {
          threshold: true,
          loading: true,
          error: true,
          reset: true
        }
      },
      {
        id: 'draggableList',
        name: 'Draggable List',
        type: 'draggableList',
        Component: <Move size={20} />,
        content: [{
          items: ['Item 1', 'Item 2', 'Item 3'],
          handle: true,
          animation: 150
        }],
        styles: {
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '8px'
        },
        functionality: {
          handle: true,
          ghost: true,
          constraints: true,
          callback: true
        }
      },
      {
        id: 'resizablePanels',
        name: 'Resizable Panels',
        type: 'resizablePanels',
        Component: <SlidersHorizontal size={20} />,
        content: [{
          panels: [
            { id: 'left', content: 'Left Panel', width: '30%' },
            { id: 'right', content: 'Right Panel', width: '70%' }
          ],
          direction: 'horizontal'
        }],
        styles: {
          width: '100%',
          height: '400px',
          display: 'flex'
        },
        functionality: {
          direction: ['horizontal', 'vertical'],
          constraints: true,
          persist: true,
          collapse: true
        }
      },
      {
        id: 'imageComparison',
        name: 'Image Comparison',
        type: 'imageComparison',
        Component: <GitCompareArrows size={20} />,
        content: [{
          before: '/before.jpg',
          after: '/after.jpg',
          position: 50
        }],
        styles: {
          width: '100%',
          height: '400px',
          position: 'relative'
        },
        functionality: {
          vertical: true,
          labels: true,
          hover: true,
          mobile: true
        }
      },
      {
        id: 'fullscreenModal',
        name: 'Fullscreen Modal',
        type: 'fullscreenModal',
        Component: <Maximize size={20} />,
        content: [{
          title: 'Modal Title',
          content: 'Modal content goes here...',
          closeButton: true
        }],
        styles: {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.9)',
          zIndex: 9999
        },
        functionality: {
          animation: ['fade', 'slide', 'zoom'],
          keyboard: true,
          backdrop: true,
          stack: true
        }
      }
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
        defaultValue={['AI Agent', 'Layout', 'Elements']}
      >
        <AccordionItem
          value="AI Agent"
          className="px-6 py-0 border-y-[1px]"
        >
          <AccordionTrigger className="!no-underline">
            <div className="flex items-center gap-2">
              ✨ AI Component Generator
            </div>
          </AccordionTrigger>
          <AccordionContent className="py-4">
            <AIComponentGenerator subaccountId={subaccountId} />
          </AccordionContent>
        </AccordionItem>
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

        <AccordionItem
          value="Analytics"
          className="px-6 py-0 border-y-[1px]"
        >
          <AccordionTrigger className="!no-underline">📊 Analytics & Data</AccordionTrigger>
          <AccordionContent className="flex flex-wrap gap-2 ">
            {elementCategories.analytics.map((element) => (
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
          value="Interactive"
          className="px-6 py-0 border-y-[1px]"
        >
          <AccordionTrigger className="!no-underline">🎯 Interactive & Animation</AccordionTrigger>
          <AccordionContent className="flex flex-wrap gap-2 ">
            {elementCategories.interactive.map((element) => (
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
          value="ContentManagement"
          className="px-6 py-0 border-y-[1px]"
        >
          <AccordionTrigger className="!no-underline">📝 Content Management</AccordionTrigger>
          <AccordionContent className="flex flex-wrap gap-2 ">
            {elementCategories.contentManagement.map((element) => (
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
          value="Social"
          className="px-6 py-0 border-y-[1px]"
        >
          <AccordionTrigger className="!no-underline">🗣️ Social & Communication</AccordionTrigger>
          <AccordionContent className="flex flex-wrap gap-2 ">
            {elementCategories.social.map((element) => (
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
          value="AdvancedUI"
          className="px-6 py-0 border-y-[1px]"
        >
          <AccordionTrigger className="!no-underline">🚀 Advanced UI</AccordionTrigger>
          <AccordionContent className="flex flex-wrap gap-2 ">
            {elementCategories.advancedUI.map((element) => (
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