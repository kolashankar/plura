
export interface AITemplate {
  id: string
  name: string
  description: string
  category: string
  prompt: string
  structure: any
  components: string[]
  features: string[]
  dependencies: string[]
}

export const AI_TEMPLATES: AITemplate[] = [
  {
    id: 'ecommerce-store',
    name: 'E-commerce Store (Amazon/Flipkart Style)',
    description: 'Full-featured e-commerce platform with product catalog, cart, checkout, and admin dashboard',
    category: 'ecommerce',
    prompt: `Create a comprehensive e-commerce website similar to Amazon/Flipkart with the following features:
    - Product catalog with search and filters
    - Shopping cart and checkout process
    - User authentication and profiles
    - Order management system
    - Admin dashboard for inventory management
    - Payment integration with Stripe
    - Responsive design for all devices`,
    structure: {
      pages: [
        'home', 'products', 'product-detail', 'cart', 'checkout', 
        'user-profile', 'orders', 'admin-dashboard', 'login', 'register'
      ],
      sections: ['header', 'hero', 'featured-products', 'categories', 'footer'],
      apis: ['products', 'cart', 'orders', 'users', 'payments']
    },
    components: [
      'navbar', 'product-card', 'search-bar', 'filter-sidebar', 
      'shopping-cart', 'checkout-form', 'payment-gateway', 'admin-table'
    ],
    features: [
      'Product Search', 'Shopping Cart', 'User Authentication', 
      'Payment Processing', 'Order Management', 'Admin Dashboard',
      'Responsive Design', 'SEO Optimization'
    ],
    dependencies: [
      '@stripe/stripe-js', '@prisma/client', 'next-auth',
      'react-hook-form', 'lucide-react', 'recharts'
    ]
  },
  
  {
    id: 'chatgpt-clone',
    name: 'AI Chat Platform (ChatGPT Style)',
    description: 'AI-powered chat platform with conversation history and multiple AI models',
    category: 'ai',
    prompt: `Create an AI chat platform similar to ChatGPT with:
    - Clean chat interface with message bubbles
    - Real-time typing indicators
    - Conversation history and management
    - Multiple AI model selection
    - User authentication and profiles
    - Code syntax highlighting
    - Export chat functionality
    - Responsive design`,
    structure: {
      pages: ['chat', 'history', 'settings', 'login'],
      sections: ['sidebar', 'chat-area', 'input-section'],
      apis: ['chat', 'conversations', 'users', 'ai-models']
    },
    components: [
      'chat-bubble', 'typing-indicator', 'code-block', 
      'conversation-list', 'model-selector', 'export-button'
    ],
    features: [
      'AI Chat', 'Conversation History', 'Code Highlighting',
      'Model Selection', 'Export Chats', 'Real-time Typing'
    ],
    dependencies: [
      '@google/generative-ai', 'openai', 'react-markdown',
      'prism-react-renderer', 'react-syntax-highlighter'
    ]
  },

  {
    id: 'social-media-dashboard',
    name: 'Social Media Management Platform',
    description: 'Comprehensive social media management tool for scheduling and analytics',
    category: 'social',
    prompt: `Create a social media management platform with:
    - Multi-platform posting (Facebook, Instagram, Twitter, LinkedIn)
    - Content scheduling and calendar view
    - Analytics dashboard with charts
    - Team collaboration features
    - Media library for assets
    - Hashtag suggestions
    - Post templates and AI content generation`,
    structure: {
      pages: [
        'dashboard', 'scheduler', 'analytics', 'content-library',
        'team', 'settings', 'accounts'
      ],
      sections: ['sidebar', 'main-content', 'calendar', 'charts'],
      apis: ['social-posts', 'analytics', 'media', 'team', 'ai-content']
    },
    components: [
      'post-composer', 'calendar-view', 'analytics-charts',
      'media-gallery', 'team-member-card', 'hashtag-generator'
    ],
    features: [
      'Multi-platform Posting', 'Content Scheduling', 'Analytics',
      'Team Collaboration', 'Media Management', 'AI Content Generation'
    ],
    dependencies: [
      'react-big-calendar', 'recharts', 'react-dropzone',
      'date-fns', 'react-beautiful-dnd'
    ]
  },

  {
    id: 'video-editing-platform',
    name: 'Video Editing Platform',
    description: 'Web-based video editing tool with timeline and effects',
    category: 'media',
    prompt: `Create a video editing platform with:
    - Timeline-based video editor
    - Drag and drop video/audio clips
    - Text overlays and animations
    - Filters and effects library
    - Export in multiple formats
    - Cloud storage integration
    - Real-time collaboration`,
    structure: {
      pages: ['editor', 'projects', 'library', 'export', 'templates'],
      sections: ['timeline', 'preview', 'tools', 'effects-panel'],
      apis: ['video-processing', 'projects', 'media', 'export']
    },
    components: [
      'video-timeline', 'preview-player', 'effects-panel',
      'media-library', 'text-overlay-tool', 'export-modal'
    ],
    features: [
      'Timeline Editor', 'Video Effects', 'Text Overlays',
      'Multi-format Export', 'Cloud Storage', 'Collaboration'
    ],
    dependencies: [
      'fabric', 'wavesurfer.js', 'ffmpeg.js',
      'react-player', 'react-draggable'
    ]
  },

  {
    id: 'automation-workflow',
    name: 'Automation & Workflow Platform',
    description: 'Visual workflow builder for automating business processes',
    category: 'automation',
    prompt: `Create an automation platform with:
    - Visual workflow builder with drag-and-drop nodes
    - Pre-built integrations (Zapier-style)
    - Conditional logic and branching
    - Scheduled and event-triggered workflows
    - Real-time execution monitoring
    - Custom API integrations
    - Team collaboration and sharing`,
    structure: {
      pages: ['workflows', 'builder', 'integrations', 'monitoring', 'templates'],
      sections: ['node-palette', 'canvas', 'properties-panel', 'execution-log'],
      apis: ['workflows', 'integrations', 'executions', 'templates']
    },
    components: [
      'workflow-node', 'connection-line', 'properties-form',
      'execution-monitor', 'integration-card', 'template-gallery'
    ],
    features: [
      'Visual Workflow Builder', 'API Integrations', 'Conditional Logic',
      'Execution Monitoring', 'Templates', 'Team Sharing'
    ],
    dependencies: [
      'reactflow', 'react-hook-form', 'axios',
      'cron-parser', 'socket.io-client'
    ]
  },

  {
    id: 'saas-landing',
    name: 'SaaS Landing Page',
    description: 'High-converting SaaS landing page with pricing and features',
    category: 'landing',
    prompt: `Create a SaaS landing page with:
    - Hero section with value proposition
    - Features showcase with icons and descriptions
    - Pricing table with comparison
    - Customer testimonials and social proof
    - FAQ section
    - CTA buttons throughout
    - Newsletter signup
    - Mobile-responsive design`,
    structure: {
      pages: ['home', 'pricing', 'features', 'about', 'contact'],
      sections: ['hero', 'features', 'pricing', 'testimonials', 'faq', 'cta'],
      apis: ['newsletter', 'contact', 'pricing']
    },
    components: [
      'hero-section', 'feature-card', 'pricing-table',
      'testimonial-card', 'faq-item', 'cta-button', 'newsletter-form'
    ],
    features: [
      'Hero Section', 'Features Showcase', 'Pricing Table',
      'Testimonials', 'FAQ', 'Newsletter', 'Mobile Responsive'
    ],
    dependencies: [
      'framer-motion', 'react-intersection-observer',
      'react-hook-form', 'lucide-react'
    ]
  },

  {
    id: 'blog-cms',
    name: 'Blog & CMS Platform',
    description: 'Full-featured blog platform with content management system',
    category: 'blog',
    prompt: `Create a blog platform with CMS features:
    - Rich text editor for posts
    - Category and tag management
    - Comment system with moderation
    - SEO optimization tools
    - Media library
    - Author profiles and multi-user support
    - Analytics dashboard
    - Newsletter integration`,
    structure: {
      pages: ['blog', 'post', 'admin', 'author', 'category', 'search'],
      sections: ['editor', 'sidebar', 'comments', 'related-posts'],
      apis: ['posts', 'comments', 'media', 'users', 'analytics']
    },
    components: [
      'rich-editor', 'post-card', 'comment-system',
      'category-filter', 'author-card', 'seo-form'
    ],
    features: [
      'Rich Text Editor', 'Comment System', 'SEO Tools',
      'Media Library', 'Multi-author', 'Analytics'
    ],
    dependencies: [
      '@tiptap/react', '@tiptap/starter-kit',
      'react-seo-meta-tags', 'date-fns'
    ]
  },

  {
    id: 'dashboard-analytics',
    name: 'Analytics Dashboard',
    description: 'Comprehensive analytics dashboard with charts and KPIs',
    category: 'analytics',
    prompt: `Create an analytics dashboard with:
    - Multiple chart types (line, bar, pie, area)
    - Real-time data updates
    - Customizable widgets
    - Date range filtering
    - Export functionality
    - Team collaboration
    - Mobile responsive layout`,
    structure: {
      pages: ['dashboard', 'reports', 'settings', 'team'],
      sections: ['sidebar', 'widget-grid', 'filters', 'export-panel'],
      apis: ['analytics', 'widgets', 'reports', 'exports']
    },
    components: [
      'chart-widget', 'kpi-card', 'date-picker',
      'export-button', 'widget-configurator', 'filter-panel'
    ],
    features: [
      'Interactive Charts', 'Real-time Updates', 'Custom Widgets',
      'Data Export', 'Team Sharing', 'Mobile Responsive'
    ],
    dependencies: [
      'recharts', 'react-grid-layout', 'date-fns',
      'file-saver', 'socket.io-client'
    ]
  }
]

export function getTemplateByCategory(category: string): AITemplate[] {
  return AI_TEMPLATES.filter(template => template.category === category)
}

export function getTemplateById(id: string): AITemplate | undefined {
  return AI_TEMPLATES.find(template => template.id === id)
}

export function getAllCategories(): string[] {
  return Array.from(new Set(AI_TEMPLATES.map(template => template.category)))
}
