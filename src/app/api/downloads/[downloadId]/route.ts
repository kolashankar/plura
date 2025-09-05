import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { promises as fs } from 'fs'
import { join } from 'path'

export async function GET(
  req: NextRequest,
  { params }: { params: { downloadId: string } }
) {
  try {
    const { downloadId } = params

    if (!downloadId) {
      return NextResponse.json(
        { error: 'Download ID is required' },
        { status: 400 }
      )
    }

    // Get download record
    const download = await db.projectDownload.findUnique({
      where: { id: downloadId }
    })

    if (!download) {
      return NextResponse.json(
        { error: 'Download not found' },
        { status: 404 }
      )
    }

    // Check if download has expired
    if (download.expiresAt && download.expiresAt < new Date()) {
      await db.projectDownload.update({
        where: { id: downloadId },
        data: { status: 'expired' }
      })
      
      return NextResponse.json(
        { error: 'Download has expired' },
        { status: 410 }
      )
    }

    // Check if download is ready
    if (download.status !== 'ready') {
      return NextResponse.json(
        { error: `Download is ${download.status}` },
        { status: 400 }
      )
    }

    // Update download count and last downloaded time
    await db.projectDownload.update({
      where: { id: downloadId },
      data: {
        downloadCount: download.downloadCount + 1,
        lastDownloadedAt: new Date()
      }
    })

    // For this implementation, we'll regenerate the files on demand
    // In production, you might want to cache the generated ZIP files
    const projectFiles = await regenerateProjectFiles(download)
    
    // Create temporary ZIP file
    const tempDir = join(process.cwd(), 'temp', downloadId)
    const zipPath = join(tempDir, 'project.zip')
    
    try {
      await fs.mkdir(tempDir, { recursive: true })
      
      // Write project files to temp directory
      for (const [filePath, content] of Object.entries(projectFiles)) {
        const fullPath = join(tempDir, filePath)
        const dir = fullPath.substring(0, fullPath.lastIndexOf('/'))
        if (dir) {
          await fs.mkdir(dir, { recursive: true })
        }
        await fs.writeFile(fullPath, content as string)
      }

      // Create ZIP using archiver would go here
      // For simplicity, we'll return the project as JSON
      const zipBuffer = Buffer.from(JSON.stringify(projectFiles))
      
      // Clean up temp directory
      setTimeout(async () => {
        try {
          await fs.rmdir(tempDir, { recursive: true })
        } catch (error) {
          console.error('Failed to clean up temp directory:', error)
        }
      }, 1000)

      return new NextResponse(zipBuffer, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${download.name}-${download.format}.zip"`,
          'Content-Length': zipBuffer.length.toString()
        }
      })
    } catch (error) {
      // Clean up on error
      try {
        await fs.rmdir(tempDir, { recursive: true })
      } catch {}
      throw error
    }
  } catch (error) {
    console.error('Error downloading project:', error)
    return NextResponse.json(
      { error: 'Failed to download project' },
      { status: 500 }
    )
  }
}

async function regenerateProjectFiles(download: any): Promise<Record<string, string>> {
  const files: Record<string, string> = {}

  // Get funnel data if available
  let funnel = null
  if (download.funnelId) {
    funnel = await db.funnel.findUnique({
      where: { id: download.funnelId },
      include: {
        FunnelPages: {
          orderBy: { order: 'asc' }
        }
      }
    })
  }

  // Generate basic project structure based on format
  switch (download.format) {
    case 'react':
    case 'nextjs':
      files['package.json'] = generatePackageJson(download.format, download.name)
      files['src/App.tsx'] = generateReactApp(funnel)
      files['README.md'] = generateReadme(download.name, download.format)
      break
      
    case 'react-native':
      files['package.json'] = generateRNPackageJson(download.name)
      files['App.tsx'] = generateRNApp(funnel)
      files['app.json'] = generateAppJson(download.name)
      break
      
    default:
      files['index.html'] = generateBasicHTML(download.name, funnel)
      files['styles.css'] = generateBasicCSS()
      break
  }

  return files
}

// Helper functions (simplified versions)
function generatePackageJson(format: string, name: string): string {
  return JSON.stringify({
    name: name.toLowerCase().replace(/\s+/g, '-'),
    version: "1.0.0",
    private: true,
    scripts: {
      dev: format === 'nextjs' ? 'next dev' : 'vite',
      build: format === 'nextjs' ? 'next build' : 'vite build'
    }
  }, null, 2)
}

function generateReactApp(funnel: any): string {
  return `import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        ${funnel?.name || 'Generated Project'}
      </h1>
      <p className="text-center text-gray-600">
        ${funnel?.description || 'Your project is ready to customize!'}
      </p>
    </div>
  )
}

export default App`
}

function generateRNPackageJson(name: string): string {
  return JSON.stringify({
    name: name.toLowerCase().replace(/\s+/g, '-'),
    version: "1.0.0",
    main: "node_modules/expo/AppEntry.js"
  }, null, 2)
}

function generateRNApp(funnel: any): string {
  return `import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>${funnel?.name || 'Generated App'}</Text>
      <Text style={styles.description}>
        ${funnel?.description || 'Your mobile app is ready!'}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
})`
}

function generateAppJson(name: string): string {
  return JSON.stringify({
    expo: {
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      version: "1.0.0"
    }
  }, null, 2)
}

function generateBasicHTML(name: string, funnel: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>${funnel?.name || name}</h1>
        <p>${funnel?.description || 'Your project is ready!'}</p>
    </div>
</body>
</html>`
}

function generateBasicCSS(): string {
  return `.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
    font-family: system-ui, sans-serif;
}

h1 {
    color: #333;
    margin-bottom: 1rem;
}

p {
    color: #666;
    line-height: 1.6;
}`
}

function generateReadme(name: string, format: string): string {
  return `# ${name}

A project generated with the funnel builder.

## Getting Started

1. Install dependencies: \`npm install\`
2. Start development: \`npm run dev\`
3. Build for production: \`npm run build\`

## Technology Stack

- ${format === 'nextjs' ? 'Next.js' : format === 'react' ? 'React' : 'React Native'}
- TypeScript
- Tailwind CSS
`
}