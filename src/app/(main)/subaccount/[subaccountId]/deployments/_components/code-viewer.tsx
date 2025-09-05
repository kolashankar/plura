'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Code,
  FileText,
  Folder,
  FolderOpen,
  Download,
  Eye,
  Copy,
  RefreshCw,
  ExternalLink
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type FileNode = {
  type: 'file' | 'directory'
  name: string
  path?: string
  children?: { [key: string]: FileNode }
  size?: number
  extension?: string
}

type CodeViewerProps = {
  deploymentId: string
  deploymentUrl?: string
}

const CodeViewer = ({ deploymentId, deploymentUrl }: CodeViewerProps) => {
  const [codeStructure, setCodeStructure] = useState<FileNode | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  useEffect(() => {
    if (deploymentId) {
      fetchCodeStructure()
    }
  }, [deploymentId])

  const fetchCodeStructure = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/deployments/${deploymentId}/code`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch code structure')
      }
      
      const data = await response.json()
      setCodeStructure(data.codeStructure)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load code structure',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchFileContent = async (filePath: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/deployments/${deploymentId}/code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath })
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch file content')
      }
      
      const data = await response.json()
      setFileContent(data.content)
      setSelectedFile(filePath)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load file content',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
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

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: 'Copied',
      description: 'File content copied to clipboard'
    })
  }

  const downloadCode = async () => {
    try {
      const response = await fetch('/api/code/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deploymentId, format: 'react' })
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.requiresPremium) {
          toast({
            title: 'Premium Required',
            description: 'Code download requires a premium subscription',
            variant: 'destructive'
          })
          return
        }
        throw new Error('Download failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `deployment-${deploymentId}-code.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: 'Success',
        description: 'Code downloaded successfully'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download code',
        variant: 'destructive'
      })
    }
  }

  const renderFileTree = (node: FileNode, path = '', level = 0) => {
    if (!node.children) {
      return (
        <div
          key={path}
          className={`flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-accent rounded ${
            selectedFile === path ? 'bg-accent' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => fetchFileContent(path)}
        >
          <FileText className="h-4 w-4" />
          <span className="text-sm">{node.name}</span>
          {node.extension && (
            <Badge variant="outline" className="text-xs">
              {node.extension}
            </Badge>
          )}
        </div>
      )
    }

    const isExpanded = expandedFolders.has(path)
    
    return (
      <div key={path}>
        <div
          className="flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-accent rounded"
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => toggleFolder(path)}
        >
          {isExpanded ? (
            <FolderOpen className="h-4 w-4" />
          ) : (
            <Folder className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">{node.name}</span>
        </div>
        {isExpanded && (
          <div>
            {Object.entries(node.children).map(([name, child]) =>
              renderFileTree(child, child.path || `${path}/${name}`, level + 1)
            )}
          </div>
        )}
      </div>
    )
  }

  const getLanguageFromExtension = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'js': case 'jsx': return 'javascript'
      case 'ts': case 'tsx': return 'typescript'
      case 'css': return 'css'
      case 'html': case 'htm': return 'html'
      case 'json': return 'json'
      case 'md': return 'markdown'
      case 'py': return 'python'
      default: return 'text'
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" data-testid="button-view-code">
          <Code className="h-4 w-4 mr-2" />
          View Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Code Viewer - Deployment {deploymentId}</DialogTitle>
          <DialogDescription>
            Browse and view the generated code for this deployment
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 mb-4">
          <Button onClick={fetchCodeStructure} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button onClick={downloadCode} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download ZIP
          </Button>
          
          {deploymentUrl && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(deploymentUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Live Site
            </Button>
          )}
        </div>

        <Tabs defaultValue="files" className="flex-1">
          <TabsList>
            <TabsTrigger value="files">File Browser</TabsTrigger>
            <TabsTrigger value="code">Code View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="files" className="flex gap-4 h-full">
            {/* File Tree */}
            <Card className="w-1/3 h-[500px] overflow-auto">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Files</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : codeStructure ? (
                  renderFileTree(codeStructure)
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No files found
                  </div>
                )}
              </CardContent>
            </Card>

            {/* File Content */}
            <Card className="flex-1 h-[500px]">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">
                    {selectedFile || 'Select a file to view'}
                  </CardTitle>
                  {selectedFile && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(fileContent)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0 h-[400px] overflow-auto">
                {selectedFile ? (
                  <pre className="text-sm bg-muted p-4 rounded h-full overflow-auto">
                    <code>{fileContent}</code>
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Code className="h-12 w-12 mx-auto mb-4" />
                      <p>Select a file from the tree to view its content</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="code" className="h-full">
            <Card className="h-[500px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Full Code Structure</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 h-[400px] overflow-auto">
                <pre className="text-xs bg-muted p-4 rounded h-full overflow-auto">
                  <code>
                    {codeStructure ? JSON.stringify(codeStructure, null, 2) : 'Loading...'}
                  </code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default CodeViewer