# Website Builder - SaaS Platform

## Overview

An advanced website builder platform offering AI-powered website generation, visual drag-and-drop editing, and multi-platform code export capabilities. The platform supports creating diverse website types including e-commerce stores, AI chat platforms, dashboards, and social media management tools. Built with Next.js and designed for both agencies and individual developers, it features a comprehensive marketplace for themes and plugins, automation workflows, and enterprise-grade hosting solutions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 14 with TypeScript and React Server Components
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Context API with custom providers for editor and modal states
- **UI Components**: Comprehensive design system using Radix UI primitives with custom theming

### Backend Architecture
- **Database**: Drizzle ORM with PostgreSQL (Neon serverless) for primary data storage
- **Authentication**: Clerk for user management with custom admin authentication
- **File Storage**: UploadThing for media and asset management
- **API Structure**: RESTful endpoints with Next.js API routes for backend functionality

### Code Generation System
- **Multi-Platform Export**: React/Next.js, React Native, and Python Flask code generation
- **AI Integration**: Google Gemini and OpenAI APIs for intelligent component generation
- **Template Engine**: Pre-built templates for common website types (e-commerce, SaaS, blogs)
- **Code Generators**: Integration with TeleportHQ, Plasmic, and Builder.io for advanced code export

### Editor and Builder
- **Visual Editor**: Custom drag-and-drop editor with real-time preview
- **Component System**: 100+ pre-built components with AI-generated custom components
- **Page Management**: Multi-page funnel system with custom routing and subdomain support
- **Live Mode**: Real-time editing with instant preview capabilities

### Automation and Workflows
- **n8n Integration**: External workflow automation for social media, email, and CRM
- **Social Media Scheduler**: Automated posting across Facebook, Instagram, Twitter, LinkedIn
- **Lead Nurturing**: Email automation sequences and contact management
- **Analytics Integration**: Built-in analytics with custom dashboard components

### Marketplace Architecture
- **Theme Store**: Buy/sell marketplace for website themes and templates
- **Plugin System**: Extensible plugin architecture for custom functionality
- **Revenue Sharing**: Stripe-based payment processing with seller dashboards
- **Content Management**: Theme preview, rating, and download systems

### Multi-Tenant System
- **Agency Management**: Hierarchical structure supporting agencies with multiple sub-accounts
- **Individual Users**: Separate user type for personal projects with limited features
- **Permission System**: Role-based access control with granular permissions
- **Billing Integration**: Plan-based feature restrictions and usage tracking

## External Dependencies

### Core Services
- **Database**: Neon PostgreSQL for primary data storage
- **Authentication**: Clerk for user authentication and session management
- **File Storage**: UploadThing for media uploads and asset management
- **Payment Processing**: Stripe for subscription billing and marketplace transactions

### AI and Automation
- **AI Services**: Google Gemini and OpenAI APIs for content and component generation
- **Workflow Automation**: n8n for external automation workflows
- **Social Media APIs**: Facebook, Instagram, Twitter, LinkedIn for content publishing

### Development and Deployment
- **Hosting**: Vercel for application deployment and hosting
- **Code Generation**: TeleportHQ, Plasmic, and Builder.io integrations
- **Mobile Development**: React Native with Expo for mobile app generation
- **Analytics**: Custom analytics system with optional third-party integrations

### UI and Visualization
- **Charts and Data**: Tremor React for dashboard components and data visualization
- **Icons**: Lucide React for iconography
- **Form Handling**: React Hook Form with Zod validation
- **Drag and Drop**: React Beautiful DND for editor functionality