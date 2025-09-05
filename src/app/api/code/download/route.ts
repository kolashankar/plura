
import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { Pool } from '@neondatabase/serverless'
import JSZip from 'jszip'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { funnelId, format = 'nextjs', language = 'typescript', platform = 'web' } = await req.json()

    // Check premium status using PostgreSQL
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    
    try {
      const subscriptionResult = await pool.query(
        'SELECT plan FROM subscriptions WHERE user_id = $1 AND active = true LIMIT 1',
        [user.id]
      )

      const plan = subscriptionResult.rows[0]?.plan || 'free'
      const canDownload = ['basic', 'unlimited'].includes(plan)

      if (!canDownload) {
        pool.end()
        return NextResponse.json({ 
          error: 'Premium subscription required for code download',
          requiresPremium: true 
        }, { status: 403 })
      }

      // Get funnel data
      const funnelResult = await pool.query(
        'SELECT * FROM funnels WHERE id = $1',
        [funnelId]
      )

      const funnel = funnelResult.rows[0]
      
      if (!funnel) {
        pool.end()
        return NextResponse.json({ error: 'Funnel not found' }, { status: 404 })
      }

      // Get funnel pages
      const pagesResult = await pool.query(
        'SELECT * FROM funnel_pages WHERE funnel_id = $1 ORDER BY order_index ASC',
        [funnelId]
      )

      funnel.FunnelPages = pagesResult.rows

      // Generate code based on format, language, and platform
      const zip = new JSZip()
      
      if (platform === 'mobile') {
        return generateReactNativeCode(funnel, zip)
      } else if (platform === 'python') {
        return generatePythonFlaskCode(funnel, zip)
      }
    
      // Default to Next.js web app
      const packageJson: any = {
        name: funnel.name.toLowerCase().replace(/\s+/g, '-'),
        version: '1.0.0',
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
          db: 'bunx prisma db push',
          'db:studio': 'bunx prisma studio',
          'db:generate': 'bunx prisma generate'
        },
        dependencies: {
          'next': '^14.0.0',
          'react': '^18.0.0',
          'react-dom': '^18.0.0',
          '@prisma/client': '^5.7.1',
          'prisma': '^5.7.1',
          'uploadthing': '^6.1.0',
          '@uploadthing/react': '^6.0.2',
          'tailwindcss': '^3.3.0',
          'autoprefixer': '^10.0.1',
          'postcss': '^8',
          'clsx': '^2.1.0',
          'tailwind-merge': '^2.2.0',
          'lucide-react': '^0.303.0',
          'shadcn-ui': 'latest'
        }
      }
      
      if (language === 'typescript') {
        packageJson.dependencies = {
          ...packageJson.dependencies,
          'typescript': '^5.0.0',
          '@types/react': '^18.0.0',
          '@types/node': '^20.0.0'
        }
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

    } catch (dbError) {
      console.error('Database error:', dbError)
      pool.end()
      return NextResponse.json({ error: 'Database error occurred' }, { status: 500 })
    }

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

async function generateReactNativeCode(funnel: any, zip: JSZip): Promise<Response> {
  // React Native specific package.json
  const packageJson = {
    name: funnel.name.toLowerCase().replace(/\s+/g, '-'),
    version: '0.0.1',
    main: 'node_modules/expo/AppEntry.js',
    scripts: {
      start: 'expo start',
      android: 'expo start --android',
      ios: 'expo start --ios',
      web: 'expo start --web'
    },
    dependencies: {
      expo: '~49.0.0',
      react: '18.2.0',
      'react-native': '0.72.6',
      '@expo/vector-icons': '^13.0.0',
      'react-native-screens': '~3.22.0',
      'react-native-safe-area-context': '4.6.3',
      '@react-navigation/native': '^6.0.2',
      '@react-navigation/stack': '^6.0.2'
    },
    devDependencies: {
      '@babel/core': '^7.20.0',
      '@types/react': '~18.2.14'
    }
  }

  zip.file('package.json', JSON.stringify(packageJson, null, 2))
  
  // App.tsx for React Native
  const appTsx = `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}`

  zip.file('App.tsx', appTsx)
  
  // Home Screen
  const homeScreen = `import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>${funnel.name}</Text>
      <Text style={styles.subtitle}>Generated React Native App</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});`

  zip.file('screens/HomeScreen.tsx', homeScreen)
  
  // app.json
  const appJson = {
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
        backgroundColor: '#ffffff'
      },
      assetBundlePatterns: ['**/*'],
      ios: {
        supportsTablet: true
      },
      android: {
        adaptiveIcon: {
          foregroundImage: './assets/adaptive-icon.png',
          backgroundColor: '#FFFFFF'
        }
      }
    }
  }
  
  zip.file('app.json', JSON.stringify(appJson, null, 2))
  
  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })
  return new Response(zipBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${funnel.name}-react-native.zip"`
    }
  })
}

async function generatePythonFlaskCode(funnel: any, zip: JSZip): Promise<Response> {
  // Python Flask requirements.txt
  const requirements = `Flask==2.3.3
Jinja2==3.1.2
SQLAlchemy==2.0.21
Flask-SQLAlchemy==3.0.5
python-dotenv==1.0.0
gunicorn==21.2.0`

  zip.file('requirements.txt', requirements)
  
  // Main Flask app
  const appPy = `from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(80), nullable=False)

@app.route('/')
def home():
    return render_template('index.html', title='${funnel.name}')

@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{'id': u.id, 'email': u.email, 'name': u.name} for u in users])

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)`

  zip.file('app.py', appPy)
  
  // HTML template
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
    <div class="min-h-screen">
        <header class="bg-white shadow">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <h1 class="text-3xl font-bold text-gray-900">{{ title }}</h1>
            </div>
        </header>
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-4">Welcome to your generated Flask app</h2>
                <p class="text-gray-600">This application was generated from your funnel design.</p>
            </div>
        </main>
    </div>
</body>
</html>`

  zip.file('templates/index.html', indexHtml)
  
  // .env template
  const envTemplate = `SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
FLASK_ENV=development`

  zip.file('.env.example', envTemplate)
  
  // README
  const readme = `# ${funnel.name} - Flask Application

Generated from Plura funnel builder.

## Setup Instructions

1. Install Python 3.8+
2. Create virtual environment: \`python -m venv venv\`
3. Activate virtual environment: \`source venv/bin/activate\` (Linux/Mac) or \`venv\\Scripts\\activate\` (Windows)
4. Install dependencies: \`pip install -r requirements.txt\`
5. Copy \`.env.example\` to \`.env\` and configure your environment variables
6. Run the application: \`python app.py\`

Your application will be available at http://localhost:5000`

  zip.file('README.md', readme)
  
  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })
  return new Response(zipBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${funnel.name}-flask.zip"`
    }
  })
}
