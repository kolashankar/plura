'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Code,
  FileText,
  Folder,
  FolderOpen,
  Save,
  Plus,
  X,
  Trash2,
  Copy,
  Terminal,
  RefreshCw,
  Play,
  FileIcon,
  Maximize,
  Minimize
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

type FileNode = {
  type: 'file' | 'directory'
  name: string
  path: string
  children?: { [key: string]: FileNode }
  size?: number
  extension?: string
}

type OpenTab = {
  id: string
  name: string
  path: string
  content: string
  language: string
  isEdited: boolean
}

type TerminalEntry = {
  id: string
  content: string
  type: 'command' | 'output' | 'error'
  timestamp: Date
}

interface EnhancedCodeEditorProps {
  deploymentId?: string
  projectPath?: string
  readOnly?: boolean
  className?: string
}

const EnhancedCodeEditor = ({
  deploymentId,
  projectPath = '.',
  readOnly = false,
  className
}: EnhancedCodeEditorProps) => {
  const [fileStructure, setFileStructure] = useState<FileNode | null>(null)
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([])
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['.']))
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [terminalOutput, setTerminalOutput] = useState<TerminalEntry[]>([])
  const [terminalCommand, setTerminalCommand] = useState('')
  const [isTerminalVisible, setIsTerminalVisible] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [isCreatingFile, setIsCreatingFile] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState('.')
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  const { toast } = useToast()
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchFileStructure()
  }, [deploymentId, projectPath])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalOutput])

  const fetchFileStructure = async () => {
    try {
      setLoading(true)
      let response
      
      if (deploymentId) {
        response = await fetch(`/api/deployments/${deploymentId}/code`)
      } else {
        // Mock file structure for demonstration
        const mockStructure: FileNode = {
          type: 'directory',
          name: 'project',
          path: '.',
          children: {
            'src': {
              type: 'directory',
              name: 'src',
              path: './src',
              children: {
                'components': {
                  type: 'directory',
                  name: 'components',
                  path: './src/components',
                  children: {
                    'App.tsx': {
                      type: 'file',
                      name: 'App.tsx',
                      path: './src/components/App.tsx',
                      extension: 'tsx'
                    }
                  }
                },
                'pages': {
                  type: 'directory', 
                  name: 'pages',
                  path: './src/pages',
                  children: {
                    'index.tsx': {
                      type: 'file',
                      name: 'index.tsx', 
                      path: './src/pages/index.tsx',
                      extension: 'tsx'
                    }
                  }
                }
              }
            },
            'package.json': {
              type: 'file',
              name: 'package.json',
              path: './package.json',
              extension: 'json'
            }
          }
        }
        setFileStructure(mockStructure)
        setLoading(false)
        return
      }
      
      if (response?.ok) {
        const data = await response.json()
        setFileStructure(data.codeStructure || data.structure)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load file structure',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchFileContent = async (filePath: string): Promise<string> => {
    try {
      if (deploymentId) {
        const response = await fetch(`/api/deployments/${deploymentId}/code`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filePath })
        })
        
        if (response.ok) {
          const data = await response.json()
          return data.content || ''
        }
      } else {
        // Mock file content for demonstration
        const mockContent = getMockFileContent(filePath)
        return mockContent
      }
      return ''
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load file content',
        variant: 'destructive'
      })
      return ''
    }
  }

  const getMockFileContent = (filePath: string): string => {
    if (filePath.includes('App.tsx')) {
      return `import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Your App
        </h1>
        <p className="text-lg text-gray-600">
          This is your main application component
        </p>
      </div>
    </div>
  )
}

export default App`
    }
    
    if (filePath.includes('package.json')) {
      return `{
  "name": "my-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}`
    }
    
    return '// New file\nconsole.log("Hello, World!");'
  }

  const openFile = async (path: string, name: string) => {
    const existingTab = openTabs.find(tab => tab.path === path)
    if (existingTab) {
      setActiveTab(existingTab.id)
      return
    }

    const content = await fetchFileContent(path)
    const language = getLanguageFromExtension(name)
    
    const newTab: OpenTab = {
      id: `tab-${Date.now()}`,
      name,
      path,
      content,
      language,
      isEdited: false
    }

    setOpenTabs(prev => [...prev, newTab])
    setActiveTab(newTab.id)
  }

  const closeTab = (tabId: string) => {
    const tab = openTabs.find(t => t.id === tabId)
    if (tab?.isEdited) {
      if (!confirm(`"${tab.name}" has unsaved changes. Close anyway?`)) {
        return
      }
    }

    setOpenTabs(prev => prev.filter(tab => tab.id !== tabId))
    
    if (activeTab === tabId) {
      const remainingTabs = openTabs.filter(tab => tab.id !== tabId)
      setActiveTab(remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1].id : null)
    }
  }

  const saveFile = async (tabId: string) => {
    const tab = openTabs.find(t => t.id === tabId)
    if (!tab || readOnly) return

    try {
      // For now, just simulate saving
      await new Promise(resolve => setTimeout(resolve, 500))

      setOpenTabs(prev => prev.map(t => 
        t.id === tabId ? { ...t, isEdited: false } : t
      ))
      
      toast({
        title: 'Saved',
        description: `File "${tab.name}" saved successfully`
      })
    } catch (error) {
      toast({
        title: 'Error', 
        description: 'Failed to save file',
        variant: 'destructive'
      })
    }
  }

  const updateTabContent = (tabId: string, newContent: string) => {
    setOpenTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, content: newContent, isEdited: tab.content !== newContent }
        : tab
    ))
  }

  const executeTerminalCommand = async (command: string) => {
    if (!command.trim()) return

    const commandEntry: TerminalEntry = {
      id: `cmd-${Date.now()}`,
      content: `$ ${command}`,
      type: 'command',
      timestamp: new Date()
    }

    setTerminalOutput(prev => [...prev, commandEntry])
    setTerminalCommand('')

    // Simulate command execution
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const outputEntry: TerminalEntry = {
      id: `out-${Date.now()}`,
      content: `Command "${command}" executed successfully`,
      type: 'output',
      timestamp: new Date()
    }

    setTerminalOutput(prev => [...prev, outputEntry])
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

  const getLanguageFromExtension = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'js': case 'jsx': return 'javascript'
      case 'ts': case 'tsx': return 'typescript'
      case 'css': case 'scss': return 'css'
      case 'html': case 'htm': return 'html'
      case 'json': return 'json'
      case 'md': return 'markdown'
      case 'py': return 'python'
      case 'java': return 'java'
      case 'php': return 'php'
      case 'rb': return 'ruby'
      case 'go': return 'go'
      case 'rs': return 'rust'
      case 'sql': return 'sql'
      case 'yaml': case 'yml': return 'yaml'
      case 'xml': return 'xml'
      default: return 'text'
    }
  }

  const renderFileTree = (node: FileNode, path = '', level = 0) => {
    if (!node.children) {
      return (
        <div
          key={path}
          className={`flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-accent rounded group ${
            openTabs.some(tab => tab.path === path) ? 'bg-accent' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          <FileText className="h-4 w-4 flex-shrink-0" />
          <span 
            className="text-sm flex-1 truncate"
            onClick={() => openFile(path, node.name)}
          >
            {node.name}
          </span>
          {node.extension && (
            <Badge variant="outline" className="text-xs">
              {node.extension}
            </Badge>
          )}
          {!readOnly && (
            <div className="opacity-0 group-hover:opacity-100 flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  // Delete functionality can be added here
                }}
                data-testid={`button-delete-${node.name}`}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      )
    }

    const isExpanded = expandedFolders.has(path)
    
    return (
      <div key={path}>
        <div
          className="flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-accent rounded group"
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          <div 
            className="flex items-center gap-2 flex-1"
            onClick={() => toggleFolder(path)}
          >
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 flex-shrink-0" />
            ) : (
              <Folder className="h-4 w-4 flex-shrink-0" />
            )}
            <span className="text-sm font-medium truncate">{node.name}</span>
          </div>
          {!readOnly && (
            <div className="opacity-0 group-hover:opacity-100 flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedFolder(path)
                  setIsCreatingFile(true)
                }}
                data-testid={`button-create-file-${node.name}`}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        {isExpanded && node.children && (
          <div>
            {Object.entries(node.children).map(([name, child]) =>
              renderFileTree(child, child.path || `${path}/${name}`, level + 1)
            )}
          </div>
        )}
      </div>
    )
  }

  const activeTabData = openTabs.find(tab => tab.id === activeTab)

  const mainContent = (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Enhanced Code Editor</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTerminalVisible(!isTerminalVisible)}
            data-testid="button-toggle-terminal"
          >
            <Terminal className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            data-testid="button-toggle-fullscreen"
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* File Explorer */}
        <div className="w-80 border-r flex flex-col">
          <div className="p-3 border-b">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Explorer</Label>
              {!readOnly && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFolder('.')
                    setIsCreatingFile(true)
                  }}
                  data-testid="button-new-file"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  New
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8"
                data-testid="input-search-files"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={fetchFileStructure}
                disabled={loading}
                data-testid="button-refresh-files"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            {loading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Loading...
              </div>
            ) : fileStructure ? (
              <div className="p-2">
                {renderFileTree(fileStructure)}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No files found
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Tab Bar */}
          {openTabs.length > 0 && (
            <div className="flex items-center border-b bg-muted/20 overflow-x-auto">
              {openTabs.map(tab => (
                <div
                  key={tab.id}
                  className={`flex items-center gap-2 px-3 py-2 border-r cursor-pointer hover:bg-accent whitespace-nowrap ${
                    activeTab === tab.id ? 'bg-background' : ''
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  data-testid={`tab-${tab.name}`}
                >
                  <FileIcon className="h-3 w-3" />
                  <span className="text-sm">
                    {tab.name}
                    {tab.isEdited && <span className="text-orange-500 ml-1">•</span>}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={(e) => {
                      e.stopPropagation()
                      closeTab(tab.id)
                    }}
                    data-testid={`button-close-tab-${tab.name}`}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Editor Content */}
          <div className="flex-1 relative">
            {activeTabData ? (
              <div className="h-full flex flex-col">
                {/* Editor Toolbar */}
                <div className="flex items-center justify-between p-2 border-b bg-muted/10">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {activeTabData.language}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {activeTabData.path}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {!readOnly && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => saveFile(activeTabData.id)}
                        disabled={!activeTabData.isEdited}
                        data-testid="button-save-file"
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(activeTabData.content)
                        toast({ description: 'Code copied to clipboard' })
                      }}
                      data-testid="button-copy-code"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Code Editor */}
                <div className="flex-1 flex flex-col">
                  {readOnly ? (
                    <div className="flex-1 overflow-auto">
                      <SyntaxHighlighter
                        language={activeTabData.language}
                        style={oneDark}
                        showLineNumbers={true}
                        wrapLines={true}
                        className="h-full text-sm"
                      >
                        {activeTabData.content}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <Tabs defaultValue="edit" className="flex-1 flex flex-col">
                      <TabsList className="w-fit mx-4 mt-2">
                        <TabsTrigger value="edit">Edit</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="edit" className="flex-1 mt-2">
                        <Textarea
                          value={activeTabData.content}
                          onChange={(e) => updateTabContent(activeTabData.id, e.target.value)}
                          className="flex-1 font-mono text-sm border-0 resize-none focus-visible:ring-0 h-full"
                          placeholder="Start coding..."
                          data-testid="textarea-code-editor"
                        />
                      </TabsContent>
                      
                      <TabsContent value="preview" className="flex-1 mt-2">
                        <div className="h-full overflow-auto">
                          <SyntaxHighlighter
                            language={activeTabData.language}
                            style={oneDark}
                            showLineNumbers={true}
                            wrapLines={true}
                            className="h-full text-sm"
                          >
                            {activeTabData.content}
                          </SyntaxHighlighter>
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Code className="h-12 w-12 mx-auto mb-4" />
                  <p>Select a file to start editing</p>
                  {!readOnly && (
                    <p className="text-sm mt-2">Or create a new file from the explorer</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Terminal Panel */}
      {isTerminalVisible && (
        <div className="border-t h-48 flex flex-col">
          <div className="flex items-center justify-between p-2 border-b bg-muted/20">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              <span className="text-sm font-medium">Terminal</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTerminalOutput([])}
              data-testid="button-clear-terminal"
            >
              Clear
            </Button>
          </div>
          
          <ScrollArea className="flex-1" ref={terminalRef}>
            <div className="p-2 font-mono text-sm space-y-1">
              {terminalOutput.map(entry => (
                <div
                  key={entry.id}
                  className={`${
                    entry.type === 'command' ? 'text-blue-400' :
                    entry.type === 'error' ? 'text-red-400' :
                    'text-green-400'
                  }`}
                >
                  {entry.content}
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="border-t p-2">
            <div className="flex gap-2">
              <span className="text-sm text-muted-foreground font-mono">$</span>
              <Input
                value={terminalCommand}
                onChange={(e) => setTerminalCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    executeTerminalCommand(terminalCommand)
                  }
                }}
                placeholder="Enter command..."
                className="flex-1 font-mono text-sm border-0 focus-visible:ring-0"
                data-testid="input-terminal-command"
              />
              <Button
                size="sm"
                onClick={() => executeTerminalCommand(terminalCommand)}
                disabled={!terminalCommand.trim()}
                data-testid="button-execute-command"
              >
                <Play className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create File Dialog */}
      <Dialog open={isCreatingFile} onOpenChange={setIsCreatingFile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Folder</Label>
              <Input
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                placeholder="Folder path"
                data-testid="input-folder-path"
              />
            </div>
            <div>
              <Label>File Name</Label>
              <Input
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="example.js"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // Create file logic here
                  }
                }}
                data-testid="input-new-filename"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  // Create file logic
                  setIsCreatingFile(false)
                  toast({ description: 'File creation feature coming soon' })
                }}
                disabled={!newFileName.trim()}
                data-testid="button-create-file"
              >
                Create File
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsCreatingFile(false)}
                data-testid="button-cancel-create"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )

  if (isFullscreen) {
    return (
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] h-[95vh] p-0">
          {mainContent}
        </DialogContent>
      </Dialog>
    )
  }

  return mainContent
}

export default EnhancedCodeEditor