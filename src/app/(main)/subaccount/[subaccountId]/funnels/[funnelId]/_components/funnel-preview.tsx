'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Eye, 
  Monitor, 
  Smartphone, 
  Tablet, 
  ExternalLink,
  RefreshCw,
  Globe,
  Layers,
  Navigation
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { FunnelPage } from '@prisma/client'

interface FunnelPreviewProps {
  funnelId: string
  subaccountId: string
  funnelName: string
  subDomainName?: string
}

interface PageWithOrder extends FunnelPage {
  order: number
}

const FunnelPreview: React.FC<FunnelPreviewProps> = ({
  funnelId,
  subaccountId,
  funnelName,
  subDomainName
}) => {
  const [pages, setPages] = useState<PageWithOrder[]>([])
  const [selectedPage, setSelectedPage] = useState<string>('')
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const fetchPages = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/funnels/${funnelId}/pages`)
        if (response.ok) {
          const data = await response.json()
          setPages(data.sort((a: PageWithOrder, b: PageWithOrder) => a.order - b.order))
          if (data.length > 0) {
            setSelectedPage(data[0].id)
          }
        }
      } catch (error) {
        console.error('Failed to fetch pages:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPages()
  }, [funnelId])

  const getDeviceFrameClass = () => {
    switch (device) {
      case 'mobile':
        return 'w-[375px] h-[667px]'
      case 'tablet':
        return 'w-[768px] h-[1024px]'
      default:
        return 'w-full h-[800px]'
    }
  }

  const getDeviceIcon = () => {
    switch (device) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />
      case 'tablet':
        return <Tablet className="w-4 h-4" />
      default:
        return <Monitor className="w-4 h-4" />
    }
  }

  const previewUrl = selectedPage 
    ? `/${subDomainName}/${pages.find(p => p.id === selectedPage)?.pathName || ''}`
    : `/${subDomainName}`

  const refreshPreview = () => {
    setIsRefreshing(true)
    const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement
    if (iframe) {
      iframe.src = iframe.src
    }
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const openInNewTab = () => {
    window.open(previewUrl, '_blank')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Preview Funnel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {funnelName} Preview
              </DialogTitle>
              <DialogDescription>
                Preview your complete funnel as users will experience it
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshPreview}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={openInNewTab}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex h-full">
          {/* Sidebar with page navigation */}
          <div className="w-64 border-r bg-muted/30 p-4 space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Funnel Pages
              </h4>
              <div className="space-y-2">
                {pages.map((page, index) => (
                  <div
                    key={page.id}
                    className={`p-2 rounded-md cursor-pointer border transition-colors ${
                      selectedPage === page.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-background hover:bg-muted'
                    }`}
                    onClick={() => setSelectedPage(page.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs px-1">
                          {index + 1}
                        </Badge>
                        <span className="text-sm font-medium">{page.name}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      /{page.pathName}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                Device Preview
              </h4>
              <Select value={device} onValueChange={(value: any) => setDevice(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desktop" className="flex items-center gap-2">
                    Desktop
                  </SelectItem>
                  <SelectItem value="tablet" className="flex items-center gap-2">
                    Tablet
                  </SelectItem>
                  <SelectItem value="mobile" className="flex items-center gap-2">
                    Mobile
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-xs text-muted-foreground">
              <p className="font-medium">Current URL:</p>
              <p className="break-all bg-muted p-2 rounded mt-1">
                {previewUrl}
              </p>
            </div>
          </div>

          {/* Preview area */}
          <div className="flex-1 p-4">
            <div className="h-full flex flex-col">
              {/* Device frame header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getDeviceIcon()}
                  <span className="font-medium capitalize">{device} Preview</span>
                  <Badge variant="secondary" className="text-xs">
                    {selectedPage ? pages.find(p => p.id === selectedPage)?.name : 'All Pages'}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {pages.length} page{pages.length !== 1 ? 's' : ''} in funnel
                </div>
              </div>

              {/* Preview iframe */}
              <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-lg p-4">
                <div className={`${getDeviceFrameClass()} border rounded-lg overflow-hidden bg-white shadow-lg`}>
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto" />
                        <p className="text-sm text-muted-foreground">Loading preview...</p>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      id="preview-iframe"
                      src={previewUrl}
                      className="w-full h-full"
                      title={`${funnelName} Preview`}
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FunnelPreview