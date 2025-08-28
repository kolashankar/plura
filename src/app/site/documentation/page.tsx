
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const DocumentationPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Documentation</h1>
            <p className="text-xl text-muted-foreground">
              Complete guides and API references to help you get the most out of Plura
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Getting Started
                  <Badge variant="default">Essential</Badge>
                </CardTitle>
                <CardDescription>
                  Learn the basics of Plura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Create your first website</li>
                  <li>• Understanding the interface</li>
                  <li>• Basic customization</li>
                  <li>• Publishing your site</li>
                </ul>
                <Button asChild className="w-full mt-4">
                  <Link href="#getting-started">View Guide</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Website Builder</CardTitle>
                <CardDescription>
                  Master the drag & drop editor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Using components</li>
                  <li>• Styling and themes</li>
                  <li>• Responsive design</li>
                  <li>• Advanced layouts</li>
                </ul>
                <Button variant="outline" className="w-full mt-4">
                  <Link href="#builder">View Guide</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agency Management</CardTitle>
                <CardDescription>
                  Manage clients and projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Setting up agencies</li>
                  <li>• Managing subaccounts</li>
                  <li>• Team collaboration</li>
                  <li>• Billing and payments</li>
                </ul>
                <Button variant="outline" className="w-full mt-4">
                  <Link href="#agency">View Guide</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Reference</CardTitle>
                <CardDescription>
                  Integrate with Plura's API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Authentication</li>
                  <li>• Endpoints reference</li>
                  <li>• Webhooks</li>
                  <li>• Rate limits</li>
                </ul>
                <Button variant="outline" className="w-full mt-4">
                  <Link href="#api">View Docs</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Marketplace</CardTitle>
                <CardDescription>
                  Themes and plugins guide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Installing themes</li>
                  <li>• Using plugins</li>
                  <li>• Creating components</li>
                  <li>• Selling in marketplace</li>
                </ul>
                <Button variant="outline" className="w-full mt-4">
                  <Link href="#marketplace">View Guide</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Troubleshooting</CardTitle>
                <CardDescription>
                  Common issues and solutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Common errors</li>
                  <li>• Performance tips</li>
                  <li>• Browser compatibility</li>
                  <li>• Contact support</li>
                </ul>
                <Button variant="outline" className="w-full mt-4">
                  <Link href="#troubleshooting">View Guide</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Popular Guides</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• How to connect a custom domain</li>
                  <li>• Setting up e-commerce</li>
                  <li>• Creating contact forms</li>
                  <li>• SEO best practices</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Video Tutorials</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Website builder walkthrough</li>
                  <li>• Agency setup tutorial</li>
                  <li>• Advanced customization</li>
                  <li>• Marketplace overview</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentationPage
