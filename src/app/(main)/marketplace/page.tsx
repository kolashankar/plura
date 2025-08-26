
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Palette, Puzzle, Store, TrendingUp } from 'lucide-react'

export default function MarketplacePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
          Plura Marketplace
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Discover themes, plugins, and tools to supercharge your websites
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Link href="/marketplace/themes">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Palette className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Themes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Beautiful, responsive themes for your websites</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/marketplace/plugins">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Puzzle className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Plugins</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Extend functionality with powerful plugins</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/marketplace/sell">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Store className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Sell Your Work</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Monetize your themes and plugins</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/marketplace/trending">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <TrendingUp className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Trending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Most popular items this week</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Featured Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg"></div>
                <CardTitle>Featured Item {item}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">$29.99</span>
                  <Button>Purchase</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
