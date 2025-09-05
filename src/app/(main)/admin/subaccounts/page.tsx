'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  Eye, 
  Ban, 
  CheckCircle, 
  Building2, 
  Users,
  Calendar,
  Edit
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type SubAccount = {
  id: string
  name: string
  companyEmail: string
  companyPhone: string
  address: string
  city: string
  zipCode: string
  state: string
  country: string
  isActive: boolean
  createdAt: string
  agencyId: string
  agency: {
    name: string
    isActive: boolean
  }
  _count?: {
    Funnels: number
    Media: number
    Contact: number
    Permissions: number
  }
}

const SubAccountsTable = () => {
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubAccount, setSelectedSubAccount] = useState<SubAccount | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchSubAccounts()
  }, [searchTerm])

  const fetchSubAccounts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      
      const response = await fetch(`/api/admin/subaccounts?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setSubAccounts(data.subAccounts)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch sub accounts',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleSubAccountStatus = async (subAccountId: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/admin/subaccounts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subAccountId, 
          action: isActive ? 'suspend' : 'activate' 
        })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Sub account ${isActive ? 'suspended' : 'activated'} successfully`
        })
        fetchSubAccounts()
      } else {
        throw new Error('Failed to update sub account status')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update sub account status',
        variant: 'destructive'
      })
    }
  }

  const filteredSubAccounts = subAccounts.filter(subAccount =>
    subAccount.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subAccount.companyEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subAccount.agency.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Sub Account Management</h1>
        <p className="text-muted-foreground">
          Manage sub accounts, their resources, and relationships with parent agencies
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sub accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-subaccounts"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sub Accounts ({filteredSubAccounts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sub Account</TableHead>
                  <TableHead>Parent Agency</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Resources</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Loading sub accounts...
                    </TableCell>
                  </TableRow>
                ) : filteredSubAccounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No sub accounts found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubAccounts.map((subAccount) => (
                    <TableRow key={subAccount.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium" data-testid={`text-subaccount-name-${subAccount.id}`}>
                              {subAccount.name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={subAccount.agency.isActive ? 'default' : 'destructive'}>
                            {subAccount.agency.name}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{subAccount.companyEmail}</div>
                          <div className="text-muted-foreground">{subAccount.companyPhone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{subAccount.city}, {subAccount.state}</div>
                          <div className="text-muted-foreground">{subAccount.country}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          <div>Funnels: {subAccount._count?.Funnels || 0}</div>
                          <div>Media: {subAccount._count?.Media || 0}</div>
                          <div>Contacts: {subAccount._count?.Contact || 0}</div>
                          <div>Permissions: {subAccount._count?.Permissions || 0}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={subAccount.isActive ? 'default' : 'destructive'}>
                          {subAccount.isActive ? 'Active' : 'Suspended'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(subAccount.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedSubAccount(subAccount)}
                                data-testid={`button-view-subaccount-${subAccount.id}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Sub Account Details</DialogTitle>
                                <DialogDescription>
                                  View detailed information about {subAccount.name}
                                </DialogDescription>
                              </DialogHeader>
                              {selectedSubAccount && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-3 gap-4">
                                    <div>
                                      <label className="font-medium">Sub Account Name</label>
                                      <p className="text-muted-foreground">{selectedSubAccount.name}</p>
                                    </div>
                                    <div>
                                      <label className="font-medium">Parent Agency</label>
                                      <p className="text-muted-foreground">{selectedSubAccount.agency.name}</p>
                                    </div>
                                    <div>
                                      <label className="font-medium">Status</label>
                                      <p>
                                        <Badge variant={selectedSubAccount.isActive ? 'default' : 'destructive'}>
                                          {selectedSubAccount.isActive ? 'Active' : 'Suspended'}
                                        </Badge>
                                      </p>
                                    </div>
                                    <div>
                                      <label className="font-medium">Email</label>
                                      <p className="text-muted-foreground">{selectedSubAccount.companyEmail}</p>
                                    </div>
                                    <div>
                                      <label className="font-medium">Phone</label>
                                      <p className="text-muted-foreground">{selectedSubAccount.companyPhone}</p>
                                    </div>
                                    <div>
                                      <label className="font-medium">Address</label>
                                      <p className="text-muted-foreground">{selectedSubAccount.address}</p>
                                    </div>
                                    <div>
                                      <label className="font-medium">City</label>
                                      <p className="text-muted-foreground">{selectedSubAccount.city}</p>
                                    </div>
                                    <div>
                                      <label className="font-medium">State</label>
                                      <p className="text-muted-foreground">{selectedSubAccount.state}</p>
                                    </div>
                                    <div>
                                      <label className="font-medium">Country</label>
                                      <p className="text-muted-foreground">{selectedSubAccount.country}</p>
                                    </div>
                                    <div>
                                      <label className="font-medium">Funnels</label>
                                      <p className="text-muted-foreground">
                                        {selectedSubAccount._count?.Funnels || 0}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="font-medium">Media Files</label>
                                      <p className="text-muted-foreground">
                                        {selectedSubAccount._count?.Media || 0}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="font-medium">Contacts</label>
                                      <p className="text-muted-foreground">
                                        {selectedSubAccount._count?.Contact || 0}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            variant={subAccount.isActive ? 'destructive' : 'default'}
                            size="sm"
                            onClick={() => toggleSubAccountStatus(subAccount.id, subAccount.isActive)}
                            data-testid={`button-toggle-subaccount-${subAccount.id}`}
                          >
                            {subAccount.isActive ? (
                              <>
                                <Ban className="h-4 w-4 mr-1" />
                                Suspend
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Activate
                              </>
                            )}
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
    </div>
  )
}

export default SubAccountsTable