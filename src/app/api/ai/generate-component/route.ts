
import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { 
      componentName, 
      description, 
      category = 'custom',
      subaccountId,
      styles = {},
      features = []
    } = await req.json()

    if (!componentName || !description) {
      return NextResponse.json(
        { error: 'Component name and description are required' },
        { status: 400 }
      )
    }

    // Generate component code based on description and features
    const componentCode = generateComponentFromDescription(
      componentName, 
      description, 
      features
    )

    // Create default styles based on component type
    const defaultStyles = generateDefaultStyles(componentName, description)

    // Generate the component structure for the editor
    const componentStructure = {
      id: uuidv4(),
      name: componentName,
      type: componentName.toLowerCase().replace(/\s+/g, '-'),
      content: generateComponentContent(description, features),
      styles: { ...defaultStyles, ...styles },
      category: category,
      isCustom: true,
      code: componentCode,
      createdBy: user.id,
      createdAt: new Date()
    }

    // Save to database if subaccountId is provided
    if (subaccountId) {
      await db.customComponent.create({
        data: {
          id: componentStructure.id,
          name: componentStructure.name,
          type: componentStructure.type,
          content: JSON.stringify(componentStructure.content),
          styles: JSON.stringify(componentStructure.styles),
          category: componentStructure.category,
          code: componentStructure.code,
          subAccountId: subaccountId,
          createdBy: user.id
        }
      })
    }

    return NextResponse.json({
      success: true,
      component: componentStructure
    })

  } catch (error) {
    console.error('Error generating component:', error)
    return NextResponse.json(
      { error: 'Failed to generate component' },
      { status: 500 }
    )
  }
}

function generateComponentFromDescription(name: string, description: string, features: string[]) {
  const componentName = name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')
  const kebabName = name.toLowerCase().replace(/\s+/g, '-')
  
  // Determine component type and generate appropriate code
  const isVideoRelated = description.toLowerCase().includes('video') || description.toLowerCase().includes('player')
  const isFilter = description.toLowerCase().includes('filter') || description.toLowerCase().includes('effect')
  const isForm = description.toLowerCase().includes('form') || description.toLowerCase().includes('input')
  const isChart = description.toLowerCase().includes('chart') || description.toLowerCase().includes('graph')

  if (isVideoRelated && isFilter) {
    return generateVideoFilterComponent(componentName, description, features)
  } else if (isVideoRelated) {
    return generateVideoComponent(componentName, description, features)
  } else if (isFilter) {
    return generateFilterComponent(componentName, description, features)
  } else if (isForm) {
    return generateFormComponent(componentName, description, features)
  } else if (isChart) {
    return generateChartComponent(componentName, description, features)
  } else {
    return generateGenericComponent(componentName, description, features)
  }
}

function generateVideoFilterComponent(name: string, description: string, features: string[]) {
  return `'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ${name}Props {
  videoRef?: React.RefObject<HTMLVideoElement>
  onFilterChange?: (filter: string) => void
}

export default function ${name}({ videoRef, onFilterChange }: ${name}Props) {
  const [brightness, setBrightness] = useState([100])
  const [contrast, setContrast] = useState([100])
  const [saturation, setSaturation] = useState([100])
  const [blur, setBlur] = useState([0])

  const applyFilters = () => {
    const filterString = \`brightness(\${brightness[0]}%) contrast(\${contrast[0]}%) saturate(\${saturation[0]}%) blur(\${blur[0]}px)\`
    
    if (videoRef?.current) {
      videoRef.current.style.filter = filterString
    }
    
    onFilterChange?.(filterString)
  }

  useEffect(() => {
    applyFilters()
  }, [brightness, contrast, saturation, blur])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>${name}</CardTitle>
        <p className="text-sm text-gray-600">${description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Brightness</label>
          <Slider
            value={brightness}
            onValueChange={setBrightness}
            min={0}
            max={200}
            step={1}
            className="mt-2"
          />
          <span className="text-xs text-gray-500">{brightness[0]}%</span>
        </div>
        
        <div>
          <label className="text-sm font-medium">Contrast</label>
          <Slider
            value={contrast}
            onValueChange={setContrast}
            min={0}
            max={200}
            step={1}
            className="mt-2"
          />
          <span className="text-xs text-gray-500">{contrast[0]}%</span>
        </div>
        
        <div>
          <label className="text-sm font-medium">Saturation</label>
          <Slider
            value={saturation}
            onValueChange={setSaturation}
            min={0}
            max={200}
            step={1}
            className="mt-2"
          />
          <span className="text-xs text-gray-500">{saturation[0]}%</span>
        </div>
        
        <div>
          <label className="text-sm font-medium">Blur</label>
          <Slider
            value={blur}
            onValueChange={setBlur}
            min={0}
            max={10}
            step={0.1}
            className="mt-2"
          />
          <span className="text-xs text-gray-500">{blur[0]}px</span>
        </div>
        
        <Button onClick={() => {
          setBrightness([100])
          setContrast([100])
          setSaturation([100])
          setBlur([0])
        }} variant="outline" className="w-full">
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  )
}`
}

