'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Flag, 
  Plus, 
  Edit,
  Trash2,
  Search
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type FeatureFlag = {
  id: string
  name: string
  key: string
  description?: string
  isEnabled: boolean
  rolloutType: string
  rolloutData?: string
  createdAt: string
  updatedAt: string
}

const FeatureFlagsManager = () => {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null)
  const [newFlag, setNewFlag] = useState({
    name: '',
    key: '',
    description: '',
    isEnabled: false,
    rolloutType: 'all'
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchFeatureFlags()
  }, [])

  const fetchFeatureFlags = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/feature-flags')
      const data = await response.json()
      
      if (response.ok) {
        setFeatureFlags(data.featureFlags || [])
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch feature flags',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const createFeatureFlag = async () => {
    try {
      const response = await fetch('/api/admin/feature-flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFlag)
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Feature flag created successfully'
        })
        setShowCreateDialog(false)
        setNewFlag({ name: '', key: '', description: '', isEnabled: false, rolloutType: 'all' })
        fetchFeatureFlags()
      } else {
        throw new Error('Failed to create feature flag')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create feature flag',
        variant: 'destructive'
      })
    }
  }

  const updateFeatureFlag = async (flagId: string, updates: Partial<FeatureFlag>) => {
    try {
      const response = await fetch('/api/admin/feature-flags', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flagId, ...updates })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Feature flag updated successfully'
        })
        fetchFeatureFlags()
      } else {
        throw new Error('Failed to update feature flag')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update feature flag',
        variant: 'destructive'
      })
    }
  }

  const toggleFeatureFlag = async (flag: FeatureFlag) => {
    await updateFeatureFlag(flag.id, { isEnabled: !flag.isEnabled })
  }

  const deleteFeatureFlag = async (flagId: string) => {
    try {
      const response = await fetch('/api/admin/feature-flags', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flagId })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Feature flag deleted successfully'
        })
        fetchFeatureFlags()
      } else {
        throw new Error('Failed to delete feature flag')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete feature flag',
        variant: 'destructive'
      })
    }
  }

  const filteredFlags = featureFlags.filter(flag =>
    flag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flag.key.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search feature flags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-flags"
          />
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-flag">
              <Plus className="h-4 w-4 mr-2" />
              Create Flag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Feature Flag</DialogTitle>
              <DialogDescription>
                Create a new feature flag to control feature rollouts
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newFlag.name}
                  onChange={(e) => setNewFlag({ ...newFlag, name: e.target.value })}
                  placeholder="Feature name"
                  data-testid="input-flag-name"
                />
              </div>
              <div>
                <Label htmlFor="key">Key</Label>
                <Input
                  id="key"
                  value={newFlag.key}
                  onChange={(e) => setNewFlag({ ...newFlag, key: e.target.value })}
                  placeholder="feature_key"
                  data-testid="input-flag-key"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newFlag.description}
                  onChange={(e) => setNewFlag({ ...newFlag, description: e.target.value })}
                  placeholder="Description of this feature"
                  data-testid="textarea-flag-description"
                />
              </div>
              <div>
                <Label htmlFor="rolloutType">Rollout Type</Label>
                <Select value={newFlag.rolloutType} onValueChange={(value) => setNewFlag({ ...newFlag, rolloutType: value })}>
                  <SelectTrigger data-testid="select-rollout-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="percentage">Percentage Rollout</SelectItem>
                    <SelectItem value="users">Specific Users</SelectItem>
                    <SelectItem value="agencies">Specific Agencies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enabled"
                  checked={newFlag.isEnabled}
                  onCheckedChange={(checked) => setNewFlag({ ...newFlag, isEnabled: checked })}
                  data-testid="switch-flag-enabled"
                />
                <Label htmlFor="enabled">Enable immediately</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={createFeatureFlag} data-testid="button-save-flag">
                  Create Flag
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Feature Flags Table */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Flags ({filteredFlags.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flag</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rollout Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading feature flags...
                  </TableCell>
                </TableRow>
              ) : filteredFlags.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No feature flags found
                  </TableCell>
                </TableRow>
              ) : (
                filteredFlags.map((flag) => (
                  <TableRow key={flag.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Flag className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium" data-testid={`text-flag-name-${flag.id}`}>
                            {flag.name}
                          </div>
                          {flag.description && (
                            <div className="text-sm text-muted-foreground">
                              {flag.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {flag.key}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={flag.isEnabled}
                          onCheckedChange={() => toggleFeatureFlag(flag)}
                          data-testid={`switch-flag-${flag.id}`}
                        />
                        <Badge variant={flag.isEnabled ? 'default' : 'secondary'}>
                          {flag.isEnabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{flag.rolloutType}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(flag.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingFlag(flag)}
                          data-testid={`button-edit-flag-${flag.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteFeatureFlag(flag.id)}
                          data-testid={`button-delete-flag-${flag.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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

export default FeatureFlagsManager