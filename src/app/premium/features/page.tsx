import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Crown, 
  Zap, 
  Palette, 
  Code, 
  Globe, 
  Users, 
  BarChart, 
  Shield,
  Smartphone,
  Database,
  Settings,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

const premiumFeatures = [
  {
    icon: Code,
    title: "AI Code Generation",
    description: "Generate complete applications in React, React Native, and Python with advanced AI",
    features: [
      "Multi-platform code generation",
      "Custom component creation", 
      "Advanced templates",
      "Production-ready code"
    ],
    color: "from-blue-500 to-purple-600"
  },
  {
    icon: Zap,
    title: "Advanced Automations",
    description: "Powerful workflow automation and integrations for streamlined operations",
    features: [
      "Social media scheduling",
      "Lead nurturing workflows",
      "Email automation",
      "Third-party integrations"
    ],
    color: "from-yellow-500 to-orange-600"
  },
  {
    icon: Palette,
    title: "Theme Marketplace",
    description: "Access premium themes and monetize your designs in our marketplace",
    features: [
      "Premium theme library",
      "Sell custom themes",
      "Revenue sharing",
      "Theme analytics"
    ],
    color: "from-pink-500 to-rose-600"
  },
  {
    icon: Smartphone,
    title: "Mobile App Generation",
    description: "Create native mobile applications with React Native integration",
    features: [
      "React Native export",
      "Cross-platform apps",
      "Native components",
      "App store ready"
    ],
    color: "from-green-500 to-teal-600"
  },
  {
    icon: BarChart,
    title: "Advanced Analytics",
    description: "Comprehensive insights and reporting for your projects and campaigns",
    features: [
      "Real-time analytics",
      "Custom dashboards",
      "Performance metrics",
      "ROI tracking"
    ],
    color: "from-indigo-500 to-blue-600"
  },
  {
    icon: Shield,
    title: "White-label Solutions",
    description: "Brand the platform as your own with custom branding and domains",
    features: [
      "Custom branding",
      "White-label interface",
      "Custom domains",
      "Client dashboards"
    ],
    color: "from-purple-500 to-pink-600"
  },
  {
    icon: Database,
    title: "Advanced Integrations",
    description: "Connect with powerful third-party services and APIs",
    features: [
      "CRM integrations",
      "Payment gateways",
      "Email services",
      "Social platforms"
    ],
    color: "from-red-500 to-orange-600"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Enhanced team features for agencies and large organizations",
    features: [
      "Unlimited team members",
      "Role-based permissions",
      "Collaboration tools",
      "Project sharing"
    ],
    color: "from-cyan-500 to-blue-600"
  }
]

export default function PremiumFeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
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
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover all the premium features available to supercharge your development workflow and business growth
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {premiumFeatures.map((feature, index) => (
            <Card key={index} className="border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
            <CardHeader className="text-center">
              <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Multi-Platform Development</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Build for web, mobile, and desktop from a single codebase with our advanced code generation
              </p>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                React • React Native • Python
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200">
            <CardHeader className="text-center">
              <Settings className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Advanced Automation</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Streamline your workflow with powerful automation tools and third-party integrations
              </p>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Save 10+ Hours/Week
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
            <CardHeader className="text-center">
              <Crown className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Enterprise Ready</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Scale your business with white-label solutions, team collaboration, and advanced analytics
              </p>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Business Growth
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Ready to Get Started?</CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Join thousands of developers and agencies already using our premium features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                  <Link href="/premium">
                    View Premium Plans
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link href="/site/documentation">
                    Learn More
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