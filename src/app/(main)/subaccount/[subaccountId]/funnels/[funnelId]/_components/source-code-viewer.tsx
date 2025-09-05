'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { 
  Code2, 
  FileCode, 
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Download,
  Copy,
  Settings
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'

interface SourceCodeViewerProps {
  funnelId: string
  funnelName: string
}

interface FileNode {
  name: string
  type: 'file' | 'folder'
  content?: string
  language?: string
  children?: FileNode[]
  path: string
}

interface GeneratedCode {
  react: FileNode[]
  vue: FileNode[]
  angular: FileNode[]
  html: FileNode[]
}

const SourceCodeViewer: React.FC<SourceCodeViewerProps> = ({
  funnelId,
  funnelName
}) => {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'components', 'pages']))
  const [selectedFramework, setSelectedFramework] = useState<'react' | 'vue' | 'angular' | 'html'>('react')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode>({
    react: [],
    vue: [],
    angular: [],
    html: []
  })

  useEffect(() => {
    generateSourceCode()
  }, [funnelId])

  const generateSourceCode = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch(`/api/funnels/${funnelId}/generate-code`)
      if (response.ok) {
        const data = await response.json()
        setGeneratedCode(data)
        
        // Select the first file by default
        if (data[selectedFramework]?.length > 0) {
          const firstFile = findFirstFile(data[selectedFramework])
          if (firstFile) setSelectedFile(firstFile)
        }
      }
    } catch (error) {
      console.error('Failed to generate source code:', error)
      toast({
        title: "Error",
        description: "Failed to generate source code. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const findFirstFile = (nodes: FileNode[]): FileNode | null => {
    for (const node of nodes) {
      if (node.type === 'file') return node
      if (node.children) {
        const found = findFirstFile(node.children)
        if (found) return found
      }
    }
    return null
  }

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedFolders(newExpanded)
  }

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map((node) => (
      <div key={node.path}>
        <div
          className={`flex items-center gap-1 py-1 px-2 hover:bg-muted/50 cursor-pointer rounded-sm ${
            selectedFile?.path === node.path ? 'bg-primary/10' : ''
          }`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.path)
            } else {
              setSelectedFile(node)
            }
          }}
        >
          {node.type === 'folder' ? (
            <>
              {expandedFolders.has(node.path) ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
              {expandedFolders.has(node.path) ? (
                <FolderOpen className="w-4 h-4 text-blue-500" />
              ) : (
                <Folder className="w-4 h-4 text-blue-500" />
              )}
            </>
          ) : (
            <>
              <div className="w-3 h-3" />
              <FileCode className="w-4 h-4 text-green-500" />
            </>
          )}
          <span className="text-sm">{node.name}</span>
          {node.type === 'file' && node.language && (
            <Badge variant="outline" className="text-xs ml-auto">
              {node.language}
            </Badge>
          )}
        </div>
        
        {node.type === 'folder' && 
         expandedFolders.has(node.path) && 
         node.children && 
         renderFileTree(node.children, level + 1)}
      </div>
    ))
  }

  const copyToClipboard = async () => {
    if (selectedFile?.content) {
      await navigator.clipboard.writeText(selectedFile.content)
      toast({
        title: "Copied!",
        description: "Code copied to clipboard."
      })
    }
  }

  const downloadFile = () => {
    if (selectedFile?.content) {
      const blob = new Blob([selectedFile.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = selectedFile.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Code2 className="w-4 h-4" />
          View Source Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Code2 className="w-5 h-5" />
                {funnelName} - Source Code
              </DialogTitle>
              <DialogDescription>
                Explore the generated source code for your funnel
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedFramework} onValueChange={(value: any) => {
                setSelectedFramework(value)
                const firstFile = findFirstFile(generatedCode[value] || [])
                if (firstFile) setSelectedFile(firstFile)
              }}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="vue">Vue.js</SelectItem>
                  <SelectItem value="angular">Angular</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={generateSourceCode}
                disabled={isGenerating}
              >
                <Settings className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? 'Generating...' : 'Regenerate'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex h-full">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* File explorer */}
            <ResizablePanel defaultSize={25} minSize={20}>
              <div className="h-full border-r">
                <div className="p-4 border-b">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Folder className="w-4 h-4" />
                    Project Structure
                  </h4>
                </div>
                <ScrollArea className="h-full p-2">
                  {isGenerating ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-center space-y-2">
                        <Settings className="w-6 h-6 animate-spin mx-auto" />
                        <p className="text-sm text-muted-foreground">Generating code...</p>
                      </div>
                    </div>
                  ) : (
                    renderFileTree(generatedCode[selectedFramework] || [])
                  )}
                </ScrollArea>
              </div>
            </ResizablePanel>

            <ResizableHandle />

            {/* Code editor */}
            <ResizablePanel defaultSize={75}>
              <div className="h-full flex flex-col">
                {selectedFile ? (
                  <>
                    <div className="flex items-center justify-between p-4 border-b">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4" />
                        <span className="font-medium">{selectedFile.name}</span>
                        {selectedFile.language && (
                          <Badge variant="outline" className="text-xs">
                            {selectedFile.language}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={copyToClipboard}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={downloadFile}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                      <pre className="text-sm bg-muted/30 p-4 rounded-lg overflow-x-auto">
                        <code className="language-typescript">
                          {selectedFile.content || '// No content available'}
                        </code>
                      </pre>
                    </ScrollArea>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <FileCode className="w-12 h-12 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground">Select a file to view its content</p>
                    </div>
                  </div>
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SourceCodeViewer