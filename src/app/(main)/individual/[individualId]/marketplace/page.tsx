
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, Download, Eye, ShoppingCart, Search, Filter, Package } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { db } from '@/lib/db'
import { checkPremiumSubscription } from '@/lib/queries'
import MarketplaceClient from './marketplace-client'

interface MarketplacePageProps {
  params: {
    individualId: string
  }
}

const MarketplacePage = async ({ params }: MarketplacePageProps) => {
  const individualId = params.individualId

  // For Individual accounts, we'll set premium based on their subscription
  let isPremium = false
  // TODO: Add Individual subscription check when billing is implemented
  const themes = [
    {
      id: '1',
      name: 'Modern Agency Theme',
      description: 'Professional theme perfect for digital agencies and creative studios',
      price: 79,
      rating: 4.8,
      downloads: 1250,
      image: '/assets/preview.png',
      category: 'business',
      featured: true
    },
    {
      id: '2',
      name: 'E-commerce Pro',
      description: 'Complete e-commerce solution with payment integration',
      price: 129,
      rating: 4.9,
      downloads: 890,
      image: '/assets/preview.png',
      category: 'ecommerce',
      featured: true
    },
    {
      id: '3',
      name: 'SaaS Landing Page',
      description: 'Conversion-optimized landing page for SaaS products',
      price: 59,
      rating: 4.7,
      downloads: 1560,
      image: '/assets/preview.png',
      category: 'saas',
      featured: false
    },
    {
      id: '4',
      name: 'Portfolio Showcase',
      description: 'Elegant portfolio theme for creatives and freelancers',
      price: 49,
      rating: 4.6,
      downloads: 980,
      image: '/assets/preview.png',
      category: 'portfolio',
      featured: false
    }
  ]

  const plugins = [
    {
      id: '1',
      name: 'Advanced Contact Forms',
      description: 'Powerful form builder with conditional logic and integrations',
      price: 39,
      rating: 4.8,
      downloads: 2100,
      category: 'forms',
      featured: true
    },
    {
      id: '2',
      name: 'SEO Optimizer Pro',
      description: 'Complete SEO toolkit for better search engine rankings',
      price: 89,
      rating: 4.9,
      downloads: 1450,
      category: 'seo',
      featured: true
    },
    {
      id: '3',
      name: 'Social Media Feed',
      description: 'Display Instagram, Twitter, and Facebook feeds beautifully',
      price: 29,
      rating: 4.5,
      downloads: 1780,
      category: 'social',
      featured: false
    },
    {
      id: '4',
      name: 'Analytics Dashboard',
      description: 'Advanced analytics and reporting for your websites',
      price: 59,
      rating: 4.7,
      downloads: 890,
      category: 'analytics',
      featured: false
    }
  ]

  return (
    <MarketplaceClient 
      subaccountId={individualId}
      isPremium={isPremium}
      themes={themes}
      plugins={plugins}
    />
  )
}

export default MarketplacePage
