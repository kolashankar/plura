'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Users, 
  Search, 
  Edit,
  Save,
  Crown,
  Building2,
  User,
  CreditCard,
  Bot,
  Zap,
  BarChart3,
  Palette,
  Globe,
  Filter,
  MoreHorizontal
} from 'lucide-react'
import { toast } from 'sonner'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface UserWithPlan {
  id: string
  name: string
  email: string
  role: string
  plan: string
  isActive: boolean
  lastLoginAt: string | null
  agencyId: string | null
  createdAt: string
  Agency?: {
    id: string
    name: string
  }
  aiCreditsUsed: number
  funnelCount: number
  automationCount: number
}

interface PlanOverride {
  userId: string
  feature: string
  isEnabled: boolean
  limit?: number
  expiresAt?: string
}

const EnhancedUserManagement = () => {
  const [users, setUsers] = useState<UserWithPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [planFilter, setPlanFilter] = useState<string>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<UserWithPlan | null>(null)
  const [showOverrideDialog, setShowOverrideDialog] = useState(false)
  const [newOverride, setNewOverride] = useState({
    feature: '',
    isEnabled: false,
    limit: '',
    expiresAt: ''
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      
      if (response.ok) {
        setUsers(data.users || [])
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast.error('Failed to fetch users')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserPlan = async (userId: string, newPlan: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, plan: newPlan })
      })

      if (response.ok) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, plan: newPlan } : user
        ))
        toast.success('User plan updated successfully')
      } else {
        toast.error('Failed to update user plan')
      }
    } catch (error) {
      toast.error('Failed to update user plan')
      console.error(error)
    }
  }

  const createFeatureOverride = async (userId: string) => {
    try {
      const response = await fetch('/api/admin/user-overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          feature: newOverride.feature,
          isEnabled: newOverride.isEnabled,
          limit: newOverride.limit ? parseInt(newOverride.limit) : undefined,
          expiresAt: newOverride.expiresAt || undefined
        })
      })

      if (response.ok) {
        toast.success('Feature override created successfully')
        setShowOverrideDialog(false)
        setNewOverride({ feature: '', isEnabled: false, limit: '', expiresAt: '' })
        fetchUsers() // Refresh to show updated data
      } else {
        toast.error('Failed to create feature override')
      }
    } catch (error) {
      toast.error('Failed to create feature override')
      console.error(error)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlan = planFilter === 'all' || user.plan === planFilter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    
    return matchesSearch && matchesPlan && matchesRole
  })

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-800'
      case 'basic': return 'bg-blue-100 text-blue-800'
      case 'unlimited': return 'bg-purple-100 text-purple-800'
      case 'agency': return 'bg-gold-100 text-gold-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'AGENCY_OWNER': return 'bg-red-100 text-red-800'
      case 'AGENCY_ADMIN': return 'bg-orange-100 text-orange-800'
      case 'SUBACCOUNT_USER': return 'bg-green-100 text-green-800'
      case 'SUBACCOUNT_GUEST': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-users"
          />
        </div>
        
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-plan-filter">
            <SelectValue placeholder="Filter by plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="unlimited">Unlimited</SelectItem>
            <SelectItem value="agency">Agency Pro</SelectItem>
          </SelectContent>
        </Select>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-role-filter">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="AGENCY_OWNER">Agency Owner</SelectItem>
            <SelectItem value="AGENCY_ADMIN">Agency Admin</SelectItem>
            <SelectItem value="SUBACCOUNT_USER">User</SelectItem>
            <SelectItem value="SUBACCOUNT_GUEST">Guest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management ({filteredUsers.length} users)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Agency</TableHead>
                  <TableHead>AI Credits</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={user.plan} 
                          onValueChange={(newPlan) => updateUserPlan(user.id, newPlan)}
                        >
                          <SelectTrigger className="w-[120px]" data-testid={`select-plan-${user.id}`}>
                            <SelectValue>
                              <Badge className={getPlanBadgeColor(user.plan)}>
                                {user.plan}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="unlimited">Unlimited</SelectItem>
                            <SelectItem value="agency">Agency Pro</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {user.Agency ? (
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            <span className="text-sm">{user.Agency.name}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span className="text-sm">Individual</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {user.aiCreditsUsed} used
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs space-y-1">
                          <div>Funnels: {user.funnelCount}</div>
                          <div>Automations: {user.automationCount}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={user.isActive}
                          onCheckedChange={(checked) => {
                            // Update user active status
                            fetch('/api/admin/users', {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ userId: user.id, isActive: checked })
                            }).then(() => {
                              setUsers(prev => prev.map(u => 
                                u.id === user.id ? { ...u, isActive: checked } : u
                              ))
                              toast.success(`User ${checked ? 'activated' : 'deactivated'}`)
                            })
                          }}
                          data-testid={`switch-user-active-${user.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" data-testid={`button-user-actions-${user.id}`}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user)
                                setShowOverrideDialog(true)
                              }}
                            >
                              <Bot className="mr-2 h-4 w-4" />
                              Feature Override
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CreditCard className="mr-2 h-4 w-4" />
                              View Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart3 className="mr-2 h-4 w-4" />
                              View Analytics
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Feature Override Dialog */}
      <Dialog open={showOverrideDialog} onOpenChange={setShowOverrideDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Feature Override</DialogTitle>
            <DialogDescription>
              Grant or restrict specific features for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feature">Feature</Label>
              <Select value={newOverride.feature} onValueChange={(value) => setNewOverride({...newOverride, feature: value})}>
                <SelectTrigger data-testid="select-override-feature">
                  <SelectValue placeholder="Select feature" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai-components">AI Component Generation</SelectItem>
                  <SelectItem value="automations">Automation Workflows</SelectItem>
                  <SelectItem value="theme-selling">Theme Marketplace Selling</SelectItem>
                  <SelectItem value="white-label">White-label Branding</SelectItem>
                  <SelectItem value="analytics">Advanced Analytics</SelectItem>
                  <SelectItem value="custom-domains">Custom Domains</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="override-enabled"
                checked={newOverride.isEnabled}
                onCheckedChange={(checked) => setNewOverride({...newOverride, isEnabled: checked})}
                data-testid="switch-override-enabled"
              />
              <Label htmlFor="override-enabled">Enable Feature</Label>
            </div>

            {newOverride.isEnabled && ['ai-components', 'automations', 'custom-domains'].includes(newOverride.feature) && (
              <div className="space-y-2">
                <Label htmlFor="override-limit">Limit</Label>
                <Input
                  id="override-limit"
                  type="number"
                  value={newOverride.limit}
                  onChange={(e) => setNewOverride({...newOverride, limit: e.target.value})}
                  placeholder="Enter limit (-1 for unlimited)"
                  data-testid="input-override-limit"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="override-expires">Expires At (Optional)</Label>
              <Input
                id="override-expires"
                type="datetime-local"
                value={newOverride.expiresAt}
                onChange={(e) => setNewOverride({...newOverride, expiresAt: e.target.value})}
                data-testid="input-override-expires"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => selectedUser && createFeatureOverride(selectedUser.id)}
                className="flex-1"
                data-testid="button-create-override"
              >
                <Save className="h-4 w-4 mr-2" />
                Create Override
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowOverrideDialog(false)}
                data-testid="button-cancel-override"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{users.filter(u => u.isActive).length}</p>
              </div>
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Premium Users</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => ['basic', 'unlimited', 'agency'].includes(u.plan)).length}
                </p>
              </div>
              <Crown className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Agencies</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.Agency).length}
                </p>
              </div>
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EnhancedUserManagement