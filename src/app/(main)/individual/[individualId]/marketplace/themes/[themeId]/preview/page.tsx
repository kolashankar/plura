'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Eye, 
  Download, 
  Star, 
  Heart, 
  Share2, 
  Monitor, 
  Tablet, 
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Play,
  ExternalLink
} from 'lucide-react'

type Props = {
  params: { themeId: string }
}

const ThemePreviewPage = ({ params }: Props) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  // Mock data - replace with actual API call
  const theme = {
    id: params.themeId,
    name: "Modern Business Pro",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.8,
    reviews: 324,
    downloads: 1234,
    category: "Business",
    seller: "ThemeStudio",
    sellerRating: 4.9,
    description: "Professional business theme with modern design and responsive layout. Perfect for corporate websites, agencies, and professional services. Includes multiple page layouts, contact forms, and advanced customization options.",
    features: [
      "Fully Responsive Design",
      "12+ Page Templates",
      "Advanced Contact Forms",
      "SEO Optimized",
      "Fast Loading Performance",
      "Cross-browser Compatible",
      "One-Click Import",
      "Lifetime Updates",
      "Premium Support",
      "Gutenberg Compatible"
    ],
    techSpecs: [
      "Built with React & Next.js",
      "Tailwind CSS Styling",
      "TypeScript Support",
      "Mobile-First Approach",
      "PWA Ready"
    ],
    demoUrl: "https://demo-modern-business.plura.dev",
    screenshots: [
      "/assets/preview.png",
      "/assets/preview.png", 
      "/assets/preview.png",
      "/assets/preview.png"
    ],
    tags: ["business", "corporate", "modern", "responsive", "professional"],
    lastUpdated: "2024-01-15",
    version: "2.1.0",
    compatibility: "WordPress 6.0+",
    fileSize: "15.2 MB"
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % theme.screenshots.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + theme.screenshots.length) % theme.screenshots.length)
  }

  const getFrameClass = () => {
    switch (viewMode) {
      case 'tablet': return 'max-w-3xl mx-auto'
      case 'mobile': return 'max-w-sm mx-auto'
      default: return 'w-full'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/marketplace">
            <Button variant="outline">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Marketplace
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Preview Area */}
          <div className="lg:col-span-2">
            {/* Theme Preview Tabs */}
            <Tabs defaultValue="live" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="live">Live Preview</TabsTrigger>
                <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
              </TabsList>

              <TabsContent value="live" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant={viewMode === 'desktop' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('desktop')}
                        >
                          <Monitor className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'tablet' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('tablet')}
                        >
                          <Tablet className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'mobile' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('mobile')}
                        >
                          <Smartphone className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={theme.demoUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Open Full Demo
                        </a>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`transition-all duration-300 ${getFrameClass()}`}>
                      <div className="aspect-video relative rounded-lg overflow-hidden border bg-white">
                        <iframe
                          src={theme.demoUrl}
                          className="w-full h-full"
                          title="Theme Live Preview"
                          loading="lazy"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <Play className="w-3 h-3 mr-1" />
                            Live Demo
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="screenshots" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="relative">
                      <div className="aspect-video relative rounded-lg overflow-hidden border">
                        <Image
                          src={theme.screenshots[currentImageIndex]}
                          alt={`${theme.name} Screenshot ${currentImageIndex + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {theme.screenshots.length > 1 && (
                        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between p-4">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={prevImage}
                            className="bg-white/80 hover:bg-white"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={nextImage}
                            className="bg-white/80 hover:bg-white"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {theme.screenshots.length > 1 && (
                      <div className="flex justify-center gap-2 mt-4">
                        {theme.screenshots.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                              index === currentImageIndex 
                                ? 'bg-primary' 
                                : 'bg-muted-foreground/30'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="mt-6">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {theme.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Technical Specifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {theme.techSpecs.map((spec, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-secondary rounded-full"></div>
                            <span className="text-sm">{spec}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{theme.name}</CardTitle>
                    <CardDescription>by {theme.seller}</CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">${theme.price}</span>
                  <span className="text-lg text-muted-foreground line-through">${theme.originalPrice}</span>
                  <Badge variant="destructive">25% OFF</Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{theme.rating}</span>
                    <span>({theme.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    <span>{theme.downloads} downloads</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link href={`/marketplace/themes/${theme.id}/purchase`}>
                    <Button className="w-full" size="lg">
                      Purchase Theme
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full" asChild>
                    <a href={theme.demoUrl} target="_blank" rel="noopener noreferrer">
                      <Eye className="w-4 h-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">What's Included:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Complete theme files</li>
                    <li>• Installation guide</li>
                    <li>• 12 months of updates</li>
                    <li>• Premium support</li>
                    <li>• Commercial license</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Theme Details */}
            <Card>
              <CardHeader>
                <CardTitle>Theme Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Category:</span>
                  <Badge variant="outline">{theme.category}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Version:</span>
                  <span>{theme.version}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Last Updated:</span>
                  <span>{theme.lastUpdated}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>File Size:</span>
                  <span>{theme.fileSize}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Compatibility:</span>
                  <span>{theme.compatibility}</span>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {theme.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* License Information */}
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
                  <p>• Resale not permitted</p>
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