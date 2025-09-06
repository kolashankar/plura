
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Code, Download, Eye, Smartphone, Monitor, Globe } from 'lucide-react'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useEditor } from '@/providers/editor/editor-provider'

interface CodeGeneratorProps {
  elements: any[]
  styles: any
  funnelPageId: string
  subaccountId: string
}

const CodeGenerator: React.FC<CodeGeneratorProps> = ({ 
  elements, 
  styles, 
  funnelPageId, 
  subaccountId 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [platform, setPlatform] = useState<'web' | 'mobile'>('web')
  const [isMobileResponsive, setIsMobileResponsive] = useState(true)
  const [deploymentUrl, setDeploymentUrl] = useState<string>('')
  const { state } = useEditor()

  const generateCode = async () => {
    setLoading(true)
    try {
      const hasStripe = elements.some(el => el.type === 'stripe' || el.type === 'payment')
      const hasAuth = elements.some(el => el.type === 'login' || el.type === 'signup')
      const hasDatabase = elements.some(el => el.type === 'form' || el.type === 'contactForm')
      const hasCharts = elements.some(el => el.type === 'chart')
      
      const codeStructure = platform === 'web' 
        ? generateWebCode(elements, styles, hasStripe, hasAuth, hasDatabase, hasCharts, isMobileResponsive)
        : generateMobileCode(elements, styles, hasStripe, hasAuth, hasDatabase)

      setGeneratedCode(codeStructure)
      
      // Auto-deploy if enabled
      await deployProject(codeStructure)
      
    } catch (error) {
      console.error('Code generation failed:', error)
      toast.error('Failed to generate code')
    } finally {
      setLoading(false)
    }
  }

  const deployProject = async (codeStructure: any) => {
    try {
      const response = await fetch('/api/deploy/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codeStructure,
          platform,
          funnelPageId,
          subaccountId,
          isMobileResponsive
        })
      })
      
      const result = await response.json()
      if (result.deploymentUrl) {
        setDeploymentUrl(result.deploymentUrl)
        toast.success('Project deployed successfully!')
      }
    } catch (error) {
      console.error('Deployment failed:', error)
      toast.error('Deployment failed')
    }
  }

  const downloadCode = async () => {
    if (!generatedCode) return
    
    try {
      // Check premium subscription before allowing download
      const response = await fetch('/api/check-premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subaccountId })
      })
      
      const { isPremium } = await response.json()
      
      if (!isPremium) {
        toast.error('Premium subscription required for code download. Please upgrade your plan to access this feature.')
        return
      }
      
      // Create and download the zip file
      const blob = new Blob([JSON.stringify(generatedCode, null, 2)], { 
        type: 'application/json' 
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${platform}-project-${funnelPageId}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success('Project downloaded successfully!')
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('Failed to download project. Please try again.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <Code className="w-4 h-4" />
          Generate Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Code Generator & Deployment
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Platform Selection */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-2">
              <Label>Platform Type</Label>
              <Select value={platform} onValueChange={(value: 'web' | 'mobile') => setPlatform(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      Web Application
                    </div>
                  </SelectItem>
                  <SelectItem value="mobile">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      Mobile App (React Native)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {platform === 'web' && (
              <div className="flex items-center gap-2">
                <Switch 
                  checked={isMobileResponsive} 
                  onCheckedChange={setIsMobileResponsive}
                  id="mobile-responsive"
                />
                <Label htmlFor="mobile-responsive">Mobile Responsive</Label>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <div className="flex gap-2">
            <Button 
              onClick={generateCode} 
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Generating...' : `Generate ${platform === 'web' ? 'React' : 'React Native'} Code`}
            </Button>
            
            {deploymentUrl && (
              <Button 
                variant="outline"
                onClick={() => window.open(deploymentUrl, '_blank')}
                className="flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                View Live
              </Button>
            )}
          </div>

          {/* Generated Code Display */}
          {generatedCode && (
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="structure">File Structure</TabsTrigger>
                <TabsTrigger value="code">Source Code</TabsTrigger>
                <TabsTrigger value="deploy">Deploy & Share</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Project Preview</h3>
                  <div className="space-y-2">
                    <Badge variant="secondary">
                      {platform === 'web' ? 'React + Next.js' : 'React Native + Expo'}
                    </Badge>
                    {platform === 'web' && isMobileResponsive && (
                      <Badge variant="outline">Mobile Responsive</Badge>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Generated {Object.keys(generatedCode.files).length} files
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="structure" className="space-y-4">
                <ScrollArea className="h-96 w-full border rounded-lg p-4">
                  <div className="space-y-2">
                    {Object.keys(generatedCode.files).map((filePath) => (
                      <div key={filePath} className="text-sm font-mono">
                        📄 {filePath}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="code" className="space-y-4">
                <ScrollArea className="h-96 w-full border rounded-lg">
                  <pre className="p-4 text-xs">
                    <code>{JSON.stringify(generatedCode, null, 2)}</code>
                  </pre>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="deploy" className="space-y-4">
                <div className="grid gap-4">
                  {deploymentUrl && (
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Live Deployment</h3>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 p-2 bg-muted rounded text-sm">
                          {deploymentUrl}
                        </code>
                        <Button
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(deploymentUrl)}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={downloadCode}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Project
                    </Button>
                    
                    {platform === 'mobile' && (
                      <Button 
                        variant="outline"
                        onClick={() => window.open(`${deploymentUrl}/expo`, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <Smartphone className="w-4 h-4" />
                        Open in Expo
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Web code generation functions
function generateWebCode(elements: any[], styles: any, hasStripe: boolean, hasAuth: boolean, hasDatabase: boolean, hasCharts: boolean, isMobileResponsive: boolean) {
  const files: Record<string, string> = {}
  
  // Package.json
  files['package.json'] = generatePackageJson(hasStripe, hasAuth, hasDatabase, hasCharts, false)
  
  // Next.js config
  files['next.config.js'] = generateNextConfig()
  
  // Tailwind config with responsive utilities
  files['tailwind.config.js'] = generateTailwindConfig(isMobileResponsive)
  
  // Main App component
  files['src/app/page.tsx'] = generateMainApp(elements, styles, isMobileResponsive)
  
  // Layout
  files['src/app/layout.tsx'] = generateLayout(hasAuth)
  
  // Global styles
  files['src/globals.css'] = generateGlobalStyles(isMobileResponsive)
  
  // Component files
  elements.forEach((element, index) => {
    const componentCode = generateComponentCode(element, isMobileResponsive)
    files[`src/components/${element.type}-${index}.tsx`] = componentCode
  })
  
  // API routes
  if (hasStripe) {
    files['src/app/api/stripe/route.ts'] = generateStripeAPI()
  }
  
  if (hasAuth) {
    files['src/app/api/auth/route.ts'] = generateAuthAPI()
  }
  
  if (hasDatabase) {
    files['src/app/api/database/route.ts'] = generateDatabaseAPI()
    files['prisma/schema.prisma'] = generatePrismaSchema()
  }
  
  // Environment template
  files['.env.example'] = generateEnvTemplate(hasStripe, hasAuth, hasDatabase)
  
  return {
    platform: 'web',
    framework: 'Next.js',
    responsive: isMobileResponsive,
    files
  }
}

// Mobile code generation functions
function generateMobileCode(elements: any[], styles: any, hasStripe: boolean, hasAuth: boolean, hasDatabase: boolean) {
  const files: Record<string, string> = {}
  
  // Package.json for React Native
  files['package.json'] = generateReactNativePackageJson(hasStripe, hasAuth, hasDatabase)
  
  // Expo config
  files['app.json'] = generateExpoConfig()
  
  // Main App component
  files['App.tsx'] = generateMobileApp(elements, styles)
  
  // Navigation setup
  files['src/navigation/AppNavigator.tsx'] = generateAppNavigator()
  
  // Screen components
  files['src/screens/HomeScreen.tsx'] = generateHomeScreen(elements)
  
  // Mobile-specific components
  elements.forEach((element, index) => {
    const componentCode = generateMobileComponentCode(element)
    files[`src/components/${element.type}-${index}.tsx`] = componentCode
  })
  
  // Styles
  files['src/styles/global.ts'] = generateMobileStyles()
  
  // Services
  if (hasStripe) {
    files['src/services/stripe.ts'] = generateMobileStripeService()
  }
  
  if (hasAuth) {
    files['src/services/auth.ts'] = generateMobileAuthService()
  }
  
  if (hasDatabase) {
    files['src/services/api.ts'] = generateMobileAPIService()
  }
  
  return {
    platform: 'mobile',
    framework: 'React Native + Expo',
    files
  }
}

function generatePackageJson(hasStripe: boolean, hasAuth: boolean, hasDatabase: boolean, hasCharts: boolean, isMobile: boolean) {
  const dependencies: Record<string, string> = {
    "next": "14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "clsx": "^2.0.0",
    "class-variance-authority": "^0.7.0"
  }

  if (hasStripe) {
    Object.assign(dependencies, {
      "@stripe/stripe-js": "^2.1.0",
      "@stripe/react-stripe-js": "^2.1.0",
      "stripe": "^14.0.0"
    })
  }

  if (hasAuth) {
    Object.assign(dependencies, {
      "next-auth": "^4.24.0",
      "jsonwebtoken": "^9.0.0",
      "bcryptjs": "^2.4.0"
    })
  }

  if (hasDatabase) {
    Object.assign(dependencies, {
      "prisma": "^5.0.0",
      "@prisma/client": "^5.0.0",
      "pg": "^8.11.0"
    })
  }

  if (hasCharts) {
    Object.assign(dependencies, {
      "recharts": "^2.8.0",
      "chart.js": "^4.4.0",
      "react-chartjs-2": "^5.2.0"
    })
  }

  return JSON.stringify({
    name: "generated-website",
    version: "1.0.0",
    private: true,
    scripts: {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "next lint",
      ...(hasDatabase && { 
        "db:generate": "bunx prisma generate", 
        "db:push": "bunx prisma db push" 
      })
    },
    dependencies
  }, null, 2)
}

function generateReactNativePackageJson(hasStripe: boolean, hasAuth: boolean, hasDatabase: boolean) {
  const dependencies: Record<string, string> = {
    "expo": "~49.0.0",
    "react": "18.2.0",
    "react-native": "0.72.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/stack": "^6.3.0",
    "react-native-screens": "~3.22.0",
    "react-native-safe-area-context": "4.6.3",
    "react-native-gesture-handler": "~2.12.0",
    "@expo/vector-icons": "^13.0.0"
  }

  if (hasStripe) {
    Object.assign(dependencies, {
      "@stripe/stripe-react-native": "^0.35.0"
    })
  }

  if (hasAuth) {
    Object.assign(dependencies, {
      "expo-auth-session": "~5.0.0",
      "expo-crypto": "~12.4.0"
    })
  }

  if (hasDatabase) {
    Object.assign(dependencies, {
      "axios": "^1.5.0"
    })
  }

  return JSON.stringify({
    name: "generated-mobile-app",
    version: "1.0.0",
    main: "node_modules/expo/AppEntry.js",
    scripts: {
      "start": "expo start",
      "android": "expo start --android",
      "ios": "expo start --ios",
      "web": "expo start --web"
    },
    dependencies,
    devDependencies: {
      "@babel/core": "^7.20.0",
      "@types/react": "~18.2.14",
      "typescript": "^5.1.3"
    }
  }, null, 2)
}

function generateNextConfig() {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'generated-app.replit.app'],
  },
}

module.exports = nextConfig`
}

function generateTailwindConfig(isMobileResponsive: boolean) {
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      ${isMobileResponsive ? `
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      ` : ''}
    },
  },
  plugins: [],
}`
}

function generateExpoConfig() {
  return JSON.stringify({
    "expo": {
      "name": "Generated Mobile App",
      "slug": "generated-mobile-app",
      "version": "1.0.0",
      "orientation": "portrait",
      "icon": "./assets/icon.png",
      "userInterfaceStyle": "light",
      "splash": {
        "image": "./assets/splash.png",
        "resizeMode": "contain",
        "backgroundColor": "#ffffff"
      },
      "assetBundlePatterns": [
        "**/*"
      ],
      "ios": {
        "supportsTablet": true
      },
      "android": {
        "adaptiveIcon": {
          "foregroundImage": "./assets/adaptive-icon.png",
          "backgroundColor": "#FFFFFF"
        }
      },
      "web": {
        "favicon": "./assets/favicon.png"
      }
    }
  }, null, 2)
}

function generateMainApp(elements: any[], styles: any, isMobileResponsive: boolean) {
  const imports = elements.map((el, index) => 
    `import ${el.type.charAt(0).toUpperCase() + el.type.slice(1)}Component${index} from '@/components/${el.type}-${index}'`
  ).join('\n')

  const components = elements.map((el, index) => 
    `<${el.type.charAt(0).toUpperCase() + el.type.slice(1)}Component${index} />`
  ).join('\n      ')

  return `import React from 'react'
${imports}

export default function HomePage() {
  return (
    <div className="${isMobileResponsive ? 'container mx-auto px-4 sm:px-6 lg:px-8' : 'container mx-auto px-8'}">
      <main className="${isMobileResponsive ? 'py-8 space-y-8' : 'py-16 space-y-16'}">
        ${components}
      </main>
    </div>
  )
}`
}

function generateMobileApp(elements: any[], styles: any) {
  return `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}`
}

function generateLayout(hasAuth: boolean) {
  return `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
${hasAuth ? "import { AuthProvider } from '@/providers/auth-provider'" : ''}

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Generated Website',
  description: 'Generated by Website Builder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        ${hasAuth ? '<AuthProvider>' : ''}
          {children}
        ${hasAuth ? '</AuthProvider>' : ''}
      </body>
    </html>
  )
}`
}

function generateComponentCode(element: any, isMobileResponsive: boolean) {
  const baseClasses = isMobileResponsive ? 'w-full' : ''
  
  switch (element.type) {
    case 'stripe':
      return generateStripeComponent(isMobileResponsive)
    case 'chart':
      return generateChartComponent(isMobileResponsive)
    case 'form':
      return generateFormComponent(isMobileResponsive)
    default:
      return generateGenericComponent(element, isMobileResponsive)
  }
}

function generateStripeComponent(isMobileResponsive: boolean) {
  return `'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    // Payment processing logic here
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="${isMobileResponsive ? 'max-w-md mx-auto' : 'max-w-lg'} p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Payment</h2>
      <div className="mb-4">
        <CardElement className="p-4 border rounded" />
      </div>
      <button 
        type="submit" 
        disabled={!stripe || loading}
        className="${isMobileResponsive ? 'w-full' : ''} bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  )
}

export default function StripeComponent() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
}`
}

function generateChartComponent(isMobileResponsive: boolean) {
  return `'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
]

export default function ChartComponent() {
  return (
    <div className="${isMobileResponsive ? 'w-full h-64 sm:h-80' : 'w-full h-96'} p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Analytics</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}`
}

function generateFormComponent(isMobileResponsive: boolean) {
  return `'use client'

import { useState } from 'react'

export default function FormComponent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission logic
    console.log('Form submitted:', formData)
  }

  return (
    <form onSubmit={handleSubmit} className="${isMobileResponsive ? 'max-w-md mx-auto' : 'max-w-lg'} p-6 border rounded-lg space-y-4">
      <h2 className="text-2xl font-bold">Contact Us</h2>
      
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Message</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 h-24"
          required
        />
      </div>
      
      <button 
        type="submit"
        className="${isMobileResponsive ? 'w-full' : ''} bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Send Message
      </button>
    </form>
  )
}`
}

function generateGenericComponent(element: any, isMobileResponsive: boolean) {
  return `export default function ${element.type.charAt(0).toUpperCase() + element.type.slice(1)}Component() {
  return (
    <div className="${isMobileResponsive ? 'w-full p-4' : 'p-6'} border rounded-lg">
      <h2 className="text-xl font-bold">${element.name || element.type}</h2>
      <p className="text-gray-600 mt-2">Generated ${element.type} component</p>
    </div>
  )
}`
}

function generateGlobalStyles(isMobileResponsive: boolean) {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

${isMobileResponsive ? `
@layer base {
  html {
    font-size: 16px;
  }
  
  @media (max-width: 640px) {
    html {
      font-size: 14px;
    }
  }
}

@layer utilities {
  .container {
    @apply max-w-7xl mx-auto;
  }
  
  .responsive-grid {
    @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4;
  }
}
` : ''}`
}

function generateStripeAPI() {
  return `import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'usd' } = await req.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    )
  }
}`
}

function generateAuthAPI() {
  return `import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { email, password, action } = await req.json()

    if (action === 'login') {
      // Login logic
      const token = jwt.sign(
        { email },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      )
      
      return NextResponse.json({ token })
    } else if (action === 'register') {
      // Registration logic
      const hashedPassword = await bcrypt.hash(password, 10)
      
      // Save user to database
      return NextResponse.json({ message: 'User created successfully' })
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}`
}

function generateDatabaseAPI() {
  return `import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const data = await prisma.user.findMany()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Database query failed' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = await prisma.user.create({
      data: body
    })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'Database insert failed' },
      { status: 500 }
    )
  }
}`
}

function generatePrismaSchema() {
  return `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Contact {
  id        String   @id @default(cuid())
  name      String
  email     String
  message   String
  createdAt DateTime @default(now())
}`
}

function generateEnvTemplate(hasStripe: boolean, hasAuth: boolean, hasDatabase: boolean) {
  let env = `# Environment Variables Template
NEXT_PUBLIC_APP_URL=http://localhost:3000
`

  if (hasStripe) {
    env += `
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
`
  }

  if (hasAuth) {
    env += `
# Authentication
JWT_SECRET=your-jwt-secret-here
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000
`
  }

  if (hasDatabase) {
    env += `
# Database
DATABASE_URL="mysql://root:tscltaTPTtzNOZOeUtZyxXklRIznkwOV@metro.proxy.rlwy.net:17390/railway"
`
  }

  return env
}

function generateMobileComponentCode(element: any) {
  return `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ${element.type.charAt(0).toUpperCase() + element.type.slice(1)}Component() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>${element.name || element.type}</Text>
      <Text style={styles.description}>Mobile ${element.type} component</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});`
}

function generateHomeScreen(elements: any[]) {
  const imports = elements.map((el, index) => 
    `import ${el.type.charAt(0).toUpperCase() + el.type.slice(1)}Component${index} from '../components/${el.type}-${index}'`
  ).join('\n')

  const components = elements.map((el, index) => 
    `<${el.type.charAt(0).toUpperCase() + el.type.slice(1)}Component${index} />`
  ).join('\n      ')

  return `import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
${imports}

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Generated Mobile App</Text>
        ${components}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});`
}

function generateAppNavigator() {
  return `import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Generated App' }}
      />
    </Stack.Navigator>
  );
}`
}

function generateMobileStyles() {
  return `import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});`
}

function generateMobileStripeService() {
  return `import { StripeProvider } from '@stripe/stripe-react-native';

export const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_key_here';

export function initializeStripe() {
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      {/* Your app components */}
    </StripeProvider>
  );
}`
}

function generateMobileAuthService() {
  return `import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthService = {
  async login(email: string, password: string) {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, action: 'login' })
      });
      
      const data = await response.json();
      if (data.token) {
        await AsyncStorage.setItem('token', data.token);
      }
      return data;
    } catch (error) {
      throw new Error('Login failed');
    }
  },

  async logout() {
    await AsyncStorage.removeItem('token');
  },

  async getToken() {
    return await AsyncStorage.getItem('token');
  }
};`
}

function generateMobileAPIService() {
  return `import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://your-api-url.com';

export const ApiService = {
  async request(endpoint: string, options: any = {}) {
    const token = await AsyncStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: \`Bearer \${token}\` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(\`\${API_BASE_URL}\${endpoint}\`, config);
    return response.json();
  },

  async get(endpoint: string) {
    return this.request(endpoint);
  },

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};`
}

export default CodeGenerator
