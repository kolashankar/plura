import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'
import JSZip from 'jszip'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { themeId, includeSource = false } = await req.json()

    if (!themeId) {
      return NextResponse.json({ error: 'Theme ID is required' }, { status: 400 })
    }

    // Get theme data
    const theme = await db.theme.findUnique({
      where: { id: themeId },
      include: {
        seller: {
          select: { id: true, name: true }
        }
      }
    })

    if (!theme) {
      return NextResponse.json({ error: 'Theme not found' }, { status: 404 })
    }

    // Check if user has purchased the theme or owns it
    const hasAccess = theme.sellerId === user.id || !theme.isPremium

    if (theme.isPremium && !hasAccess) {
      // Check if user has purchased this theme
      const purchase = await db.purchase.findFirst({
        where: {
          userId: user.id,
          itemId: themeId,
          itemType: 'theme'
        }
      })

      if (!purchase) {
        return NextResponse.json({ 
          error: 'Theme purchase required',
          requiresPurchase: true,
          price: theme.price
        }, { status: 402 })
      }
    }

    // Create ZIP file
    const zip = new JSZip()
    
    // Parse theme files
    let themeFiles: { [key: string]: string } = {}
    try {
      themeFiles = JSON.parse(theme.files || '{}')
    } catch (error) {
      return NextResponse.json({ error: 'Invalid theme data' }, { status: 500 })
    }

    // Add theme files to ZIP
    for (const [filePath, content] of Object.entries(themeFiles)) {
      zip.file(filePath, content)
    }

    // Add theme metadata
    const metadata = {
      name: theme.name,
      description: theme.description,
      category: theme.category,
      version: '1.0.0',
      author: theme.seller?.name || 'Unknown',
      downloadedAt: new Date().toISOString(),
      includeSource
    }

    zip.file('theme-info.json', JSON.stringify(metadata, null, 2))

    // Add README file
    const readme = `# ${theme.name}

${theme.description}

## Installation

1. Extract this ZIP file
2. Import the theme into your Plura workspace
3. Customize as needed

## Support

For support, please contact the theme author: ${theme.seller?.name || 'Unknown'}

---
Downloaded from Plura Marketplace
`

    zip.file('README.md', readme)

    // Generate additional project files if source is included
    if (includeSource) {
      // Add package.json for development
      const packageJson = {
        name: theme.name.toLowerCase().replace(/\s+/g, '-'),
        version: '1.0.0',
        description: theme.description,
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start'
        },
        dependencies: {
          'next': '^14.0.0',
          'react': '^18.0.0',
          'react-dom': '^18.0.0',
          'tailwindcss': '^3.0.0'
        },
        devDependencies: {
          'typescript': '^5.0.0',
          '@types/react': '^18.0.0',
          '@types/node': '^20.0.0'
        }
      }

      zip.file('package.json', JSON.stringify(packageJson, null, 2))

      // Add development configuration files
      zip.file('next.config.js', `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig`)

      zip.file('tailwind.config.js', `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`)

      zip.file('tsconfig.json', JSON.stringify({
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
          paths: { '@/*': ['./src/*'] }
        },
        include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
        exclude: ['node_modules']
      }, null, 2))
    }

    // Record download
    try {
      await db.download.create({
        data: {
          userId: user.id,
          itemId: themeId,
          itemType: 'theme',
          downloadedAt: new Date()
        }
      })

      // Update download count
      await db.theme.update({
        where: { id: themeId },
        data: {
          downloads: { increment: 1 }
        }
      })
    } catch (dbError) {
      console.error('Error recording download:', dbError)
      // Continue with download even if DB update fails
    }

    // Generate ZIP buffer
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    // Return ZIP file
    return new Response(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${theme.name.replace(/[^a-zA-Z0-9]/g, '-')}-theme.zip"`
      }
    })

  } catch (error) {
    console.error('Theme download failed:', error)
    return NextResponse.json({ 
      error: 'Download failed',
      details: error.message 
    }, { status: 500 })
  }
}