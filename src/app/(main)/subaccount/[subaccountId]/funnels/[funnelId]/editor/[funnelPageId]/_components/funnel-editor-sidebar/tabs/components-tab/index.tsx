import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { EditorBtns } from '@/lib/constants'
import React from 'react'
import TextPlaceholder from './text-placeholder'
import ContainerPlaceholder from './container-placeholder'
import VideoPlaceholder from './video-placeholder'
import TwoColumnsPlaceholder from './two-columns-placeholder'
import LinkPlaceholder from './link-placeholder'
import ContactFormComponentPlaceholder from './contact-form-placeholder'
import CheckoutPlaceholder from './checkout-placeholder'
import CodeGenerator from './code-generator' // Assuming CodeGenerator is in the same directory

type Props = {}

const ComponentsTab = (props: Props) => {
  const elementCategories = {
    basic: [
      {
        id: 'text',
        name: 'Text',
        type: 'text',
        content: [],
        styles: {},
      },
      {
        id: 'heading',
        name: 'Heading',
        type: 'heading',
        content: [{ innerText: 'Heading' }],
        styles: { fontSize: '2rem', fontWeight: 'bold' },
      },
      {
        id: 'paragraph',
        name: 'Paragraph',
        type: 'paragraph',
        content: [{ innerText: 'Lorem ipsum dolor sit amet...' }],
        styles: { lineHeight: '1.6' },
      },
      {
        id: 'button',
        name: 'Button',
        type: 'button',
        content: [{ innerText: 'Click Me' }],
        styles: { padding: '12px 24px', backgroundColor: '#007adf', color: 'white', borderRadius: '6px' },
      },
      {
        id: 'image',
        name: 'Image',
        type: 'image',
        content: [{ src: '/placeholder.jpg', alt: 'Image' }],
        styles: { maxWidth: '100%', height: 'auto' },
      },
      {
        id: 'video',
        name: 'Video',
        type: 'video',
        content: [],
        styles: {},
      },
      {
        id: 'link',
        name: 'Link',
        type: 'link',
        content: [{ href: '#', innerText: 'Click Me' }],
        styles: { color: 'black', backgroundColor: 'transparent' },
      },
      {
        id: 'divider',
        name: 'Divider',
        type: 'divider',
        content: [],
        styles: { height: '1px', backgroundColor: '#e5e5e5', margin: '20px 0' },
      },
      {
        id: 'spacer',
        name: 'Spacer',
        type: 'spacer',
        content: [],
        styles: { height: '40px' },
      },
      {
        id: 'icon',
        name: 'Icon',
        type: 'icon',
        content: [{ iconName: 'star', size: 24 }],
        styles: { color: '#007adf' },
      },
    ],
    layout: [
      {
        id: 'container',
        name: 'Container',
        type: 'container',
        content: [],
        styles: {},
      },
      {
        id: '2Col',
        name: '2 Columns',
        type: '2Col',
        content: [],
        styles: {},
      },
      {
        id: '3Col',
        name: '3 Columns',
        type: '3Col',
        content: [],
        styles: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' },
      },
      {
        id: '4Col',
        name: '4 Columns',
        type: '4Col',
        content: [],
        styles: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' },
      },
      {
        id: 'section',
        name: 'Section',
        type: 'section',
        content: [],
        styles: { padding: '60px 0' },
      },
      {
        id: 'hero',
        name: 'Hero Section',
        type: 'hero',
        content: [],
        styles: { minHeight: '80vh', display: 'flex', alignItems: 'center' },
      },
      {
        id: 'grid',
        name: 'Grid Layout',
        type: 'grid',
        content: [],
        styles: { display: 'grid', gap: '20px' },
      },
      {
        id: 'flexbox',
        name: 'Flex Container',
        type: 'flexbox',
        content: [],
        styles: { display: 'flex', gap: '20px' },
      },
      {
        id: 'sidebar',
        name: 'Sidebar Layout',
        type: 'sidebar',
        content: [],
        styles: { display: 'grid', gridTemplateColumns: '250px 1fr', gap: '20px' },
      },
      {
        id: 'card',
        name: 'Card',
        type: 'card',
        content: [],
        styles: { padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
      },
    ],
    forms: [
      {
        id: 'contactForm',
        name: 'Contact Form',
        type: 'contactForm',
        content: [],
        styles: {},
      },
      {
        id: 'input',
        name: 'Input Field',
        type: 'input',
        content: [{ placeholder: 'Enter text...', type: 'text' }],
        styles: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' },
      },
      {
        id: 'textarea',
        name: 'Textarea',
        type: 'textarea',
        content: [{ placeholder: 'Enter your message...', rows: 4 }],
        styles: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' },
      },
      {
        id: 'select',
        name: 'Select Dropdown',
        type: 'select',
        content: [{ options: ['Option 1', 'Option 2', 'Option 3'] }],
        styles: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' },
      },
      {
        id: 'checkbox',
        name: 'Checkbox',
        type: 'checkbox',
        content: [{ label: 'I agree to terms', checked: false }],
        styles: {},
      },
      {
        id: 'radio',
        name: 'Radio Button',
        type: 'radio',
        content: [{ name: 'choice', options: ['Option A', 'Option B'] }],
        styles: {},
      },
      {
        id: 'fileUpload',
        name: 'File Upload',
        type: 'fileUpload',
        content: [{ accept: 'image/*', multiple: false }],
        styles: { width: '100%', padding: '12px', border: '2px dashed #ddd', borderRadius: '4px' },
      },
      {
        id: 'slider',
        name: 'Range Slider',
        type: 'slider',
        content: [{ min: 0, max: 100, value: 50 }],
        styles: { width: '100%' },
      },
      {
        id: 'toggle',
        name: 'Toggle Switch',
        type: 'toggle',
        content: [{ checked: false, label: 'Enable feature' }],
        styles: {},
      },
      {
        id: 'datePicker',
        name: 'Date Picker',
        type: 'datePicker',
        content: [{ type: 'date' }],
        styles: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' },
      },
    ],
    ecommerce: [
      {
        id: 'paymentForm',
        name: 'Payment Form',
        type: 'paymentForm',
        content: [],
        styles: {},
      },
      {
        id: 'productCard',
        name: 'Product Card',
        type: 'productCard',
        content: [{ title: 'Product Name', price: '$99', image: '/product.jpg' }],
        styles: { border: '1px solid #ddd', borderRadius: '8px', padding: '16px' },
      },
      {
        id: 'cart',
        name: 'Shopping Cart',
        type: 'cart',
        content: [],
        styles: {},
      },
      {
        id: 'checkout',
        name: 'Checkout Form',
        type: 'checkout',
        content: [],
        styles: {},
      },
      {
        id: 'pricingTable',
        name: 'Pricing Table',
        type: 'pricingTable',
        content: [{ plans: [{ name: 'Basic', price: '$9/mo' }, { name: 'Pro', price: '$19/mo' }] }],
        styles: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
      },
      {
        id: 'productGallery',
        name: 'Product Gallery',
        type: 'productGallery',
        content: [],
        styles: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
      },
      {
        id: 'wishlist',
        name: 'Wishlist',
        type: 'wishlist',
        content: [],
        styles: {},
      },
      {
        id: 'reviews',
        name: 'Product Reviews',
        type: 'reviews',
        content: [],
        styles: {},
      },
      {
        id: 'compare',
        name: 'Product Compare',
        type: 'compare',
        content: [],
        styles: {},
      },
      {
        id: 'inventory',
        name: 'Inventory Display',
        type: 'inventory',
        content: [{ stock: 10, message: 'Only 10 left in stock!' }],
        styles: { color: '#d63384', fontWeight: 'bold' },
      },
    ],
    navigation: [
      {
        id: 'navbar',
        name: 'Navigation Bar',
        type: 'navbar',
        content: [{ logo: 'Logo', links: ['Home', 'About', 'Services', 'Contact'] }],
        styles: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' },
      },
      {
        id: 'breadcrumbs',
        name: 'Breadcrumbs',
        type: 'breadcrumbs',
        content: [{ path: ['Home', 'Products', 'Current Page'] }],
        styles: { fontSize: '14px', color: '#666' },
      },
      {
        id: 'sidebar',
        name: 'Side Navigation',
        type: 'sideNav',
        content: [{ links: ['Dashboard', 'Profile', 'Settings', 'Help'] }],
        styles: { width: '250px', backgroundColor: '#f8f9fa', padding: '20px' },
      },
      {
        id: 'tabs',
        name: 'Tab Navigation',
        type: 'tabs',
        content: [{ tabs: ['Tab 1', 'Tab 2', 'Tab 3'] }],
        styles: { borderBottom: '1px solid #ddd' },
      },
      {
        id: 'pagination',
        name: 'Pagination',
        type: 'pagination',
        content: [{ currentPage: 1, totalPages: 10 }],
        styles: { display: 'flex', gap: '8px', justifyContent: 'center' },
      },
      {
        id: 'menu',
        name: 'Dropdown Menu',
        type: 'menu',
        content: [{ items: ['Option 1', 'Option 2', 'Option 3'] }],
        styles: { position: 'relative' },
      },
      {
        id: 'footer',
        name: 'Footer',
        type: 'footer',
        content: [{ copyright: '© 2024 Company Name', links: ['Privacy', 'Terms', 'Support'] }],
        styles: { backgroundColor: '#333', color: 'white', padding: '40px 0' },
      },
      {
        id: 'socialLinks',
        name: 'Social Media Links',
        type: 'socialLinks',
        content: [{ platforms: ['facebook', 'twitter', 'instagram', 'linkedin'] }],
        styles: { display: 'flex', gap: '16px' },
      },
      {
        id: 'backToTop',
        name: 'Back to Top',
        type: 'backToTop',
        content: [],
        styles: { position: 'fixed', bottom: '20px', right: '20px' },
      },
      {
        id: 'searchBar',
        name: 'Search Bar',
        type: 'searchBar',
        content: [{ placeholder: 'Search...' }],
        styles: { display: 'flex', alignItems: 'center', gap: '8px' },
      },
    ],
    content: [
      {
        id: 'testimonial',
        name: 'Testimonial',
        type: 'testimonial',
        content: [{ quote: 'Amazing service!', author: 'John Doe', role: 'CEO' }],
        styles: { fontStyle: 'italic', padding: '20px', backgroundColor: '#f8f9fa' },
      },
      {
        id: 'faq',
        name: 'FAQ Section',
        type: 'faq',
        content: [{ questions: [{ q: 'Question?', a: 'Answer here.' }] }],
        styles: {},
      },
      {
        id: 'timeline',
        name: 'Timeline',
        type: 'timeline',
        content: [{ events: [{ date: '2024', title: 'Event', description: 'Description' }] }],
        styles: {},
      },
      {
        id: 'stats',
        name: 'Statistics',
        type: 'stats',
        content: [{ stats: [{ value: '1000+', label: 'Customers' }] }],
        styles: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' },
      },
      {
        id: 'team',
        name: 'Team Section',
        type: 'team',
        content: [{ members: [{ name: 'John Doe', role: 'Developer', image: '/team1.jpg' }] }],
        styles: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },
      },
      {
        id: 'blog',
        name: 'Blog Posts',
        type: 'blog',
        content: [{ posts: [{ title: 'Post Title', excerpt: 'Post excerpt...', date: '2024-01-01' }] }],
        styles: {},
      },
      {
        id: 'gallery',
        name: 'Image Gallery',
        type: 'gallery',
        content: [{ images: ['/img1.jpg', '/img2.jpg', '/img3.jpg'] }],
        styles: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' },
      },
      {
        id: 'counter',
        name: 'Animated Counter',
        type: 'counter',
        content: [{ target: 1000, suffix: '+', label: 'Happy Customers' }],
        styles: { textAlign: 'center', fontSize: '2rem', fontWeight: 'bold' },
      },
      {
        id: 'newsletter',
        name: 'Newsletter Signup',
        type: 'newsletter',
        content: [{ title: 'Subscribe to our newsletter', placeholder: 'Enter your email' }],
        styles: { backgroundColor: '#f8f9fa', padding: '40px', textAlign: 'center' },
      },
      {
        id: 'cta',
        name: 'Call to Action',
        type: 'cta',
        content: [{ title: 'Ready to get started?', buttonText: 'Get Started' }],
        styles: { textAlign: 'center', padding: '60px', backgroundColor: '#007adf', color: 'white' },
      },
    ],
    advanced: [
      {
        id: 'modal',
        name: 'Modal/Popup',
        type: 'modal',
        content: [],
        styles: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
      },
      {
        id: 'tooltip',
        name: 'Tooltip',
        type: 'tooltip',
        content: [{ text: 'Hover me', tooltip: 'This is a tooltip' }],
        styles: { position: 'relative' },
      },
      {
        id: 'accordion',
        name: 'Accordion',
        type: 'accordion',
        content: [{ items: [{ title: 'Section 1', content: 'Content here' }] }],
        styles: {},
      },
      {
        id: 'carousel',
        name: 'Image Carousel',
        type: 'carousel',
        content: [{ images: ['/slide1.jpg', '/slide2.jpg', '/slide3.jpg'] }],
        styles: { position: 'relative', overflow: 'hidden' },
      },
      {
        id: 'progressBar',
        name: 'Progress Bar',
        type: 'progressBar',
        content: [{ progress: 75, label: 'Progress' }],
        styles: { width: '100%', height: '8px', backgroundColor: '#e5e5e5', borderRadius: '4px' },
      },
      {
        id: 'loadingSpinner',
        name: 'Loading Spinner',
        type: 'loadingSpinner',
        content: [],
        styles: { width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #007adf', borderRadius: '50%' },
      },
      {
        id: 'notification',
        name: 'Notification',
        type: 'notification',
        content: [{ message: 'This is a notification', type: 'info' }],
        styles: { padding: '16px', borderRadius: '4px', backgroundColor: '#d1ecf1', color: '#0c5460' },
      },
      {
        id: 'map',
        name: 'Map Embed',
        type: 'map',
        content: [{ location: 'New York, NY', zoom: 12 }],
        styles: { width: '100%', height: '400px' },
      },
      {
        id: 'chatWidget',
        name: 'Chat Widget',
        type: 'chatWidget',
        content: [],
        styles: { position: 'fixed', bottom: '20px', right: '20px', width: '300px', height: '400px' },
      },
      {
        id: 'codeBlock',
        name: 'Code Block',
        type: 'codeBlock',
        content: [{ code: 'console.log("Hello World");', language: 'javascript' }],
        styles: { backgroundColor: '#f8f8f8', padding: '16px', borderRadius: '4px', fontFamily: 'monospace' },
      },
    ]
  }

  return (
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
            >
              {element.Component}
              <span className="text-muted-foreground">{element.name}</span>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>

      <div className="p-4 border-t">
        <CodeGenerator />
      </div>
    </Accordion>
  )
}

export default ComponentsTab