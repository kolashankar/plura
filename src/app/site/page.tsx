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
import { pricingCards } from '@/lib/constants'
import { stripe } from '@/lib/stripe'
import clsx from 'clsx'
import { Check, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
  let prices: { data: any[] } = { data: [] };
  
  try {
    if (process.env.NEXT_PLURA_PRODUCT_ID && process.env.STRIPE_SECRET_KEY) {
      const stripeResponse = await stripe.prices.list({
        product: process.env.NEXT_PLURA_PRODUCT_ID,
        active: true,
      });
      prices = stripeResponse;
    }
  } catch (error) {
    console.error('Failed to fetch Stripe prices:', error);
    // Continue with empty prices array
  }

  return (
    <>
      <section className="h-full w-full md:pt-44 mt-[-70px] relative flex items-center justify-center flex-col overflow-hidden">
        {/* Slanted background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 transform -skew-y-3 origin-top-left scale-110 -z-20" />
        <div className="absolute inset-0 bg-gradient-to-tl from-accent/10 via-transparent to-primary/10 transform skew-y-2 origin-bottom-right scale-110 -z-19" />
        
        {/* grid */}
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" />

        <div className="relative z-10 transform -skew-y-1">
          <p className="text-center text-lg md:text-xl mb-4 transform skew-y-1">Run your agency, in one place</p>
          <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative transform skew-y-1">
            <h1 className="text-7xl font-bold text-center md:text-[250px] leading-tight">
              Plura
            </h1>
          </div>
        </div>
        
        <div className="flex justify-center items-center relative md:mt-[-50px] z-10 transform rotate-1">
          <div className="relative">
            <Image
              src={'/assets/preview.png'}
              alt="banner image"
              height={1200}
              width={1200}
              className="rounded-2xl border-4 border-primary/20 shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent rounded-2xl" />
          </div>
          <div className="bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-10"></div>
        </div>
      </section>
      <section className="flex justify-center items-center flex-col gap-4 md:!mt-20 mt-[-60px]">
        <h2 className="text-4xl text-center"> Choose what fits you right</h2>
        <p className="text-muted-foreground text-center">
          Our straightforward pricing plans are tailored to meet your needs. If
          {" you're"} not <br />
          ready to commit you can get started for free.
        </p>
        <div className="flex  justify-center gap-4 flex-wrap mt-6">
          {pricingCards.map((card) => (
            <Card
              key={card.title}
              className={clsx('w-[300px] flex flex-col justify-between', {
                'border-2 border-primary': card.title === 'Unlimited Saas',
              })}
            >
              <CardHeader>
                <CardTitle
                  className={clsx('', {
                    'text-muted-foreground': card.title !== 'Unlimited Saas',
                  })}
                >
                  {card.title}
                </CardTitle>
                <CardDescription>
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-4xl font-bold">
                  {card.price}
                </span>
                <span className="text-muted-foreground">
                  {card.duration && <span>/ {card.duration}</span>}
                </span>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4">
                <div>
                  <p className="font-medium text-sm mb-2">{card.highlight}</p>
                  {card.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex gap-2 items-center mb-1"
                    >
                      <Check className="h-4 w-4 text-green-500" />
                      <p className="text-sm">{feature}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href={card.priceId ? `/agency?plan=${card.priceId}` : '/agency'}
                  className={clsx(
                    'w-full text-center bg-primary p-2 rounded-md text-white hover:bg-primary/90 transition-colors',
                    {
                      '!bg-muted-foreground hover:!bg-muted-foreground/90':
                        card.title !== 'Unlimited Saas',
                    }
                  )}
                >
                  Get Started
                </Link>
              </CardFooter>
            </Card>
          ))}
          {/* Add Priority Support as an add-on */}
          <Card className={clsx('w-[300px] flex flex-col justify-between border-dashed')}>
            <CardHeader>
              <CardTitle className="text-muted-foreground">
                Priority Support
              </CardTitle>
              <CardDescription>
                24/7 dedicated support for your agency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-4xl font-bold">Add-on</span>
              <span className="text-muted-foreground">
                <span>/ month</span>
              </span>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4">
              <div>
                <p className="font-medium text-sm mb-2">Additional Features</p>
                <div className="flex gap-2 items-center mb-1">
                  <Check className="h-4 w-4 text-green-500" />
                  <p className="text-sm">24/7 Priority Support</p>
                </div>
                <div className="flex gap-2 items-center mb-1">
                  <Check className="h-4 w-4 text-green-500" />
                  <p className="text-sm">Dedicated Support Team</p>
                </div>
                <div className="flex gap-2 items-center mb-1">
                  <Check className="h-4 w-4 text-green-500" />
                  <p className="text-sm">Skip Queue Support</p>
                </div>
              </div>
              <Link
                href="/agency?addon=priority-support"
                className="w-full text-center bg-muted-foreground p-2 rounded-md text-white hover:bg-muted-foreground/90 transition-colors"
              >
                Add to Plan
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Individual User Pricing Section */}
      <section className="py-20 px-4 bg-background/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Individual Developer Plans</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Perfect for individual developers and freelancers who want to build amazing websites with AI assistance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Get started for free</CardDescription>
                <div className="text-3xl font-bold">$0</div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Drag & drop builder</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-muted-foreground">No AI agent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-muted-foreground">No code access</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/individual" className="w-full">
                  <div className="w-full text-center bg-primary p-2 rounded-md text-white hover:bg-primary/90 transition-colors">
                    Get Started
                  </div>
                </Link>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <CardDescription>AI-powered development</CardDescription>
                <div className="text-3xl font-bold">$15<span className="text-sm font-normal">/month</span></div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">AI agent enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">View & download code</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-muted-foreground">No automations</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/individual?plan=basic" className="w-full">
                  <div className="w-full text-center bg-primary p-2 rounded-md text-white hover:bg-primary/90 transition-colors">
                    Choose Basic
                  </div>
                </Link>
              </CardFooter>
            </Card>

            <Card className="flex flex-col border-2 border-primary relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">Popular</Badge>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>Full automation power</CardDescription>
                <div className="text-3xl font-bold">$35<span className="text-sm font-normal">/month</span></div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">AI agent enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Automations enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">View & download code</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/individual?plan=pro" className="w-full">
                  <div className="w-full text-center bg-primary p-2 rounded-md text-white hover:bg-primary/90 transition-colors">
                    Choose Pro
                  </div>
                </Link>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Premium</CardTitle>
                <CardDescription>Marketplace creator</CardDescription>
                <div className="text-3xl font-bold">$55<span className="text-sm font-normal">/month</span></div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Everything in Pro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Sell themes & plugins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">95% revenue share</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/individual?plan=premium" className="w-full">
                  <div className="w-full text-center bg-primary p-2 rounded-md text-white hover:bg-primary/90 transition-colors">
                    Choose Premium
                  </div>
                </Link>
              </CardFooter>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/pricing">
              <Button variant="outline" size="lg">
                View Detailed Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
