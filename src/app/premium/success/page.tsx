import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Crown, ArrowRight, Gift } from 'lucide-react'
import Link from 'next/link'

export default function PremiumSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-white/80 backdrop-blur border-2 border-green-200">
        <CardHeader className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to Premium!
          </CardTitle>
          <CardDescription className="text-lg">
            Your account has been successfully upgraded to premium. You now have access to all premium features!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Premium Features Now Available */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold text-lg">Premium Features Now Available</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">AI Code Generation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Advanced Automations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Premium Templates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Priority Support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Theme Marketplace</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">White-label Options</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Gift className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-lg">Get Started with Premium</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Explore your new premium features and start building amazing projects with enhanced capabilities.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600" asChild>
              <Link href="/dashboard">
                Start Building
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/premium/features">
                Explore Features
              </Link>
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Need help getting started? <Link href="mailto:support@plura-app.com" className="text-blue-600 hover:underline">Contact our support team</Link></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}