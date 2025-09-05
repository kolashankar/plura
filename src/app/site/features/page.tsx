
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { 
  Zap, 
  Globe, 
  Users, 
  CreditCard, 
  Bot, 
  Palette,
  BarChart3,
  Shield,
  Smartphone,
  Database,
  Workflow,
  Store
} from 'lucide-react'

const FeaturesPage = () => {
  const featureCategories = {
    builder: [
      {
        icon: <Globe className="w-6 h-6" />,
        title: "Drag & Drop Website Builder",
        description: "Professional website creation with no coding required"
      },
      {
        icon: <Palette className="w-6 h-6" />,
        title: "Premium Templates",
        description: "100+ industry-specific templates and themes"
      },
      {
        icon: <Smartphone className="w-6 h-6" />,
        title: "Mobile-First Design",
        description: "Responsive designs that look perfect on all devices"
      }
    ],
    automation: [
      {
        icon: <Workflow className="w-6 h-6" />,
        title: "Visual Workflow Designer",
        description: "Create complex automations with drag-and-drop interface"
      },
      {
        icon: <Zap className="w-6 h-6" />,
        title: "500+ Integrations",
        description: "Connect with popular apps and services seamlessly"
      },
      {
        icon: <Bot className="w-6 h-6" />,
        title: "AI-Powered Automation",
        description: "Intelligent automation with machine learning capabilities"
      }
    ],
    business: [
      {
        icon: <Users className="w-6 h-6" />,
        title: "Multi-tenant Architecture",
        description: "Manage multiple agencies and sub-accounts efficiently"
      },
      {
        icon: <CreditCard className="w-6 h-6" />,
        title: "Built-in Billing",
        description: "Stripe integration for subscriptions and payments"
      },
      {
        icon: <BarChart3 className="w-6 h-6" />,
        title: "Advanced Analytics",
        description: "Comprehensive reporting and performance insights"
      }
    ],
    marketplace: [
      {
        icon: <Store className="w-6 h-6" />,
        title: "Theme Marketplace",
        description: "Buy and sell premium themes and templates"
      },
      {
        icon: <Database className="w-6 h-6" />,
        title: "Plugin Ecosystem",
        description: "Extend functionality with third-party plugins"
      },
      {
        icon: <Shield className="w-6 h-6" />,
        title: "White-label Solutions",
        description: "Rebrand and customize for your agency"
      }
    ]
  }

  const automationFeatures = [
    "Webhook Triggers",
    "Time-based Scheduling", 
    "Email Automation",
    "Social Media Management",
    "Database Operations",
    "API Integrations",
    "Custom Code Execution",
    "Conditional Logic",
    "Error Handling & Retries",
    "Real-time Monitoring"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="outline" className="mb-4">Platform Features</Badge>
          <h1 className="text-5xl font-bold text-white mb-6">
            Everything You Need to 
            <span className="text-purple-400"> Scale Your Agency</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            From website building to advanced automation, Plura provides all the tools agencies need to grow and succeed.
          </p>
        </div>
      </section>

      {/* Feature Tabs */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="builder" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-black/20">
              <TabsTrigger value="builder">Website Builder</TabsTrigger>
              <TabsTrigger value="automation">Automation</TabsTrigger>
              <TabsTrigger value="business">Business Tools</TabsTrigger>
              <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            </TabsList>

            {Object.entries(featureCategories).map(([key, features]) => (
              <TabsContent key={key} value={key} className="mt-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {features.map((feature, index) => (
                    <Card key={index} className="bg-black/20 border-purple-500/20 hover:border-purple-400/40 transition-all">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-600/20 rounded-lg text-purple-400">
                            {feature.icon}
                          </div>
                          <CardTitle className="text-white">{feature.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-gray-300">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Automation Deep Dive */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Advanced Automation Engine</h2>
            <p className="text-xl text-gray-300">Build complex workflows that save time and increase efficiency</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Automation Capabilities</h3>
              <div className="grid grid-cols-2 gap-3">
                {automationFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Popular Automation Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-purple-600/10 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Lead Generation Workflow</h4>
                  <p className="text-gray-300 text-sm">Automatically capture leads, send welcome emails, and create CRM records</p>
                </div>
                <div className="p-4 bg-purple-600/10 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Social Media Scheduler</h4>
                  <p className="text-gray-300 text-sm">Schedule and post content across multiple social platforms</p>
                </div>
                <div className="p-4 bg-purple-600/10 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">E-commerce Automation</h4>
                  <p className="text-gray-300 text-sm">Process orders, update inventory, and send shipping notifications</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Explore All Features?</h2>
          <p className="text-xl text-gray-300 mb-8">Start your free trial and experience the full power of Plura</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/agency/sign-up">Start Free Trial</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/site/documentation">View Documentation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FeaturesPage
