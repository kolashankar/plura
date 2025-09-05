
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { AI_TEMPLATES, getTemplateById } from '@/lib/ai-templates'

if (!process.env.GOOGLE_GEMINI_API_KEY) {
  throw new Error('GOOGLE_GEMINI_API_KEY is not defined')
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { prompt, context, conversation } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const systemPrompt = `You are an expert web development assistant. Based on the user's request, generate a feature or component for their website.

User request: ${prompt}
Context: ${JSON.stringify(context)}
Previous conversation: ${JSON.stringify(conversation)}

Return a JSON response with:
{
  "response": "Description of what you're creating",
  "feature": {
    "type": "component",
    "name": "Feature name",
    "code": "Generated code",
    "description": "What this feature does"
  }
}`

    const result = await model.generateContent(systemPrompt)
    const response = await result.response
    const text = response.text()

    // Try to extract JSON from response
    let responseData
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        responseData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No valid JSON found')
      }
    } catch (parseError) {
      // Fallback response
      responseData = {
        response: `I'll help you create: ${prompt}`,
        feature: {
          type: 'component',
          name: 'Custom Feature',
          code: `<!-- Generated feature for: ${prompt} -->\n<div class="custom-feature">\n  <h3>Custom Feature</h3>\n  <p>This feature was generated based on your request.</p>\n</div>`,
          description: `Custom feature generated for: ${prompt}`
        }
      }
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error generating feature:', error)
    return NextResponse.json(
      { error: 'Failed to generate feature' },
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
      categories: Array.from(new Set(AI_TEMPLATES.map(t => t.category)))
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}
