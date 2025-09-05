import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { v4 } from 'uuid'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'

if (!process.env.GOOGLE_GEMINI_API_KEY) {
  throw new Error('GOOGLE_GEMINI_API_KEY is not configured')
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt, funnelId, subaccountId, existingPages } = await req.json()

    if (!prompt || !funnelId || !subaccountId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify user has access to subaccount
    const subAccount = await db.subAccount.findFirst({
      where: {
        id: subaccountId,
        Agency: {
          users: {
            some: { id: userId }
          }
        }
      }
    })

    if (!subAccount) {
      return NextResponse.json({ error: 'Unauthorized access to subaccount' }, { status: 403 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const enhancedPrompt = `
You are a funnel page generator for a marketing platform. Create a complete funnel structure based on this description: "${prompt}"

Generate a JSON response with a "pages" array containing 3-7 funnel pages that work together as a cohesive sales/marketing funnel.

Each page should have this structure:
{
  "name": "Page Name",
  "pathName": "url-friendly-path",
  "elements": [
    {
      "id": "unique-id",
      "type": "container" | "text" | "heading" | "button" | "image" | "video" | "link" | "divider",
      "name": "Element Name",
      "styles": {
        // CSS styles as key-value pairs
        "display": "flex",
        "flexDirection": "column",
        "padding": "20px",
        "backgroundColor": "#ffffff",
        "width": "100%"
      },
      "content": [
        // Nested elements for containers, or content object for leaf elements
      ]
    }
  ]
}

For leaf elements (text, heading, button, etc.), use a "content" object:
{
  "content": {
    "innerText": "Text content here"
  }
}

Common funnel page types to consider:
- Landing Page (main value proposition)
- About/Story Page (build trust)
- Features/Benefits Page (detailed product info)
- Pricing Page (different packages/options)
- Testimonials/Social Proof Page
- FAQ Page (overcome objections)
- Checkout/Order Page (conversion)
- Thank You Page (confirmation)

Requirements:
- Create 3-7 pages that flow logically together
- Each page should have a clear purpose in the funnel
- Use modern, responsive design principles
- Include appropriate CTAs on each page
- Use professional styling and layout
- Make pathNames URL-friendly (lowercase, hyphens)
- Ensure each page serves the overall funnel goal

Existing pages in funnel: ${existingPages ? existingPages.map((p: any) => p.name).join(', ') : 'None'}

IMPORTANT: Respond with valid JSON only, no additional text or markdown formatting.
`

    const result = await model.generateContent(enhancedPrompt)
    const response = await result.response
    const text = response.text()

    let parsedResponse
    try {
      // Clean the response to remove any markdown formatting
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim()
      parsedResponse = JSON.parse(cleanText)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      return NextResponse.json({ error: 'Invalid AI response format' }, { status: 500 })
    }

    if (!parsedResponse.pages || !Array.isArray(parsedResponse.pages)) {
      return NextResponse.json({ error: 'Invalid page structure in AI response' }, { status: 500 })
    }

    // Create the funnel pages in the database
    const createdPages = []
    const startingOrder = existingPages ? existingPages.length : 0

    for (let i = 0; i < parsedResponse.pages.length; i++) {
      const pageData = parsedResponse.pages[i]
      
      // Validate required fields
      if (!pageData.name || !pageData.pathName || !pageData.elements) {
        console.warn('Skipping invalid page:', pageData)
        continue
      }

      try {
        const newPage = await db.funnelPage.create({
          data: {
            id: v4(),
            name: pageData.name,
            pathName: pageData.pathName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
            content: JSON.stringify(pageData.elements),
            funnelId,
            order: startingOrder + i,
          },
        })

        createdPages.push(newPage)
      } catch (dbError) {
        console.error('Failed to create page in database:', dbError)
        // Continue with other pages even if one fails
      }
    }

    if (createdPages.length === 0) {
      return NextResponse.json({ error: 'No valid pages were generated' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      pages: createdPages,
      message: `Successfully generated ${createdPages.length} funnel pages`
    })

  } catch (error) {
    console.error('Error generating funnel pages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}