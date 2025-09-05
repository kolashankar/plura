import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      prompt,
      type = 'component',
      style = 'modern',
      framework = 'react',
      includeStyles = true,
      subAccountId,
      individualId
    } = await req.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Create AI generation record (temporary approach)
    const generationId = `ai_gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const generation = {
      id: generationId,
      userId: user.id,
      prompt,
      type,
      framework,
      style,
      includeStyles,
      status: 'generating',
      subAccountId,
      individualId,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Generate component using Google AI
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const systemPrompt = `You are an expert frontend developer. Generate a complete, production-ready ${framework} component based on the user's request.

Style: ${style}
Framework: ${framework}
Include styles: ${includeStyles}

Requirements:
- Generate clean, modern, accessible code
- Include TypeScript types if using React
- Use modern CSS or Tailwind classes for styling
- Ensure responsive design
- Include proper semantic HTML
- Add helpful comments
- Follow best practices for ${framework}

User request: ${prompt}

Return only the component code without any additional explanation.`

    const result = await model.generateContent(systemPrompt)
    const generatedCode = result.response.text()

    // Parse and structure the generated code
    const component = {
      id: generationId,
      name: extractComponentName(prompt, generatedCode),
      code: generatedCode,
      framework,
      type,
      style,
      prompt,
      createdAt: new Date(),
      createdBy: user.id
    }

    // TODO: Save to database when Prisma client is updated
    // await db.aIGeneration.create({
    //   data: {
    //     ...generation,
    //     result: generatedCode,
    //     status: 'completed'
    //   }
    // })

    return NextResponse.json({
      success: true,
      component,
      generationId
    })

  } catch (error) {
    console.error('Error generating AI component:', error)
    return NextResponse.json(
      { error: 'Failed to generate component' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const subAccountId = searchParams.get('subAccountId')
    const individualId = searchParams.get('individualId')
    const type = searchParams.get('type')
    const framework = searchParams.get('framework')

    // TODO: Replace with actual DB query when Prisma client is updated
    // const generations = await db.aIGeneration.findMany({
    //   where: {
    //     userId: user.id,
    //     ...(subAccountId && { subAccountId }),
    //     ...(individualId && { individualId }),
    //     ...(type && { type }),
    //     ...(framework && { framework })
    //   },
    //   orderBy: { createdAt: 'desc' },
    //   take: 50
    // })

    // Return mock data for now
    const generations = [
      {
        id: 'ai_gen_1',
        prompt: 'Create a modern contact form',
        type: 'component',
        framework: 'react',
        style: 'modern',
        status: 'completed',
        result: '// Sample generated contact form component\nconst ContactForm = () => {\n  return (\n    <form className="max-w-md mx-auto">\n      <input type="text" placeholder="Name" className="w-full p-3 border rounded" />\n      <input type="email" placeholder="Email" className="w-full p-3 border rounded mt-2" />\n      <textarea placeholder="Message" className="w-full p-3 border rounded mt-2"></textarea>\n      <button className="w-full bg-blue-500 text-white p-3 rounded mt-2">Send</button>\n    </form>\n  )\n}',
        createdAt: new Date('2024-01-15')
      }
    ]

    return NextResponse.json({ generations })

  } catch (error) {
    console.error('Error fetching AI generations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch AI generations' },
      { status: 500 }
    )
  }
}

function extractComponentName(prompt: string, code: string): string {
  // Try to extract component name from the generated code
  const componentMatch = code.match(/(?:function|const|class)\s+([A-Z][a-zA-Z0-9]*)/);
  if (componentMatch) {
    return componentMatch[1];
  }

  // Fallback: generate name from prompt
  const words = prompt.split(' ').filter(word => word.length > 2);
  return words.map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join('') + 'Component';
}