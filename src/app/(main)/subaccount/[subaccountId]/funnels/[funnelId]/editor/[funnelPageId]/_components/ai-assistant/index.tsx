
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Send, Code, Palette, Database } from 'lucide-react'
import { toast } from 'sonner'

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
  onFeatureGenerated: (feature: any) => void
  pageData?: any
}

export default function AIAssistant({ isOpen, onClose, onFeatureGenerated, pageData }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('')
  const [conversation, setConversation] = useState<Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestedFeatures] = useState([
    'Add contact form with email validation',
    'Create pricing table component',
    'Implement user authentication',
    'Add blog section with CMS',
    'Create product showcase gallery',
    'Add testimonials carousel',
    'Implement shopping cart',
    'Create dashboard layout'
  ])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault()
        if (!isOpen) {
          // Trigger opening the AI assistant
          window.dispatchEvent(new CustomEvent('openAIAssistant'))
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const generateFeature = async (userPrompt: string) => {
    setIsGenerating(true)
    
    // Add user message to conversation
    const userMessage = {
      role: 'user' as const,
      content: userPrompt,
      timestamp: new Date()
    }
    setConversation(prev => [...prev, userMessage])

    try {
      // Simulate Gemini API call
      const response = await fetch('/api/ai/generate-feature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userPrompt,
          context: pageData,
          conversation: conversation
        })
      })

      const data = await response.json()
      
      // Add assistant response
      const assistantMessage = {
        role: 'assistant' as const,
        content: data.response,
        timestamp: new Date()
      }
      setConversation(prev => [...prev, assistantMessage])

      // Generate the actual feature
      if (data.feature) {
        onFeatureGenerated(data.feature)
        toast.success('Feature generated and added to your page!')
      }

    } catch (error) {
      toast.error('Failed to generate feature. Please try again.')
    } finally {
      setIsGenerating(false)
      setPrompt('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      generateFeature(prompt.trim())
    }
  }

  const handleSuggestedFeature = async (feature: string) => {
    setPrompt(feature)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            AI Design Assistant
            <Badge variant="secondary">Ctrl+B</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 h-full">
          {/* Conversation Area */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 border rounded-lg p-4 mb-4">
              {conversation.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-300" />
                  <h3 className="font-semibold mb-2">AI Design Assistant Ready</h3>
                  <p className="text-sm">
                    Tell me what feature, component, or page you&apos;d like to create for your website.
                    I&apos;ll generate the code and add it to your design automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {conversation.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the feature you want to add... (e.g., 'Add a contact form with name, email, and message fields')"
                className="flex-1 min-h-[60px]"
                disabled={isGenerating}
              />
              <Button 
                type="submit" 
                disabled={!prompt.trim() || isGenerating}
                className="px-6"
              >
                {isGenerating ? (
                  <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
          </div>

          {/* Suggestions Sidebar */}
          <div className="w-80 border-l pl-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Code className="w-4 h-4" />
              Quick Suggestions
            </h3>
            
            <div className="space-y-2 mb-6">
              {suggestedFeatures.map((feature, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestedFeature(feature)}
                  className="w-full text-left justify-start h-auto p-3"
                  disabled={isGenerating}
                >
                  {feature}
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-3">
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <Palette className="w-4 h-4" />
                  Style Options
                </h4>
                <p className="text-xs text-muted-foreground">
                  Specify colors, fonts, animations, or layout preferences
                </p>
              </div>

              <div className="border rounded-lg p-3">
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4" />
                  Data Integration
                </h4>
                <p className="text-xs text-muted-foreground">
                  Request forms, databases, or API integrations
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-blue-800 mb-1">Pro Tips</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Be specific about functionality</li>
                  <li>• Mention design preferences</li>
                  <li>• Ask for responsive layouts</li>
                  <li>• Request accessibility features</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
