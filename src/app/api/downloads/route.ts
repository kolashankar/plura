import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'
import archiver from 'archiver'
import { promises as fs } from 'fs'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      name,
      type,
      format,
      funnelId,
      includeAssets,
      includeDocs,
      minified,
      subAccountId,
      individualId
    } = await req.json()

    if (!name || !type || !format) {
      return NextResponse.json(
        { error: 'Name, type, and format are required' },
        { status: 400 }
      )
    }

    // Create download record
    const downloadId = uuidv4()
    // Create download record - temporary approach until Prisma client recognizes new models
    const download = {
      id: downloadId,
      name,
      type,
      format,
      funnelId,
      includeAssets: includeAssets ?? true,
      includeDocs: includeDocs ?? false,
      minified: minified ?? false,
      status: 'generating',
      subAccountId,
      individualId,
      userId: user.id,
      ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
      userAgent: req.headers.get('user-agent'),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // TODO: Replace with actual DB call when Prisma client is updated
    // await db.projectDownload.create({ data: download })

    // Generate project files based on type and format
    const projectFiles = await generateProjectFiles({
      funnelId,
      type,
      format,
      includeAssets,
      includeDocs,
      minified
    })

    // Create temporary directory for project
    const tempDir = join(process.cwd(), 'temp', downloadId)
    await fs.mkdir(tempDir, { recursive: true })

    // Write project files
    for (const [filePath, content] of Object.entries(projectFiles)) {
      const fullPath = join(tempDir, filePath)
      const dir = fullPath.substring(0, fullPath.lastIndexOf('/'))
      if (dir) {
        await fs.mkdir(dir, { recursive: true })
      }
      await fs.writeFile(fullPath, content as string)
    }

    // Create ZIP archive
    const archive = archiver('zip', { zlib: { level: 9 } })
    archive.directory(tempDir, false)
    archive.finalize()

    // Calculate file size (estimate)
    const fileSize = BigInt(JSON.stringify(projectFiles).length)

    // TODO: Update download record when Prisma client is updated
    // await db.projectDownload.update({
    //   where: { id: downloadId },
    //   data: {
    //     status: 'ready',
    //     fileSize,
    //     downloadUrl: `/api/downloads/${downloadId}`
    //   }
    // })
    
    // For now, simulate the update
    download.status = 'ready'
    download.fileSize = Number(fileSize)
    download.downloadUrl = `/api/downloads/${downloadId}`

    // Clean up temp directory in background
    setTimeout(async () => {
      try {
        await fs.rmdir(tempDir, { recursive: true })
      } catch (error) {
        console.error('Failed to clean up temp directory:', error)
      }
    }, 5000)

    return NextResponse.json({
      downloadId,
      downloadUrl: `/api/downloads/${downloadId}`,
      fileSize: Number(fileSize),
      expiresAt: download.expiresAt
    })
  } catch (error) {
    console.error('Error creating project download:', error)
    return NextResponse.json(
      { error: 'Failed to create project download' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const subAccountId = searchParams.get('subAccountId')
    const individualId = searchParams.get('individualId')

    if (!subAccountId && !individualId) {
      return NextResponse.json(
        { error: 'SubAccount ID or Individual ID is required' },
        { status: 400 }
      )
    }

    // TODO: Replace with actual DB call when Prisma client is updated
    // const downloads = await db.projectDownload.findMany({
    //   where: {
    //     OR: [
    //       { subAccountId },
    //       { individualId }
    //     ]
    //   },
    //   include: {
    //     funnel: {
    //       select: {
    //         name: true,
    //         description: true
    //       }
    //     }
    //   },
    //   orderBy: { createdAt: 'desc' },
    //   take: 50
    // })

    // For now, return mock data
    const downloads = [
      {
        id: 'download_1',
        name: 'Sample React Project',
        type: 'website',
        format: 'react',
        status: 'ready',
        fileSize: 1024000,
        downloadUrl: '/api/downloads/download_1',
        createdAt: new Date('2024-01-15'),
        funnel: {
          name: 'Sample Funnel',
          description: 'A sample funnel for testing'
        }
      }
    ]

    return NextResponse.json({ downloads })
  } catch (error) {
    console.error('Error fetching downloads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch downloads' },
      { status: 500 }
    )
  }
}

