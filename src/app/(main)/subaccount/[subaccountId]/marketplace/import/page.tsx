'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, Download, Eye, Import, Search, Filter, Package } from 'lucide-react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'

const ImportToFunnelPage = () => {
  const params = useParams()
  const subaccountId = params.subaccountId as string

  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [selectedFunnel, setSelectedFunnel] = useState<string>('')
  const [funnels, setFunnels] = useState<any[]>([])
  const [purchasedThemes, setPurchasedThemes] = useState<any[]>([])
  const [isImporting, setIsImporting] = useState(false)

  const mockPurchasedThemes = [
    {
      id: '1',
      name: 'Modern Agency Theme',
      description: 'Professional theme perfect for digital agencies',
      image: '/assets/preview.png',
      category: 'business',
      purchaseDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'E-commerce Pro',
      description: 'Complete e-commerce solution',
      image: '/assets/preview.png',
      category: 'ecommerce',
      purchaseDate: '2024-01-10'
    },
    {
      id: '3',
      name: 'SaaS Landing Page',
      description: 'Conversion-optimized landing page',
      image: '/assets/preview.png',
      category: 'saas',
      purchaseDate: '2024-01-05'
    }
  ]

  const mockFunnels = [
    { id: '1', name: 'Main Sales Funnel', status: 'PUBLISHED' },
    { id: '2', name: 'Lead Generation', status: 'DRAFT' },
    { id: '3', name: 'Product Launch', status: 'DRAFT' }
  ]

  useEffect(() => {
    setPurchasedThemes(mockPurchasedThemes)
    setFunnels(mockFunnels)
  }, [])

  const handleImportTheme = async () => {
    if (!selectedTheme || !selectedFunnel) {
      toast.error('Please select both a theme and a funnel')
      return
    }

    setIsImporting(true)
    try {
      const response = await fetch('/api/marketplace/import-theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          themeId: selectedTheme,
          funnelId: selectedFunnel,
          subAccountId: subaccountId,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(result.message || 'Theme imported successfully!')
        setSelectedTheme(null)
        setSelectedFunnel('')
      } else {
        toast.error(result.error || 'Failed to import theme')
      }
    } catch (error) {
      toast.error('Failed to import theme')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <Package className="h-8 w-8" />
          Import Theme to Funnel
        </h1>
        <p className="text-muted-foreground">
          Import your purchased themes into existing funnels to quickly create professional designs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Theme Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Select Theme
            </CardTitle>
            <CardDescription>
              Choose from your purchased themes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {purchasedThemes.map((theme) => (
                <div
                  key={theme.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedTheme === theme.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedTheme(theme.id)}
                >
                  <div className="flex gap-4">
                    <div className="relative w-20 h-16 bg-muted rounded overflow-hidden">
                      <Image
                        src={theme.image}
                        alt={theme.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{theme.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {theme.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{theme.category}</Badge>
                        <span className="text-xs text-muted-foreground">
                          Purchased: {new Date(theme.purchaseDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Funnel Selection & Import */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Select Funnel
            </CardTitle>
            <CardDescription>
              Choose the funnel to import the theme into
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Target Funnel
              </label>
              <Select value={selectedFunnel} onValueChange={setSelectedFunnel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a funnel" />
                </SelectTrigger>
                <SelectContent>
                  {funnels.map((funnel) => (
                    <SelectItem key={funnel.id} value={funnel.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{funnel.name}</span>
                        <Badge variant={funnel.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                          {funnel.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTheme && selectedFunnel && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Import Preview</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  This will import the selected theme's design and components into your funnel. 
                  Existing content will be preserved but the styling will be updated.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Theme:</span>
                  <span>{purchasedThemes.find(t => t.id === selectedTheme)?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Funnel:</span>
                  <span>{funnels.find(f => f.id === selectedFunnel)?.name}</span>
                </div>
              </div>
            )}

            <Button 
              onClick={handleImportTheme}
              disabled={!selectedTheme || !selectedFunnel || isImporting}
              className="w-full"
              size="lg"
            >
              {isImporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Importing Theme...
                </>
              ) : (
                <>
                  <Import className="w-4 h-4 mr-2" />
                  Import Theme to Funnel
                </>
              )}
            </Button>

            <div className="text-center">
              <Link 
                href={`/subaccount/${subaccountId}/marketplace`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                ← Back to Marketplace
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Browse More Themes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Discover new themes in our marketplace
            </p>
            <Button variant="outline" asChild className="w-full">
              <Link href={`/subaccount/${subaccountId}/marketplace/themes`}>
                Browse Themes
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Manage Funnels</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create and edit your sales funnels
            </p>
            <Button variant="outline" asChild className="w-full">
              <Link href={`/subaccount/${subaccountId}/funnels`}>
                View Funnels
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Theme Library</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View all your purchased themes
            </p>
            <Button variant="outline" asChild className="w-full">
              <Link href={`/subaccount/${subaccountId}/marketplace/themes`}>
                My Themes
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ImportToFunnelPage