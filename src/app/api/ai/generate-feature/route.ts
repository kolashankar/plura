
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { prompt, context, conversation } = await req.json()

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const systemPrompt = `You are an expert web developer and UI/UX designer. Generate React components and features based on user requests.

Context about the current page:
${JSON.stringify(context, null, 2)}

Previous conversation:
${conversation.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}

Guidelines:
- Generate modern, responsive React components
- Use TypeScript and Tailwind CSS
- Include proper accessibility features
- Provide complete, production-ready code
- Consider the existing page context
- Generate both the component code and integration instructions

User request: ${prompt}

Respond with:
1. A description of what you're creating
2. The component code
3. Integration instructions
4. Any additional files needed (API routes, types, etc.)

Format your response as a JSON object with 'response' and 'feature' properties.`

    const result = await model.generateContent(systemPrompt)
    const responseText = result.response.text()

    // Parse the AI response and generate feature object
    const feature = {
      id: Date.now().toString(),
      type: 'ai-generated',
      name: extractFeatureName(prompt),
      code: extractComponentCode(responseText),
      styles: extractStyles(responseText),
      props: extractProps(responseText),
      integration: extractIntegration(responseText)
    }

    return NextResponse.json({
      response: responseText,
      feature: feature
    })

  } catch (error) {
    console.error('AI Generation Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate feature' },
      { status: 500 }
    )
  }
}

function extractFeatureName(prompt: string): string {
  // Extract feature name from prompt
  const match = prompt.match(/(?:add|create|build|make)\s+(?:a\s+)?(.+?)(?:\s+(?:component|feature|section|page))?$/i)
  return match ? match[1].trim() : 'Custom Feature'
}

function extractComponentCode(response: string): string {
  // Extract React component code from AI response
  const codeMatch = response.match(/```(?:tsx|typescript|jsx|javascript)?\n([\s\S]*?)\n```/)
  return codeMatch ? codeMatch[1] : ''
}

function extractStyles(response: string): any {
  // Extract styling information
  return {
    className: 'ai-generated-component',
    responsive: true,
    theme: 'modern'
  }
}

function extractProps(response: string): any {
  // Extract component props
  return {}
}

function extractIntegration(response: string): string {
  // Extract integration instructions
  return 'Component ready to be added to your page'
}
