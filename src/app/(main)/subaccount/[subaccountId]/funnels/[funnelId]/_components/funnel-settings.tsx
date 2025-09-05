'use client'

import React, { useState, useEffect } from 'react'
import { Funnel } from '@prisma/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Globe, 
  Search, 
  Zap, 
  Shield, 
  Code, 
  Download, 
  Bell, 
  Settings,
  Save,
  Eye,
  ExternalLink,
  Database,
  Palette
} from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import FunnelProductsTable from './funnel-products-table'
import DatabaseConnectionCard from '@/components/forms/database-connection-form'
import ProjectDownloadCard from '@/components/forms/project-download-form'
import ThemeMarketplaceCard from '@/components/forms/theme-marketplace-form'

interface FunnelSettingsProps {
  subaccountId: string
  defaultData: Funnel
}

interface FunnelSettingsData {
  // SEO Settings
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  ogImage: string
  customFavicon: string
  
  // Analytics Settings
  googleAnalyticsId: string
  facebookPixelId: string
  customAnalyticsCode: string
  
  // Performance Settings
  enableCaching: boolean
  enableCompression: boolean
  enableLazyLoading: boolean
  
  // Security Settings
  enableSSL: boolean
  enableCsrfProtection: boolean
  allowedOrigins: string
  
  // Custom Code Settings
  customCss: string
  customJs: string
  customHeadCode: string
  customBodyCode: string
  
  // Domain Settings
  customDomain: string
  subDomain: string
  enableWwwRedirect: boolean
  
  // Backup & Export Settings
  autoBackupEnabled: boolean
  backupFrequency: string
  exportFormat: string
  
  // Notification Settings
  emailNotifications: boolean
  slackWebhookUrl: string
  discordWebhookUrl: string
}

