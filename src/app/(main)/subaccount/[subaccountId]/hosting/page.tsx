
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Globe, Server, Settings, CheckCircle, Clock, AlertCircle, Crown } from 'lucide-react'
import { toast } from 'sonner'

export default function HostingPage() {
  const [customDomain, setCustomDomain] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  const domains = [
    { domain: 'example.com', status: 'active', ssl: true, created: '2024-01-15' },
    { domain: 'staging.example.com', status: 'pending', ssl: false, created: '2024-01-20' },
  ]

  const verifyDomain = async () => {
    setIsVerifying(true)
    // Simulate domain verification
    setTimeout(() => {
      setIsVerifying(false)
      toast.success('Domain verification started!')
    }, 2000)
  }

  const deployToProduction = () => {
    toast.success('Deployment started! Your site will be live in a few minutes.')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <Server className="w-8 h-8" />
          Website Hosting
        </h1>
        <p className="text-muted-foreground">Deploy and manage your websites with custom domains</p>
      </div>

      <Tabs defaultValue="domains" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="domains">Custom Domains</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="domains" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                Add Custom Domain (Premium Feature)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="domain">Domain Name</Label>
                  <div className="flex gap-2">
                    <Input
                      id="domain"
                      placeholder="yourdomain.com"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                    />
                    <Button onClick={verifyDomain} disabled={isVerifying || !customDomain}>
                      {isVerifying ? 'Verifying...' : 'Add Domain'}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    You&apos;ll need to update your DNS settings after adding the domain
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Domains</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {domains.map((domain, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5" />
                      <div>
                        <p className="font-medium">{domain.domain}</p>
                        <p className="text-sm text-muted-foreground">Added {domain.created}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge variant={domain.status === 'active' ? 'default' : 'secondary'}>
                        {domain.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {domain.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {domain.status}
                      </Badge>
                      
                      <Badge variant={domain.ssl ? 'default' : 'destructive'}>
                        {domain.ssl ? 'SSL Active' : 'No SSL'}
                      </Badge>
                      
                      <Button variant="outline" size="sm">
                        <Settings className="w-3 h-3 mr-1" />
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Deployment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Live
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last Deploy:</span>
                    <span className="text-sm">2 hours ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Build Time:</span>
                    <span className="text-sm">1m 23s</span>
                  </div>
                  <Button onClick={deployToProduction} className="w-full mt-4">
                    Deploy to Production
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deployment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: '2 hours ago', status: 'success', branch: 'main' },
                    { time: '1 day ago', status: 'success', branch: 'main' },
                    { time: '2 days ago', status: 'failed', branch: 'develop' },
                  ].map((deployment, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="text-sm font-medium">{deployment.branch}</p>
                        <p className="text-xs text-muted-foreground">{deployment.time}</p>
                      </div>
                      <Badge variant={deployment.status === 'success' ? 'default' : 'destructive'}>
                        {deployment.status === 'success' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {deployment.status === 'failed' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {deployment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Visits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12,847</div>
                <p className="text-sm text-muted-foreground">+18.2% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Page Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">24,563</div>
                <p className="text-sm text-muted-foreground">+12.5% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Bounce Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">34.2%</div>
                <p className="text-sm text-muted-foreground">-2.1% from last month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hosting Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Default Domain</Label>
                <Input value="your-site.plura.app" readOnly />
              </div>
              
              <div>
                <Label>Environment</Label>
                <select className="w-full p-2 border rounded">
                  <option>Production</option>
                  <option>Staging</option>
                  <option>Development</option>
                </select>
              </div>
              
              <div>
                <Label>Auto Deploy</Label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">Deploy automatically on content changes</span>
                </div>
              </div>
              
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
