
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { 
  BookOpen, 
  Code, 
  Rocket, 
  Settings, 
  Users, 
  Zap,
  ExternalLink,
  Download,
  Play,
  FileText,
  Video
} from 'lucide-react'

const DocumentationPage = () => {
  const quickStartGuides = [
    {
      title: "Getting Started",
      description: "Set up your first agency and create your dashboard",
      time: "5 min",
      icon: <Rocket className="w-5 h-5" />
    },
    {
      title: "Building Your First Funnel",
      description: "Create and customize sales funnels with drag-and-drop",
      time: "10 min",
      icon: <Code className="w-5 h-5" />
    },
    {
      title: "Automation Workflows",
      description: "Set up automated processes to save time",
      time: "15 min",
      icon: <Zap className="w-5 h-5" />
    },
    {
      title: "Team Management",
      description: "Invite team members and manage permissions",
      time: "8 min",
      icon: <Users className="w-5 h-5" />
    }
  ]

  const apiEndpoints = [
    {
      method: "GET",
      endpoint: "/api/agencies",
      description: "Get all agencies for authenticated user"
    },
    {
      method: "POST",
      endpoint: "/api/funnels",
      description: "Create a new funnel"
    },
    {
      method: "PUT",
      endpoint: "/api/automations/{id}",
      description: "Update automation settings"
    },
    {
      method: "DELETE",
      endpoint: "/api/subaccounts/{id}",
      description: "Delete a sub-account"
    }
  ]

  const videoTutorials = [
    {
      title: "Platform Overview",
      duration: "12:34",
      description: "Complete walkthrough of Plura's features and capabilities"
    },
    {
      title: "Advanced Funnel Building",
      duration: "18:45",
      description: "Master advanced techniques for high-converting funnels"
    },
    {
      title: "Automation Best Practices",
      duration: "15:20",
      description: "Learn how to create effective automation workflows"
    },
    {
      title: "Agency Management",
      duration: "22:10",
      description: "Complete guide to managing multiple clients and teams"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="outline" className="mb-4">Documentation</Badge>
          <h1 className="text-5xl font-bold text-white mb-6">
            Developer 
            <span className="text-purple-400"> Documentation</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Everything you need to build, customize, and scale with Plura. From quick start guides to advanced API references.
          </p>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Quick Start Guides</h2>
            <p className="text-xl text-gray-300">Get up and running in minutes</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStartGuides.map((guide, index) => (
              <Card key={index} className="bg-black/20 border-purple-500/20 hover:border-purple-400/40 transition-all group cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-purple-600/20 rounded-lg text-purple-400">
                      {guide.icon}
                    </div>
                    <Badge variant="secondary">{guide.time}</Badge>
                  </div>
                  <CardTitle className="text-white">{guide.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    {guide.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Tabs */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="guides" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-black/20">
              <TabsTrigger value="guides">Guides</TabsTrigger>
              <TabsTrigger value="api">API Reference</TabsTrigger>
              <TabsTrigger value="tutorials">Video Tutorials</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>

            <TabsContent value="guides" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-black/20 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      User Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Account Setup</li>
                      <li>• Dashboard Navigation</li>
                      <li>• Basic Operations</li>
                      <li>• Settings Configuration</li>
                    </ul>
                    <Button className="w-full mt-4" variant="outline">
                      Read Guide
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Developer Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Custom Components</li>
                      <li>• Theme Development</li>
                      <li>• Plugin Architecture</li>
                      <li>• Advanced Customization</li>
                    </ul>
                    <Button className="w-full mt-4" variant="outline">
                      Read Guide
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Integration Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Third-party Services</li>
                      <li>• Webhook Configuration</li>
                      <li>• OAuth Setup</li>
                      <li>• Custom Integrations</li>
                    </ul>
                    <Button className="w-full mt-4" variant="outline">
                      Read Guide
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="api" className="mt-8">
              <Card className="bg-black/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">API Reference</CardTitle>
                  <CardDescription className="text-gray-300">
                    Complete API documentation with examples and authentication
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {apiEndpoints.map((endpoint, index) => (
                      <div key={index} className="p-4 bg-purple-600/10 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge 
                            variant={endpoint.method === 'GET' ? 'secondary' : 
                                   endpoint.method === 'POST' ? 'default' : 
                                   endpoint.method === 'PUT' ? 'outline' : 'destructive'}
                          >
                            {endpoint.method}
                          </Badge>
                          <code className="text-purple-300 font-mono text-sm">
                            {endpoint.endpoint}
                          </code>
                        </div>
                        <p className="text-gray-300 text-sm">{endpoint.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex gap-4">
                    <Button variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Full API Docs
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download Postman Collection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tutorials" className="mt-8">
              <div className="grid md:grid-cols-2 gap-6">
                {videoTutorials.map((tutorial, index) => (
                  <Card key={index} className="bg-black/20 border-purple-500/20 hover:border-purple-400/40 transition-all group cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">{tutorial.title}</CardTitle>
                        <Badge variant="secondary">{tutorial.duration}</Badge>
                      </div>
                      <CardDescription className="text-gray-300">
                        {tutorial.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video bg-purple-600/20 rounded-lg flex items-center justify-center group-hover:bg-purple-600/30 transition-colors">
                        <Play className="w-12 h-12 text-purple-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="examples" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-black/20 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">Code Examples</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-300">
                      <li>• React Components</li>
                      <li>• API Integration</li>
                      <li>• Custom Hooks</li>
                      <li>• Utility Functions</li>
                    </ul>
                    <Button className="w-full mt-4" variant="outline">
                      Browse Examples
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">Sample Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-300">
                      <li>• E-commerce Store</li>
                      <li>• Landing Page</li>
                      <li>• SaaS Dashboard</li>
                      <li>• Portfolio Site</li>
                    </ul>
                    <Button className="w-full mt-4" variant="outline">
                      View Projects
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">Templates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Starter Templates</li>
                      <li>• Component Library</li>
                      <li>• Boilerplate Code</li>
                      <li>• Configuration Files</li>
                    </ul>
                    <Button className="w-full mt-4" variant="outline">
                      Download Templates
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Need More Help?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Our support team and community are here to help you succeed
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/support">Contact Support</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/community">Join Community</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DocumentationPage
