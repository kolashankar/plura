'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Eye, 
  EyeOff, 
  Monitor,
  Smartphone,
  Tablet,
  Play,
  Pause,
  RefreshCw,
  Settings,
  Globe,
  Lock,
  Users,
  Zap,
  ExternalLink,
  Database,
  Navigation,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Maximize,
  ArrowLeft
} from 'lucide-react'
import { useEditor } from '@/providers/editor/editor-provider'
import { cn } from '@/lib/utils'
import { getFunnel, getFunnelPageDetails } from '@/lib/queries'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type Props = {}

const PreviewTab = (props: Props) => {
  const { state, dispatch, funnelId, subaccountId, pageDetails } = useEditor()
  const router = useRouter()
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(5)
  const [previewUrl, setPreviewUrl] = useState('')
  const [seoPreview, setSeoPreview] = useState(false)
  const [performanceMode, setPerformanceMode] = useState(false)
  const [accessibilityCheck, setAccessibilityCheck] = useState(false)
  const [deviceSimulation, setDeviceSimulation] = useState('desktop')
  const [networkThrottle, setNetworkThrottle] = useState('fast')
  const [fullScreenPreview, setFullScreenPreview] = useState(false)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [funnelPages, setFunnelPages] = useState<any[]>([])
  const [previewData, setPreviewData] = useState<any>(null)
  const [databaseConnected, setDatabaseConnected] = useState(false)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)

  // Load funnel pages and setup preview data
  useEffect(() => {
    const loadFunnelData = async () => {
      if (funnelId) {
        try {
          const funnelData = await getFunnel(funnelId)
          if (funnelData?.FunnelPages) {
            setFunnelPages(funnelData.FunnelPages)
            // Find current page index
            const currentIndex = funnelData.FunnelPages.findIndex(
              page => page.id === pageDetails?.id
            )
            setCurrentPageIndex(currentIndex >= 0 ? currentIndex : 0)
          }
        } catch (error) {
          console.error('Error loading funnel data:', error)
        }
      }
    }
    loadFunnelData()
  }, [funnelId, pageDetails?.id])

  // Auto refresh functionality
  useEffect(() => {
    if (autoRefresh && state.editor.previewMode) {
      const interval = setInterval(() => {
        handleRefresh()
      }, refreshInterval * 1000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval, state.editor.previewMode])

  const handlePreviewToggle = () => {
    dispatch({ type: 'TOGGLE_PREVIEW_MODE' })
    dispatch({ type: 'TOGGLE_LIVE_MODE' })
  }

  const handleDeviceChange = (device: string) => {
    setDeviceSimulation(device)
    dispatch({
      type: 'CHANGE_DEVICE',
      payload: { device: device as 'Desktop' | 'Tablet' | 'Mobile' },
    })
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleFullScreenPreview = async () => {
    setIsLoadingPreview(true)
    try {
      // Load current page data with real database connectivity
      if (pageDetails?.id) {
        const pageData = await getFunnelPageDetails(pageDetails.id)
        setPreviewData(pageData)
      }
      setFullScreenPreview(true)
      toast.success('Full preview mode activated with real data')
    } catch (error) {
      toast.error('Failed to load preview data')
    } finally {
      setIsLoadingPreview(false)
    }
  }

  const navigateToPage = useCallback(async (direction: 'prev' | 'next') => {
    if (funnelPages.length === 0) return
    
    let newIndex
    if (direction === 'next') {
      newIndex = currentPageIndex < funnelPages.length - 1 ? currentPageIndex + 1 : 0
    } else {
      newIndex = currentPageIndex > 0 ? currentPageIndex - 1 : funnelPages.length - 1
    }
    
    const targetPage = funnelPages[newIndex]
    if (targetPage) {
      setCurrentPageIndex(newIndex)
      // Navigate to the new page
      router.push(`/subaccount/${subaccountId}/funnels/${funnelId}/editor/${targetPage.id}`)
      toast.success(`Navigated to ${targetPage.name}`)
    }
  }, [currentPageIndex, funnelPages, router, subaccountId, funnelId])

  const checkDatabaseConnection = async () => {
    try {
      const response = await fetch(`/api/database/connect?subaccountId=${subaccountId}`)
      const databases = await response.json()
      setDatabaseConnected(databases.length > 0)
      if (databases.length > 0) {
        toast.success('Database connection verified')
      } else {
        toast.error('No database connections found')
      }
    } catch (error) {
      setDatabaseConnected(false)
      toast.error('Failed to check database connection')
    }
  }

  const handleLiveDemo = () => {
    // Open live demo in new tab with full functionality
    const demoUrl = `/api/funnel/preview/${funnelId}?page=${pageDetails?.id}&live=true`
    window.open(demoUrl, '_blank')
    toast.success('Live demo opened in new tab')
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Enhanced Preview Controls */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Eye size={20} />
            Enhanced Preview Mode
          </CardTitle>
          <CardDescription>
            Test your funnel with complete functionality, page redirections, and real data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Preview Controls */}
          <div className="flex items-center justify-between">
            <Label htmlFor="preview-mode">Preview Mode</Label>
            <Switch
              id="preview-mode"
              checked={state.editor.previewMode}
              onCheckedChange={handlePreviewToggle}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handlePreviewToggle}
              variant={state.editor.previewMode ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              {state.editor.previewMode ? <Pause size={16} /> : <Play size={16} />}
              {state.editor.previewMode ? 'Exit Preview' : 'Start Preview'}
            </Button>
            <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-2">
              <RefreshCw size={16} />
              Refresh
            </Button>
          </div>

          {/* Full Screen Preview */}
          <div className="flex gap-2">
            <Button
              onClick={handleFullScreenPreview}
              disabled={isLoadingPreview}
              className="flex-1 flex items-center gap-2"
              variant="secondary"
            >
              <Maximize size={16} />
              {isLoadingPreview ? 'Loading...' : 'Full Screen Preview'}
            </Button>
            <Button
              onClick={handleLiveDemo}
              className="flex items-center gap-2"
              variant="outline"
            >
              <ExternalLink size={16} />
              Live Demo
            </Button>
          </div>

          {/* Navigation Controls */}
          {funnelPages.length > 1 && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Navigation size={16} />
                Page Navigation ({currentPageIndex + 1} of {funnelPages.length})
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => navigateToPage('prev')}
                  variant="outline"
                  size="sm"
                  disabled={funnelPages.length <= 1}
                >
                  <ChevronLeft size={16} />
                  Previous
                </Button>
                <div className="flex-1 text-center text-sm text-muted-foreground">
                  {funnelPages[currentPageIndex]?.name || 'Current Page'}
                </div>
                <Button
                  onClick={() => navigateToPage('next')}
                  variant="outline"
                  size="sm"
                  disabled={funnelPages.length <= 1}
                >
                  Next
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* Database Connection Status */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Database size={16} className={databaseConnected ? 'text-green-500' : 'text-gray-400'} />
              <Label>Real Data Connection</Label>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={databaseConnected ? "default" : "secondary"}>
                {databaseConnected ? 'Connected' : 'Disconnected'}
              </Badge>
              <Button
                onClick={checkDatabaseConnection}
                variant="outline"
                size="sm"
              >
                Test
              </Button>
            </div>
          </div>

          <Separator />

          {/* Device Simulation */}
          <div className="space-y-2">
            <Label>Device Simulation</Label>
            <Tabs value={deviceSimulation} onValueChange={handleDeviceChange}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="Desktop" className="flex items-center gap-2">
                  <Monitor size={16} />
                  Desktop
                </TabsTrigger>
                <TabsTrigger value="Tablet" className="flex items-center gap-2">
                  <Tablet size={16} />
                  Tablet
                </TabsTrigger>
                <TabsTrigger value="Mobile" className="flex items-center gap-2">
                  <Smartphone size={16} />
                  Mobile
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Separator />

          {/* Auto Refresh */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-refresh">Auto Refresh</Label>
              <Switch
                id="auto-refresh"
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
              />
            </div>
            {autoRefresh && (
              <div className="flex items-center gap-2">
                <Label className="text-sm text-muted-foreground">Interval (seconds):</Label>
                <Input
                  type="number"
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="w-20"
                  min="1"
                  max="60"
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Network Throttling */}
          <div className="space-y-2">
            <Label>Network Throttling</Label>
            <Select value={networkThrottle} onValueChange={setNetworkThrottle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fast">Fast 3G</SelectItem>
                <SelectItem value="slow">Slow 3G</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="none">No Throttling</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Device Simulation */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Monitor size={20} />
            Device & Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Device Simulation</Label>
            <Tabs value={deviceSimulation} onValueChange={handleDeviceChange}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="Desktop" className="flex items-center gap-2">
                  <Monitor size={16} />
                  Desktop
                </TabsTrigger>
                <TabsTrigger value="Tablet" className="flex items-center gap-2">
                  <Tablet size={16} />
                  Tablet
                </TabsTrigger>
                <TabsTrigger value="Mobile" className="flex items-center gap-2">
                  <Smartphone size={16} />
                  Mobile
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Auto Refresh */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-refresh">Auto Refresh</Label>
              <Switch
                id="auto-refresh"
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
              />
            </div>
            {autoRefresh && (
              <div className="flex items-center gap-2">
                <Label className="text-sm text-muted-foreground">Interval (seconds):</Label>
                <Input
                  type="number"
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="w-20"
                  min="1"
                  max="60"
                />
              </div>
            )}
          </div>

          {/* Network Throttling */}
          <div className="space-y-2">
            <Label>Network Throttling</Label>
            <Select value={networkThrottle} onValueChange={setNetworkThrottle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fast">Fast 3G</SelectItem>
                <SelectItem value="slow">Slow 3G</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="none">No Throttling</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings size={20} />
            Advanced Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* SEO Preview */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe size={16} />
              <Label htmlFor="seo-preview">SEO Preview</Label>
            </div>
            <Switch
              id="seo-preview"
              checked={seoPreview}
              onCheckedChange={setSeoPreview}
            />
          </div>

          {/* Performance Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={16} />
              <Label htmlFor="performance-mode">Performance Mode</Label>
            </div>
            <Switch
              id="performance-mode"
              checked={performanceMode}
              onCheckedChange={setPerformanceMode}
            />
          </div>

          {/* Accessibility Check */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={16} />
              <Label htmlFor="accessibility-check">Accessibility Check</Label>
            </div>
            <Switch
              id="accessibility-check"
              checked={accessibilityCheck}
              onCheckedChange={setAccessibilityCheck}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Preview Status:</span>
              <Badge variant={state.editor.previewMode ? "default" : "secondary"}>
                {state.editor.previewMode ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Device:</span>
              <Badge variant="outline">{state.editor.device}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Live Mode:</span>
              <Badge variant={state.editor.liveMode ? "default" : "secondary"}>
                {state.editor.liveMode ? "On" : "Off"}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pages:</span>
              <Badge variant="outline">{funnelPages.length} pages</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full Screen Preview Dialog */}
      <Dialog open={fullScreenPreview} onOpenChange={setFullScreenPreview}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] h-[95vh] p-0">
          <DialogHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Eye size={20} />
                Full Screen Preview - {pageDetails?.name}
              </DialogTitle>
              <div className="flex items-center gap-2">
                {funnelPages.length > 1 && (
                  <>
                    <Button
                      onClick={() => navigateToPage('prev')}
                      variant="outline"
                      size="sm"
                    >
                      <ChevronLeft size={16} />
                      Prev
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {currentPageIndex + 1}/{funnelPages.length}
                    </span>
                    <Button
                      onClick={() => navigateToPage('next')}
                      variant="outline"
                      size="sm"
                    >
                      Next
                      <ChevronRight size={16} />
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => setFullScreenPreview(false)}
                  variant="outline"
                  size="sm"
                >
                  <ArrowLeft size={16} />
                  Back to Editor
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden bg-white">
            {previewData ? (
              <div className="h-full w-full">
                <iframe
                  src={`/api/funnel/preview/${funnelId}?page=${pageDetails?.id}&live=true&embedded=true`}
                  className="w-full h-full border-0"
                  title="Funnel Preview"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <RefreshCw className="mx-auto h-12 w-12 text-muted-foreground animate-spin" />
                  <p className="mt-2 text-muted-foreground">Loading preview with real data...</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PreviewTab