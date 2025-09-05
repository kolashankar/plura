import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'

export async function GET(
  req: NextRequest,
  { params }: { params: { funnelId: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch funnel pages
    const pages = await db.funnelPage.findMany({
      where: {
        funnelId: params.funnelId,
      },
      orderBy: {
        order: 'asc'
      }
    })

    // Generate code structures for different frameworks
    const generatedCode = {
      react: [
        {
          name: 'src',
          type: 'folder' as const,
          path: 'src',
          children: [
            {
              name: 'components',
              type: 'folder' as const,
              path: 'src/components',
              children: [
                {
                  name: 'Layout.tsx',
                  type: 'file' as const,
                  path: 'src/components/Layout.tsx',
                  language: 'typescript',
                  content: generateReactLayoutCode(pages)
                },
                ...pages.map(page => ({
                  name: `${page.name.replace(/\s+/g, '')}.tsx`,
                  type: 'file' as const,
                  path: `src/components/${page.name.replace(/\s+/g, '')}.tsx`,
                  language: 'typescript',
                  content: generateReactPageCode(page)
                }))
              ]
            },
            {
              name: 'pages',
              type: 'folder' as const,
              path: 'src/pages',
              children: [
                {
                  name: 'App.tsx',
                  type: 'file' as const,
                  path: 'src/pages/App.tsx',
                  language: 'typescript',
                  content: generateReactAppCode(pages)
                },
                ...pages.map(page => ({
                  name: `${page.pathName}.tsx`,
                  type: 'file' as const,
                  path: `src/pages/${page.pathName}.tsx`,
                  language: 'typescript',
                  content: generateReactRouteCode(page)
                }))
              ]
            },
            {
              name: 'styles',
              type: 'folder' as const,
              path: 'src/styles',
              children: [
                {
                  name: 'globals.css',
                  type: 'file' as const,
                  path: 'src/styles/globals.css',
                  language: 'css',
                  content: generateGlobalStyles()
                }
              ]
            }
          ]
        },
        {
          name: 'package.json',
          type: 'file' as const,
          path: 'package.json',
          language: 'json',
          content: generatePackageJson('react')
        },
        {
          name: 'README.md',
          type: 'file' as const,
          path: 'README.md',
          language: 'markdown',
          content: generateReadme('react', pages)
        }
      ],
      vue: [
        {
          name: 'src',
          type: 'folder' as const,
          path: 'src',
          children: [
            {
              name: 'components',
              type: 'folder' as const,
              path: 'src/components',
              children: pages.map(page => ({
                name: `${page.name.replace(/\s+/g, '')}.vue`,
                type: 'file' as const,
                path: `src/components/${page.name.replace(/\s+/g, '')}.vue`,
                language: 'vue',
                content: generateVuePageCode(page)
              }))
            }
          ]
        }
      ],
      angular: [
        {
          name: 'src',
          type: 'folder' as const,
          path: 'src',
          children: [
            {
              name: 'app',
              type: 'folder' as const,
              path: 'src/app',
              children: pages.map(page => ({
                name: `${page.name.toLowerCase().replace(/\s+/g, '-')}.component.ts`,
                type: 'file' as const,
                path: `src/app/${page.name.toLowerCase().replace(/\s+/g, '-')}.component.ts`,
                language: 'typescript',
                content: generateAngularPageCode(page)
              }))
            }
          ]
        }
      ],
      html: [
        {
          name: 'index.html',
          type: 'file' as const,
          path: 'index.html',
          language: 'html',
          content: generateStaticHtml(pages)
        },
        {
          name: 'styles.css',
          type: 'file' as const,
          path: 'styles.css',
          language: 'css',
          content: generateGlobalStyles()
        }
      ]
    }

    return NextResponse.json(generatedCode)
  } catch (error) {
    console.error('Error generating source code:', error)
    return NextResponse.json(
      { error: 'Failed to generate source code' },
      { status: 500 }
    )
  }
}

function generateReactPageCode(page: any): string {
  const elements = page.content ? JSON.parse(page.content) : []
  
  return `import React from 'react'

interface ${page.name.replace(/\s+/g, '')}Props {
  className?: string
}

const ${page.name.replace(/\s+/g, '')}: React.FC<${page.name.replace(/\s+/g, '')}Props> = ({ className }) => {
  return (
    <div className={\`min-h-screen bg-white \${className || ''}\`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">${page.name}</h1>
        {/* Generated from funnel content */}
        ${generateElementsCode(elements)}
      </div>
    </div>
  )
}

export default ${page.name.replace(/\s+/g, '')}`
}

function generateReactAppCode(pages: any[]): string {
  return `import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
${pages.map(page => `import ${page.name.replace(/\s+/g, '')} from '../components/${page.name.replace(/\s+/g, '')}'`).join('\n')}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          ${pages.map(page => `<Route path="/${page.pathName}" element={<${page.name.replace(/\s+/g, '')} />} />`).join('\n          ')}
          <Route path="/" element={<${pages[0]?.name.replace(/\s+/g, '') || 'Home'} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App`
}

function generateReactLayoutCode(pages: any[]): string {
  return `import React from 'react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Your Website</h1>
            <div className="flex items-center space-x-4">
              ${pages.map(page => `<a href="/${page.pathName}" className="text-gray-600 hover:text-gray-900">${page.name}</a>`).join('\n              ')}
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}

export default Layout`
}

function generateReactRouteCode(page: any): string {
  return `import React from 'react'
import ${page.name.replace(/\s+/g, '')} from '../components/${page.name.replace(/\s+/g, '')}'
import Layout from '../components/Layout'

const ${page.name.replace(/\s+/g, '')}Page: React.FC = () => {
  return (
    <Layout>
      <${page.name.replace(/\s+/g, '')} />
    </Layout>
  )
}

export default ${page.name.replace(/\s+/g, '')}Page`
}

function generateVuePageCode(page: any): string {
  return `<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">${page.name}</h1>
      <!-- Generated from funnel content -->
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic for ${page.name}
</script>

<style scoped>
/* Component styles */
</style>`
}

function generateAngularPageCode(page: any): string {
  return `import { Component } from '@angular/core';

@Component({
  selector: 'app-${page.name.toLowerCase().replace(/\s+/g, '-')}',
  template: \`
    <div class="min-h-screen bg-white">
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-6">${page.name}</h1>
        <!-- Generated from funnel content -->
      </div>
    </div>
  \`,
  styleUrls: ['./${page.name.toLowerCase().replace(/\s+/g, '-')}.component.css']
})
export class ${page.name.replace(/\s+/g, '')}Component {
  // Component logic
}`
}

function generateStaticHtml(pages: any[]): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Website</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <h1>Your Website</h1>
            <ul>
                ${pages.map(page => `<li><a href="#${page.pathName}">${page.name}</a></li>`).join('\n                ')}
            </ul>
        </div>
    </nav>
    
    <main>
        ${pages.map(page => `
        <section id="${page.pathName}" class="page-section">
            <div class="container">
                <h2>${page.name}</h2>
                <!-- Generated from funnel content -->
            </div>
        </section>`).join('\n        ')}
    </main>
</body>
</html>`
}

function generateElementsCode(elements: any[]): string {
  if (!Array.isArray(elements)) return ''
  
  return elements.map(element => {
    switch (element.type) {
      case 'text':
        return `<p className="text-base">${element.content?.innerText || 'Text content'}</p>`
      case 'container':
        return `<div className="space-y-4">${generateElementsCode(element.content || [])}</div>`
      case 'video':
        return `<iframe src="${element.content?.src || ''}" className="w-full aspect-video rounded-lg" />`
      case 'link':
        return `<a href="${element.content?.href || '#'}" className="text-blue-600 hover:underline">${element.content?.innerText || 'Link'}</a>`
      default:
        return `<!-- ${element.type} component -->`
    }
  }).join('\n        ')
}

function generatePackageJson(framework: string): string {
  const deps = {
    react: {
      dependencies: {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "^6.8.0"
      },
      devDependencies: {
        "@types/react": "^18.0.27",
        "@types/react-dom": "^18.0.10",
        "typescript": "^4.9.4",
        "vite": "^4.1.0"
      }
    }
  }

  return JSON.stringify({
    name: "generated-funnel",
    version: "1.0.0",
    private: true,
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview"
    },
    ...deps[framework as keyof typeof deps]
  }, null, 2)
}

function generateGlobalStyles(): string {
  return `/* Global styles for generated funnel */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  line-height: 1.6;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.navbar {
  background: white;
  border-bottom: 1px solid #e5e5e5;
  padding: 1rem 0;
}

.page-section {
  padding: 4rem 0;
  min-height: 100vh;
}

/* Responsive design */
@media (max-width: 768px) {
  .container {
    padding: 0 0.5rem;
  }
  
  .page-section {
    padding: 2rem 0;
  }
}`
}

function generateReadme(framework: string, pages: any[]): string {
  return `# Generated Funnel - ${framework.charAt(0).toUpperCase() + framework.slice(1)}

This project was automatically generated from your funnel builder.

## Pages Included

${pages.map((page, index) => `${index + 1}. ${page.name} (/${page.pathName})`).join('\n')}

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
\`\`\`

## Framework: ${framework.charAt(0).toUpperCase() + framework.slice(1)}

This project uses ${framework} with modern best practices and responsive design.

Generated on: ${new Date().toLocaleString()}
`
}