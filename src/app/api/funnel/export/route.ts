import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkPremiumSubscription } from '@/lib/queries'
import archiver from 'archiver'
import { mkdir, writeFile, rmdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { v4 as uuidv4 } from 'uuid'

interface ExportRequest {
  funnelId: string
  format: 'react' | 'react-native' | 'python'
}

export async function POST(req: NextRequest) {
  try {
    const { funnelId, format }: ExportRequest = await req.json()

    if (!funnelId || !format) {
      return NextResponse.json(
        { error: 'Funnel ID and format are required' },
        { status: 400 }
      )
    }

    // Get funnel data with pages
    const funnel = await db.funnel.findUnique({
      where: { id: funnelId },
      include: {
        FunnelPages: {
          orderBy: { order: 'asc' },
        },
        SubAccount: {
          select: {
            agencyId: true,
            name: true,
          },
        },
      },
    })

    if (!funnel) {
      return NextResponse.json(
        { error: 'Funnel not found' },
        { status: 404 }
      )
    }

    // Check premium subscription
    const isPremium = await checkPremiumSubscription(funnel.SubAccount!.agencyId)
    
    if (!isPremium) {
      return NextResponse.json(
        { error: 'Premium subscription required for code export' },
        { status: 403 }
      )
    }

    // Generate project code
    const projectId = uuidv4()
    const tempDir = join(process.cwd(), 'temp', projectId)
    
    try {
      await generateProjectStructure(funnel, format, tempDir)
      
      // Create zip archive
      const archive = archiver('zip', { zlib: { level: 9 } })
      
      // Add all files to archive
      archive.directory(tempDir, false)
      archive.finalize()

      // Clean up temp directory in background
      setTimeout(async () => {
        try {
          await rmdir(tempDir, { recursive: true })
        } catch (error) {
          console.error('Failed to clean up temp directory:', error)
        }
      }, 5000)

      // Return zip file
      return new NextResponse(archive as any, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${funnel.name}-${format}.zip"`,
        },
      })
    } catch (error) {
      // Clean up on error
      if (existsSync(tempDir)) {
        await rmdir(tempDir, { recursive: true }).catch(() => {})
      }
      throw error
    }
  } catch (error) {
    console.error('Failed to export funnel:', error)
    return NextResponse.json(
      { error: 'Failed to export funnel code' },
      { status: 500 }
    )
  }
}

async function generateProjectStructure(
  funnel: any,
  format: string,
  tempDir: string
) {
  await mkdir(tempDir, { recursive: true })

  switch (format) {
    case 'react':
      await generateReactProject(funnel, tempDir)
      break
    case 'react-native':
      await generateReactNativeProject(funnel, tempDir)
      break
    case 'python':
      await generatePythonProject(funnel, tempDir)
      break
    default:
      throw new Error(`Unsupported format: ${format}`)
  }
}

async function generateReactProject(funnel: any, baseDir: string) {
  // Create Next.js project structure
  const structure: Record<string, string> = {
    'package.json': generatePackageJson(funnel.name),
    'next.config.js': generateNextConfig(),
    'tailwind.config.js': generateTailwindConfig(),
    'postcss.config.js': generatePostcssConfig(),
    'tsconfig.json': generateTsConfig(),
    'README.md': generateReadme(funnel, 'Next.js'),
    '.gitignore': generateGitignore('react'),
    '.env.example': generateEnvExample(),
    'src/app/layout.tsx': generateAppLayout(funnel),
    'src/app/page.tsx': generateHomePage(funnel),
    'src/app/globals.css': generateGlobalCSS(),
    'src/components/ui/button.tsx': generateButtonComponent(),
    'src/components/ui/card.tsx': generateCardComponent(),
    'src/components/layout/header.tsx': generateHeaderComponent(funnel),
    'src/components/layout/footer.tsx': generateFooterComponent(funnel),
    'src/lib/utils.ts': generateUtilsFile(),
    'public/favicon.ico': '# Favicon placeholder',
  }

  // Generate funnel pages
  for (const page of funnel.FunnelPages) {
    const pagePath = page.pathName === '/' 
      ? 'src/app/page.tsx' 
      : `src/app${page.pathName}/page.tsx`
    
    structure[pagePath] = generateFunnelPage(page, funnel)
  }

  await createFileStructure(baseDir, structure)
}

