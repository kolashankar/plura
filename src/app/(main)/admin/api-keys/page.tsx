'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Key,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  RefreshCw,
  Calendar,
  Shield
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

type ApiKey = {
  id: string
  name: string
  key: string
  permissions: string[]
  status: 'active' | 'revoked'
  createdAt: string
  lastUsed?: string
  usageCount: number
}

const ApiKeysPage = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showKey, setShowKey] = useState<{ [key: string]: boolean }>({})
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newKeyData, setNewKeyData] = useState({ name: '', permissions: [] as string[] })
  const { toast } = useToast()

  const availablePermissions = [
    'read:users',
    'write:users',
    'read:agencies',
    'write:agencies',
    'read:automation',
    'write:automation',
    'read:marketplace',
    'write:marketplace',
    'read:financial',
    'write:financial',
    'read:analytics',
    'admin:all'
  ]

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockKeys: ApiKey[] = [
        {
          id: '1',
          name: 'Production API',
          key: 'plura_live_sk_1234567890abcdef',
          permissions: ['read:users', 'read:agencies', 'read:analytics'],
          status: 'active',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          usageCount: 1247
        },
        {
          id: '2',
          name: 'Development API',
          key: 'plura_test_sk_abcdef1234567890',
          permissions: ['admin:all'],
          status: 'active',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          lastUsed: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          usageCount: 456
        }
      ]
      setApiKeys(mockKeys)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch API keys',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const createApiKey = async () => {
    try {
      // Mock API key creation
      const newKey: ApiKey = {
        id: Date.now().toString(),
        name: newKeyData.name,
        key: `plura_${Date.now()}_sk_${Math.random().toString(36).substring(2)}`,
        permissions: newKeyData.permissions,
        status: 'active',
        createdAt: new Date().toISOString(),
        usageCount: 0
      }
      
      setApiKeys([...apiKeys, newKey])
      setShowCreateDialog(false)
      setNewKeyData({ name: '', permissions: [] })
      
      toast({
        title: 'Success',
        description: 'API key created successfully'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create API key',
        variant: 'destructive'
      })
    }
  }

  const revokeApiKey = async (keyId: string) => {
    try {
      setApiKeys(apiKeys.map(key => 
        key.id === keyId ? { ...key, status: 'revoked' as const } : key
      ))
      
      toast({
        title: 'Success',
        description: 'API key revoked successfully'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to revoke API key',
        variant: 'destructive'
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied',
      description: 'API key copied to clipboard'
    })
  }

  const toggleKeyVisibility = (keyId: string) => {
    setShowKey(prev => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const maskKey = (key: string) => {
    return `${key.substring(0, 12)}${'*'.repeat(20)}${key.substring(key.length - 4)}`
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Keys</h1>
          <p className="text-muted-foreground">Manage API keys for external integrations</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={fetchApiKeys} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create API Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New API Key</DialogTitle>
                <DialogDescription>
                  Create a new API key for external integrations
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="keyName">Key Name</Label>
                  <Input
                    id="keyName"
                    value={newKeyData.name}
                    onChange={(e) => setNewKeyData({ ...newKeyData, name: e.target.value })}
                    placeholder="e.g., Production API, Development API"
                  />
                </div>
                
                <div>
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {availablePermissions.map((permission) => (
                      <label key={permission} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newKeyData.permissions.includes(permission)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewKeyData({
                                ...newKeyData,
                                permissions: [...newKeyData.permissions, permission]
                              })
                            } else {
                              setNewKeyData({
                                ...newKeyData,
                                permissions: newKeyData.permissions.filter(p => p !== permission)
                              })
                            }
                          }}
                        />
                        <span className="text-sm">{permission}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createApiKey} disabled={!newKeyData.name}>
                    Create Key
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total API Keys</p>
                <p className="text-2xl font-bold">{apiKeys.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Active Keys</p>
                <p className="text-2xl font-bold">
                  {apiKeys.filter(k => k.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Total Usage</p>
                <p className="text-2xl font-bold">
                  {apiKeys.reduce((acc, key) => acc + key.usageCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Keys ({apiKeys.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading API keys...
                  </TableCell>
                </TableRow>
              ) : apiKeys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No API keys found
                  </TableCell>
                </TableRow>
              ) : (
                apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Key className="h-4 w-4 text-primary" />
                        <span className="font-medium">{apiKey.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">
                          {showKey[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                          {showKey[apiKey.id] ? 
                            <EyeOff className="h-4 w-4" /> : 
                            <Eye className="h-4 w-4" />
                          }
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.key)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={apiKey.status === 'active' ? 'default' : 'destructive'}>
                        {apiKey.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {apiKey.permissions.slice(0, 2).map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                        {apiKey.permissions.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{apiKey.permissions.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{apiKey.usageCount} requests</div>
                        {apiKey.lastUsed && (
                          <div className="text-muted-foreground">
                            Last: {new Date(apiKey.lastUsed).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          {new Date(apiKey.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {apiKey.status === 'active' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => revokeApiKey(apiKey.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default ApiKeysPage