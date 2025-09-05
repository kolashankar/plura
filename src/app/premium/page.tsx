import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Crown, Zap, Star, Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { PRICING_PLANS } from '@/app/api/billing/plans/route'

export default async function PremiumPage() {
  const user = await currentUser()
  
  if (!user) {
    return redirect('/sign-in')
  }

  const premiumPlans = PRICING_PLANS.filter(plan => plan.id !== 'free')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full mb-6">
            <Crown className="w-5 h-5" />
            <span className="font-semibold">Premium Features</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Unlock Premium Power
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Supercharge your workflow with advanced features, unlimited resources, and priority support
          </p>
        </div>

        {/* Premium Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-2 border-blue-200 bg-white/80 backdrop-blur">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle>AI Code Generation</CardTitle>
              <CardDescription>
                Generate React, React Native, and Python code with AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Multi-platform code generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Advanced AI templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Custom component creation</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-white/80 backdrop-blur">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Advanced Automations</CardTitle>
              <CardDescription>
                Powerful workflow automation and integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Social media scheduler</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Lead nurturing workflows</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Third-party integrations</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-white/80 backdrop-blur">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Theme Marketplace</CardTitle>
              <CardDescription>
                Access premium themes and sell your own creations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Premium theme access</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Sell custom themes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Revenue sharing</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Plans */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Choose Your Premium Plan</h2>
          <p className="text-gray-600">Select the plan that best fits your needs</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {premiumPlans.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.popular ? 'border-2 border-blue-500 shadow-xl scale-105' : 'border border-gray-200'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="text-4xl font-bold text-blue-600">
                  ${plan.price}
                  <span className="text-lg text-gray-500 font-normal">/month</span>
                </div>
                <CardDescription className="text-base">
                  Perfect for {plan.id === 'basic' ? 'small teams' : plan.id === 'unlimited' ? 'growing businesses' : 'large agencies'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' : ''}`}
                  asChild
                >
                  <Link href={`/billing?upgrade=${plan.id}`}>
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl">Need Help Choosing?</CardTitle>
              <CardDescription>
                Contact our team for personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/site/documentation">
                    View Documentation
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="mailto:support@plura-app.com">
                    Contact Support
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}