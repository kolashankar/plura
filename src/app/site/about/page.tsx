import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Zap, 
  Users, 
  Globe, 
  Target,
  Award,
  Rocket,
  Heart,
  Shield,
  TrendingUp,
  Clock
} from 'lucide-react'

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "CEO & Founder",
      description: "10+ years in SaaS and automation platforms",
      avatar: "AJ"
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      description: "Former Google engineer, AI/ML specialist",
      avatar: "SC"
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Product",
      description: "UX expert with enterprise automation experience",
      avatar: "MR"
    },
    {
      name: "Emma Thompson",
      role: "VP of Engineering",
      description: "Scalable systems architect and DevOps leader",
      avatar: "ET"
    }
  ]

  const values = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Customer First",
      description: "Every decision we make starts with how it benefits our users"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Innovation",
      description: "Constantly pushing the boundaries of what's possible in automation"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Security",
      description: "Enterprise-grade security and privacy protection for all data"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Collaboration",
      description: "Building tools that bring teams together and amplify productivity"
    }
  ]

  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description: "Started with a vision to democratize business automation"
    },
    {
      year: "2021",
      title: "First 1,000 Users",
      description: "Reached our first major user milestone with overwhelming positive feedback"
    },
    {
      year: "2022",
      title: "Series A Funding",
      description: "Raised $10M to accelerate product development and team growth"
    },
    {
      year: "2023",
      title: "AI Integration",
      description: "Launched AI-powered automation suggestions and natural language processing"
    },
    {
      year: "2024",
      title: "Global Expansion",
      description: "Serving 50,000+ businesses across 40+ countries worldwide"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="outline" className="mb-4">About Plura</Badge>
          <h1 className="text-5xl font-bold text-white mb-6">
            Empowering Agencies with
            <span className="text-purple-400"> Intelligent Automation</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            We&apos;re on a mission to transform how digital agencies build, automate, and scale their businesses through cutting-edge technology and intuitive design.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">50K+</div>
              <div className="text-gray-300">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">100M+</div>
              <div className="text-gray-300">Automations Run</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">40+</div>
              <div className="text-gray-300">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">99.9%</div>
              <div className="text-gray-300">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-xl text-gray-300 mb-6">
                To democratize business automation and make powerful tools accessible to agencies of all sizes. We believe that every business should have the power to automate repetitive tasks, streamline workflows, and focus on what truly matters - growing their business and serving their clients.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-purple-600/10 rounded-lg">
                  <Target className="w-8 h-8 text-purple-400 mb-2" />
                  <h3 className="font-semibold text-white mb-1">Vision</h3>
                  <p className="text-gray-300 text-sm">A world where every business runs on intelligent automation</p>
                </div>
                <div className="p-4 bg-purple-600/10 rounded-lg">
                  <Rocket className="w-8 h-8 text-purple-400 mb-2" />
                  <h3 className="font-semibold text-white mb-1">Goal</h3>
                  <p className="text-gray-300 text-sm">Empower 1M+ businesses with automation by 2030</p>
                </div>
              </div>
            </div>
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">What Drives Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white">Growth</h4>
                    <p className="text-gray-300 text-sm">We measure our success by our customers&apos; growth and achievements</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white">Efficiency</h4>
                    <p className="text-gray-300 text-sm">Helping businesses save time and resources through smart automation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white">Excellence</h4>
                    <p className="text-gray-300 text-sm">Delivering world-class products that exceed expectations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-xl text-gray-300">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="bg-black/20 border-purple-500/20 text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto text-purple-400">
                    {value.icon}
                  </div>
                  <CardTitle className="text-white">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-300">The passionate people behind Plura</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="bg-black/20 border-purple-500/20 text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto text-white text-lg font-bold">
                    {member.avatar}
                  </div>
                  <CardTitle className="text-white">{member.name}</CardTitle>
                  <CardDescription className="text-purple-400">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Our Journey</h2>
            <p className="text-xl text-gray-300">Key milestones in our growth story</p>
          </div>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {milestone.year}
                </div>
                <Card className="bg-black/20 border-purple-500/20 flex-1">
                  <CardHeader>
                    <CardTitle className="text-white">{milestone.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300">
                      {milestone.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Join Our Mission</h2>
          <p className="text-xl text-gray-300 mb-8">Ready to transform your agency with intelligent automation?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/agency/sign-up">Start Your Journey</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/site/features">Explore Features</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage