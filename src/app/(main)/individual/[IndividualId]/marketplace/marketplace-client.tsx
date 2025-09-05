'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, Download, Eye, ShoppingCart, Search, Filter, Package } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from '@/components/ui/use-toast'

interface Theme {
  id: string
  name: string
  description: string
  price: number
  rating: number
  downloads: number
  image: string
  category: string
  featured: boolean
}

interface Plugin {
  id: string
  name: string
  description: string
  price: number
  rating: number
  downloads: number
  category: string
  featured: boolean
}

interface MarketplaceClientProps {
  subaccountId: string
  isPremium: boolean
  themes: Theme[]
  plugins: Plugin[]
}

const MarketplaceClient = ({ subaccountId, isPremium, themes, plugins }: MarketplaceClientProps) => {
  const handleImportToFunnel = async (themeId: string, themeName: string) => {
    try {
      // Simulate import process - in real implementation, this would call an API
      toast({
        title: 'Importing Theme',
        description: `Starting import of "${themeName}" to your funnels...`,
      })
      
      // Here you would make an API call to import the theme
      // await importThemeToFunnel(subaccountId, themeId)
      
      setTimeout(() => {
        toast({
          title: 'Import Successful',
          description: `"${themeName}" has been imported to your funnels. You can now use it to create new pages.`,
        })
      }, 2000)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Import Failed',
        description: 'There was an error importing the theme. Please try again.',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="outline" className="mb-4">Marketplace</Badge>
          <h1 className="text-5xl font-bold text-white mb-6">
            Themes & Plugins
            <span className="text-purple-400"> Marketplace</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover premium themes and powerful plugins to enhance your websites and boost functionality.
            {isPremium && (
              <span className="block mt-2 text-purple-300 font-medium">
                ✨ Premium member: Import themes directly to your funnels!
              </span>
            )}
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search themes and plugins..." 
                className="pl-10 bg-black/20 border-purple-500/20 text-white"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Marketplace Tabs */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="themes" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-black/20 mb-8">
              <TabsTrigger value="themes">Themes</TabsTrigger>
              <TabsTrigger value="plugins">Plugins</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
            </TabsList>

            <TabsContent value="themes">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {themes.map((theme) => (
                  <Card key={theme.id} className="bg-black/20 border-purple-500/20 hover:border-purple-400/40 transition-all group">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={theme.image}
                        alt={theme.name}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                      />
                      {theme.featured && (
                        <Badge className="absolute top-2 left-2 bg-purple-600">Featured</Badge>
                      )}
                      {isPremium && (
                        <Badge className="absolute top-2 right-2 bg-green-600">Premium Access</Badge>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/subaccount/${subaccountId}/marketplace/themes/${theme.id}/preview`}>
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </Link>
                        </Button>
                        {isPremium ? (
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleImportToFunnel(theme.id, theme.name)}
                          >
                            <Package className="w-4 h-4 mr-1" />
                            Import
                          </Button>
                        ) : (
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700" asChild>
                            <Link href={`/subaccount/${subaccountId}/marketplace/themes/${theme.id}/purchase`}>
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              Buy
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-white">{theme.name}</CardTitle>
                        <div className="text-purple-400 font-bold">${theme.price}</div>
                      </div>
                      <CardDescription className="text-gray-300">
                        {theme.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{theme.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          <span>{theme.downloads}</span>
                        </div>
                      </div>
                      {!isPremium && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" asChild>
                            <Link href={`/subaccount/${subaccountId}/marketplace/themes/${theme.id}/preview`}>
                              <Eye className="w-4 h-4 mr-1" />
                              Preview
                            </Link>
                          </Button>
                          <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700" asChild>
                            <Link href={`/subaccount/${subaccountId}/marketplace/themes/${theme.id}/purchase`}>
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              Buy
                            </Link>
                          </Button>
                        </div>
                      )}
                      {isPremium && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" asChild>
                            <Link href={`/subaccount/${subaccountId}/marketplace/themes/${theme.id}/preview`}>
                              <Eye className="w-4 h-4 mr-1" />
                              Preview
                            </Link>
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handleImportToFunnel(theme.id, theme.name)}
                          >
                            <Package className="w-4 h-4 mr-1" />
                            Import to Funnel
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="plugins">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plugins.map((plugin) => (
                  <Card key={plugin.id} className="bg-black/20 border-purple-500/20 hover:border-purple-400/40 transition-all">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-white">{plugin.name}</CardTitle>
                        <div className="text-purple-400 font-bold">${plugin.price}</div>
                      </div>
                      {plugin.featured && (
                        <Badge className="w-fit bg-purple-600">Featured</Badge>
                      )}
                      <CardDescription className="text-gray-300">
                        {plugin.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{plugin.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          <span>{plugin.downloads}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Buy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="featured">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...themes.filter(t => t.featured), ...plugins.filter(p => p.featured)].map((item) => (
                  <Card key={item.id} className="bg-black/20 border-purple-500/20 hover:border-purple-400/40 transition-all">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-white">{item.name}</CardTitle>
                        <div className="text-purple-400 font-bold">${item.price}</div>
                      </div>
                      <Badge className="w-fit bg-purple-600">Featured</Badge>
                      <CardDescription className="text-gray-300">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{item.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          <span>{item.downloads}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        {'category' in item && isPremium ? (
                          <Button 
                            size="sm" 
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handleImportToFunnel(item.id, item.name)}
                          >
                            <Package className="w-4 h-4 mr-1" />
                            Import
                          </Button>
                        ) : (
                          <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Buy
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Sell Your Own Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Sell Your Creations</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join our marketplace and earn money by selling your themes and plugins to thousands of users.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href={`/subaccount/${subaccountId}/marketplace/sell`}>Start Selling</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/site/documentation">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MarketplaceClient