
# Advanced Website Builder - SaaS Platform

A comprehensive website builder platform that can generate AI-powered websites, mobile apps, e-commerce stores, dashboards, and more.

## 🚀 Features

### Core Platform Features
- **AI-Powered Website Generation** - Generate complete websites like ChatGPT, Amazon, social media platforms
- **Visual Drag & Drop Builder** - Advanced Kanban-style editor with 100+ components
- **Mobile App Generation** - React Native code generation with Expo integration
- **Code Export & Hosting** - Generate production-ready code with custom domains
- **Marketplace** - Buy/sell themes, plugins, and templates
- **Multi-tenant Architecture** - Agency and sub-account management

### Supported Website Types
- 🛒 **E-commerce Stores** (Amazon/Flipkart style)
- 🤖 **AI Chat Platforms** (ChatGPT style)
- 📊 **Analytics Dashboards**
- 📱 **Social Media Management Tools**
- 🎬 **Video Editing Platforms**
- ⚡ **Automation & Workflow Tools**
- 📝 **Blog & CMS Platforms**
- 🎯 **SaaS Landing Pages**

### Technical Features
- **Database Integration** - PostgreSQL, MySQL, MongoDB support
- **Payment Processing** - Stripe integration with marketplace
- **Authentication** - Clerk-based user management
- **File Storage** - UploadThing integration
- **AI Integration** - Google Gemini & OpenAI APIs
- **Social Media APIs** - Facebook, Instagram, Twitter, LinkedIn
- **Mobile Development** - React Native with Expo
- **Custom Domains** - Enterprise hosting features

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- MySQL database
- Clerk account for authentication
- Stripe account for payments
- Google Gemini API key for AI features

### 1. Clone and Install Dependencies

```bash
git clone <your-repo>
cd website-builder
npm install
```

### 2. Database Setup

Create a MySQL database:

```bash
# Run the database setup script
npm run db:setup

# Push Prisma schema
npm run db:push

# (Optional) Open Prisma Studio
npm run db:studio
```

### 3. Environment Variables

Copy the `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

**Required Environment Variables:**

```env
# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database
DATABASE_URL="mysql://username:password@localhost:3306/website_builder"
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI Services
GOOGLE_GEMINI_API_KEY=your_gemini_api_key

# File Upload
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=your_app_id

# Application
NEXT_PUBLIC_URL=https://your-domain.replit.app
NEXT_PUBLIC_DOMAIN=your-domain.replit.app
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── (main)/                 # Main application routes
│   │   ├── agency/            # Agency management
│   │   ├── subaccount/        # Sub-account features
│   │   ├── marketplace/       # Theme/plugin marketplace
│   │   └── funnels/          # Website builder editor
│   ├── api/                   # API routes
│   │   ├── ai/               # AI generation endpoints
│   │   ├── deploy/           # Deployment services
│   │   ├── database/         # Database connections
│   │   └── integrations/     # Third-party integrations
│   └── site/                 # Landing page
├── components/
│   ├── global/               # Shared components
│   ├── forms/                # Form components
│   ├── ui/                   # UI library components
│   └── sidebar/              # Navigation components
├── lib/
│   ├── ai-templates.ts       # AI website templates
│   ├── constants.ts          # Application constants
│   ├── db.ts                 # Database connection
│   └── queries.ts            # Database queries
└── providers/                # React context providers
```

## 🎯 Usage Guide

### 1. Creating Websites with AI

1. Navigate to the funnel editor
2. Use `Ctrl+B` to open AI assistant
3. Describe your website (e.g., "Create an e-commerce store like Amazon")
4. The AI will generate components and pages automatically

### 2. Using Pre-built Templates

- **E-commerce Store**: Complete online store with cart, checkout, admin panel
- **AI Chat Platform**: ChatGPT-style interface with conversation history
- **Social Media Dashboard**: Multi-platform posting and analytics
- **Video Editor**: Timeline-based editing with effects
- **Blog Platform**: Full CMS with rich text editor

### 3. Mobile App Generation

1. Set platform to "mobile" in the editor
2. Design your app interface
3. Click the `</>` button to view React Native code
4. Use Expo to test on your mobile device
5. Export code for Play Store/App Store submission

### 4. Code Export & Deployment

- **Starter Plan**: Live preview only
- **Basic Plan**: View generated code
- **Enterprise Plan**: Download complete project as ZIP
- **Custom Domains**: Available for premium users

### 5. Marketplace

- Browse themes and plugins
- Purchase and install components
- Sell your own creations
- Earn revenue from marketplace sales

## 🔧 Advanced Features

### Database Integration

Connect external databases:
- PostgreSQL
- MongoDB
- Custom APIs
- Sample data for testing

### Third-party Integrations

Supported integrations:
- **Social Media**: Facebook, Instagram, Twitter, LinkedIn
- **E-commerce**: Shopify, WooCommerce
- **Analytics**: Google Analytics, Facebook Pixel
- **Communication**: Twilio, SendGrid, Slack
- **Storage**: AWS S3, Cloudinary

### AI-Powered Features

- **Smart Component Generation**: AI suggests components based on content
- **Code Optimization**: Automatic code improvements
- **SEO Optimization**: AI-generated meta tags and content
- **Responsive Design**: Automatic mobile optimization

## 📱 Mobile Development

The platform generates React Native code for mobile apps:

```javascript
// Generated React Native component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Mobile App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' }
});
```

### Expo Integration

1. Generated apps include Expo configuration
2. Scan QR code to test on mobile
3. Build for app stores with `expo build`

## 🚀 Deployment

### Replit Deployment

The platform is optimized for Replit hosting:

1. Connect your Replit account
2. Deploy with one click
3. Get instant live URLs
4. Custom domain support for premium users

### Self-hosting

For enterprise customers:

```bash
npm run build
npm start
```

## 🔐 Security & Authentication

- **Clerk Authentication**: Secure user management
- **Role-based Access**: Agency owner, admin, user roles
- **API Security**: JWT tokens and webhook validation
- **Data Encryption**: All sensitive data encrypted
- **GDPR Compliant**: Privacy controls and data export

## 💰 Monetization

### Pricing Tiers

1. **Starter** (Free): Basic builder with 3 sub-accounts
2. **Basic** ($49/month): Unlimited sub-accounts and team members
3. **Unlimited** ($199/month): Full features with rebilling
4. **Enterprise** (Custom): Code export and custom domains

### Marketplace Revenue

- Creators earn 70% from theme/plugin sales
- Platform takes 30% commission
- Monthly payouts via Stripe

## 🛟 Support

- **Discord Community**: Get help from other developers
- **Documentation**: Comprehensive guides and tutorials
- **Video Tutorials**: Step-by-step YouTube videos
- **Premium Support**: Priority support for paid plans

## 📈 Roadmap

- [ ] WordPress plugin export
- [ ] Figma integration
- [ ] Team collaboration features  
- [ ] Advanced analytics
- [ ] White-label solutions
- [ ] API marketplace

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Need Help?** Join our [Discord community](https://discord.gg/GG4wJkxh) or check out the [full video tutorial](https://youtu.be/6omuUOZcWL0).
