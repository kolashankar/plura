import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import { Check, X } from 'lucide-react'
import Link from 'next/link'

const individualPricingCards = [
  {
    title: 'Free',
    description: 'Perfect for getting started',
    price: '$0',
    duration: 'forever',
    highlight: 'Basic features',
    features: [
      'Drag and drop website builder',
      'Basic templates',
      'Limited to 1 project',
      'Community support'
    ],
    limitations: [
      'No AI agent enabled',
      'No automation features', 
      'Cannot view or download code',
      'No custom domains'
    ],
    priceId: '',
    popular: false,
  },
  {
    title: 'Basic',
    description: 'For serious individual developers',
    price: '$15',
    duration: 'month',
    highlight: 'Everything in Free, plus',
    features: [
      'AI agent enabled',
      'View and download code',
      'Up to 5 projects',
      'Email support',
      'Custom domains',
      'Advanced templates'
    ],
    limitations: [
      'Automations not enabled',
      'Cannot sell themes/plugins'
    ],
    priceId: 'price_basic_individual',
    popular: false,
  },
  {
    title: 'Pro',
    description: 'For power users and professionals',
    price: '$35',
    duration: 'month',
    highlight: 'Everything in Basic, plus',
    features: [
      'AI agent enabled',
      'Automations enabled',
      'View and download code',
      'Unlimited projects',
      'Priority support',
      'Advanced integrations',
      'Team collaboration'
    ],
    limitations: [
      'Cannot sell themes/plugins'
    ],
    priceId: 'price_pro_individual',
    popular: true,
  },
  {
    title: 'Premium',
    description: 'For marketplace creators',
    price: '$55',
    duration: 'month',
    highlight: 'Everything in Pro, plus',
    features: [
      'AI agent enabled',
      'Automations enabled',
      'View and download code',
      'Sell themes and plugins',
      'Marketplace revenue sharing',
      'Premium seller badge',
      'Analytics dashboard',
      'Dedicated support'
    ],
    limitations: [],
    priceId: 'price_premium_individual',
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="outline" className="mb-4">Individual Plans</Badge>
          <h1 className="text-5xl font-bold text-white mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Select the perfect plan for your individual needs. Start free and upgrade as you grow.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {individualPricingCards.map((card) => (
              <Card
                key={card.title}
                className={clsx(
                  'relative bg-black/20 border-purple-500/20 hover:border-purple-400/40 transition-all flex flex-col',
                  {
                    'border-2 border-purple-400 ring-2 ring-purple-400/20': card.popular,
                  }
                )}
              >
                {card.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-white text-2xl">
                    {card.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {card.description}
                  </CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold text-white">
                      {card.price}
                    </span>
                    {card.duration && (
                      <span className="text-gray-400 ml-1">
                        / {card.duration}
                      </span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <p className="font-medium text-sm mb-4 text-purple-300">
                    {card.highlight}
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-3 mb-4">
                    {card.features.map((feature) => (
                      <div key={feature} className="flex gap-2 items-center">
                        <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <p className="text-sm text-gray-300">{feature}</p>
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  {card.limitations.length > 0 && (
                    <div className="space-y-2 pt-4 border-t border-gray-700">
                      <p className="text-xs text-gray-500 font-medium">Limitations:</p>
                      {card.limitations.map((limitation) => (
                        <div key={limitation} className="flex gap-2 items-center">
                          <X className="h-3 w-3 text-red-400 flex-shrink-0" />
                          <p className="text-xs text-gray-400">{limitation}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>

                <CardFooter>
                  <Button
                    className={clsx(
                      'w-full transition-colors',
                      card.popular
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                    )}
                    asChild
                  >
                    <Link href={card.priceId ? `/individual?plan=${card.priceId}` : '/individual'}>
                      {card.title === 'Free' ? 'Get Started Free' : 'Choose Plan'}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 px-4 bg-black/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Feature Comparison
          </h2>
          <div className="bg-black/40 rounded-lg p-6 border border-purple-500/20">
            <div className="grid grid-cols-5 gap-4 text-center">
              <div className="text-gray-400 font-medium">Features</div>
              <div className="text-white font-medium">Free</div>
              <div className="text-white font-medium">Basic</div>
              <div className="text-white font-medium">Pro</div>
              <div className="text-white font-medium">Premium</div>
              
              <div className="text-gray-300 text-left">AI Agent</div>
              <X className="h-5 w-5 text-red-400 mx-auto" />
              <Check className="h-5 w-5 text-green-400 mx-auto" />
              <Check className="h-5 w-5 text-green-400 mx-auto" />
              <Check className="h-5 w-5 text-green-400 mx-auto" />
              
              <div className="text-gray-300 text-left">Automations</div>
              <X className="h-5 w-5 text-red-400 mx-auto" />
              <X className="h-5 w-5 text-red-400 mx-auto" />
              <Check className="h-5 w-5 text-green-400 mx-auto" />
              <Check className="h-5 w-5 text-green-400 mx-auto" />
              
              <div className="text-gray-300 text-left">Code Access</div>
              <X className="h-5 w-5 text-red-400 mx-auto" />
              <Check className="h-5 w-5 text-green-400 mx-auto" />
              <Check className="h-5 w-5 text-green-400 mx-auto" />
              <Check className="h-5 w-5 text-green-400 mx-auto" />
              
              <div className="text-gray-300 text-left">Sell Themes/Plugins</div>
              <X className="h-5 w-5 text-red-400 mx-auto" />
              <X className="h-5 w-5 text-red-400 mx-auto" />
              <X className="h-5 w-5 text-red-400 mx-auto" />
              <Check className="h-5 w-5 text-green-400 mx-auto" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}