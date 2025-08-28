
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'

type Props = {
  params: { themeId: string }
}

const ThemePreviewPage = ({ params }: Props) => {
  const theme = {
    id: params.themeId,
    name: "Modern Business",
    price: 49,
    rating: 4.8,
    downloads: 1234,
    category: "Business",
    description: "Professional business theme with modern design and responsive layout. Perfect for corporate websites, agencies, and professional services.",
    features: [
      "Responsive design",
      "Multiple page layouts",
      "Contact forms",
      "SEO optimized",
      "Fast loading",
      "Cross-browser compatible"
    ],
    demoUrl: "https://demo.example.com",
    screenshots: ["/assets/preview.png", "/assets/preview.png", "/assets/preview.png"]
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/marketplace">
            <Button variant="outline">← Back to Marketplace</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="aspect-video relative mb-6 rounded-lg overflow-hidden border">
              <iframe
                src={theme.demoUrl}
                className="w-full h-full"
                title="Theme Preview"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {theme.screenshots.map((screenshot, index) => (
                <div key={index} className="aspect-video relative rounded border overflow-hidden">
                  <Image
                    src={screenshot}
                    alt={`Screenshot ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Theme Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {theme.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle>{theme.name}</CardTitle>
                  <Badge variant="secondary">{theme.category}</Badge>
                </div>
                <CardDescription>{theme.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold">${theme.price}</span>
                    <div className="text-right">
                      <div className="text-sm">⭐ {theme.rating}</div>
                      <div className="text-sm text-muted-foreground">{theme.downloads} downloads</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link href={`/marketplace/themes/${theme.id}/purchase`}>
                      <Button className="w-full">Purchase Theme</Button>
                    </Link>
                    <Button variant="outline" className="w-full">
                      Live Demo
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">What's Included:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Complete theme files</li>
                      <li>• Documentation</li>
                      <li>• 6 months of updates</li>
                      <li>• Email support</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>License Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>• Use on unlimited projects</p>
                  <p>• Commercial use allowed</p>
                  <p>• Modify and customize freely</p>
                  <p>• No attribution required</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThemePreviewPage
