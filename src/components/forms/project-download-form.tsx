'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Download, 
  Code, 
  Smartphone, 
  Globe,
  FileText, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Folder,
  Package,
  Zap,
  Star,
  Crown,
  ArrowRight,
  Github,
  Settings
} from 'lucide-react'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ProjectDownloadCardProps {
  funnelId: string
  subaccountId: string
  funnelName: string
}

interface DownloadOption {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  platform: 'web' | 'mobile' | 'docs'
  format: string
  size: string
  premium: boolean
  features: string[]
}

const ProjectDownloadCard: React.FC<ProjectDownloadCardProps> = ({ 
  funnelId, 
  subaccountId,
  funnelName
}) => {
  const [isDownloading, setIsDownloading] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState('web')
  const [includeAssets, setIncludeAssets] = useState(true)
  const [includeDatabase, setIncludeDatabase] = useState(true)
  const [minifyCode, setMinifyCode] = useState(false)

  const downloadOptions: DownloadOption[] = [
    {
      id: 'nextjs-typescript',
      name: 'Next.js + TypeScript',
      description: 'Professional React application with TypeScript, Tailwind CSS, and shadcn/ui',
      icon: <Globe className="h-5 w-5 text-blue-600" />,
      platform: 'web',
      format: 'ZIP',
      size: '~2.1 MB',
      premium: false,
      features: ['TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Modern Components', 'Responsive Design']
    },
    {
      id: 'react-native-expo',
      name: 'React Native + Expo',
      description: 'Professional mobile app with React Native Paper, navigation, and animations',
      icon: <Smartphone className="h-5 w-5 text-green-600" />,
      platform: 'mobile',
      format: 'ZIP',
      size: '~3.4 MB',
      premium: true,
      features: ['React Native Paper', 'Navigation', 'Animations', 'Gesture Handler', 'Professional UI']
    },
    {
      id: 'project-docs',
      name: 'Documentation Bundle',
      description: 'Complete project documentation with setup guides and API references',
      icon: <FileText className="h-5 w-5 text-purple-600" />,
      platform: 'docs',
      format: 'PDF + MD',
      size: '~1.2 MB',
      premium: false,
      features: ['Setup Guide', 'Component Docs', 'API Reference', 'Deployment Guide', 'Best Practices']
    }
  ]

  const handleDownload = async (option: DownloadOption) => {
    if (option.premium) {
      toast.error('Premium subscription required for this download option')
      return
    }

    setIsDownloading(true)
    try {
      const response = await fetch('/api/code/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          funnelId,
          platform: option.platform,
          format: option.id,
          options: {
            includeAssets,
            includeDatabase,
            minifyCode,
            typescript: true
          }
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Download failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${funnelName.toLowerCase().replace(/\s+/g, '-')}-${option.id}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success(`${option.name} project downloaded successfully!`)
    } catch (error: any) {
      toast.error(error.message || 'Download failed')
    } finally {
      setIsDownloading(false)
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'web':
        return <Globe className="h-4 w-4" />
      case 'mobile':
        return <Smartphone className="h-4 w-4" />
      case 'docs':
        return <FileText className="h-4 w-4" />
      default:
        return <Code className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-full border-l-4 border-l-green-500">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
            <Download className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Project Export</CardTitle>
            <CardDescription>
              Download professional source code with modern structure
            </CardDescription>
          </div>
        </div>
        <Separator />
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="web" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Web App
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Mobile App
            </TabsTrigger>
            <TabsTrigger value="docs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documentation
            </TabsTrigger>
          </TabsList>

          {/* Download Options */}
          <div className="mt-6 space-y-4">
            {downloadOptions
              .filter(option => option.platform === selectedPlatform)
              .map((option) => (
                <div 
                  key={option.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {option.icon}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{option.name}</h4>
                          {option.premium && (
                            <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                              <Crown className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{option.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-gray-500">{option.format}</div>
                        <div className="text-xs font-medium">{option.size}</div>
                      </div>
                      <Button
                        onClick={() => handleDownload(option)}
                        disabled={isDownloading}
                        size="sm"
                        className={`${
                          option.premium 
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600' 
                            : 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700'
                        }`}
                      >
                        {isDownloading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {option.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
          </div>

          {/* Export Options */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Export Options
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Include Assets</Label>
                  <p className="text-xs text-gray-500">Include images, fonts, and media files</p>
                </div>
                <Switch
                  checked={includeAssets}
                  onCheckedChange={setIncludeAssets}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Database Schema</Label>
                  <p className="text-xs text-gray-500">Include database migrations and schemas</p>
                </div>
                <Switch
                  checked={includeDatabase}
                  onCheckedChange={setIncludeDatabase}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Minify Code</Label>
                  <p className="text-xs text-gray-500">Optimize and compress the generated code</p>
                </div>
                <Switch
                  checked={minifyCode}
                  onCheckedChange={setMinifyCode}
                />
              </div>
            </div>
          </div>

          {/* Professional Features */}
          <div className="mt-6 p-4 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">Professional Features Included</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-blue-700">
                <CheckCircle className="h-4 w-4" />
                Modern UI Components
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <CheckCircle className="h-4 w-4" />
                TypeScript Support
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <CheckCircle className="h-4 w-4" />
                Responsive Design
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <CheckCircle className="h-4 w-4" />
                SEO Optimized
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <CheckCircle className="h-4 w-4" />
                Production Ready
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <CheckCircle className="h-4 w-4" />
                Best Practices
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-sm">Project Structure</h5>
                  <p className="text-xs text-gray-500">Industry-standard folder organization</p>
                </div>
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-gray-600" />
                  <span className="text-xs text-gray-600">Professional</span>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Upgrade */}
          {selectedPlatform === 'mobile' && (
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Premium Mobile Apps</h4>
                    <p className="text-sm text-yellow-700">Advanced React Native features with professional UI</p>
                  </div>
                </div>
                <Button variant="outline" className="border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                  Upgrade Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default ProjectDownloadCard