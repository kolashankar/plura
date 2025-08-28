
import React from 'react'
import BlurPage from '@/components/global/blur-page'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type Props = {
  params: { subaccountId: string }
}

const AutomationsPage = ({ params }: Props) => {
  return (
    <BlurPage>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl">Automations</h1>
          <Button>Create Automation</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Email Sequences
                <Badge variant="secondary">Active</Badge>
              </CardTitle>
              <CardDescription>
                Automated email campaigns for lead nurturing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sent this month:</span>
                  <span className="font-medium">1,234</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Open rate:</span>
                  <span className="font-medium text-green-600">24.5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Click rate:</span>
                  <span className="font-medium text-blue-600">3.2%</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Manage Sequences
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Lead Scoring
                <Badge variant="default">New</Badge>
              </CardTitle>
              <CardDescription>
                Automatically score and qualify leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Leads scored:</span>
                  <span className="font-medium">856</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Hot leads:</span>
                  <span className="font-medium text-red-600">23</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Conversion rate:</span>
                  <span className="font-medium text-green-600">12.8%</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Configure Rules
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>
                Schedule and auto-post content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Posts scheduled:</span>
                  <span className="font-medium">45</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Platforms:</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Engagement rate:</span>
                  <span className="font-medium text-blue-600">6.7%</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Manage Posts
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Task Automation</CardTitle>
              <CardDescription>
                Automate repetitive tasks and workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Active workflows:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tasks completed:</span>
                  <span className="font-medium">2,847</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Time saved:</span>
                  <span className="font-medium text-green-600">34h</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Create Workflow
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Journey</CardTitle>
              <CardDescription>
                Map and automate customer experiences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Active journeys:</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Customers in flow:</span>
                  <span className="font-medium">456</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Completion rate:</span>
                  <span className="font-medium text-blue-600">78%</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Design Journey
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integration Hub</CardTitle>
              <CardDescription>
                Connect with third-party services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Connected apps:</span>
                  <span className="font-medium">6</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Data synced:</span>
                  <span className="font-medium">Real-time</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>API calls today:</span>
                  <span className="font-medium">1,247</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Browse Integrations
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Automation Performance</CardTitle>
            <CardDescription>
              Overview of all automation metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24</div>
                <div className="text-sm text-muted-foreground">Active Automations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">98.5%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">2.3K</div>
                <div className="text-sm text-muted-foreground">Actions This Month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">156h</div>
                <div className="text-sm text-muted-foreground">Time Saved</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </BlurPage>
  )
}

export default AutomationsPage
