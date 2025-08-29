'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Code, Download, Package, Zap, Crown } from 'lucide-react'
import { toast } from 'sonner'

interface CodeExportIntegrationProps {
  funnelId: string
  funnelName: string
  isPremium?: boolean
}

const exportServices = [
  {
    id: 'teleport-hq',
    name: 'TeleportHQ',
    description: 'Export to React, Vue, Angular, and more',
    frameworks: ['React', 'Vue', 'Angular', 'Next.js'],
    icon: '🚀',
    premium: true,
  },
  {
    id: 'plasmic',
    name: 'Plasmic',
    description: 'Visual development platform with code export',
    frameworks: ['React', 'Next.js', 'Gatsby'],
    icon: '⚡',
    premium: true,
  },
  {
    id: 'builder-io',
    name: 'Builder.io',
    description: 'Export to any framework or CMS',
    frameworks: ['React', 'Vue', 'Angular', 'Svelte'],
    icon: '🔧',
    premium: true,
  },
  {
    id: 'sandpack',
    name: 'Sandpack',
    description: 'Interactive code playground integration',
    frameworks: ['React', 'Vanilla JS', 'TypeScript'],
    icon: '📦',
    premium: false,
  },
  {
    id: 'custom-react',
    name: 'Custom React Export',
    description: 'Professional React components with TypeScript',
    frameworks: ['React', 'TypeScript', 'Tailwind CSS'],
    icon: '⚛️',
    premium: true,
  },
]

const CodeExportIntegration: React.FC<CodeExportIntegrationProps> = ({
  funnelId,
  funnelName,
  isPremium = false
}) => {
  const [selectedService, setSelectedService] = useState('')
  const [selectedFramework, setSelectedFramework] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  const selectedServiceData = exportServices.find(service => service.id === selectedService)

  const handleExport = async () => {
    if (!selectedService || !selectedFramework) {
      toast.error('Please select a service and framework')
      return
    }

    const service = exportServices.find(s => s.id === selectedService)
    if (service?.premium && !isPremium) {
      toast.error('Premium subscription required for this export service')
      return
    }

    setIsExporting(true)
    try {
      // Mock export process - In real implementation, this would:
      // 1. Convert funnel pages to clean HTML/CSS
      // 2. Generate framework-specific components
      // 3. Package with proper folder structure
      // 4. Export via selected third-party service
      
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      toast.success(`Code exported successfully via ${service?.name}!`)
      
      // Mock download trigger
      const mockExportData = {
        service: service?.name,
        framework: selectedFramework,
        funnelName,
        timestamp: new Date(),
        components: ['Header', 'Hero', 'Features', 'Footer'],
        assets: ['styles.css', 'images/', 'scripts.js'],
      }
      
      console.log('Export completed:', mockExportData)
      
    } catch (error) {
      toast.error('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            <CardTitle>Code Export</CardTitle>
            {!isPremium && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Crown className="h-3 w-3" />
                Premium Required
              </Badge>
            )}
          </div>
          <CardDescription>
            Export your funnel &quot;{funnelName}&quot; to production-ready code using professional services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Export Service Selection */}
          <div className="space-y-4">
            <h4 className="font-semibold">Select Export Service</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exportServices.map((service) => (
                <Card 
                  key={service.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedService === service.id ? 'ring-2 ring-primary' : ''
                  } ${service.premium && !isPremium ? 'opacity-50' : ''}`}
                  onClick={() => {
                    if (!service.premium || isPremium) {
                      setSelectedService(service.id)
                      setSelectedFramework('')
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{service.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium">{service.name}</h5>
                          {service.premium && (
                            <Badge variant="secondary" className="text-xs">Premium</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {service.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {service.frameworks.slice(0, 3).map((framework) => (
                            <Badge key={framework} variant="outline" className="text-xs">
                              {framework}
                            </Badge>
                          ))}
                          {service.frameworks.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{service.frameworks.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Framework Selection */}
          {selectedServiceData && (
            <div className="space-y-2">
              <h4 className="font-semibold">Select Framework</h4>
              <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your target framework" />
                </SelectTrigger>
                <SelectContent>
                  {selectedServiceData.frameworks.map((framework) => (
                    <SelectItem key={framework} value={framework}>
                      {framework}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Export Button */}
          <div className="pt-4 border-t">
            <Button 
              onClick={handleExport}
              disabled={!selectedService || !selectedFramework || isExporting || (selectedServiceData?.premium && !isPremium)}
              className="w-full"
              size="lg"
            >
              {isExporting ? (
                <>
                  <Package className="w-4 h-4 mr-2 animate-spin" />
                  Exporting... This may take a few minutes
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Code
                </>
              )}
            </Button>
            
            {selectedServiceData?.premium && !isPremium && (
              <p className="text-sm text-center text-muted-foreground mt-2">
                Upgrade to Premium to access professional code export services
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Export Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Export Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="font-medium">✅ Included in Export</h5>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Clean, semantic HTML structure</li>
                <li>• Responsive CSS with mobile support</li>
                <li>• Framework-specific components</li>
                <li>• Optimized images and assets</li>
                <li>• Professional folder structure</li>
                <li>• TypeScript definitions (when supported)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">🚀 Premium Features</h5>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Advanced component optimization</li>
                <li>• Custom styling framework integration</li>
                <li>• API integration templates</li>
                <li>• Performance optimizations</li>
                <li>• SEO meta tags and structured data</li>
                <li>• Professional documentation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CodeExportIntegration