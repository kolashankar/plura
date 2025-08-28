
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

type Props = {
  params: { themeId: string }
}

const ThemePurchasePage = ({ params }: Props) => {
  const theme = {
    id: params.themeId,
    name: "Modern Business",
    price: 49,
    category: "Business",
    description: "Professional business theme with modern design"
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link href={`/marketplace/themes/${theme.id}/preview`}>
              <Button variant="outline">← Back to Preview</Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Complete Your Purchase</CardTitle>
              <CardDescription>
                You're about to purchase the {theme.name} theme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <h3 className="font-semibold">{theme.name}</h3>
                  <p className="text-sm text-muted-foreground">{theme.description}</p>
                  <Badge variant="outline" className="mt-1">{theme.category}</Badge>
                </div>
                <div className="text-2xl font-bold">${theme.price}</div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Payment Information</h4>
                
                <div>
                  <Label htmlFor="card">Card Number</Label>
                  <Input
                    id="card"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      type="text"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      type="text"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="text-2xl font-bold">${theme.price}</span>
              </div>

              <div className="space-y-2">
                <Button className="w-full">
                  Complete Purchase
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  By purchasing, you agree to our Terms of Service and License Agreement
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">What happens next?</h4>
                <ul className="text-sm space-y-1">
                  <li>• Instant download access</li>
                  <li>• Theme files sent to your email</li>
                  <li>• Installation instructions included</li>
                  <li>• 6 months of free updates</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ThemePurchasePage