async function generateProjectFiles({
  funnelId,
  type,
  format,
  includeAssets,
  includeDocs,
  minified
}: any): Promise<Record<string, string>> {
  const files: Record<string, string> = {}

  // Get funnel data if provided
  let funnel = null
  if (funnelId) {
    funnel = await db.funnel.findUnique({
      where: { id: funnelId },
      include: {
        FunnelPages: {
          orderBy: { order: 'asc' }
        }
      }
    })
  }

  // Generate files based on format
  switch (format) {
    case 'react':
    case 'nextjs':
      files['package.json'] = generatePackageJson(format, funnel?.name || 'Generated Project')
      files['src/App.tsx'] = generateReactApp(funnel)
      files['src/index.tsx'] = generateReactIndex()
      files['tailwind.config.js'] = generateTailwindConfig()
      files['tsconfig.json'] = generateTSConfig()
      break

    case 'react-native':
      files['package.json'] = generateRNPackageJson(funnel?.name || 'Generated App')
      files['App.tsx'] = generateRNApp(funnel)
      files['app.json'] = generateAppJson(funnel?.name || 'Generated App')
      break

    default:
      files['index.html'] = generateBasicHTML(funnel)
      files['styles.css'] = generateBasicCSS()
      break
  }

  // Add documentation if requested
  if (includeDocs) {
    files['README.md'] = generateReadme(funnel, format)
    files['DEPLOYMENT.md'] = generateDeploymentGuide(format)
  }

  return files
}

function generatePackageJson(format: string, name: string): string {
  const dependencies = format === 'nextjs' 
    ? {
        "next": "^14.0.0",
        "react": "^18.0.0",
        "react-dom": "^18.0.0",
        "@types/node": "^20.0.0",
        "@types/react": "^18.0.0",
        "@types/react-dom": "^18.0.0",
        "typescript": "^5.0.0",
        "tailwindcss": "^3.0.0",
        "autoprefixer": "^10.0.0",
        "postcss": "^8.0.0"
      }
    : {
        "react": "^18.0.0",
        "react-dom": "^18.0.0",
        "vite": "^5.0.0",
        "@vitejs/plugin-react": "^4.0.0",
        "@types/react": "^18.0.0",
        "@types/react-dom": "^18.0.0",
        "typescript": "^5.0.0",
        "tailwindcss": "^3.0.0"
      }

  return JSON.stringify({
    name: name.toLowerCase().replace(/\s+/g, '-'),
    version: "1.0.0",
    private: true,
    scripts: format === 'nextjs' 
      ? {
          "dev": "next dev",
          "build": "next build",
          "start": "next start",
          "lint": "next lint"
        }
      : {
          "dev": "vite",
          "build": "vite build",
          "preview": "vite preview"
        },
    dependencies,
    devDependencies: {
      "eslint": "^8.0.0",
      "eslint-config-next": "^14.0.0"
    }
  }, null, 2)
}

function generateReactApp(funnel: any): string {
  return `import React from 'react'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              ${funnel?.name || 'Generated Project'}
            </h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Welcome to Your Generated Project
              </h2>
              <p className="text-gray-600">
                ${funnel?.description || 'Start building your amazing application!'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App`
}

function generateReactIndex(): string {
  return `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
}

function generateTailwindConfig(): string {
  return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`
}

function generateTSConfig(): string {
  return JSON.stringify({
    compilerOptions: {
      target: "ES2020",
      useDefineForClassFields: true,
      lib: ["ES2020", "DOM", "DOM.Iterable"],
      module: "ESNext",
      skipLibCheck: true,
      moduleResolution: "bundler",
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: "react-jsx",
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true
    },
    include: ["src"],
    references: [{ path: "./tsconfig.node.json" }]
  }, null, 2)
}