async function generateReactNativeProject(funnel: any, baseDir: string) {
  const structure: Record<string, string> = {
    'package.json': generateRNPackageJson(funnel.name),
    'app.json': generateAppJson(funnel),
    'App.tsx': generateRNApp(funnel),
    'babel.config.js': generateBabelConfig(),
    'metro.config.js': generateMetroConfig(),
    'README.md': generateReadme(funnel, 'React Native'),
    '.gitignore': generateGitignore('react-native'),
    'src/screens/HomeScreen.tsx': generateRNHomeScreen(funnel),
    'src/components/Header.tsx': generateRNHeader(funnel),
    'src/components/Footer.tsx': generateRNFooter(funnel),
    'src/navigation/AppNavigator.tsx': generateRNNavigation(funnel),
    'src/styles/colors.ts': generateRNColors(),
    'src/styles/typography.ts': generateRNTypography(),
  }

  await createFileStructure(baseDir, structure)
}

async function generatePythonProject(funnel: any, baseDir: string) {
  const structure: Record<string, string> = {
    'requirements.txt': generatePythonRequirements(),
    'app.py': generateFlaskApp(funnel),
    'config.py': generateFlaskConfig(),
    'run.py': generateRunScript(),
    'README.md': generateReadme(funnel, 'Flask'),
    '.gitignore': generateGitignore('python'),
    '.env.example': generatePythonEnvExample(),
    'templates/layout.html': generateFlaskLayout(funnel),
    'templates/index.html': generateFlaskIndex(funnel),
    'static/css/style.css': generateFlaskCSS(),
    'static/js/main.js': generateFlaskJS(),
  }

  // Generate templates for each funnel page
  for (const page of funnel.FunnelPages) {
    const templateName = page.pathName === '/' 
      ? 'index.html' 
      : `${page.name.toLowerCase().replace(/\s+/g, '-')}.html`
    
    structure[`templates/${templateName}`] = generateFlaskTemplate(page, funnel)
  }

  await createFileStructure(baseDir, structure)
}

async function createFileStructure(baseDir: string, structure: Record<string, string>) {
  for (const [filePath, content] of Object.entries(structure)) {
    const fullPath = join(baseDir, filePath)
    const dirPath = join(fullPath, '..')
    
    await mkdir(dirPath, { recursive: true })
    await writeFile(fullPath, content, 'utf-8')
  }
}

// File generators
function generatePackageJson(projectName: string) {
  return JSON.stringify({
    name: projectName.toLowerCase().replace(/\s+/g, '-'),
    version: '1.0.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    },
    dependencies: {
      next: '^14.0.0',
      react: '^18.0.0',
      'react-dom': '^18.0.0',
      '@types/react': '^18.0.0',
      '@types/react-dom': '^18.0.0',
      '@types/node': '^20.0.0',
      typescript: '^5.0.0',
      tailwindcss: '^3.3.0',
      autoprefixer: '^10.4.0',
      postcss: '^8.4.0',
      clsx: '^2.0.0',
      'lucide-react': '^0.300.0',
    },
  }, null, 2)
}

function generateNextConfig() {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
}

module.exports = nextConfig`
}

function generateTailwindConfig() {
  return `/** @type {import('tailwindcss').Config} */
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
}`
}

function generatePostcssConfig() {
  return `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`
}

function generateTsConfig() {
  return JSON.stringify({
    compilerOptions: {
      target: 'es5',
      lib: ['dom', 'dom.iterable', 'esnext'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      forceConsistentCasingInFileNames: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true,
      plugins: [{ name: 'next' }],
      baseUrl: '.',
      paths: {
        '@/*': ['./src/*'],
      },
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules'],
  }, null, 2)
}

function generateReadme(funnel: any, tech: string) {
  return `# ${funnel.name}

This is a ${tech} project exported from Plura.

## Getting Started

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Responsive design
- Modern UI components
- Professional structure
- Ready for deployment

## Deployment

This project is ready to be deployed to platforms like Vercel, Netlify, or any hosting provider.

## Support

For support, please contact the Plura team.
`
}

function generateGitignore(type: string) {
  if (type === 'react') {
    return `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/

# Production
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# OS
.DS_Store
Thumbs.db`
  } else if (type === 'python') {
    return `# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtual environments
venv/
env/
ENV/

# Environment variables
.env
.env.local

# Logs
*.log