const FunnelSettings: React.FC<FunnelSettingsProps> = ({
  subaccountId,
  defaultData,
}) => {
  const [settings, setSettings] = useState<FunnelSettingsData>({
    metaTitle: defaultData.name || '',
    metaDescription: defaultData.description || '',
    metaKeywords: '',
    ogImage: '',
    customFavicon: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
    customAnalyticsCode: '',
    enableCaching: true,
    enableCompression: true,
    enableLazyLoading: true,
    enableSSL: true,
    enableCsrfProtection: true,
    allowedOrigins: '',
    customCss: '',
    customJs: '',
    customHeadCode: '',
    customBodyCode: '',
    customDomain: '',
    subDomain: defaultData.subDomainName || '',
    enableWwwRedirect: false,
    autoBackupEnabled: true,
    backupFrequency: 'daily',
    exportFormat: 'react',
    emailNotifications: true,
    slackWebhookUrl: '',
    discordWebhookUrl: ''
  })
  
  const [isSaving, setIsSaving] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)

  // Load existing settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch(`/api/funnel-settings/${defaultData.id}`)
        if (response.ok) {
          const data = await response.json()
          setSettings(prev => ({ ...prev, ...data }))
        }
      } catch (error) {
        console.error('Failed to load funnel settings:', error)
      }
    }
    loadSettings()
  }, [defaultData.id])

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/funnel-settings/${defaultData.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          funnelId: defaultData.id,
          subaccountId
        })
      })
      
      if (response.ok) {
        toast({
          title: "Settings Saved",
          description: "Your funnel settings have been successfully updated."
        })
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const previewFunnel = () => {
    setIsPreviewing(true)
    const previewUrl = `/${defaultData.subDomainName}`
    window.open(previewUrl, '_blank')
    setTimeout(() => setIsPreviewing(false), 1000)
  }

  const updateSetting = (key: keyof FunnelSettingsData, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Funnel Settings</h2>
          <p className="text-muted-foreground">Configure your funnel's advanced settings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={previewFunnel} disabled={isPreviewing}>
            <Eye className="w-4 h-4 mr-2" />
            {isPreviewing ? 'Opening...' : 'Preview'}
          </Button>
          <Button onClick={saveSettings} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="seo" className="w-full">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
          <TabsTrigger value="seo" className="flex items-center gap-1">
            <Search className="w-4 h-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1">
            <Zap className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-1">
            <Zap className="w-4 h-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="custom-code" className="flex items-center gap-1">
            <Code className="w-4 h-4" />
            Code
          </TabsTrigger>
          <TabsTrigger value="domain" className="flex items-center gap-1">
            <Globe className="w-4 h-4" />
            Domain
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            Backup
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1">
            <Bell className="w-4 h-4" />
            Alerts
          </TabsTrigger>
        </TabsList>

        {/* SEO Settings */}
        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                SEO Configuration
              </CardTitle>
              <CardDescription>
                Optimize your funnel for search engines and social media sharing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={settings.metaTitle}
                    onChange={(e) => updateSetting('metaTitle', e.target.value)}
                    placeholder="Enter page title for search engines"
                    maxLength={60}
                  />
                  <span className="text-xs text-muted-foreground">
                    {settings.metaTitle.length}/60 characters
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ogImage">Open Graph Image URL</Label>
                  <Input
                    id="ogImage"
                    value={settings.ogImage}
                    onChange={(e) => updateSetting('ogImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={settings.metaDescription}
                  onChange={(e) => updateSetting('metaDescription', e.target.value)}
                  placeholder="Brief description for search engines and social media"
                  maxLength={160}
                  rows={3}
                />
                <span className="text-xs text-muted-foreground">
                  {settings.metaDescription.length}/160 characters
                </span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  value={settings.metaKeywords}
                  onChange={(e) => updateSetting('metaKeywords', e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customFavicon">Custom Favicon URL</Label>
                <Input
                  id="customFavicon"
                  value={settings.customFavicon}
                  onChange={(e) => updateSetting('customFavicon', e.target.value)}
                  placeholder="https://example.com/favicon.ico"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Settings */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Analytics & Tracking
              </CardTitle>
              <CardDescription>
                Connect analytics services to track your funnel performance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                  <Input
                    id="googleAnalyticsId"
                    value={settings.googleAnalyticsId}
                    onChange={(e) => updateSetting('googleAnalyticsId', e.target.value)}
                    placeholder="G-XXXXXXXXXX or UA-XXXXXXXX-X"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                  <Input
                    id="facebookPixelId"
                    value={settings.facebookPixelId}
                    onChange={(e) => updateSetting('facebookPixelId', e.target.value)}
                    placeholder="123456789012345"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customAnalyticsCode">Custom Analytics Code</Label>
                <Textarea
                  id="customAnalyticsCode"
                  value={settings.customAnalyticsCode}
                  onChange={(e) => updateSetting('customAnalyticsCode', e.target.value)}
                  placeholder="Add custom tracking scripts (GTM, Hotjar, etc.)"
                  rows={4}
                />
                <span className="text-xs text-muted-foreground">
                  This code will be injected into the head section
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Settings */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Performance Optimization
              </CardTitle>
              <CardDescription>
                Configure performance settings to improve loading times.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enable Browser Caching</Label>
                  <p className="text-sm text-muted-foreground">
                    Cache static assets to improve load times
                  </p>
                </div>
                <Switch
                  checked={settings.enableCaching}
                  onCheckedChange={(checked) => updateSetting('enableCaching', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enable Gzip Compression</Label>
                  <p className="text-sm text-muted-foreground">
                    Compress files to reduce bandwidth usage
                  </p>
                </div>
                <Switch
                  checked={settings.enableCompression}
                  onCheckedChange={(checked) => updateSetting('enableCompression', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enable Lazy Loading</Label>
                  <p className="text-sm text-muted-foreground">
                    Load images and content as users scroll
                  </p>
                </div>
                <Switch
                  checked={settings.enableLazyLoading}
                  onCheckedChange={(checked) => updateSetting('enableLazyLoading', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Configuration
              </CardTitle>
              <CardDescription>
                Configure security settings to protect your funnel.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Force HTTPS/SSL</Label>
                  <p className="text-sm text-muted-foreground">
                    Redirect all HTTP traffic to HTTPS
                  </p>
                </div>
                <Switch
                  checked={settings.enableSSL}
                  onCheckedChange={(checked) => updateSetting('enableSSL', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>CSRF Protection</Label>
                  <p className="text-sm text-muted-foreground">
                    Protect against cross-site request forgery attacks
                  </p>
                </div>
                <Switch
                  checked={settings.enableCsrfProtection}
                  onCheckedChange={(checked) => updateSetting('enableCsrfProtection', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allowedOrigins">Allowed Origins (CORS)</Label>
                <Textarea
                  id="allowedOrigins"
                  value={settings.allowedOrigins}
                  onChange={(e) => updateSetting('allowedOrigins', e.target.value)}
                  placeholder="https://example.com, https://app.example.com"
                  rows={3}
                />
                <span className="text-xs text-muted-foreground">
                  One origin per line. Leave empty to allow all origins.
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Code Settings */}
        <TabsContent value="custom-code" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Custom Code Injection
              </CardTitle>
              <CardDescription>
                Add custom CSS, JavaScript, and HTML code to your funnel.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customCss">Custom CSS</Label>
                <Textarea
                  id="customCss"
                  value={settings.customCss}
                  onChange={(e) => updateSetting('customCss', e.target.value)}
                  placeholder="/* Custom CSS styles */&#10;.my-custom-class {&#10;  color: #333;&#10;}"
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customJs">Custom JavaScript</Label>
                <Textarea
                  id="customJs"
                  value={settings.customJs}
                  onChange={(e) => updateSetting('customJs', e.target.value)}
                  placeholder="// Custom JavaScript code&#10;console.log('Hello from custom JS!');"
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customHeadCode">Custom Head Code</Label>
                <Textarea
                  id="customHeadCode"
                  value={settings.customHeadCode}
                  onChange={(e) => updateSetting('customHeadCode', e.target.value)}
                  placeholder="<meta name='custom' content='value'>&#10;<link rel='stylesheet' href='custom.css'>"
                  rows={4}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customBodyCode">Custom Body Code</Label>
                <Textarea
                  id="customBodyCode"
                  value={settings.customBodyCode}
                  onChange={(e) => updateSetting('customBodyCode', e.target.value)}
                  placeholder="<script>&#10;// Code that runs at the end of body&#10;</script>"
                  rows={4}
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Domain Settings */}
        <TabsContent value="domain" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Domain Configuration
              </CardTitle>
              <CardDescription>
                Set up custom domains and subdomain settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customDomain">Custom Domain</Label>
                  <Input
                    id="customDomain"
                    value={settings.customDomain}
                    onChange={(e) => updateSetting('customDomain', e.target.value)}
                    placeholder="yourfunnel.com"
                  />
                  <span className="text-xs text-muted-foreground">
                    Configure DNS to point to our servers
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subDomain">Subdomain</Label>
                  <Input
                    id="subDomain"
                    value={settings.subDomain}
                    onChange={(e) => updateSetting('subDomain', e.target.value)}
                    placeholder="yourfunnel"
                  />
                  <span className="text-xs text-muted-foreground">
                    Will be: yourfunnel.yoursite.com
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>WWW Redirect</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically redirect www to non-www version
                  </p>
                </div>
                <Switch
                  checked={settings.enableWwwRedirect}
                  onCheckedChange={(checked) => updateSetting('enableWwwRedirect', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Backup & Export Settings
              </CardTitle>
              <CardDescription>
                Configure automatic backups and export preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto Backup</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically backup your funnel data
                  </p>
                </div>
                <Switch
                  checked={settings.autoBackupEnabled}
                  onCheckedChange={(checked) => updateSetting('autoBackupEnabled', checked)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select 
                    value={settings.backupFrequency} 
                    onValueChange={(value) => updateSetting('backupFrequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Every Hour</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="exportFormat">Default Export Format</Label>
                  <Select 
                    value={settings.exportFormat} 
                    onValueChange={(value) => updateSetting('exportFormat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="react">React/Next.js</SelectItem>
                      <SelectItem value="vue">Vue.js</SelectItem>
                      <SelectItem value="angular">Angular</SelectItem>
                      <SelectItem value="html">Static HTML</SelectItem>
                      <SelectItem value="wordpress">WordPress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how you want to receive alerts and notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email alerts for important events
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slackWebhookUrl">Slack Webhook URL</Label>
                <Input
                  id="slackWebhookUrl"
                  value={settings.slackWebhookUrl}
                  onChange={(e) => updateSetting('slackWebhookUrl', e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discordWebhookUrl">Discord Webhook URL</Label>
                <Input
                  id="discordWebhookUrl"
                  value={settings.discordWebhookUrl}
                  onChange={(e) => updateSetting('discordWebhookUrl', e.target.value)}
                  placeholder="https://discord.com/api/webhooks/..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Legacy Settings */}
      <div className="space-y-6">
        {/* Database Connection */}
        <DatabaseConnectionCard
          funnelId={defaultData.id}
          subaccountId={subaccountId}
        />

        {/* Project Download */}
        <div className="flex gap-4 flex-col xl:!flex-row">
          <ProjectDownloadCard
            funnelId={defaultData.id}
            subaccountId={subaccountId}
            funnelName={defaultData.name}
          />
          
          <ThemeMarketplaceCard
            funnelId={defaultData.id}
            subaccountId={subaccountId}
            funnelName={defaultData.name}
          />
        </div>
      </div>
    </div>
  )
}

export default FunnelSettings
