
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Smartphone, Tablet, Monitor, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobilePreviewProps {
  elements: any[]
  styles: any
}

const MobilePreview: React.FC<MobilePreviewProps> = ({ elements, styles }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentDevice, setCurrentDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile')
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')

  const deviceSizes = {
    mobile: {
      portrait: { width: 375, height: 667 },
      landscape: { width: 667, height: 375 }
    },
    tablet: {
      portrait: { width: 768, height: 1024 },
      landscape: { width: 1024, height: 768 }
    },
    desktop: {
      portrait: { width: 1920, height: 1080 },
      landscape: { width: 1920, height: 1080 }
    }
  }

  const currentSize = deviceSizes[currentDevice][orientation]

  const renderPreviewContent = () => {
    return (
      <div className="p-4 space-y-4">
        {elements.map((element, index) => (
          <div
            key={index}
            className={cn(
              "border rounded-lg p-4",
              currentDevice === 'mobile' && "text-sm",
              currentDevice === 'tablet' && "text-base",
              currentDevice === 'desktop' && "text-lg"
            )}
            style={{
              ...element.styles,
              // Apply responsive styles based on current device
              ...(currentDevice === 'mobile' && {
                fontSize: '14px',
                padding: '12px',
                margin: '8px 0'
              }),
              ...(currentDevice === 'tablet' && {
                fontSize: '16px',
                padding: '16px',
                margin: '12px 0'
              })
            }}
          >
            <h3 className="font-semibold">{element.name || element.type}</h3>
            <p className="text-muted-foreground">
              {element.content?.[0]?.text || `${element.type} component preview`}
            </p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Smartphone className="w-4 h-4" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Responsive Preview
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Device Controls */}
          <div className="flex items-center justify-between">
            <Tabs value={currentDevice} onValueChange={(value: any) => setCurrentDevice(value)}>
              <TabsList>
                <TabsTrigger value="mobile" className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Mobile
                </TabsTrigger>
                <TabsTrigger value="tablet" className="flex items-center gap-2">
                  <Tablet className="w-4 h-4" />
                  Tablet
                </TabsTrigger>
                <TabsTrigger value="desktop" className="flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Desktop
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {orientation === 'portrait' ? 'Portrait' : 'Landscape'}
            </Button>
          </div>
          
          {/* Device Info */}
          <div className="text-sm text-muted-foreground">
            {currentDevice.charAt(0).toUpperCase() + currentDevice.slice(1)} - {currentSize.width} x {currentSize.height}px
          </div>
          
          {/* Preview Frame */}
          <div className="flex justify-center">
            <div
              className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg"
              style={{
                width: Math.min(currentSize.width * 0.5, 800),
                height: Math.min(currentSize.height * 0.5, 600),
                aspectRatio: `${currentSize.width}/${currentSize.height}`
              }}
            >
              <div className="h-full overflow-auto">
                {renderPreviewContent()}
              </div>
            </div>
          </div>
          
          {/* Responsive Tips */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Responsive Design Tips</h4>
            <ul className="text-sm space-y-1 text-blue-700">
              <li>• Use flexible layouts with CSS Grid and Flexbox</li>
              <li>• Implement touch-friendly button sizes (minimum 44px)</li>
              <li>• Optimize images for different screen densities</li>
              <li>• Test forms and navigation on actual devices</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MobilePreview
