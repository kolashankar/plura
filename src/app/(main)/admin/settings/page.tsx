'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { 
  Settings,
  Save,
  RefreshCw,
  Globe,
  Mail,
  Shield,
  Palette,
  Code,
  Database
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type SystemSettings = {
  general: {
    siteName: string
    siteDescription: string
    defaultLanguage: string
    timezone: string
    maintenanceMode: boolean
  }
  email: {
    smtpHost: string
    smtpPort: number
    smtpUsername: string
    smtpPassword: string
    fromEmail: string
    fromName: string
  }
  security: {
    twoFactorRequired: boolean
    sessionTimeout: number
    passwordMinLength: number
    allowRegistration: boolean
    emailVerificationRequired: boolean
  }
  appearance: {
    primaryColor: string
    logoUrl: string
    faviconUrl: string
    customCss: string
  }
  api: {
    rateLimitEnabled: boolean
    rateLimitRequests: number
    rateLimitWindow: number
    webhookSecret: string
  }
  database: {
    backupFrequency: string
    retentionDays: number
    compressionEnabled: boolean
  }
}

const SettingsPage = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: 'Plura',
      siteDescription: 'Complete Website Builder SaaS Platform',
      defaultLanguage: 'en',
      timezone: 'UTC',
      maintenanceMode: false
    },
    email: {
      smtpHost: '',
      smtpPort: 587,
      smtpUsername: '',
      smtpPassword: '',
      fromEmail: 'noreply@plura.com',
      fromName: 'Plura'
    },
    security: {
      twoFactorRequired: false,
      sessionTimeout: 30,
      passwordMinLength: 8,
      allowRegistration: true,
      emailVerificationRequired: true
    },
    appearance: {
      primaryColor: '#0066cc',
      logoUrl: '',
      faviconUrl: '',
      customCss: ''
    },
    api: {
      rateLimitEnabled: true,
      rateLimitRequests: 100,
      rateLimitWindow: 60,
      webhookSecret: ''
    },
    database: {
      backupFrequency: 'daily',
      retentionDays: 30,
      compressionEnabled: true
    }
  })
  
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      // Mock fetch - replace with actual API call
      // const response = await fetch('/api/admin/settings')
      // const data = await response.json()
      // setSettings(data.settings)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch settings',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setLoading(true)
      // Mock save - replace with actual API call
      // await fetch('/api/admin/settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // })
      
      toast({
        title: 'Success',
        description: 'Settings saved successfully'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = (section: keyof SystemSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">Manage global system configuration</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={fetchSettings} variant="outline" disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button onClick={saveSettings} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.general.siteName}
                  onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.general.siteDescription}
                  onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="defaultLanguage">Default Language</Label>
                  <Select 
                    value={settings.general.defaultLanguage}
                    onValueChange={(value) => updateSetting('general', 'defaultLanguage', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={settings.general.timezone}
                    onValueChange={(value) => updateSetting('general', 'timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable to show maintenance page to users
                  </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.general.maintenanceMode}
                  onCheckedChange={(checked) => updateSetting('general', 'maintenanceMode', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.email.smtpHost}
                    onChange={(e) => updateSetting('email', 'smtpHost', e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={settings.email.smtpPort}
                    onChange={(e) => updateSetting('email', 'smtpPort', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    value={settings.email.smtpUsername}
                    onChange={(e) => updateSetting('email', 'smtpUsername', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.email.smtpPassword}
                    onChange={(e) => updateSetting('email', 'smtpPassword', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={settings.email.fromEmail}
                    onChange={(e) => updateSetting('email', 'fromEmail', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={settings.email.fromName}
                    onChange={(e) => updateSetting('email', 'fromName', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactorRequired">Require Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Force all users to enable 2FA
                  </p>
                </div>
                <Switch
                  id="twoFactorRequired"
                  checked={settings.security.twoFactorRequired}
                  onCheckedChange={(checked) => updateSetting('security', 'twoFactorRequired', checked)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowRegistration">Allow User Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to register accounts
                  </p>
                </div>
                <Switch
                  id="allowRegistration"
                  checked={settings.security.allowRegistration}
                  onCheckedChange={(checked) => updateSetting('security', 'allowRegistration', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailVerificationRequired">Require Email Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Users must verify email before account activation
                  </p>
                </div>
                <Switch
                  id="emailVerificationRequired"
                  checked={settings.security.emailVerificationRequired}
                  onCheckedChange={(checked) => updateSetting('security', 'emailVerificationRequired', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={settings.appearance.primaryColor}
                    onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                    className="w-20"
                  />
                  <Input
                    value={settings.appearance.primaryColor}
                    onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                    placeholder="#0066cc"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  value={settings.appearance.logoUrl}
                  onChange={(e) => updateSetting('appearance', 'logoUrl', e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              
              <div>
                <Label htmlFor="faviconUrl">Favicon URL</Label>
                <Input
                  id="faviconUrl"
                  value={settings.appearance.faviconUrl}
                  onChange={(e) => updateSetting('appearance', 'faviconUrl', e.target.value)}
                  placeholder="https://example.com/favicon.ico"
                />
              </div>
              
              <div>
                <Label htmlFor="customCss">Custom CSS</Label>
                <Textarea
                  id="customCss"
                  value={settings.appearance.customCss}
                  onChange={(e) => updateSetting('appearance', 'customCss', e.target.value)}
                  placeholder="/* Custom CSS styles */"
                  rows={10}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                API Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="rateLimitEnabled">Enable Rate Limiting</Label>
                  <p className="text-sm text-muted-foreground">
                    Limit API requests per time window
                  </p>
                </div>
                <Switch
                  id="rateLimitEnabled"
                  checked={settings.api.rateLimitEnabled}
                  onCheckedChange={(checked) => updateSetting('api', 'rateLimitEnabled', checked)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rateLimitRequests">Requests per Window</Label>
                  <Input
                    id="rateLimitRequests"
                    type="number"
                    value={settings.api.rateLimitRequests}
                    onChange={(e) => updateSetting('api', 'rateLimitRequests', parseInt(e.target.value))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="rateLimitWindow">Window Size (seconds)</Label>
                  <Input
                    id="rateLimitWindow"
                    type="number"
                    value={settings.api.rateLimitWindow}
                    onChange={(e) => updateSetting('api', 'rateLimitWindow', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="webhookSecret">Webhook Secret</Label>
                <Input
                  id="webhookSecret"
                  type="password"
                  value={settings.api.webhookSecret}
                  onChange={(e) => updateSetting('api', 'webhookSecret', e.target.value)}
                  placeholder="Generated webhook secret"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="backupFrequency">Backup Frequency</Label>
                <Select 
                  value={settings.database.backupFrequency}
                  onValueChange={(value) => updateSetting('database', 'backupFrequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="retentionDays">Backup Retention (days)</Label>
                <Input
                  id="retentionDays"
                  type="number"
                  value={settings.database.retentionDays}
                  onChange={(e) => updateSetting('database', 'retentionDays', parseInt(e.target.value))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compressionEnabled">Enable Backup Compression</Label>
                  <p className="text-sm text-muted-foreground">
                    Compress backups to save storage space
                  </p>
                </div>
                <Switch
                  id="compressionEnabled"
                  checked={settings.database.compressionEnabled}
                  onCheckedChange={(checked) => updateSetting('database', 'compressionEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SettingsPage