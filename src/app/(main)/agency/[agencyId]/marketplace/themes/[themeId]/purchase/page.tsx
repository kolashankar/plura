'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ChevronLeft, 
  CreditCard, 
  Shield, 
  Download, 
  CheckCircle,
  AlertCircle,
  Lock,
  Star
} from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

type Props = {
  params: { themeId: string }
}

const ThemePurchasePage = ({ params }: Props) => {
  const { user } = useUser()
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [processing, setProcessing] = useState(false)
  const [agreesToTerms, setAgreesToTerms] = useState(false)
  const [billingInfo, setBillingInfo] = useState({
    email: user?.emailAddresses[0]?.emailAddress || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    company: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'US'
  })

  // Mock theme data - replace with actual API call
  const theme = {
    id: params.themeId,
    name: "Modern Business Pro",
    price: 89.99,
    originalPrice: 129.99,
    category: "Business",
    seller: "ThemeStudio",
    rating: 4.8,
    reviews: 324,
    description: "Professional business theme with modern design and responsive layout. Perfect for corporate websites, agencies, and professional services.",
    image: "/assets/preview.png",
    features: [
      "Complete theme files",
      "12+ page templates", 
      "Installation guide",
      "12 months of updates",
      "Premium support",
      "Commercial license"
    ]
  }

  const handlePurchase = async () => {
    if (!agreesToTerms) {
      alert('Please agree to the terms and conditions')
      return
    }

    setProcessing(true)

    try {
      // Create Stripe checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          themeId: theme.id,
          themeName: theme.name,
          amount: theme.price * 100, // Convert to cents
          billingInfo,
          successUrl: `${window.location.origin}/marketplace/themes/${theme.id}/success`,
          cancelUrl: `${window.location.origin}/marketplace/themes/${theme.id}/purchase`
        }),
      })

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Purchase error:', error)
      alert('Failed to process purchase. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const tax = theme.price * 0.08 // 8% tax
  const total = theme.price + tax

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link href={`/marketplace/themes/${theme.id}/preview`}>
              <Button variant="outline">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Preview
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Secure Checkout
                  </CardTitle>
                  <CardDescription>
                    Your payment information is secure and encrypted
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Theme Preview */}
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                      <Image
                        src={theme.image}
                        alt={theme.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{theme.name}</h3>
                      <p className="text-sm text-muted-foreground">by {theme.seller}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{theme.rating} ({theme.reviews})</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">${theme.price}</div>
                      <div className="text-sm text-muted-foreground line-through">
                        ${theme.originalPrice}
                      </div>
                    </div>
                  </div>

                  {/* Billing Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Billing Information</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={billingInfo.firstName}
                          onChange={(e) => setBillingInfo({...billingInfo, firstName: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={billingInfo.lastName}
                          onChange={(e) => setBillingInfo({...billingInfo, lastName: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={billingInfo.email}
                        onChange={(e) => setBillingInfo({...billingInfo, email: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input
                        id="company"
                        value={billingInfo.company}
                        onChange={(e) => setBillingInfo({...billingInfo, company: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Payment Method</h3>

                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Credit/Debit Card
                        </Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === 'card' && (
                      <div className="space-y-4 p-4 border rounded-lg">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input
                              id="expiry"
                              placeholder="MM/YY"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvc">CVC</Label>
                            <Input
                              id="cvc"
                              placeholder="123"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={agreesToTerms}
                      onCheckedChange={(checked) => setAgreesToTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed">
                      You&apos;re getting instant access to:
                      <Link href="/site/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/site/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Total & Purchase */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Theme Price:</span>
                    <span>${theme.price}</span>
                  </div>

                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-${(theme.originalPrice - theme.price).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handlePurchase}
                    disabled={processing || !agreesToTerms}
                  >
                    {processing ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Complete Purchase
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      Secured by Stripe
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What You Get */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    What You'll Get
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {theme.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Guarantee */}
              <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <AlertCircle className="w-5 h-5" />
                    30-Day Money Back Guarantee
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-green-600 dark:text-green-400">
                  <p>
                    Not satisfied with your purchase? Get a full refund within 30 days, 
                    no questions asked.
                  </p>
                </CardContent>
              </Card>

              {/* Support */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">
                    Our support team is here to help with installation, 
                    customization, and any questions you might have.
                  </p>
                  <Link 
                    href="/support" 
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Contact Support
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThemePurchasePage