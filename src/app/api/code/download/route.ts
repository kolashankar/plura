
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

    const { funnelId, format = 'react', language = 'typescript' } = await req.json()

    // Check premium status
    const userSubscription = await db.subscription.findFirst({
      where: {
        userId: user.id,
        active: true,
      },
    })

    const plan = userSubscription?.plan || 'free'
    const canDownload = ['basic', 'unlimited'].includes(plan)

    if (!canDownload) {
      return NextResponse.json({ 
        error: 'Premium subscription required for code download',
        requiresPremium: true 
      }, { status: 403 })
    }

    // Get funnel data
    const funnel = await db.funnel.findUnique({
      where: { id: funnelId },
      include: {
        FunnelPages: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!funnel) {
      return NextResponse.json({ error: 'Funnel not found' }, { status: 404 })
    }

    // Generate code based on format and language
    const zip = new JSZip()
    
    // Add package.json
    const packageJson = {
      name: funnel.name.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start'
      },
      dependencies: {
        'next': '^14.0.0',
        'react': '^18.0.0',
        'react-dom': '^18.0.0'
      }
    }
    
    if (language === 'typescript') {
      packageJson.dependencies['typescript'] = '^5.0.0'
      packageJson.dependencies['@types/react'] = '^18.0.0'
      packageJson.dependencies['@types/node'] = '^20.0.0'
    }

    zip.file('package.json', JSON.stringify(packageJson, null, 2))

    // Add pages
    for (const page of funnel.FunnelPages) {
      const fileExtension = language === 'typescript' ? 'tsx' : 'jsx'
      const pageContent = generatePageCode(page, language, format)
      zip.file(`pages/${page.name}.${fileExtension}`, pageContent)
    }

    // Add basic layout and configuration files
    const layoutContent = generateLayoutCode(language)
    zip.file(`app/layout.${language === 'typescript' ? 'tsx' : 'jsx'}`, layoutContent)

    if (language === 'typescript') {
      const tsConfig = {
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
      }
      zip.file('tsconfig.json', JSON.stringify(tsConfig, null, 2))
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    return new Response(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${funnel.name}-code.zip"`
      }
    })

  } catch (error) {
    console.error('Error generating code download:', error)
    return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 })
  }
}

function generatePageCode(page: any, language: string, format: string): string {
  const isTypeScript = language === 'typescript'
  const fileExtension = isTypeScript ? 'tsx' : 'jsx'
  
  return `${isTypeScript ? "import React from 'react'" : "import React from 'react'"}

export default function ${page.name.replace(/[^a-zA-Z0-9]/g, '')}Page()${isTypeScript ? ': React.FC' : ''} {
  return (
    <div className="min-h-screen">
      <h1>${page.name}</h1>
      {/* Generated from funnel page content */}
      <div dangerouslySetInnerHTML={{ __html: \`${page.content || '<p>Page content</p>'}\` }} />
    </div>
  )
}
`
}

function generateLayoutCode(language: string): string {
  const isTypeScript = language === 'typescript'
  
  return `${isTypeScript ? "import React from 'react'" : "import React from 'react'"}
import './globals.css'

export const metadata = {
  title: 'Generated Funnel',
  description: 'Generated from Plura funnel',
}

export default function RootLayout({
  children,
}${isTypeScript ? ': { children: React.ReactNode }' : ''}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`
}
