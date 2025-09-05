'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Users,
  Mail,
  Play,
  Pause,
  Settings,
  Plus,
  Trash2,
  Clock,
  Target,
  TrendingUp,
  Edit
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import FeatureGate from '@/components/ui/feature-gate'

interface NurtureSequence {
  id: string
  name: string
  description: string
  triggerEvent: string
  steps: NurtureStep[]
  isActive: boolean
  totalLeads: number
  convertedLeads: number
  conversionRate: number
}

interface NurtureStep {
  id: string
  type: 'email' | 'sms' | 'delay' | 'condition'
  delay: number // in hours
  title: string
  content: string
  condition?: string
}

interface LeadNurturingProps {
  subAccountId: string
  automationId?: string
}

const LeadNurturing: React.FC<LeadNurturingProps> = ({
  subAccountId,
  automationId = 'lead-nurturing-default'
}) => {
  const [sequences, setSequences] = useState<NurtureSequence[]>([])
  const [isActive, setIsActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSequence, setSelectedSequence] = useState<NurtureSequence | null>(null)
  const [isEditingSequence, setIsEditingSequence] = useState(false)

  useEffect(() => {
    fetchNurtureSequences()
    fetchAutomationStatus()
  }, [])

  const fetchNurtureSequences = async () => {
    try {
      const response = await fetch(`/api/automations/lead-nurturing/sequences?subAccountId=${subAccountId}`)
      if (response.ok) {
        const data = await response.json()
        setSequences(data)
      }
    } catch (error) {
      console.error('Failed to fetch sequences:', error)
    }
  }

  const fetchAutomationStatus = async () => {
    try {
      const response = await fetch(`/api/automations/${automationId}/status?subAccountId=${subAccountId}`)
      if (response.ok) {
        const data = await response.json()
        setIsActive(data.isRunning)
      }
    } catch (error) {
      console.error('Failed to fetch status:', error)
    }
  }

  const toggleNurturing = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/automations/${automationId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subAccountId, 
          action: isActive ? 'pause' : 'start',
          type: 'lead-nurturing'
        })
      })
      
      if (response.ok) {
        setIsActive(!isActive)
        toast({
          title: isActive ? 'Nurturing Paused' : 'Nurturing Started',
          description: `Lead nurturing automation is now ${isActive ? 'paused' : 'active'}.`
        })
      }
    } catch (error) {
      console.error('Failed to toggle nurturing:', error)
      toast({
        title: "Error",
        description: "Failed to toggle lead nurturing. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createSequence = async (sequenceData: Partial<NurtureSequence>) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/automations/lead-nurturing/sequences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...sequenceData,
          subAccountId,
          automationId
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setSequences(prev => [...prev, data])
        setIsEditingSequence(false)
        toast({
          title: "Sequence Created",
          description: "New lead nurturing sequence has been created."
        })
      }
    } catch (error) {
      console.error('Failed to create sequence:', error)
      toast({
        title: "Error",
        description: "Failed to create sequence. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const triggerSequence = async (sequenceId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/automations/lead-nurturing/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sequenceId,
          subAccountId,
          triggerData: { manual: true, timestamp: new Date() }
        })
      })
      
      if (response.ok) {
        toast({
          title: "Sequence Triggered",
          description: "Lead nurturing sequence has been manually triggered."
        })
      }
    } catch (error) {
      console.error('Failed to trigger sequence:', error)
      toast({
        title: "Error",
        description: "Failed to trigger sequence. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FeatureGate feature="automations">
      <div className="space-y-6">
        {/* Header */}
        <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Lead Nurturing
              </CardTitle>
              <CardDescription>
                Automate lead engagement and conversion workflows
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isActive ? "default" : "secondary"}>
                {isActive ? "Active" : "Paused"}
              </Badge>
              <Button
                size="sm"
                variant={isActive ? "destructive" : "default"}
                onClick={toggleNurturing}
                disabled={isLoading}
              >
                {isLoading ? '...' : isActive ? (
                  <>
                    <Pause className="w-4 h-4 mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-1" />
                    Start
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Create New Sequence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Nurture Sequence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sequenceName">Sequence Name</Label>
              <Input
                id="sequenceName"
                placeholder="Welcome Series"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="triggerEvent">Trigger Event</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="form_submission">Form Submission</SelectItem>
                  <SelectItem value="user_signup">User Signup</SelectItem>
                  <SelectItem value="purchase_completed">Purchase Completed</SelectItem>
                  <SelectItem value="cart_abandoned">Cart Abandoned</SelectItem>
                  <SelectItem value="email_opened">Email Opened</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sequenceDescription">Description</Label>
            <Textarea
              id="sequenceDescription"
              placeholder="Describe what this sequence does..."
              rows={3}
            />
          </div>

          <Button className="w-full" disabled={isLoading}>
            <Plus className="w-4 h-4 mr-2" />
            Create Sequence
          </Button>
        </CardContent>
      </Card>

      {/* Existing Sequences */}
      <Card>
        <CardHeader>
          <CardTitle>Active Sequences ({sequences.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {sequences.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No nurture sequences created yet</p>
              <p className="text-sm">Create your first sequence to start nurturing leads</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sequences.map((sequence) => (
                <div
                  key={sequence.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{sequence.name}</h4>
                        <Badge variant={sequence.isActive ? "default" : "secondary"}>
                          {sequence.isActive ? "Active" : "Paused"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {sequence.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{sequence.totalLeads} leads</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{sequence.conversionRate}% conversion</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          <span>{sequence.steps.length} steps</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => triggerSequence(sequence.id)}
                        disabled={isLoading}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSequence(sequence)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </FeatureGate>
  )
}

export default LeadNurturing