# OS
.DS_Store
Thumbs.db`
  }
  return ''
}

function generateEnvExample() {
  return `# Environment Variables
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Add your API keys here
`
}

function generateAppLayout(funnel: any) {
  return `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '${funnel.name}',
  description: '${funnel.description || 'Generated by Plura'}',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}`
}

function generateHomePage(funnel: any) {
  const firstPage = funnel.FunnelPages?.[0]
  return `export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">${firstPage?.name || funnel.name}</h1>
        <p className="text-xl text-gray-600 mb-8">
          Welcome to your exported funnel project
        </p>
        <div className="max-w-4xl mx-auto">
          ${firstPage?.content ? 
            `<div dangerouslySetInnerHTML={{ __html: \`${firstPage.content}\` }} />` :
            '<p>Your funnel content will appear here</p>'
          }
        </div>
      </div>
    </div>
  )
}`
}

function generateGlobalCSS() {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`
}

function generateButtonComponent() {
  return `import { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={clsx(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
            'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
            'border border-input hover:bg-accent hover:text-accent-foreground': variant === 'outline',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
            'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
            'h-10 py-2 px-4': size === 'default',
            'h-9 px-3 rounded-md': size === 'sm',
            'h-11 px-8 rounded-md': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }`
}

function generateCardComponent() {
  return `import { HTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={clsx('text-2xl font-semibold leading-none tracking-tight', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx('p-6 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

export { Card, CardHeader, CardTitle, CardContent }`
}

function generateHeaderComponent(funnel: any) {
  return `export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">${funnel.name}</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="/" className="text-gray-600 hover:text-gray-900">Home</a></li>
              <li><a href="/about" className="text-gray-600 hover:text-gray-900">About</a></li>
              <li><a href="/contact" className="text-gray-600 hover:text-gray-900">Contact</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}`
}

function generateFooterComponent(funnel: any) {
  return `export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">${funnel.name}</h3>
          <p className="text-gray-400">
            © 2024 ${funnel.name}. All rights reserved. Powered by Plura.
          </p>
        </div>
      </div>
    </footer>
  )
}`
}

function generateUtilsFile() {
  return `import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}`
}

function generateFunnelPage(page: any, funnel: any) {
  return `export default function ${page.name.replace(/\s+/g, '')}Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">${page.name}</h1>
      <div className="max-w-4xl mx-auto">
        ${page.content ? 
          `<div dangerouslySetInnerHTML={{ __html: \`${page.content}\` }} />` :
          '<p>Page content will appear here</p>'
        }
      </div>
    </div>
  )
}`
}

// React Native generators
function generateRNPackageJson(projectName: string) {
  return JSON.stringify({
    name: projectName.toLowerCase().replace(/\s+/g, '-'),
    version: '1.0.0',
    main: 'node_modules/expo/AppEntry.js',
    scripts: {
      start: 'expo start',
      android: 'expo start --android',
      ios: 'expo start --ios',
      web: 'expo start --web',
    },
    dependencies: {
      expo: '~49.0.0',
      react: '18.2.0',
      'react-native': '0.72.6',
      '@expo/vector-icons': '^13.0.0',
      '@react-navigation/native': '^6.0.0',
      '@react-navigation/stack': '^6.0.0',
      'react-native-safe-area-context': '^4.6.3',
      'react-native-screens': '~3.22.0',
    },
    devDependencies: {
      '@types/react': '~18.2.0',
      '@types/react-native': '~0.72.0',
      typescript: '^5.1.3',
    },
  }, null, 2)
}

function generateAppJson(funnel: any) {
  return JSON.stringify({
    expo: {
      name: funnel.name,
      slug: funnel.name.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      orientation: 'portrait',
      icon: './assets/icon.png',
      userInterfaceStyle: 'light',
      splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
      assetBundlePatterns: ['**/*'],
      ios: {
        supportsTablet: true,
      },
      android: {
        adaptiveIcon: {
          foregroundImage: './assets/adaptive-icon.png',
          backgroundColor: '#FFFFFF',
        },
      },
      web: {
        favicon: './assets/favicon.png',
      },
    },
  }, null, 2)
}

function generateRNApp(funnel: any) {
  return `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}`
}

function generateBabelConfig() {
  return `module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};`
}

function generateMetroConfig() {
  return `const { getDefaultConfig } = require('expo/metro-config');

module.exports = getDefaultConfig(__dirname);`
}

function generateRNHomeScreen(funnel: any) {
  return `import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>${funnel.name}</Text>
        <Text style={styles.description}>
          Welcome to your exported React Native app
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
});`
}

function generateRNHeader(funnel: any) {
  return `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>${funnel.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});`
}

function generateRNFooter(funnel: any) {
  return `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>© 2024 ${funnel.name}. Powered by Plura.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#333',
    padding: 20,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 12,
  },
});`
}

function generateRNNavigation(funnel: any) {
  return `import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}`
}

function generateRNColors() {
  return `export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  light: '#F2F2F7',
  dark: '#1C1C1E',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8E8E93',
};`
}

function generateRNTypography() {
  return `import { StyleSheet } from 'react-native';

