'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Download, Eye, Calendar, Filter, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface PurchasedTheme {
  id: string
  themeId: string
  purchaseDate: Date
  price: number
  theme: {
    id: string
    name: string
    description: string
    price: number
    category: string
    image: string
    rating: number
    downloads: number
  }
}

interface PurchasedThemesGridProps {
  agencyId?: string
  subAccountId?: string
  showImportButton?: boolean
}

const PurchasedThemesGrid: React.FC<PurchasedThemesGridProps> = ({
  agencyId,
  subAccountId,
  showImportButton = false
}) => {
  const [themes, setThemes] = useState<PurchasedTheme[]>([])
  const [filteredThemes, setFilteredThemes] = useState<PurchasedTheme[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isLoading, setIsLoading] = useState(true)

  const categories = ['All', 'business', 'ecommerce', 'saas', 'portfolio', 'blog']

  useEffect(() => {
    fetchPurchasedThemes()
  }, [agencyId, subAccountId])

  useEffect(() => {
    filterThemes()
  }, [themes, searchTerm, selectedCategory])

  const fetchPurchasedThemes = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (agencyId) params.append('agencyId', agencyId)
      if (subAccountId) params.append('subAccountId', subAccountId)

      const response = await fetch(`/api/marketplace/purchased-themes?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setThemes(data)
      } else {
        console.error('Failed to fetch purchased themes:', data.error)
      }
    } catch (error) {
      console.error('Error fetching purchased themes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterThemes = () => {
    let filtered = themes

    if (searchTerm) {
      filtered = filtered.filter(theme =>
        theme.theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        theme.theme.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(theme => theme.theme.category === selectedCategory)
    }

    setFilteredThemes(filtered)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="h-48 bg-muted animate-pulse" />
            <CardHeader>
              <div className="h-4 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your themes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === 'All' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Themes Grid */}
      {filteredThemes.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-muted-foreground">
            {themes.length === 0 ? (
              <>
                <h3 className="text-lg font-semibold mb-2">No purchased themes</h3>
                <p>Browse the marketplace to purchase and download themes.</p>
                <Button asChild className="mt-4">
                  <Link href={agencyId ? `/agency/${agencyId}/marketplace` : `/subaccount/${subAccountId}/marketplace`}>
                    Browse Marketplace
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-2">No themes match your search</h3>
                <p>Try adjusting your filters or search terms.</p>
              </>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredThemes.map((purchasedTheme) => (
            <Card key={purchasedTheme.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-muted">
                <Image
                  src={purchasedTheme.theme.image}
                  alt={purchasedTheme.theme.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary">Owned</Badge>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{purchasedTheme.theme.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {purchasedTheme.theme.description}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(purchasedTheme.purchaseDate).toLocaleDateString()}
                  </div>
                  <Badge variant="outline">{purchasedTheme.theme.category}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  
                  {showImportButton && subAccountId && (
                    <Button asChild size="sm" className="flex-1">
                      <Link href={`/subaccount/${subAccountId}/marketplace/import?theme=${purchasedTheme.themeId}`}>
                        Import
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default PurchasedThemesGrid