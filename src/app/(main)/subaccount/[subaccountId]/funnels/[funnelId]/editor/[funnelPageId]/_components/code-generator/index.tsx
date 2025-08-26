
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Code, Download, Copy, FolderTree } from 'lucide-react'
import { toast } from 'sonner'

interface CodeGeneratorProps {
  pageData?: any // This would contain the current page structure
}

export default function CodeGenerator({ pageData }: CodeGeneratorProps) {
  const [generatedCode, setGeneratedCode] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateCode = async () => {
    setIsGenerating(true)
    
    // Simulate code generation process
    setTimeout(() => {
      const code = {
        structure: {
          'src/': {
            'components/': {
              'ui/': {
                'button.tsx': 'Button component code...',
                'card.tsx': 'Card component code...',
                'input.tsx': 'Input component code...'
              },
              'layout/': {
                'header.tsx': 'Header component code...',
                'footer.tsx': 'Footer component code...',
                'sidebar.tsx': 'Sidebar component code...'
              },
              'sections/': {
                'hero.tsx': 'Hero section code...',
                'features.tsx': 'Features section code...',
                'testimonials.tsx': 'Testimonials section code...'
              }
            },
            'pages/': {
              'index.tsx': 'Main page code...',
              '_app.tsx': 'App wrapper code...',
              '_document.tsx': 'Document structure code...'
            },
            'styles/': {
              'globals.css': 'Global styles...',
              'components.css': 'Component styles...'
            },
            'lib/': {
              'utils.ts': 'Utility functions...',
              'constants.ts': 'Constants and configurations...'
            },
            'hooks/': {
              'useLocalStorage.ts': 'Local storage hook...',
              'useDebounce.ts': 'Debounce hook...'
            }
          },
          'public/': {
            'images/': {
              'logo.png': 'Logo image...',
              'hero-bg.jpg': 'Hero background image...'
            },
            'icons/': {
              'favicon.ico': 'Favicon...'
            }
          },
          'package.json': JSON.stringify({
            name: 'generated-website',
            version: '1.0.0',
            scripts: {
              dev: 'next dev',
              build: 'next build',
              start: 'next start',
              lint: 'next lint'
            },
            dependencies: {
              'next': '^14.0.0',
              'react': '^18.0.0',
              'react-dom': '^18.0.0',
              'tailwindcss': '^3.0.0',
              'typescript': '^5.0.0'
            }
          }, null, 2),
          'tsconfig.json': JSON.stringify({
            compilerOptions: {
              target: 'es5',
              lib: ['dom', 'dom.iterable', 'es6'],
              allowJs: true,
              skipLibCheck: true,
              strict: true,
              forceConsistentCasingInFileNames: true,
              noEmit: true,
              esModuleInterop: true,
              module: 'esnext',
              moduleResolution: 'node',
              resolveJsonModule: true,
              isolatedModules: true,
              jsx: 'preserve',
              incremental: true,
              plugins: [{ name: 'next' }],
              baseUrl: '.',
              paths: { '@/*': ['./src/*'] }
            },
            include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
            exclude: ['node_modules']
          }, null, 2),
          'tailwind.config.js': `module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#007adf',
        secondary: '#00ecbc'
      }
    }
  },
  plugins: []
}`
        }
      }
      setGeneratedCode(code)
      setIsGenerating(false)
      toast.success('Code generated successfully!')
    }, 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const downloadProject = () => {
    // This would trigger a download of the entire project as a ZIP file
    toast.success('Project download started!')
  }

  const renderFileTree = (structure: any, path = '') => {
    return Object.entries(structure).map(([key, value]) => {
      const currentPath = path ? `${path}/${key}` : key
      const isFile = typeof value === 'string'
      
      return (
        <div key={currentPath} className="ml-4">
          <div className="flex items-center gap-2 py-1">
            {isFile ? (
              <>
                <span className="text-sm font-mono">{key}</span>
                <Badge variant="outline" className="text-xs">
                  {key.split('.').pop()}
                </Badge>
              </>
            ) : (
              <>
                <FolderTree className="w-4 h-4" />
                <span className="text-sm font-semibold">{key}</span>
              </>
            )}
          </div>
          {!isFile && renderFileTree(value, currentPath)}
        </div>
      )
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Code className="w-4 h-4" />
          Generate Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Website Code Generator</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 h-full">
          <div className="w-1/3">
            <div className="text-center mb-4">
              <Button 
                onClick={generateCode} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? 'Generating...' : 'Generate Full Project'}
              </Button>
            </div>

            {generatedCode && (
              <div>
                <h3 className="font-semibold mb-2">Project Structure</h3>
                <ScrollArea className="h-96 border rounded-lg p-4">
                  {renderFileTree(generatedCode.structure)}
                </ScrollArea>
                
                <div className="flex gap-2 mt-4">
                  <Button onClick={downloadProject} className="flex-1 gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1">
            {generatedCode ? (
              <Tabs defaultValue="preview" className="h-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="components">Components</TabsTrigger>
                  <TabsTrigger value="pages">Pages</TabsTrigger>
                  <TabsTrigger value="config">Config</TabsTrigger>
                </TabsList>

                <TabsContent value="preview" className="h-96">
                  <ScrollArea className="h-full border rounded-lg p-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Generated Website Preview</h3>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Your website has been converted to a complete Next.js project with:
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                          <li>Responsive React components</li>
                          <li>TypeScript support</li>
                          <li>Tailwind CSS styling</li>
                          <li>SEO optimized structure</li>
                          <li>Production-ready configuration</li>
                        </ul>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="components" className="h-96">
                  <ScrollArea className="h-full">
                    <div className="space-y-4">
                      {Object.entries(generatedCode.structure['src/']['components/']).map(([folder, files]: [string, any]) => (
                        <div key={folder} className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">{folder}</h4>
                          {Object.entries(files).map(([file, content]: [string, any]) => (
                            <div key={file} className="mb-2">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-sm">{file}</span>
                                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(content)}>
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                              <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                                {content}
                              </pre>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="pages" className="h-96">
                  <ScrollArea className="h-full">
                    <div className="space-y-4">
                      {Object.entries(generatedCode.structure['src/']['pages/']).map(([file, content]: [string, any]) => (
                        <div key={file} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{file}</h4>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(content)}>
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                            {content}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="config" className="h-96">
                  <ScrollArea className="h-full">
                    <div className="space-y-4">
                      {['package.json', 'tsconfig.json', 'tailwind.config.js'].map((file) => (
                        <div key={file} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{file}</h4>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(generatedCode.structure[file])}>
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                            {generatedCode.structure[file]}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Click "Generate Full Project" to see the code output
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