export const typography = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 12,
    color: '#8E8E93',
  },
});`
}

// Python/Flask generators
function generatePythonRequirements() {
  return `Flask==2.3.3
Jinja2==3.1.2
python-dotenv==1.0.0
gunicorn==21.2.0`
}

function generateFlaskApp(funnel: any) {
  return `from flask import Flask, render_template
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config.from_object('config.Config')

@app.route('/')
def index():
    return render_template('index.html', funnel_name='${funnel.name}')

${funnel.FunnelPages?.map((page: any) => {
  if (page.pathName === '/') return ''
  const routeName = page.pathName.replace('/', '')
  const templateName = page.name.toLowerCase().replace(/\s+/g, '-')
  return `
@app.route('${page.pathName}')
def ${routeName.replace(/[^a-zA-Z0-9]/g, '_')}():
    return render_template('${templateName}.html', page_name='${page.name}')`
}).join('')}

if __name__ == '__main__':
    app.run(debug=True)`
}

function generateFlaskConfig() {
  return `import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    DEBUG = os.environ.get('FLASK_DEBUG') or True`
}

function generateRunScript() {
  return `from app import app

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)`
}

function generateFlaskLayout(funnel: any) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}${funnel.name}{% endblock %}</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
</head>
<body class="bg-gray-50">
    <header class="bg-white shadow-sm border-b">
        <div class="container mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
                <h1 class="text-2xl font-bold">${funnel.name}</h1>
                <nav>
                    <ul class="flex space-x-6">
                        <li><a href="/" class="text-gray-600 hover:text-gray-900">Home</a></li>
                        <li><a href="/about" class="text-gray-600 hover:text-gray-900">About</a></li>
                        <li><a href="/contact" class="text-gray-600 hover:text-gray-900">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>

    <main class="min-h-screen">
        {% block content %}{% endblock %}
    </main>

    <footer class="bg-gray-900 text-white">
        <div class="container mx-auto px-4 py-8">
            <div class="text-center">
                <h3 class="text-lg font-semibold mb-4">${funnel.name}</h3>
                <p class="text-gray-400">© 2024 ${funnel.name}. All rights reserved. Powered by Plura.</p>
            </div>
        </div>
    </footer>

    <script src="{{ url_for('static', filename='js/main.js') }}"></script>
</body>
</html>`
}

function generateFlaskIndex(funnel: any) {
  const firstPage = funnel.FunnelPages?.[0]
  return `{% extends "layout.html" %}

{% block content %}
<div class="container mx-auto px-4 py-8">
    <div class="text-center">
        <h1 class="text-4xl font-bold mb-4">${firstPage?.name || funnel.name}</h1>
        <p class="text-xl text-gray-600 mb-8">Welcome to your exported Flask project</p>
        <div class="max-w-4xl mx-auto">
            ${firstPage?.content ? 
              firstPage.content :
              '<p>Your funnel content will appear here</p>'
            }
        </div>
    </div>
</div>
{% endblock %}`
}

function generateFlaskTemplate(page: any, funnel: any) {
  return `{% extends "layout.html" %}

{% block title %}${page.name} - ${funnel.name}{% endblock %}

{% block content %}
<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">{{ page_name }}</h1>
    <div class="max-w-4xl mx-auto">
        ${page.content ? 
          page.content :
          '<p>Page content will appear here</p>'
        }
    </div>
</div>
{% endblock %}`
}

function generateFlaskCSS() {
  return `/* Custom styles for your Flask app */
.container {
    max-width: 1200px;
    margin: 0 auto;
}

.btn {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s;
}

.btn-primary {
    background-color: #3B82F6;
    color: white;
}

.btn-primary:hover {
    background-color: #2563EB;
}

.card {
    background: white;
    border-radius: 0.5rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}`
}

function generateFlaskJS() {
  return `// Custom JavaScript for your Flask app
document.addEventListener('DOMContentLoaded', function() {
    console.log('Flask app loaded successfully!');
    
    // Add your custom JavaScript here
});`
}

function generatePythonEnvExample() {
  return `# Flask Configuration
FLASK_APP=app.py
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here

# Database
DATABASE_URL=sqlite:///app.db

# Add your API keys here
`
}