function generateRNPackageJson(name: string): string {
  return JSON.stringify({
    name: name.toLowerCase().replace(/\s+/g, '-'),
    version: "1.0.0",
    main: "node_modules/expo/AppEntry.js",
    scripts: {
      "start": "expo start",
      "android": "expo start --android",
      "ios": "expo start --ios",
      "web": "expo start --web"
    },
    dependencies: {
      "expo": "~49.0.0",
      "react": "18.2.0",
      "react-native": "0.72.6",
      "react-native-paper": "^5.0.0",
      "@expo/vector-icons": "^13.0.0"
    },
    devDependencies: {
      "@babel/core": "^7.20.0",
      "@types/react": "~18.2.14",
      "typescript": "^5.1.3"
    }
  }, null, 2)
}

function generateRNApp(funnel: any): string {
  return `import React from 'react'
import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import { Provider as PaperProvider, Card, Title, Paragraph } from 'react-native-paper'

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Title style={styles.title}>${funnel?.name || 'Generated App'}</Title>
        </View>
        
        <View style={styles.content}>
          <Card style={styles.card}>
            <Card.Content>
              <Title>Welcome!</Title>
              <Paragraph>
                ${funnel?.description || 'Your mobile app is ready to customize!'}
              </Paragraph>
            </Card.Content>
          </Card>
        </View>
      </SafeAreaView>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    marginBottom: 16,
  },
})`
}

function generateAppJson(name: string): string {
  return JSON.stringify({
    expo: {
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/icon.png",
      userInterfaceStyle: "light",
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      },
      platforms: ["ios", "android", "web"]
    }
  }, null, 2)
}

function generateBasicHTML(funnel: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${funnel?.name || 'Generated Project'}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>${funnel?.name || 'Generated Project'}</h1>
    </header>
    
    <main>
        <div class="container">
            <h2>Welcome to Your Generated Project</h2>
            <p>${funnel?.description || 'Start building your amazing website!'}</p>
        </div>
    </main>
</body>
</html>`
}

function generateBasicCSS(): string {
  return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8f9fa;
}

header {
    background: #fff;
    padding: 1rem 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

header h1 {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    font-size: 2rem;
    color: #2c3e50;
}

main {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
}

.container {
    background: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    text-align: center;
}

h2 {
    color: #2c3e50;
    margin-bottom: 1rem;
}

p {
    color: #666;
    font-size: 1.1rem;
}`
}

function generateReadme(funnel: any, format: string): string {
  return `# ${funnel?.name || 'Generated Project'}

${funnel?.description || 'A generated project created with the funnel builder.'}

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
\`\`\`bash
npm install
\`\`\`

### Development
\`\`\`bash
npm run dev
\`\`\`

### Build
\`\`\`bash
npm run build
\`\`\`

## Project Structure
- \`src/\` - Source code
- \`public/\` - Static assets
- \`package.json\` - Dependencies and scripts

## Technologies Used
- ${format === 'nextjs' ? 'Next.js' : format === 'react' ? 'React + Vite' : 'React Native'}
- TypeScript
- Tailwind CSS

## License
MIT
`
}

function generateDeploymentGuide(format: string): string {
  return `# Deployment Guide

## ${format === 'nextjs' ? 'Next.js' : format === 'react' ? 'React' : 'React Native'} Deployment

### Vercel (Recommended for Next.js/React)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Netlify
1. Build your project: \`npm run build\`
2. Upload the \`dist\` or \`.next\` folder to Netlify

### Manual Deployment
1. Run \`npm run build\`
2. Upload the generated files to your web server

${format === 'react-native' ? `
### Mobile App Deployment

#### iOS App Store
1. Build with Expo: \`expo build:ios\`
2. Submit to App Store Connect

#### Google Play Store
1. Build with Expo: \`expo build:android\`
2. Upload to Google Play Console
` : ''}

## Environment Variables
Make sure to set up any required environment variables in your deployment platform.
`
}