function generateVideoComponent(name: string, description: string, features: string[]) {
  return `'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

interface ${name}Props {
  src?: string
  autoPlay?: boolean
  controls?: boolean
  onTimeUpdate?: (currentTime: number) => void
}

export default function ${name}({ 
  src = '', 
  autoPlay = false, 
  controls = true,
  onTimeUpdate 
}: ${name}Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime
      setCurrentTime(time)
      onTimeUpdate?.(time)
    }
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>${name}</CardTitle>
        <p className="text-sm text-gray-600">${description}</p>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <video
            ref={videoRef}
            src={src}
            autoPlay={autoPlay}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                setDuration(videoRef.current.duration)
              }
            }}
            className="w-full h-auto rounded-lg"
          />
          
          {controls && (
            <div className="flex items-center justify-between mt-4 p-2 bg-gray-100 rounded">
              <Button
                onClick={togglePlay}
                size="sm"
                variant="ghost"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </Button>
              
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: \`\${(currentTime / duration) * 100}%\` }}
                  />
                </div>
              </div>
              
              <Button
                onClick={toggleMute}
                size="sm"
                variant="ghost"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </Button>
              
              <span className="text-sm text-gray-600 ml-2">
                {\`\${Math.floor(currentTime / 60)}:\${Math.floor(currentTime % 60).toString().padStart(2, '0')}\`}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}`
}

function generateFilterComponent(name: string, description: string, features: string[]) {
  return `'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ${name}Props {
  items?: any[]
  onFilter?: (filteredItems: any[]) => void
  filterOptions?: string[]
}

export default function ${name}({ 
  items = [], 
  onFilter, 
  filterOptions = ['all', 'active', 'completed'] 
}: ${name}Props) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const handleFilter = (filter: string) => {
    setActiveFilter(filter)
    
    let filteredItems = items
    
    if (filter !== 'all') {
      filteredItems = items.filter(item => 
        item.status === filter || item.category === filter
      )
    }
    
    if (searchTerm) {
      filteredItems = filteredItems.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    onFilter?.(filteredItems)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    handleFilter(activeFilter)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>${name}</CardTitle>
        <p className="text-sm text-gray-600">${description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <Badge
              key={option}
              variant={activeFilter === option ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleFilter(option)}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Badge>
          ))}
        </div>
        
        <Button
          onClick={() => {
            setActiveFilter('all')
            setSearchTerm('')
            onFilter?.(items)
          }}
          variant="outline"
          size="sm"
        >
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  )
}`
}

function generateFormComponent(name: string, description: string, features: string[]) {
  return `'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface ${name}Props {
  onSubmit?: (data: any) => void
  fields?: { name: string; type: string; label: string; required?: boolean }[]
}

export default function ${name}({ 
  onSubmit,
  fields = [
    { name: 'name', type: 'text', label: 'Name', required: true },
    { name: 'email', type: 'email', label: 'Email', required: true },
    { name: 'message', type: 'textarea', label: 'Message' }
  ]
}: ${name}Props) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: Record<string, string> = {}
    
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = \`\${field.label} is required\`
      }
    })
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    onSubmit?.(formData)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>${name}</CardTitle>
        <p className="text-sm text-gray-600">${description}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {field.type === 'textarea' ? (
                <Textarea
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              ) : (
                <Input
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="mt-1"
                />
              )}
              
              {errors[field.name] && (
                <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}
          
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}`
}

function generateChartComponent(name: string, description: string, features: string[]) {
  return `'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ${name}Props {
  data?: any[]
  title?: string
  type?: 'bar' | 'line' | 'pie'
}

export default function ${name}({ 
  data = [],
  title = '${name}',
  type = 'bar'
}: ${name}Props) {
  const maxValue = Math.max(...data.map(item => item.value || 0))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-gray-600">${description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-sm font-medium w-20 truncate">
                {item.label}
              </span>
              <div className="flex-1 h-4 bg-gray-200 rounded">
                <div
                  className="h-full bg-blue-500 rounded transition-all"
                  style={{ 
                    width: \`\${(item.value / maxValue) * 100}%\`
                  }}
                />
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">
                {item.value}
              </span>
            </div>
          ))}
          
          {data.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No data available
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}`
}

function generateGenericComponent(name: string, description: string, features: string[]) {
  return `'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ${name}Props {
  title?: string
  children?: React.ReactNode
}

export default function ${name}({ title = '${name}', children }: ${name}Props) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-gray-600">${description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {children || (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              Custom component ready for implementation
            </p>
            <div className="space-y-2">
              ${features.map(feature => `<p className="text-sm text-gray-600">• ${feature}</p>`).join('\n              ')}
            </div>
            <Button className="mt-4">
              Get Started
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}`
}

function generateDefaultStyles(name: string, description: string) {
  return {
    padding: '16px',
    margin: '8px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    minHeight: '100px'
  }
}

function generateComponentContent(description: string, features: string[]) {
  return [
    {
      type: 'content',
      description: description,
      features: features
    }
  ]
}
