
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import Image from 'next/image'

const MarketplacePage = () => {
  const themes = [
    {
      id: 1,
      name: "Modern Business",
      price: 49,
      rating: 4.8,
      downloads: 1234,
      category: "Business",
      image: "/assets/preview.png",
      description: "Professional business theme with modern design"
    },
    {
      id: 2,
      name: "E-commerce Pro",
      price: 79,
      rating: 4.9,
      downloads: 856,
      category: "E-commerce",
      image: "/assets/preview.png",
      description: "Complete e-commerce solution with shopping cart"
    },
    {
      id: 3,
      name: "Portfolio Creative",
      price: 39,
      rating: 4.7,
      downloads: 2156,
      category: "Portfolio",
      image: "/assets/preview.png",
      description: "Stunning portfolio theme for creatives"
    }
  ]

  const plugins = [
    {
      id: 1,
      name: "Advanced Forms",
      price: 29,
      rating: 4.6,
      downloads: 3421,
      category: "Forms",
      description: "Create complex forms with conditional logic"
    },
    {
      id: 2,
      name: "SEO Optimizer",
      price: 49,
      rating: 4.8,
      downloads: 1876,
      category: "SEO",
      description: "Boost your search engine rankings"
    },
    {
      id: 3,
      name: "Analytics Pro",
      price: 39,
      rating: 4.7,
      downloads: 967,
      category: "Analytics",
      description: "Advanced analytics and reporting tools"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
            <p className="text-muted-foreground">Discover themes, plugins, and components for your websites</p>
          </div>
          <Link href="/marketplace/sell">
            <Button>Sell Your Products</Button>
          </Link>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search themes, plugins, and components..."
            className="max-w-md"
          />
        </div>

        <Tabs defaultValue="themes" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="themes">Themes</TabsTrigger>
            <TabsTrigger value="plugins">Plugins</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
          </TabsList>

          <TabsContent value="themes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {themes.map((theme) => (
                <Card key={theme.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <Image
                      src={theme.image}
                      alt={theme.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary">{theme.category}</Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{theme.name}</CardTitle>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${theme.price}</div>
                        <div className="text-sm text-muted-foreground">
                          ⭐ {theme.rating} ({theme.downloads})
                        </div>
                      </div>
                    </div>
                    <CardDescription>{theme.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Link href={`/marketplace/themes/${theme.id}/preview`} className="flex-1">
                        <Button variant="outline" className="w-full">Preview</Button>
                      </Link>
                      <Link href={`/marketplace/themes/${theme.id}/purchase`} className="flex-1">
                        <Button className="w-full">Purchase</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="plugins" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plugins.map((plugin) => (
                <Card key={plugin.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{plugin.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">{plugin.category}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${plugin.price}</div>
                        <div className="text-sm text-muted-foreground">
                          ⭐ {plugin.rating} ({plugin.downloads})
                        </div>
                      </div>
                    </div>
                    <CardDescription>{plugin.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Link href={`/marketplace/plugins/${plugin.id}/preview`} className="flex-1">
                        <Button variant="outline" className="w-full">Preview</Button>
                      </Link>
                      <Link href={`/marketplace/plugins/${plugin.id}/purchase`} className="flex-1">
                        <Button className="w-full">Purchase</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="components" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold mb-4">Components Coming Soon</h3>
              <p className="text-muted-foreground mb-6">
                We're working on a comprehensive component library
              </p>
              <Button variant="outline">Get Notified</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default MarketplacePage
