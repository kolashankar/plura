import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const enhancedPrompt = `
You are an expert component generator for a website builder platform. Create a beautiful, functional component based on this description: "${prompt}"

ENHANCED GENERATION REQUIREMENTS:
- Generate with suitable icons and modern, stylish UI design
- Include full functioning backend and API integration capabilities
- Design components that support automatic background code generation for React, React Native, and Python platforms
- Use contemporary design patterns with premium aesthetics
- Include proper TypeScript interfaces and robust error handling
- Generate responsive, accessible components with smooth animations
- Integrate modern UI libraries and best practices

Please respond with a JSON object containing:
{
  "name": "ComponentName (descriptive, 2-4 words)",
  "description": "Brief description of what the component does",
  "code": "Complete React component code with proper TypeScript types",
  "preview": "Pure HTML code (no React JSX) that renders the component with Tailwind classes - this will be inserted directly into the DOM"
}

CRITICAL REQUIREMENTS for the preview HTML:
- Generate ONLY pure HTML (div, span, p, h1-h6, img, button, etc.)
- Use Tailwind CSS classes for styling
- Include inline styles where needed for precise control
- Make it fully functional HTML that can be inserted with dangerouslySetInnerHTML
- Include interactive behaviors using inline onclick handlers when appropriate
- Use semantic HTML elements (article, section, nav, etc.)
- Ensure the HTML is self-contained and renders properly
- DO NOT include React JSX syntax like {}, className, or React components

Example preview format:
<div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
  <div class="p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-2">Feature Card</h3>
    <p class="text-gray-600 text-sm mb-4">Description text here with actual content</p>
    <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer" onclick="alert('Button clicked!')">
      Call to Action
    </button>
  </div>
</div>

Styling Guidelines:
- Use colors like: bg-white, bg-gray-50, bg-blue-50, text-gray-900, text-gray-600
- Include borders: border border-gray-200, rounded-lg, rounded-xl
- Add shadows: shadow-sm, shadow-md, shadow-lg
- Use proper spacing: p-4, p-6, m-4, gap-4, space-y-4
- Include hover states: hover:bg-gray-50, hover:shadow-lg, transition-all duration-300
- Make it responsive: sm:, md:, lg: prefixes
- Add cursor-pointer to clickable elements

Focus on creating components that look professional, modern, and fully functional when rendered as HTML.
`

    const result = await model.generateContent(enhancedPrompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from the response
    let jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      // Fallback: create a functional component with interactive preview
      return NextResponse.json({
        name: 'Generated Component',
        description: 'AI-generated component based on your prompt',
        code: `// Generated component for: ${prompt}\nconst GeneratedComponent = () => {\n  return (\n    <div className="p-6 rounded-xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-all duration-300">\n      <h3 className="text-xl font-bold text-gray-900 mb-3">Generated Component</h3>\n      <p className="text-gray-600 mb-4">${prompt}</p>\n      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">\n        Interact\n      </button>\n    </div>\n  )\n}\n\nexport default GeneratedComponent`,
        preview: `<div class="p-6 rounded-xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 max-w-md mx-auto">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900">Generated Component</h3>
          </div>
          <p class="text-gray-600 mb-4 leading-relaxed">${prompt}</p>
          <button class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 cursor-pointer font-medium" onclick="this.style.transform='scale(0.95)'; setTimeout(() => this.style.transform='scale(1)', 100)">
            Interact
          </button>
        </div>`
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
        code: `const GeneratedComponent = () => {\n  return (\n    <div className="p-6 rounded-xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-all duration-300">\n      <h3 className="text-xl font-bold text-gray-900 mb-3">Generated Component</h3>\n      <p className="text-gray-600 mb-4">${prompt}</p>\n      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">\n        Interact\n      </button>\n    </div>\n  )\n}\n\nexport default GeneratedComponent`,
        preview: `<div class="p-6 rounded-xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 max-w-md mx-auto">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900">Generated Component</h3>
          </div>
          <p class="text-gray-600 mb-4 leading-relaxed">${prompt}</p>
          <button class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 cursor-pointer font-medium" onclick="this.style.transform='scale(0.95)'; setTimeout(() => this.style.transform='scale(1)', 100)">
            Interact
          </button>
        </div>`
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