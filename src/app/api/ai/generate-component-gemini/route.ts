import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const enhancedPrompt = `
You are a React component generator. Create a functional React/TypeScript component based on this description: "${prompt}"

Please respond with a JSON object containing:
{
  "name": "ComponentName (descriptive, 2-4 words)",
  "description": "Brief description of what the component does",
  "code": "Complete React component code with proper TypeScript types",
  "preview": "HTML-like preview showing the component structure"
}

Requirements:
- Use modern React with TypeScript
- Include proper styling with Tailwind CSS classes
- Make components responsive and accessible
- Include proper props interfaces if needed
- Use semantic HTML elements
- Add hover effects and transitions where appropriate
- Make the component production-ready

Focus on creating clean, reusable, and well-structured components.
`

    const result = await model.generateContent(enhancedPrompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from the response
    let jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      // Fallback: create a basic component structure
      return NextResponse.json({
        name: 'Generated Component',
        description: 'AI-generated component based on your prompt',
        code: `// Generated component for: ${prompt}\nconst GeneratedComponent = () => {\n  return (\n    <div className="p-4 rounded-lg border bg-white">\n      <h3 className="text-lg font-semibold mb-2">Generated Component</h3>\n      <p className="text-gray-600">${prompt}</p>\n    </div>\n  )\n}\n\nexport default GeneratedComponent`,
        preview: `<div class="p-4 rounded-lg border bg-white"><h3 class="text-lg font-semibold mb-2">Generated Component</h3><p class="text-gray-600">${prompt}</p></div>`
      })
    }

    const jsonStr = jsonMatch[0]
    let componentData

    try {
      componentData = JSON.parse(jsonStr)
    } catch (parseError) {
      // If JSON parsing fails, create a basic structure
      componentData = {
        name: 'Generated Component',
        description: 'AI-generated component',
        code: `const GeneratedComponent = () => {\n  return (\n    <div className="p-4 rounded-lg border bg-white">\n      <h3 className="text-lg font-semibold mb-2">Generated Component</h3>\n      <p className="text-gray-600">${prompt}</p>\n    </div>\n  )\n}\n\nexport default GeneratedComponent`,
        preview: `<div class="p-4 rounded-lg border bg-white"><h3 class="text-lg font-semibold mb-2">Generated Component</h3><p class="text-gray-600">${prompt}</p></div>`
      }
    }

    return NextResponse.json(componentData)

  } catch (error) {
    console.error('Error generating component:', error)
    return NextResponse.json(
      { error: 'Failed to generate component' },
      { status: 500 }
    )
  }
}