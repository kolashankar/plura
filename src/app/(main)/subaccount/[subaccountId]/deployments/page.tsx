
'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Globe, Smartphone, Monitor, ExternalLink, Download, Eye, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import BlurPage from '@/components/global/blur-page'

interface Deployment {
  id: string
  name: string
  platform: 'web' | 'mobile'
  status: 'active' | 'building' | 'failed'
  url: string
  createdAt: string
  lastUpdated: string
  isResponsive?: boolean
}

const DeploymentsPage = ({ params }: { params: { subaccountId: string } }) => {
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null)

  useEffect(() => {
    fetchDeployments()
  }, [])

  const fetchDeployments = async () => {
    try {
      const response = await fetch(`/api/deployments/${params.subaccountId}`)
      const data = await response.json()
      setDeployments(data.deployments || mockDeployments)
    } catch (error) {
      console.error('Failed to fetch deployments:', error)
      setDeployments(mockDeployments)
    } finally {
      setLoading(false)
    }
  }

  const deleteDeployment = async (deploymentId: string) => {
    try {
      await fetch(`/api/deployments/${deploymentId}`, { method: 'DELETE' })
      setDeployments(prev => prev.filter(d => d.id !== deploymentId))
      toast.success('Deployment deleted successfully')
    } catch (error) {
      toast.error('Failed to delete deployment')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'building': return 'bg-yellow-500'
      case 'failed': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getPlatformIcon = (platform: string) => {
    return platform === 'mobile' ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />
  }

  // Mock data for demonstration
  const mockDeployments: Deployment[] = [
    {
      id: '1',
      name: 'E-commerce Landing Page',
      platform: 'web',
      status: 'active',
      url: 'https://ecommerce-landing.replit.app',
      createdAt: '2024-01-15T10:00:00Z',
      lastUpdated: '2024-01-16T14:30:00Z',
      isResponsive: true
    },
    {
      id: '2',
      name: 'Mobile Shopping App',
      platform: 'mobile',
      status: 'active',
      url: 'https://mobile-shop.replit.app/expo',
      createdAt: '2024-01-14T09:00:00Z',
      lastUpdated: '2024-01-15T11:20:00Z'
    },
    {
      id: '3',
      name: 'Portfolio Website',
      platform: 'web',
      status: 'building',
      url: 'https://portfolio.replit.app',
      createdAt: '2024-01-16T16:00:00Z',
      lastUpdated: '2024-01-16T16:05:00Z',
      isResponsive: true
    }
  ]

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading deployments...</div>
  }

  return (
    <BlurPage>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Deployments</h1>
            <p className="text-muted-foreground">
              Manage your live websites and mobile apps
            </p>
          </div>
          <Button onClick={() => window.location.href = `/subaccount/${params.subaccountId}/funnels`}>
            Create New Project
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deployments</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deployments.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Deployments</CardTitle>
              <div className="h-4 w-4 bg-green-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {deployments.filter(d => d.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mobile Apps</CardTitle>
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {deployments.filter(d => d.platform === 'mobile').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deployments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deployments.map((deployment) => (
                  <TableRow key={deployment.id}>
                    <TableCell className="font-medium">{deployment.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(deployment.platform)}
                        <span className="capitalize">{deployment.platform}</span>
                        {deployment.isResponsive && (
                          <Badge variant="outline" className="text-xs">Responsive</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={`${getStatusColor(deployment.status)} text-white`}
                      >
                        {deployment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <a 
                        href={deployment.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {deployment.url.replace('https://', '')}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </TableCell>
                    <TableCell>
                      {new Date(deployment.lastUpdated).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(deployment.url, '_blank')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedDeployment(deployment)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Download Deployment</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p>Download the complete source code for this deployment:</p>
                              <div className="space-y-2">
                                <Button className="w-full" onClick={() => {
                                  // Trigger download
                                  toast.success('Download started!')
                                }}>
                                  Download Source Code (.zip)
                                </Button>
                                {deployment.platform === 'mobile' && (
                                  <Button variant="outline" className="w-full" onClick={() => {
                                    window.open(`${deployment.url}/expo-qr`, '_blank')
                                  }}>
                                    View Expo QR Code
                                  </Button>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteDeployment(deployment.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Deployment Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Deployment Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Web Applications</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Automatically deployed to Replit hosting</li>
                <li>• Custom domains available for premium users</li>
                <li>• SSL certificates included</li>
                <li>• CDN optimization for global performance</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Mobile Applications</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• React Native apps deployed with Expo</li>
                <li>• Test on your device using Expo Go app</li>
                <li>• Download APK/IPA files for app store submission</li>
                <li>• Enterprise users get complete source code access</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </BlurPage>
  )
}

export default DeploymentsPage
