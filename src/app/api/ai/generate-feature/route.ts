
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { AI_TEMPLATES, getTemplateById } from '@/lib/ai-templates'

if (!process.env.GOOGLE_GEMINI_API_KEY) {
  throw new Error('GOOGLE_GEMINI_API_KEY is not defined')
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export async function POST(req: NextRequest) {
  try {
    const { prompt, templateId, websiteType, features, platform = 'web' } = await req.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    let enhancedPrompt = prompt
    let templateData = null

    // If a template is specified, use it to enhance the prompt
    if (templateId) {
      templateData = getTemplateById(templateId)
      if (templateData) {
        enhancedPrompt = `${templateData.prompt}\n\nAdditional requirements: ${prompt}`
      }
    }

    // Generate website structure and components
    const systemPrompt = `You are an expert full-stack developer specializing in React, Next.js, TypeScript, and modern web development. 

Generate a complete, production-ready ${platform === 'mobile' ? 'React Native' : 'React'} application based on the following requirements:

${enhancedPrompt}

Please provide:
1. Complete file structure with folder hierarchy
2. All necessary React components with TypeScript
3. API routes for backend functionality
4. Database schema (Prisma)
5. Styling with Tailwind CSS
6. State management with React hooks/context
7. Form validation with react-hook-form
8. Authentication integration
9. Payment integration (if needed)
10. Mobile-responsive design
11. SEO optimization
12. Performance optimizations

${platform === 'mobile' ? `
For React Native, include:
- Navigation setup with React Navigation
- Platform-specific code for iOS/Android
- Expo configuration
- Native device integrations
- Mobile UI/UX best practices
` : ''}

Format your response as a JSON object with the following structure:
{
  "projectStructure": {
    "folders": ["folder1", "folder2"],
    "files": [
      {
        "path": "path/to/file.tsx",
        "content": "file content here",
        "description": "brief description"
      }
    ]
  },
  "features": ["feature1", "feature2"],
  "dependencies": {
    "dependencies": ["package1", "package2"],
    "devDependencies": ["dev-package1"]
  },
  "apis": [
    {
      "endpoint": "/api/endpoint",
      "method": "GET|POST|PUT|DELETE",
      "description": "what this API does"
    }
  ],
  "database": {
    "models": [
      {
        "name": "ModelName",
        "fields": ["field1: String", "field2: Int"]
      }
    ]
  },
  "deploymentConfig": {
    "buildCommand": "npm run build",
    "startCommand": "npm start",
    "envVariables": ["VAR1", "VAR2"]
  }
}`

    const result = await model.generateContent(systemPrompt)
    const response = result.response
    const generatedText = response.text()

    // Try to parse the JSON response
    let generatedData
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        generatedData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      // If parsing fails, create a structured response
      generatedData = {
        projectStructure: {
          folders: ['src', 'src/components', 'src/pages', 'src/api', 'src/lib', 'src/types'],
          files: [
            {
              path: 'src/pages/index.tsx',
              content: generateBasicComponent('HomePage', prompt),
              description: 'Main homepage component'
            }
          ]
        },
        features: extractFeatures(prompt),
        dependencies: {
          dependencies: ['next', 'react', 'typescript', 'tailwindcss'],
          devDependencies: ['@types/react', '@types/node']
        },
        apis: [],
        database: { models: [] },
        deploymentConfig: {
          buildCommand: 'npm run build',
          startCommand: 'npm start',
          envVariables: []
        },
        rawResponse: generatedText
      }
    }

    // Enhance with template data if available
    if (templateData) {
      generatedData.templateUsed = templateData.name
      generatedData.features = [...new Set([...generatedData.features, ...templateData.features])]
      generatedData.dependencies.dependencies = [
        ...new Set([...generatedData.dependencies.dependencies, ...templateData.dependencies])
      ]
    }

    return NextResponse.json({
      success: true,
      data: generatedData,
      platform,
      templateUsed: templateData?.name || null
    })

  } catch (error) {
    console.error('AI generation failed:', error)
    return NextResponse.json(
      { error: 'Failed to generate feature', details: error.message },
      { status: 500 }
    )
  }
}

function generateBasicComponent(componentName: string, description: string) {
  return `import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ${componentName}Props {
  // Add your props here
}

export default function ${componentName}({ }: ${componentName}Props) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>${componentName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            ${description}
          </p>
          {/* Add your component content here */}
        </CardContent>
      </Card>
    </div>
  )
}`
}

function extractFeatures(prompt: string): string[] {
  const commonFeatures = [
    'Responsive Design',
    'TypeScript Support',
    'Tailwind CSS',
    'Component Library',
    'State Management'
  ]

  // Extract features based on keywords in the prompt
  const featureKeywords = {
    'auth': 'User Authentication',
    'payment': 'Payment Integration',
    'database': 'Database Integration',
    'api': 'REST API',
    'responsive': 'Mobile Responsive',
    'search': 'Search Functionality',
    'chat': 'Real-time Chat',
    'analytics': 'Analytics Dashboard',
    'admin': 'Admin Panel',
    'blog': 'Blog System',
    'ecommerce': 'E-commerce Features',
    'social': 'Social Media Integration'
  }

  const detectedFeatures = Object.entries(featureKeywords)
    .filter(([keyword]) => prompt.toLowerCase().includes(keyword))
    .map(([, feature]) => feature)

  return [...commonFeatures, ...detectedFeatures]
}

// GET endpoint to retrieve available templates
export async function GET() {
  try {
    return NextResponse.json({
      templates: AI_TEMPLATES,
      categories: [...new Set(AI_TEMPLATES.map(t => t.category))]
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}
